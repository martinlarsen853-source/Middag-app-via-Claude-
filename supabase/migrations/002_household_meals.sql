-- Legg til household_id på meals (nullable = seed-måltider er globale)
ALTER TABLE meals
  ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES households(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_meals_household_id ON meals(household_id);

-- Erstatt gammel "alle kan lese"-policy
DROP POLICY IF EXISTS "Authenticated can read meals" ON meals;

CREATE POLICY "Users can read own and global meals" ON meals
  FOR SELECT TO authenticated USING (
    household_id IS NULL OR
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own household meals" ON meals
  FOR INSERT TO authenticated WITH CHECK (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own household meals" ON meals
  FOR UPDATE TO authenticated USING (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete own household meals" ON meals
  FOR DELETE TO authenticated USING (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

-- meal_ingredients: erstatt gammel policy
DROP POLICY IF EXISTS "Authenticated can read ingredients" ON meal_ingredients;

CREATE POLICY "Users can read accessible meal ingredients" ON meal_ingredients
  FOR SELECT TO authenticated USING (
    meal_id IN (
      SELECT id FROM meals WHERE
        household_id IS NULL OR
        household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own meal ingredients" ON meal_ingredients
  FOR INSERT TO authenticated WITH CHECK (
    meal_id IN (
      SELECT id FROM meals WHERE
        household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can delete own meal ingredients" ON meal_ingredients
  FOR DELETE TO authenticated USING (
    meal_id IN (
      SELECT id FROM meals WHERE
        household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
    )
  );
