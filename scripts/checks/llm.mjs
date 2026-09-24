/** Run: node scripts/checks/llm.mjs */
import { countTokens } from '../../src/lib/llm/tokenizer.js';
import { callCost, usd } from '../../src/lib/llm/cost.js';
import { LLM_MODELS, MODEL_NOTES } from '../../src/data/llmModels.js';

let failed = 0;
const eq = (name, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); } };

// Known o200k_base values: "hello world" = 2 tokens, empty = 0.
eq('hello world', (await countTokens('hello world', ['o200k_base'])).o200k_base, 2);
eq('empty', (await countTokens('', ['o200k_base'])).o200k_base, 0);
eq('special as text', (await countTokens('<|endoftext|>', ['o200k_base'])).o200k_base > 1, true);
const sonnet = LLM_MODELS.find((x) => x.slug === 'claude-sonnet-5');
eq('cost', callCost(sonnet, { inputTokens: 1_000_000, outputTokens: 1_000_000, cached: false }).total, 12);
eq('cached', callCost(sonnet, { inputTokens: 1_000_000, outputTokens: 0, cached: true }).total, 0.2);
eq('usd', usd(0.0123), '$0.0123');
eq('slugs unique', new Set(LLM_MODELS.map((x) => x.slug)).size, LLM_MODELS.length);
Object.keys(MODEL_NOTES).forEach((slug) => eq(`note ${slug}`, LLM_MODELS.some((x) => x.slug === slug), true));
console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
