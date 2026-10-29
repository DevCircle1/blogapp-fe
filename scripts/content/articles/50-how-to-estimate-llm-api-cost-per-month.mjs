export default {
  slug: 'how-to-estimate-llm-api-cost-per-month',
  title: 'How to Estimate Your Monthly LLM API Cost (With a Worked Example)',
  category: 'technology',
  theme: 'dev',
  tags: ['llm api cost', 'estimate llm cost', 'tokens per request', 'ai api pricing', 'prompt caching', 'monthly ai budget'],
  description: 'A simple formula to estimate monthly LLM API spend from tokens per request and daily volume, a worked chatbot example, and the levers that cut the bill.',
  cover: {
    kicker: 'Tokens × price × volume',
    visual: { type: 'formula', title: 'COST PER REQUEST', lines: ['in × price_in ÷ 1M', '+ out × price_out ÷ 1M', '1,500 in · 400 out', '$3 / $15 per 1M (example)', '= $0.0105'] },
  },
  infographic: {
    type: 'steps',
    title: 'Estimating monthly LLM spend',
    subtitle: 'Five numbers are enough for a defensible budget.',
    items: [
      ['Measure tokens per request', 'Count the input (system prompt, history, question) and the typical output. Use a tokenizer, not word counts.'],
      ['Look up the price per million tokens', 'Input and output are priced separately, and output is usually several times dearer.'],
      ['Work out the cost of one request', '(input tokens × input price + output tokens × output price) ÷ 1,000,000.'],
      ['Multiply by requests per day and days per month', 'Use a realistic average, then a busy-day figure for headroom.'],
      ['Add a margin', 'Retries, longer conversations and growth. A 20–30% buffer is a sensible start.'],
    ],
    alt: 'Five steps to estimate monthly LLM API cost: measure tokens, find prices, cost one request, multiply by volume, add a margin',
    caption: 'Prices change often, so check the current rates before you commit to a budget.',
    footer: 'Run the numbers: talkandtool.com/tools/llm-api-cost-calculator',
  },
  html: `
<p>You can estimate what an LLM feature will cost per month with a short formula: the tokens you send and receive per request, the price per million tokens, and how many requests you expect. Most surprises come from forgetting that conversation history is sent again on every turn, and that output tokens cost more than input tokens. This guide walks through the formula with a worked example and the main ways to bring the bill down.</p>

<h2>The formula</h2>
<p><strong>Cost per request = (input tokens × input price + output tokens × output price) ÷ 1,000,000</strong></p>
<p><strong>Monthly cost = cost per request × requests per day × days in the month</strong></p>
<p>Prices are quoted per million tokens, separately for input and output. Output tokens usually cost several times more than input tokens, so a feature that writes long answers is more expensive than one that reads a lot and answers briefly.</p>

<h2>Step 1: measure your tokens</h2>
<p>Tokens are not words. English text averages roughly three-quarters of a word per token, and code, numbers and non-English text often use more. Measure with a real tokenizer; the <a href="/tools/llm-token-counter">LLM token counter</a> counts a prompt and shows the cost across models, and <a href="/blogs/article/how-to-count-tokens-llm">how to count tokens</a> explains how tokenizers differ.</p>
<p>Count everything that goes in, not just the user's question:</p>
<ul>
<li>The system prompt and instructions</li>
<li>Retrieved documents or context you add</li>
<li>The conversation so far, if you resend history</li>
<li>The user's new message</li>
</ul>
<p>Then estimate the output from a handful of real answers.</p>

<h2>Step 2: a worked example</h2>
<p>A support chatbot receives 1,000 requests a day. Each request sends about 1,500 input tokens (system prompt, a few retrieved passages and the question) and returns about 400 tokens. Take example prices of $3 per million input tokens and $15 per million output tokens. These are placeholders for the arithmetic, not a quote from any provider.</p>
<ul>
<li>Input: 1,500 × $3 ÷ 1,000,000 = $0.0045</li>
<li>Output: 400 × $15 ÷ 1,000,000 = $0.0060</li>
<li>Per request: $0.0105</li>
<li>Per day: 1,000 × $0.0105 = $10.50</li>
<li>Per month (30 days): <strong>$315</strong></li>
</ul>
<p>With a 25% buffer for retries and growth, budget about $395. The output is only 400 of the 1,900 tokens in each call, but it makes up 57% of the cost. That is the effect of the higher output price.</p>

{{infographic}}

<h2>Where the estimate goes wrong</h2>
<ul>
<li><strong>Conversation history.</strong> In a multi-turn chat you usually send the earlier messages again. A 10-turn conversation does not cost ten single requests; it costs closer to the sum of an ever-growing input. Estimate with the average conversation length, not a single message.</li>
<li><strong>Reasoning tokens.</strong> Models that think before answering may bill the hidden reasoning as output tokens. Check how your provider counts them and test with real prompts.</li>
<li><strong>Tool calls and agents.</strong> An agent that makes several model calls per task multiplies the figure. Estimate calls per task, then tokens per call.</li>
<li><strong>Retries and failures.</strong> Failed or repeated calls usually still cost something. A buffer covers this.</li>
<li><strong>Image and file inputs.</strong> These are converted to tokens at rates that vary by provider and size.</li>
</ul>

<h2>Ways to reduce the bill</h2>
<ol>
<li><strong>Use a cheaper model where it is good enough.</strong> Route simple classification or extraction to a small model and keep the large one for hard questions. Compare current prices in the <a href="/tools/llm-price-comparison">LLM pricing comparison</a>.</li>
<li><strong>Cache repeated prefixes.</strong> Several providers offer prompt caching, where a long, unchanging prefix such as a system prompt or reference document is billed at a reduced rate on later calls. It helps most when the same context is reused many times.</li>
<li><strong>Batch non-urgent work.</strong> Many providers discount asynchronous batch processing, often by around half, in exchange for a slower turnaround.</li>
<li><strong>Trim the prompt.</strong> Remove boilerplate, send only the most relevant retrieved passages and summarise old history instead of resending it.</li>
<li><strong>Cap the output.</strong> Set a maximum output length and ask for concise answers.</li>
</ol>

<h2>Use ranges, not a single number</h2>
<p>Run the calculation for a low, typical and high scenario, and for a busy day as well as an average one. If the high case is unaffordable, find out before launch, not on the first invoice. The <a href="/tools/llm-api-cost-calculator">LLM API cost calculator</a> takes tokens and daily volume and gives the per-call and monthly figures, with prices kept up to date with a visible "last verified" date.</p>

<h2>Frequently asked questions</h2>
<h3>Why is output more expensive than input?</h3>
<p>Generating each output token requires a separate pass through the model, while input tokens can be processed in parallel. The price reflects that difference in compute.</p>
<h3>How many tokens is 1,000 words?</h3>
<p>Roughly 1,300 to 1,500 tokens for typical English prose. Code and other languages vary, so measure your own text.</p>
<h3>Do I pay for the system prompt every time?</h3>
<p>Yes, it is input on every request unless your provider's caching reduces the rate for the repeated part.</p>
<h3>How often do prices change?</h3>
<p>Often. Models are released, repriced and retired regularly, so recheck prices before each budgeting cycle.</p>
`,
};
