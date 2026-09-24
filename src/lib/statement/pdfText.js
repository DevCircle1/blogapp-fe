/**
 * Reads positioned text out of a PDF with pdf.js. `pdfjs` is passed in so the
 * browser worker (module build) and the Node checks (legacy build) share this.
 */
export async function extractPages(pdfjs, data, { password, onProgress } = {}) {
  const task = pdfjs.getDocument({
    data,
    password,
    useSystemFonts: true,
    isEvalSupported: false,
    disableFontFace: true,
  });
  const doc = await task.promise;
  const pages = [];
  let characters = 0;
  try {
    for (let number = 1; number <= doc.numPages; number += 1) {
      const page = await doc.getPage(number);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items = [];
      for (const item of content.items) {
        if (typeof item.str !== 'string') continue;
        const [, , , d, e, f] = item.transform;
        characters += item.str.trim().length;
        items.push({
          str: item.str,
          x: e,
          y: viewport.height - f,
          w: item.width,
          h: item.height || Math.abs(d),
        });
      }
      pages.push({ number, width: viewport.width, height: viewport.height, items });
      page.cleanup();
      if (onProgress) onProgress(number, doc.numPages);
    }
  } finally {
    await task.destroy();
  }
  return { pages, characters };
}
