import { createClient } from '@supabase/supabase-js';
import * as kassaappClient from './kassaappClient.js';
import * as transformer from './kassaappTransformer.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sync ingredients from Kassalapp API to Supabase
 */
export async function syncIngredientsFromKassalapp(options = {}) {
  const startTime = Date.now();
  let syncedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    console.log('🔄 Starting ingredient sync from Kassalapp...');

    // Fetch products from Kassalapp
    const searchTerm = options.search || '';
    const limit = options.limit || 500;

    let page = 1;
    let hasMore = true;
    let allProducts = [];

    while (hasMore && page <= 10) {
      try {
        console.log(`📦 Fetching page ${page}...`);
        const response = await kassaappClient.fetchProducts({
          search: searchTerm,
          limit,
          page,
        });

        if (response.data && Array.isArray(response.data)) {
          allProducts = allProducts.concat(response.data);
          console.log(`✓ Got ${response.data.length} products on page ${page}`);
        }

        // Check if there are more pages
        hasMore = response.links?.next !== null && response.meta?.current_page < response.meta?.last_page;
        page++;

        // Rate limiting: wait a bit between requests
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        errors.push({ page, error: error.message });
        hasMore = false;
      }
    }

    console.log(`✓ Fetched ${allProducts.length} total products from Kassalapp`);

    // Transform products to ingredient format
    const { results: transformedIngredients, errors: transformErrors } =
      await transformer.transformProductsBatch(allProducts, ({ processed, total }) => {
        if (processed % 100 === 0) {
          console.log(`  Transformed ${processed}/${total} products...`);
        }
      });

    if (transformErrors.length > 0) {
      console.warn(`⚠️  ${transformErrors.length} products failed to transform`);
      errors.push(...transformErrors);
      errorCount += transformErrors.length;
    }

    console.log(`✓ Transformed ${transformedIngredients.length} products to ingredient format`);

    // Upsert ingredients into Supabase
    if (transformedIngredients.length > 0) {
      console.log('💾 Upserting ingredients into Supabase...');

      for (const ingredient of transformedIngredients) {
        try {
          // Try to find existing ingredient by EAN or external_id
          let existingId = null;
          if (ingredient.ean) {
            const { data: existing } = await supabase
              .from('ingredients')
              .select('id')
              .eq('ean', ingredient.ean)
              .single();
            existingId = existing?.id;
          }

          if (!existingId && ingredient.external_id) {
            const { data: existing } = await supabase
              .from('ingredients')
              .select('id')
              .eq('external_id', ingredient.external_id)
              .single();
            existingId = existing?.id;
          }

          if (existingId) {
            // Update existing ingredient
            const { error } = await supabase
              .from('ingredients')
              .update({
                ...ingredient,
                updated_at: new Date(),
              })
              .eq('id', existingId);

            if (error) {
              console.error(`Error updating ingredient ${ingredient.name}:`, error.message);
              errors.push({ ingredient: ingredient.name, error: error.message });
              errorCount++;
            } else {
              updatedCount++;
            }
          } else {
            // Insert new ingredient
            const { error } = await supabase
              .from('ingredients')
              .insert([ingredient]);

            if (error) {
              // Might be duplicate by name, try to ignore
              if (error.code === '23505') {
                console.log(`  Skipped duplicate: ${ingredient.name}`);
                updatedCount++;
              } else {
                console.error(`Error inserting ingredient ${ingredient.name}:`, error.message);
                errors.push({ ingredient: ingredient.name, error: error.message });
                errorCount++;
              }
            } else {
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`Error processing ingredient ${ingredient.name}:`, error.message);
          errors.push({ ingredient: ingredient.name, error: error.message });
          errorCount++;
        }
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);

    // Log sync result
    const result = {
      synced: syncedCount,
      updated: updatedCount,
      errors: errorCount,
      total_processed: transformedIngredients.length,
      duration_seconds: duration,
    };

    console.log('✅ Sync complete:', result);

    // Store sync log
    try {
      await supabase
        .from('ingredient_sync_log')
        .insert([{
          total_synced: syncedCount,
          total_updated: updatedCount,
          total_errors: errorCount,
          error_details: errors.length > 0 ? errors : null,
          sync_duration_seconds: duration,
        }]);
    } catch (error) {
      console.warn('Could not log sync result:', error.message);
    }

    return result;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    const duration = Math.round((Date.now() - startTime) / 1000);

    // Log failure
    try {
      await supabase
        .from('ingredient_sync_log')
        .insert([{
          total_synced: 0,
          total_updated: 0,
          total_errors: 1,
          error_details: [{ error: error.message }],
          sync_duration_seconds: duration,
        }]);
    } catch (logError) {
      console.warn('Could not log sync failure:', logError.message);
    }

    throw error;
  }
}

/**
 * Schedule daily sync (to be called from a cron job or interval)
 */
export async function scheduleDailySync() {
  console.log('⏰ Scheduling daily ingredient sync...');

  // Run sync every day at 02:00 UTC
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(2, 0, 0, 0);

  const timeUntilNextSync = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    syncIngredientsFromKassalapp()
      .then(() => {
        // Re-schedule for next day
        const interval = 24 * 60 * 60 * 1000; // 24 hours
        setInterval(
          () => syncIngredientsFromKassalapp(),
          interval
        );
      })
      .catch(error => {
        console.error('Scheduled sync failed:', error);
        // Retry in 1 hour
        setTimeout(scheduleDailySync, 60 * 60 * 1000);
      });
  }, timeUntilNextSync);

  console.log(`⏰ Next sync in ${Math.round(timeUntilNextSync / 1000 / 60)} minutes`);
}
