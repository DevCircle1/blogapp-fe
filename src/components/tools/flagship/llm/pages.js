import {
  LLM_MODELS, MODEL_NOTES, MODEL_PAGE_SLUGS, PRICES_VERIFIED_ON, PRICE_SOURCES,
} from '../../../../data/llmModels.js';
import { callCost, compactTokens, perMillion, usd } from '../../../../lib/llm/cost.js';

const N = LLM_MODELS.length;

export const COUNTER_PATH = '/tools/llm-token-counter';
export const COST_PATH = '/tools/llm-api-cost-calculator';
export const COMPARE_PATH = '/tools/llm-price-comparison';

const monthYear = new Date(`${PRICES_VERIFIED_ON}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const shortDate = new Date(`${PRICES_VERIFIED_ON}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const longDate = new Date(`${PRICES_VERIFIED_ON}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const RELATED = [
  { to: '/tools/word-counter', label: 'Word Counter', description: 'Count words, characters and reading time for the same text.' },
  { to: '/tools/json-studio', label: 'JSON Studio', description: 'Validate and format the JSON in your prompts and tool schemas.' },
  { to: '/tools/percentage-calculator', label: 'Percentage Calculator', description: 'Work out savings between two models or price tiers.' },
];

const SIBLINGS = [
  { to: COUNTER_PATH, label: 'LLM token counter' },
  { to: COST_PATH, label: 'LLM API cost calculator' },
  { to: COMPARE_PATH, label: 'LLM pricing comparison' },
];

const SOURCE_LIST = PRICE_SOURCES.map((source) => `${source.provider}: ${source.name} (${source.url.replace('https://', '')})`);

const COUNT_FAQS = [
  {
    q: 'Are these token counts exact?',
    a: 'They are exact for OpenAI models that use the o200k_base encoding, such as GPT-4o and GPT-4.1, because the tokenizer is run in your browser. For other models the provider’s own tokenizer cannot be run in a browser, so the count is an estimate made with o200k_base and marked with ≈. Treat an estimate as a planning figure and check the usage field of a real API response before you commit to a budget.',
  },
  {
    q: 'Why does the same text give different token counts on different models?',
    a: 'Each model family has its own vocabulary of text fragments, and text is split into the longest fragments the vocabulary knows. A larger or differently trained vocabulary splits the same sentence into a different number of pieces. Anthropic, for example, states that its 4.7 and later models produce roughly 30% more tokens for the same text than earlier Claude models.',
  },
  {
    q: 'Is my prompt sent to a server?',
    a: 'No. Counting runs in a background thread in your browser. The site records only an anonymous counter such as how many models were compared, never the text you paste.',
  },
  {
    q: 'How current are the prices?',
    a: `Prices were last verified on ${longDate} against the providers’ own pricing pages, and the date is shown next to every table. They can change without notice, so confirm a price on the provider’s page before signing a contract or setting a budget.`,
  },
  {
    q: 'What does the cached-input option do?',
    a: 'Providers charge a much lower price for prompt text that they can serve from a cache, typically when the same long prefix is sent repeatedly. Ticking the option prices the input at each model’s cache-read rate where one is listed. Cache write charges and cache expiry are not modelled.',
  },
  {
    q: 'What is a token, roughly, in words?',
    a: 'A common rule of thumb for English is about four characters, or three quarters of a word, per token. Code, other languages and unusual formatting usually use more tokens per word, which is why counting the real text beats using the rule.',
  },
];

const hubPage = () => ({
  path: COUNTER_PATH,
  toolId: 'llm-token-counter',
  slug: 'llm-token-counter',
  title: 'LLM Token Counter — Count Tokens for Any Model',
  description: `Count tokens and compare API costs across major LLMs. Exact OpenAI counts, labelled estimates for others. Prices verified ${shortDate}. Free.`,
  h1: 'LLM Token Counter',
  crumb: 'LLM Token Counter',
  appName: 'LLM Token Counter and API Cost Calculator',
  category: 'Developer · AI',
  applicationCategory: 'DeveloperApplication',
  lead: `This LLM token counter tells you how many tokens a prompt uses and what one call, and a month of calls, costs on ${N} models from Anthropic, OpenAI and Google. Paste text below; it is tokenized in your browser and never uploaded.`,
  sections: [
    {
      heading: 'How this LLM token counter works',
      paragraphs: [
        'Language models do not read characters or words. They read tokens: fragments of text drawn from a fixed vocabulary, where a common word is often one token and a rare word is several. Providers bill by the token, and a model’s context window is measured in tokens too, so the token count of a prompt decides both what a call costs and whether it fits.',
        'The counter runs a real byte-pair-encoding tokenizer, not a length-divided-by-four guess. It loads OpenAI’s o200k_base encoding through js-tiktoken in a background thread, so a large document does not freeze the page. For the GPT-4o and GPT-4.1 families that count is exactly what the API bills. For every other model the table shows the same count with a ≈ sign.',
      ],
    },
    {
      heading: 'Why token counts differ between models',
      paragraphs: [
        'Each model family trains its own tokenizer, so the same sentence can be split into more or fewer pieces depending on the vocabulary. The difference is not small: Anthropic states that Claude models from 4.7 onward produce roughly 30% more tokens than earlier Claude models for the same text, and non-English text, source code and long numbers all tokenize less efficiently than plain English prose.',
        'That is why a cost comparison based on one shared token count is an approximation. It is still the right first step for choosing a model, because price differences between models are usually far larger than tokenizer differences — but before you set a budget, send a representative prompt to the real API and read the usage figures it returns.',
      ],
    },
    {
      heading: 'Reading the cost table',
      paragraphs: [
        'Every row prices your prompt as input tokens and your expected reply as output tokens at that model’s per-million-token rates. Output is usually several times more expensive than input, so a short prompt that produces a long answer can cost more than a long prompt with a short answer. The cheapest model for your inputs is highlighted, and a red warning appears when the prompt is longer than a model’s context window.',
        'Tick “Prompt is served from cache” to price the input at each provider’s cache-read rate, which is commonly a 50–90% discount on repeated prefixes. Set calls per day to turn the per-call price into a monthly figure, and use “Copy as markdown table” to paste the comparison, with its source line, into a design document or pull request.',
      ],
    },
    {
      heading: 'Limits of this calculator',
      list: [
        'Estimated counts (≈) can differ from what the provider bills, in either direction.',
        'Prices are standard-tier list prices for prompts up to 200k tokens; batch discounts, long-context surcharges, regional multipliers and fast-mode premiums are not modelled.',
        'Cache writes, tool-use overhead, images and reasoning tokens are not included.',
        'Prices change. The verification date is shown, and each provider’s page is the source of truth.',
      ],
    },
  ],
  steps: [
    'Paste your prompt into the box, or drop a .txt or .md file on it.',
    'Set the expected output length and how many calls you make per day.',
    'Compare the cost per call and per month across models; the cheapest is highlighted.',
    'Tick the cache option if your prompt prefix is reused, then copy the table if you need it elsewhere.',
  ],
  faqs: COUNT_FAQS,
  related: RELATED,
  siblingsHeading: 'Also in this suite',
  siblings: [...SIBLINGS.slice(1), ...MODEL_PAGE_SLUGS.map((slug) => {
    const model = LLM_MODELS.find((item) => item.slug === slug);
    return { to: `${COUNTER_PATH}/${slug}`, label: `${model.name} token counter` };
  })],
  disclaimer: `Prices verified ${longDate} from the providers’ pricing pages. Estimates are marked ≈. Always check the provider’s current price and the usage field of a real API response before budgeting.`,
});

const modelPage = (model) => {
  const base = { inputTokens: 1000, outputTokens: 500, cached: false };
  const thousandCalls = callCost(model, base).total * 1000;
  const fullContext = model.context ? perMillion(model.context, model.input) : null;
  const cachedNote = model.cached != null
    ? `With prompt caching, a cache read is priced at ${usd(model.cached)} per million tokens, ${Math.round((1 - model.cached / model.input) * 100)}% below the standard input rate.`
    : 'No cache-read price is listed for this model.';
  const contextNote = model.context
    ? `Its ${compactTokens(model.context)}-token context window holds roughly ${Math.round(model.context * 0.75 / 1000).toLocaleString('en-US')},000 English words, or about ${Math.round((model.context * 0.75) / 500).toLocaleString('en-US')} pages at 500 words a page; filling all of it once costs ${usd(fullContext)} in input tokens.`
    : 'A context window size was not listed on the provider’s pricing page for this model.';
  const counting = model.exact
    ? `${model.name} uses OpenAI’s o200k_base encoding, and this page runs that tokenizer in your browser, so the count shown is exactly what the API will bill for the prompt text.`
    : `${model.name}’s own tokenizer cannot be run in a browser, so this page counts with OpenAI’s o200k_base encoding and marks the result ≈. Use it to size a prompt and compare costs, then confirm against the usage figures the API returns.`;

  return {
    path: `${COUNTER_PATH}/${model.slug}`,
    toolId: 'llm-token-counter',
    slug: `llm-token-counter/${model.slug}`,
    modelSlug: model.slug,
    title: `${model.name} Token Counter & Cost Calculator`,
    description: `Count tokens and estimate API cost for ${model.name}, then compare it with other LLMs. Prices verified ${longDate}. Free, runs in your browser.`,
    h1: `${model.name} Token Counter & Cost Calculator`,
    crumb: `${model.name} token counter`,
    parent: { name: 'LLM Token Counter', path: COUNTER_PATH },
    appName: `${model.name} Token Counter & Cost Calculator`,
    category: `Developer · ${model.provider}`,
    applicationCategory: 'DeveloperApplication',
    lead: `Use this ${model.name} token counter to see how many tokens a prompt uses and what it costs: ${usd(model.input)} per million input tokens and ${usd(model.output)} per million output tokens. Paste text below — it is counted in your browser and never uploaded.`,
    sections: [
      {
        heading: `${model.name} pricing at a glance`,
        list: [
          `Provider: ${model.provider}`,
          `Input: ${usd(model.input)} per million tokens`,
          `Output: ${usd(model.output)} per million tokens`,
          `Cached input: ${model.cached != null ? `${usd(model.cached)} per million tokens` : 'not listed'}`,
          `Context window: ${model.context ? `${model.context.toLocaleString('en-US')} tokens` : 'not listed'}`,
          `Prices verified: ${longDate}`,
        ],
      },
      { heading: `About ${model.name}`, paragraphs: [MODEL_NOTES[model.slug], ...(model.promo ? [model.promo] : [])] },
      {
        heading: `What ${model.name} costs in practice`,
        paragraphs: [
          `A call with 1,000 input tokens and 500 output tokens costs ${usd(callCost(model, base).total)} on ${model.name}, so a thousand such calls cost ${usd(thousandCalls)}. ${cachedNote} ${contextNote}`,
        ],
      },
      { heading: `How this ${model.name} token counter counts tokens`, paragraphs: [counting] },
    ],
    steps: hubPage().steps,
    faqs: [
      {
        q: `How many tokens is my text in ${model.name}?`,
        a: model.exact ? 'Paste it into the box above; the count shown for this model is exact because it uses the same o200k_base tokenizer the API applies.' : 'Paste it into the box above. The number shown for this model is an estimate made with o200k_base and marked ≈, so the API’s own count can differ.',
      },
      {
        q: `How much does ${model.name} cost per million tokens?`,
        a: `${usd(model.input)} per million input tokens and ${usd(model.output)} per million output tokens${model.cached != null ? `, with cached input at ${usd(model.cached)}` : ''}, as of ${longDate}.`,
      },
      COUNT_FAQS[2],
    ],
    related: [{ to: COUNTER_PATH, label: 'LLM Token Counter', description: 'Compare every model side by side.' }, { to: COMPARE_PATH, label: 'LLM Pricing Comparison', description: 'The full, sortable price table.' }, RELATED[0]],
    siblingsHeading: 'More token counters',
    siblings: MODEL_PAGE_SLUGS.filter((slug) => slug !== model.slug).map((slug) => {
      const other = LLM_MODELS.find((item) => item.slug === slug);
      return { to: `${COUNTER_PATH}/${slug}`, label: `${other.name} token counter` };
    }),
    disclaimer: `Prices verified ${longDate} from ${model.provider}’s pricing page. Confirm on the provider’s site before budgeting.`,
  };
};

const costPage = () => ({
  path: COST_PATH,
  toolId: 'llm-api-cost-calculator',
  slug: 'llm-api-cost-calculator',
  title: 'LLM API Cost Calculator — Compare Model Pricing',
  description: `Estimate monthly LLM API spend and compare ${N} models by price. Set tokens and calls per day. Prices verified ${longDate}. Free, in your browser.`,
  h1: 'LLM API Cost Calculator',
  crumb: 'LLM API Cost Calculator',
  appName: 'LLM API Cost Calculator',
  category: 'Developer · AI',
  applicationCategory: 'DeveloperApplication',
  lead: `This LLM API cost calculator estimates what a feature will cost per call and per month on ${N} Anthropic, OpenAI and Google models. Enter your tokens per call and calls per day, or paste a real prompt to measure it.`,
  sections: [
    {
      heading: 'How the LLM API cost calculator works',
      paragraphs: [
        'API cost is tokens multiplied by a per-million-token price, added up separately for the input you send and the output you receive. For each model the calculator takes your input tokens, multiplies by that model’s input price, adds your output tokens multiplied by its output price, and scales the result by calls per day and 30 days.',
        'You can enter token counts directly when you are budgeting a feature that does not exist yet, or paste a sample prompt and let the calculator measure it with a real tokenizer. Sorting by cost per call makes the cheapest option obvious, and a warning marks any model whose context window is too small for your input.',
      ],
    },
    {
      heading: 'Where the money actually goes',
      paragraphs: [
        'For chat-style features the reply is often the larger cost, because output tokens are priced at several times the input rate. For retrieval and document workloads the opposite is true: thousands of context tokens go in and only a short answer comes out. Look at both columns rather than only the total.',
        'Repeated prompt prefixes — a long system prompt, a tool list, a reference document — are the biggest saving available. Providers price cache reads far below normal input, so the cached option can change which model is cheapest. Batch APIs, which most providers discount by around half for non-urgent work, are not modelled here.',
      ],
    },
    {
      heading: 'Estimating before you build',
      list: [
        'Start from a real example prompt and measure it rather than guessing.',
        'Estimate output length from the answers you want, then add a margin: replies vary.',
        'Multiply by realistic traffic, including retries and multi-turn conversations, which resend earlier messages.',
        'Re-run the numbers when a provider changes prices — the date shown is when they were last verified.',
      ],
    },
  ],
  steps: [
    'Enter the input tokens per call, or paste a prompt to measure it.',
    'Enter the expected output tokens per call and your calls per day.',
    'Read the per-month column, and tick the cache option if your prompt prefix repeats.',
    'Copy the comparison as a markdown table to share it.',
  ],
  faqs: [
    COUNT_FAQS[3],
    COUNT_FAQS[4],
    {
      q: 'Does this include batch discounts or long-context surcharges?',
      a: 'No. It uses standard-tier list prices for prompts up to 200k tokens. Batch processing, long-prompt tiers, regional or data-residency multipliers and premium speed modes are billed differently by each provider and are not modelled.',
    },
    {
      q: 'How do I estimate output tokens?',
      a: 'Run a few typical requests, note the output length in the response usage, and use the average plus a margin. A useful reply of one paragraph is roughly 100–200 tokens; a page of text is closer to 700.',
    },
  ],
  related: RELATED,
  siblingsHeading: 'Also in this suite',
  siblings: [SIBLINGS[0], SIBLINGS[2]],
  disclaimer: `Prices verified ${longDate}. Estimates only — your invoice depends on real token counts and the provider’s current pricing.`,
});

const comparePage = () => ({
  path: COMPARE_PATH,
  toolId: 'llm-price-comparison',
  slug: 'llm-price-comparison',
  title: `LLM Pricing Comparison — All Models, Updated ${monthYear}`,
  description: `Compare LLM API prices per million tokens across Anthropic, OpenAI and Google. Sortable, with cached-input rates. Prices verified ${longDate}.`,
  h1: 'LLM Pricing Comparison',
  crumb: 'LLM Pricing Comparison',
  appName: 'LLM Pricing Comparison',
  category: 'Developer · AI',
  applicationCategory: 'DeveloperApplication',
  lead: `This LLM pricing comparison lists input, cached-input and output prices per million tokens for ${N} models, taken from each provider’s own pricing page and last verified on ${longDate}.`,
  sections: [
    {
      heading: 'How to read this LLM pricing comparison',
      paragraphs: [
        'All prices are US dollars per million tokens at the standard tier. “Input” is the text you send, “output” is the text the model generates, and “cached input” is the discounted rate for prompt text the provider can serve from its cache. Click a column heading to sort; the default order groups models by provider from cheapest to most expensive input.',
        'Context is the largest prompt the model accepts, where the provider lists one. Some providers charge a higher rate for prompts above 200,000 tokens; this table shows the standard rate below that size.',
      ],
    },
    {
      heading: 'Where the prices come from',
      paragraphs: ['Every figure is read from the provider’s own pricing page rather than a third-party roundup, and the verification date is shown above the table. The sources are:'],
      list: SOURCE_LIST,
    },
    {
      heading: 'Choosing on price alone',
      paragraphs: [
        'The cheapest model per token is not always the cheapest per task. A stronger model that answers correctly in one call can cost less than a weaker one that needs retries, and tokenizers differ, so the same prompt is a different number of tokens on each model. Use the LLM token counter to price your own prompt across all of them.',
      ],
    },
  ],
  steps: [
    'Sort by input or output price to find the cheapest models.',
    'Compare the cached-input column if you resend the same prompt prefix.',
    'Open the token counter to price your own prompt on any of these models.',
  ],
  faqs: [
    COUNT_FAQS[3],
    {
      q: 'Why do two pricing pages show different prices for the same model?',
      a: 'Third-party summaries are often out of date or mix pricing tiers. This table is read from the providers’ own pages and dated, and it shows the standard tier for prompts up to 200k tokens; batch, priority and long-context rates differ.',
    },
    {
      q: 'What is the difference between input, output and cached input?',
      a: 'Input is the prompt you send, output is what the model generates, and cached input is prompt text the provider recognises from a recent call and bills at a reduced rate.',
    },
    {
      q: 'Are open-weight models like Llama or Mistral included?',
      a: 'Not yet. Open-weight models are priced by whichever company hosts them, so there is no single list price to verify. Only models with an official first-party price page are listed.',
    },
  ],
  related: RELATED,
  siblingsHeading: 'Also in this suite',
  siblings: SIBLINGS.slice(0, 2),
  disclaimer: `Prices verified ${longDate}. They can change without notice; the provider’s page is the source of truth.`,
});

export const LLM_PAGES = [
  hubPage(),
  ...LLM_MODELS.filter((model) => MODEL_PAGE_SLUGS.includes(model.slug)).map(modelPage),
  costPage(),
  comparePage(),
];
