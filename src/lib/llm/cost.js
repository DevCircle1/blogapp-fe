/** Cost arithmetic for the LLM calculators. Prices are USD per million tokens. */

export const perMillion = (tokens, price) => (tokens * price) / 1_000_000;

/**
 * Cost of one call. With `cached`, the prompt is assumed to be served from the
 * provider's prompt cache (read price) where the model has one; cache writes
 * are not modelled.
 */
export function callCost(model, { inputTokens, outputTokens, cached }) {
  const inputPrice = cached && model.cached != null ? model.cached : model.input;
  const input = perMillion(inputTokens, inputPrice);
  const output = perMillion(outputTokens, model.output);
  return { input, output, total: input + output };
}

export const monthlyCost = (perCall, callsPerDay, days = 30) => perCall * callsPerDay * days;

export const usd = (value) => {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '$0';
  const abs = Math.abs(value);
  if (abs < 0.000001) return '<$0.000001';
  const digits = abs >= 100 ? 0 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : 6;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: digits === 0 ? 0 : Math.min(2, digits), maximumFractionDigits: digits })}`;
};

export const priceLabel = (value) => (value == null ? '—' : `$${value}`);

export const compactTokens = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 2 })}M`;
  if (n >= 1000) return `${Math.round(n / 1000).toLocaleString('en-US')}k`;
  return String(n);
};

/** Ranks models by total cost per call, cheapest first. */
export const rankByCost = (models, options) => models
  .map((model) => ({ model, cost: callCost(model, options) }))
  .sort((a, b) => a.cost.total - b.cost.total);

export function markdownTable(rows, { outputTokens, cached, callsPerDay, verifiedOn, url }) {
  const lines = [
    `| Model | Input tokens | Cost per call | Cost per month (${callsPerDay.toLocaleString('en-US')} calls/day) |`,
    '| --- | ---: | ---: | ---: |',
    ...rows.map(({ model, tokens, perCall, perMonth, approx }) => `| ${model.provider} ${model.name} | ${approx ? '≈' : ''}${tokens.toLocaleString('en-US')} | ${usd(perCall)} | ${usd(perMonth)} |`),
    '',
    `Assumes ${outputTokens.toLocaleString('en-US')} output tokens per call${cached ? ' and cached input pricing' : ''}. ≈ marks a token count estimated with the o200k_base encoding.`,
    `Source: Talk & Tool LLM token counter — ${url} — prices verified ${verifiedOn}.`,
  ];
  return lines.join('\n');
}
