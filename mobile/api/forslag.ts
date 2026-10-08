import Anthropic from '@anthropic-ai/sdk';

import { cleanResult, outputSchema, parseRequest, SYSTEM_PROMPT, userMessage } from './_lib/forslag';
import { json } from './_lib/kassalapp';

// Enkel grense per IP, så ingen kan bruke opp AI-kontoen ved å kalle oftere enn en person gjør.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = 20;
const calls = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (calls.get(ip) ?? []).filter(at => now - at < WINDOW_MS);
  recent.push(now);
  calls.set(ip, recent);
  return recent.length > MAX_CALLS;
}

// POST /api/forslag → forslag til bytter i ukeplanen som sparer penger, gir mer protein
// eller følger kostrådene bedre. Appen regner ut pris og næring, Claude velger byttene.
export async function POST(request: Request): Promise<Response> {
  // Bare appen selv (samme adresse) får bruke forslagene.
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: 'Ikke tillatt' }, { status: 403 });

  if (!process.env.ANTHROPIC_API_KEY) return json({ unavailable: 'no_key' });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'ukjent';
  if (rateLimited(ip)) return json({ unavailable: 'busy' }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Ugyldig forespørsel' }, { status: 400 });
  }
  const input = parseRequest(body);
  if (!input) return json({ error: 'Ugyldig forespørsel' }, { status: 400 });

  const client = new Anthropic({ timeout: 55_000, maxRetries: 1 });
  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      // Avslår sikkerhetsfilteret, prøver API-et automatisk en annen modell.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: outputSchema(input) },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage(input) }],
    });

    if (response.stop_reason === 'refusal') return json({ unavailable: 'refusal' });
    const textBlock = response.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') return json({ unavailable: 'error' }, { status: 502 });
    const result = cleanResult(JSON.parse(textBlock.text), input);
    if (!result) return json({ unavailable: 'error' }, { status: 502 });
    return json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ unavailable: 'busy' }, { status: 429 });
    if (error instanceof Anthropic.AuthenticationError) return json({ unavailable: 'no_key' });
    if (error instanceof SyntaxError) return json({ unavailable: 'error' }, { status: 502 });
    console.error('forslag feilet', error instanceof Anthropic.APIError ? error.status : error);
    return json({ unavailable: 'error' }, { status: 502 });
  }
}
