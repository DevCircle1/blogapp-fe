import * as pdfjs from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { extractResumePdf } from './pdfResume.js';
import { readDocx } from './docxResume.js';
import { modelFromDocx, modelFromPdf } from './model.js';
import { runChecks } from './checks.js';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

/** The resume is parsed here, in the browser, off the main thread. It is never uploaded. */
self.onmessage = async (event) => {
  const { id, buffer, name, password } = event.data;
  try {
    const ext = (name.split('.').pop() || '').toLowerCase();
    const model = ext === 'docx'
      ? modelFromDocx(await readDocx(buffer))
      : modelFromPdf(await extractResumePdf(pdfjs, new Uint8Array(buffer), { password }));
    self.postMessage({ id, type: 'done', model, result: runChecks(model) });
  } catch (error) {
    const code = error?.name === 'PasswordException' ? 'PASSWORD' : 'FAILED';
    self.postMessage({ id, type: 'error', code, message: String(error?.message || error) });
  }
};
