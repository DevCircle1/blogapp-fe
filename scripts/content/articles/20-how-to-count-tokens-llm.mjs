export default {
  slug: 'how-to-count-tokens-llm',
  title: 'How to Count Tokens for ChatGPT, Claude and Gemini (Cost Guide)',
  category: 'programming',
  theme: 'dev',
  tags: ['token counter', 'llm tokens', 'openai tokenizer', 'claude tokens', 'llm api cost', 'prompt caching'],
  description: 'What a token is, how to count tokens for GPT, Claude and Gemini models, why counts differ between tokenizers, and how to turn a token count into an API cost estimate.',
  cover: {
    kicker: 'From text to tokens to dollars',
    visual: {
      type: 'code',
      lines: [
        ['"Hello, world!"', '#e2e8f0'],
        ['→ ["Hello", ",",', 'accent'],
        ['   " world", "!"]', 'accent'],
        ['= 4 tokens', '#34d399'],
        '',
        ['"Tokenization"', '#e2e8f0'],
        ['→ ["Token", "ization"]', 'accent'],
      ],
    },
  },
  infographic: {
    type: 'bars',
    title: 'Monthly cost of the same chatbot workload',
    subtitle: '100,000 requests of 2,000 input + 500 output tokens (200M in, 50M out). List prices per million tokens as of 24 September 2026, no caching.',
    items: [
      { label: 'Claude Haiku 4.5', value: 450, display: '$450' },
      { label: 'Gemini 3.5 Flash', value: 750, display: '$750' },
      { label: 'Gemini 2.5 Pro', value: 750, display: '$750' },
      { label: 'Claude Sonnet 5', value: 900, display: '$900', highlight: true },
      { label: 'GPT-6 Sol', value: 900, display: '$900', highlight: true },
      { label: 'GPT-4o', value: 1000, display: '$1,000' },
      { label: 'Claude Opus 5.5', value: 1800, display: '$1,800' },
    ],
    alt: 'Bar chart comparing the monthly API cost of one chatbot workload across Claude, GPT and Gemini models, from 450 to 1,800 dollars',
    caption: 'Assumes identical token counts. In practice each tokenizer counts the same text differently, which shifts these totals.',
    footer: 'Estimate your own: talkandtool.com/tools/llm-api-cost-calculator',
  },
  html: `
<p>A token is the unit a language model reads and bills by. It is usually a word, part of a word, or a punctuation mark. To count tokens, run your text through the model's tokenizer. For a quick estimate, English text with modern OpenAI tokenizers comes to roughly one token per word. Here is how counting works for GPT, Claude and Gemini models, and how to turn a count into a cost.</p>

<h2>What a token actually is</h2>
<p>Models do not see letters or words. A tokenizer splits text into pieces from a fixed vocabulary, and each piece becomes a number. Common words are usually a single token. Rarer words are split into several parts:</p>
<ul>
<li><code>"Hello, world!"</code> → <code>Hello</code> <code>,</code> <code> world</code> <code>!</code> = <strong>4 tokens</strong></li>
<li><code>"Tokenization is surprisingly unintuitive."</code> → <code>Token</code> <code>ization</code> <code> is</code> <code> surprisingly</code> <code> unint</code> <code>uitive</code> <code>.</code> = <strong>7 tokens</strong></li>
</ul>
<p>Those counts come from OpenAI's <code>o200k_base</code> encoding, used by GPT-4o and GPT-4.1. Note that the leading space is part of the token: <code>" world"</code> and <code>"world"</code> are different tokens.</p>

<h2>Rules of thumb (and their limits)</h2>
<p>The classic estimate is about 4 characters or 0.75 words per token for English. That came from older tokenizers. Newer vocabularies are more efficient: in our test, a 53-word English paragraph was 57 tokens with <code>o200k_base</code>, about 1.1 tokens per word or 5.2 characters per token.</p>
<p>Counts rise sharply for:</p>
<ul>
<li><strong>Code:</strong> brackets, operators and indentation often become separate tokens. <code>function add(a, b) { return a + b; }</code> is 13 tokens for 8 "words".</li>
<li><strong>Non-English text:</strong> languages that are less represented in the vocabulary, and scripts like Chinese, Arabic or Hindi, can take several times more tokens for the same meaning.</li>
<li><strong>Numbers, IDs and URLs:</strong> long digit strings and random identifiers split into many small pieces.</li>
<li><strong>Whitespace and formatting:</strong> JSON, tables and repeated spaces all add tokens.</li>
</ul>

<h2>Why different models count differently</h2>
<p>Every model family has its own tokenizer, so the same text gives different counts:</p>
<ul>
<li><strong>OpenAI:</strong> GPT-4o and GPT-4.1 use <code>o200k_base</code>, which is public, so counts for those models can be exact. OpenAI has not published tokenizers for every newer model, so counts made with <code>o200k_base</code> are estimates for them.</li>
<li><strong>Anthropic (Claude):</strong> Anthropic says Claude 4.7 and later models use a newer tokenizer that produces roughly 30% more tokens for the same text than earlier Claude models. Its API has a token-counting endpoint for exact figures.</li>
<li><strong>Google (Gemini):</strong> Gemini's API has a <code>countTokens</code> method. Its tokenizer is not available to run in a browser, so browser tools estimate.</li>
</ul>
<p>The <a href="/tools/llm-token-counter">LLM token counter</a> counts in your browser with <code>o200k_base</code>. Results are marked exact where that is the model's own tokenizer and "≈" where it is an estimate. There are model pages for <a href="/tools/llm-token-counter/claude-sonnet-5">Claude Sonnet 5</a>, <a href="/tools/llm-token-counter/claude-opus-5-5">Claude Opus 5.5</a>, <a href="/tools/llm-token-counter/gpt-4o">GPT-4o</a> and <a href="/tools/llm-token-counter/gemini-2-5-pro">Gemini 2.5 Pro</a>, among others.</p>

<h2>From tokens to cost</h2>
<p>API prices are quoted per million tokens, with separate rates for input (your prompt) and output (the model's reply). Output is usually priced several times higher.</p>
<p><strong>Cost = (input tokens ÷ 1,000,000 × input price) + (output tokens ÷ 1,000,000 × output price)</strong></p>
<p>Example: a support chatbot handles 100,000 requests a month, each with a 2,000-token prompt (system instructions, conversation history, retrieved documents) and a 500-token reply. That is 200 million input tokens and 50 million output tokens. On Claude Sonnet 5 at $2 input and $10 output per million: 200 × $2 + 50 × $10 = <strong>$900 a month</strong>.</p>

{{infographic}}

<p>Prices change often, and several models have promotional or tiered pricing. The <a href="/tools/llm-price-comparison">LLM price comparison</a> lists current rates with the date they were last verified. Plug your own volumes into the <a href="/tools/llm-api-cost-calculator">LLM API cost calculator</a>.</p>

<h2>How to cut token costs</h2>
<ul>
<li><strong>Prompt caching:</strong> if the start of your prompt (system instructions, reference documents) is the same across requests, cached input is billed at a fraction of the normal rate, often 90% less for cache reads. In the example above, caching 1,500 of the 2,000 input tokens on Sonnet 5 would cut input cost from $400 to about $130 before any cache-write charges.</li>
<li><strong>Trim conversation history:</strong> re-sending the whole chat every turn makes input grow quickly. Summarise older turns or keep only the last few.</li>
<li><strong>Cap output length:</strong> set a sensible maximum and ask for concise answers. Output tokens are the expensive ones.</li>
<li><strong>Route by difficulty:</strong> send simple classification or extraction to a small model, and reserve large models for hard reasoning.</li>
<li><strong>Retrieve less, better:</strong> five relevant passages beat twenty loosely related ones, on cost and usually on answer quality.</li>
</ul>

<h2>Context windows are tokens too</h2>
<p>A model's context window is the maximum number of tokens for input and output combined in one request. Many current models accept around a million tokens, and some smaller ones 128,000–400,000. Hitting the limit truncates or rejects the request, so count long documents before sending them.</p>

<h2>Frequently asked questions</h2>
<h3>How many tokens is 1,000 words?</h3>
<p>For English with modern OpenAI tokenizers, roughly 1,100–1,400 tokens depending on vocabulary and formatting. Code and non-English text can take far more.</p>
<h3>Do spaces and punctuation count as tokens?</h3>
<p>Yes. Punctuation is often its own token, and spaces are usually attached to the following word. Extra whitespace and formatting add tokens.</p>
<h3>Are input and output tokens priced the same?</h3>
<p>Almost never. Output is typically 4–8 times more expensive per token than input, so long replies drive cost more than long prompts.</p>
`,
};
