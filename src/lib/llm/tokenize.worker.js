import { countTokens } from './tokenizer.js';

self.onmessage = async (event) => {
  const { id, text, tokenizers } = event.data;
  try {
    self.postMessage({ id, counts: await countTokens(text, tokenizers) });
  } catch (error) {
    self.postMessage({ id, error: String(error?.message || error) });
  }
};
