import * as pdfjs from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { extractPages } from './pdfText.js';
import { parseStatement } from './parse.js';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Everything happens here, off the main thread, and nothing leaves the browser:
 * the PDF bytes arrive by postMessage and only parsed rows go back.
 */
self.onmessage = async (event) => {
  const { id, buffer, password } = event.data;
  try {
    const { pages, characters } = await extractPages(pdfjs, new Uint8Array(buffer), {
      password,
      onProgress: (page, total) => self.postMessage({ id, type: 'progress', page, total }),
    });
    if (characters < 20) {
      self.postMessage({ id, type: 'error', code: 'NO_TEXT', pageCount: pages.length });
      return;
    }
    const result = parseStatement(pages);
    self.postMessage({ id, type: 'done', result });
  } catch (error) {
    const code = error?.name === 'PasswordException' ? 'PASSWORD' : 'FAILED';
    self.postMessage({ id, type: 'error', code, message: String(error?.message || error) });
  }
};
