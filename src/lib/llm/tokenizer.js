/**
 * Real BPE tokenization via js-tiktoken. Encoders are multi-megabyte rank
 * tables, so they are imported lazily and cached; only ever call this from a
 * Web Worker in the browser.
 */
const encoders = new Map();

export function loadEncoder(name) {
  if (!encoders.has(name)) {
    encoders.set(name, (async () => {
      if (name !== 'o200k_base') throw new Error(`Unknown tokenizer: ${name}`);
      const [{ Tiktoken }, ranks] = await Promise.all([import('js-tiktoken/lite'), import('js-tiktoken/ranks/o200k_base')]);
      return new Tiktoken(ranks.default);
    })());
  }
  return encoders.get(name);
}

/** → { [tokenizer]: count }. Special-token strings in the text are counted as ordinary text. */
export async function countTokens(text, tokenizers) {
  const result = {};
  for (const name of tokenizers) {
    const encoder = await loadEncoder(name);
    result[name] = text ? encoder.encode(text, [], []).length : 0;
  }
  return result;
}
