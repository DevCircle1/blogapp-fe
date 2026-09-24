/**
 * LLM price list. This is the build-time copy: it is what the prerendered HTML
 * shows and what the tool uses until fresher rows arrive from Supabase
 * (`llm_models`, see supabase/llm_models.sql). Edit a row in Supabase and the
 * tool updates without a deploy; edit it here to change the static page.
 *
 * All prices are USD per million tokens at the standard tier, for prompts up to
 * 200k tokens, and were read from each provider's own pricing page on
 * PRICES_VERIFIED_ON. Re-check them before changing the date.
 */
export const PRICES_VERIFIED_ON = '2026-09-24';

export const PRICE_SOURCES = [
  { provider: 'Anthropic', name: 'Claude pricing', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
  { provider: 'OpenAI', name: 'OpenAI API pricing', url: 'https://developers.openai.com/api/docs/pricing' },
  { provider: 'Google', name: 'Gemini API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' },
];

/** Only tokenizers we can run in the browser. Everything else is an estimate against the nearest one. */
export const TOKENIZERS = {
  o200k_base: 'OpenAI o200k_base (js-tiktoken)',
};

// exact: the model's own tokenizer is o200k_base. Otherwise the count is an
// estimate made with o200k_base and is labelled "≈" everywhere it appears.
const m = (slug, provider, name, input, cached, output, context, extra = {}) => ({
  slug, provider, name, tokenizer: 'o200k_base', exact: false, input, cached, output, context, notes: '', ...extra,
});

export const LLM_MODELS = [
  m('claude-fable-5-1', 'Anthropic', 'Claude Fable 5.1', 10, 0.25, 50, 1_000_000),
  m('claude-opus-5-5', 'Anthropic', 'Claude Opus 5.5', 4, 0.2, 20, 1_000_000),
  m('claude-opus-5', 'Anthropic', 'Claude Opus 5', 5, 0.5, 25, 1_000_000),
  m('claude-sonnet-5', 'Anthropic', 'Claude Sonnet 5', 2, 0.2, 10, 1_000_000),
  m('claude-sonnet-4-6', 'Anthropic', 'Claude Sonnet 4.6', 3, 0.3, 15, 1_000_000),
  m('claude-haiku-4-5', 'Anthropic', 'Claude Haiku 4.5', 1, 0.1, 5, 200_000),
  m('gpt-6-astra', 'OpenAI', 'GPT-6 Astra', 10, 1, 50, null),
  m('gpt-6-sol', 'OpenAI', 'GPT-6 Sol', 2, 0.2, 10, null),
  m('gpt-6-luna', 'OpenAI', 'GPT-6 Luna', 0.1, 0.01, 0.5, null),
  m('gpt-5-6-sol', 'OpenAI', 'GPT-5.6 Sol', 4, 0.4, 20, null),
  m('gpt-5-6-terra', 'OpenAI', 'GPT-5.6 Terra', 2, 0.2, 12, null),
  m('gpt-5-6-luna', 'OpenAI', 'GPT-5.6 Luna', 0.2, 0.02, 1.2, null),
  m('gpt-5-5', 'OpenAI', 'GPT-5.5', 5, 0.5, 30, null),
  m('gpt-5-4-mini', 'OpenAI', 'GPT-5.4 mini', 0.75, 0.075, 4.5, null),
  m('gpt-5-mini', 'OpenAI', 'GPT-5 mini', 0.25, 0.025, 2, 400_000),
  m('gpt-5-nano', 'OpenAI', 'GPT-5 nano', 0.05, 0.005, 0.4, 400_000),
  m('gpt-4-1', 'OpenAI', 'GPT-4.1', 2, 0.5, 8, 1_047_576, { exact: true }),
  m('gpt-4o', 'OpenAI', 'GPT-4o', 2.5, 1.25, 10, 128_000, { exact: true }),
  m('gpt-4o-mini', 'OpenAI', 'GPT-4o mini', 0.15, 0.075, 0.6, 128_000, { exact: true }),
  m('gemini-3-8-flash', 'Google', 'Gemini 3.8 Flash', 0.75, 0.075, 3.75, 1_000_000, { promo: 'Promotional price through 31 December 2026; Google lists an increase from 1 January 2027.' }),
  m('gemini-3-5-flash', 'Google', 'Gemini 3.5 Flash', 1.5, 0.15, 9, 1_000_000),
  m('gemini-3-5-flash-lite', 'Google', 'Gemini 3.5 Flash-Lite', 0.3, 0.03, 2.5, 1_000_000),
  m('gemini-3-1-pro-preview', 'Google', 'Gemini 3.1 Pro Preview', 2, 0.2, 12, 200_000),
  m('gemini-2-5-pro', 'Google', 'Gemini 2.5 Pro', 1.25, 0.125, 10, 1_000_000),
  m('gemini-2-5-flash', 'Google', 'Gemini 2.5 Flash', 0.3, 0.03, 2.5, 1_000_000),
  m('gemini-2-5-flash-lite', 'Google', 'Gemini 2.5 Flash-Lite', 0.1, 0.01, 0.4, 1_000_000),
];

/**
 * Hand-written notes for the models that get their own page. Each states facts
 * that are specific to that model; models without a note appear in the tables
 * but do not get a page (a page of swapped numbers would be a doorway page).
 */
export const MODEL_NOTES = {
  'claude-fable-5-1': 'Fable 5.1 is the most expensive Claude model in the public price list, at $10 per million input tokens and $50 per million output. Its cache-read price is unusually low — 2.5% of the base input rate, or $0.25 per million — so a large, stable prompt that is reused across many calls costs far less than the headline rate suggests. Anthropic notes that Claude 4.7 and later models use a newer tokenizer that produces roughly 30% more tokens for the same text than earlier Claude models, so a prompt counted here with a generic encoding is likely to be billed higher on this model.',
  'claude-opus-5-5': 'Opus 5.5 is priced at $4 per million input tokens and $20 per million output, below the $5 and $25 charged for Opus 5 and the 4.x Opus line. Cache reads are 5% of the base input price ($0.20 per million), and Anthropic lists a separate fast mode for Opus models at premium prices ($8 input, $40 output for Opus 5.5) that this calculator does not model. It uses the newer Claude tokenizer, which Anthropic says yields about 30% more tokens than earlier Claude models.',
  'claude-sonnet-5': 'Sonnet 5 launched at introductory prices of $2 per million input tokens and $10 per million output, and Anthropic has since confirmed these are now the standard price: the increase to $3 and $15 that had been scheduled for 1 September 2026 will not happen. That makes it one of the cheapest 1M-context models from Anthropic. Cache reads cost $0.20 per million, and it uses the newer tokenizer that produces around 30% more tokens than Claude models up to Sonnet 4.6.',
  'claude-haiku-4-5': 'Haiku 4.5 is the low-cost Claude option at $1 per million input tokens and $5 per million output, with cache reads at $0.10 per million. It has a 200,000-token context window, smaller than the 1M windows of the newer Claude models, and it still uses the earlier Claude tokenizer, so token counts for the same text are lower than on Claude 4.7 and later.',
  'gpt-6-sol': 'GPT-6 Sol sits in the middle of OpenAI’s GPT-6 line at $2 per million input tokens and $10 per million output, with cached input at $0.20 per million — a 90% discount on repeated prompt prefixes. OpenAI has not published a tokenizer specifically for this model, so the counts shown here use o200k_base, the encoding used by the GPT-4o and GPT-4.1 families, and should be treated as an estimate.',
  'gpt-5-6-sol': 'GPT-5.6 Sol is the top model of the GPT-5.6 family at $4 per million input tokens and $20 per million output, with cached input at $0.40 per million. Counts here use o200k_base as an estimate.',
  'gpt-4o': 'GPT-4o costs $2.50 per million input tokens and $10 per million output, and its cached-input price of $1.25 is a 50% discount — a much smaller reduction than the 90% offered on newer OpenAI models, so caching saves less here. GPT-4o uses the o200k_base encoding and has a 128,000-token context window, so the token counts on this page are exact for it rather than estimates.',
  'gpt-4-1': 'GPT-4.1 is priced at $2 per million input tokens and $8 per million output, with cached input at $0.50 per million (a 75% discount). Its context window is about a million tokens, which is why a whole codebase or book can fit in one prompt. It uses o200k_base, so the counts on this page are exact for it.',
  'gemini-3-5-flash': 'Gemini 3.5 Flash costs $1.50 per million input tokens and $9 per million output, with cached input at $0.15 per million and a 1M-token context window. Google’s listed prices apply to prompts up to 200,000 tokens; longer prompts are billed at a higher tier that this calculator does not model. Google does not publish its tokenizer for browsers, so counts here are estimates made with o200k_base.',
  'gemini-2-5-pro': 'Gemini 2.5 Pro is priced at $1.25 per million input tokens and $10 per million output, with cached input at $0.125 per million. The figures apply to prompts up to 200,000 tokens; beyond that Google charges a higher rate, which matters if you fill the 1M-token window. Token counts here are estimates using o200k_base rather than Google’s own tokenizer.',
};
export const MODEL_PAGE_SLUGS = Object.keys(MODEL_NOTES);

export const providerOrder = ['Anthropic', 'OpenAI', 'Google'];
export const bySlug = (models, slug) => models.find((model) => model.slug === slug);
