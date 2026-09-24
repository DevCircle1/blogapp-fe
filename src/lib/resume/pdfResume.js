/**
 * Resume text with position, font and image information out of a PDF via pdf.js.
 * `pdfjs` is injected so the browser worker and the Node checks share this.
 */
export async function extractResumePdf(pdfjs, data, { password } = {}) {
  const task = pdfjs.getDocument({ data, password, useSystemFonts: true, isEvalSupported: false, disableFontFace: true });
  const doc = await task.promise;
  const pages = [];
  const imageOps = new Set([pdfjs.OPS.paintImageXObject, pdfjs.OPS.paintInlineImageXObject, pdfjs.OPS.paintImageMaskXObject, pdfjs.OPS.paintJpegXObject].filter((op) => op !== undefined));
  try {
    for (let number = 1; number <= doc.numPages; number += 1) {
      const page = await doc.getPage(number);
      const viewport = page.getViewport({ scale: 1 });
      const [content, ops] = await Promise.all([page.getTextContent(), page.getOperatorList().catch(() => null)]);
      const images = ops ? ops.fnArray.filter((fn) => imageOps.has(fn)).length : 0;
      const fontNames = {};
      const fontName = (id) => {
        if (id in fontNames) return fontNames[id];
        let name = content.styles?.[id]?.fontFamily || '';
        try { if (page.commonObjs.has(id)) name = `${page.commonObjs.get(id)?.name || ''} ${name}`; } catch { /* font not resolved */ }
        fontNames[id] = name;
        return name;
      };
      const items = [];
      for (const item of content.items) {
        if (typeof item.str !== 'string') continue;
        const [, , , d, e, f] = item.transform;
        items.push({ str: item.str, x: e, y: viewport.height - f, w: item.width, h: item.height || Math.abs(d), font: fontName(item.fontName) });
      }
      pages.push({ number, width: viewport.width, height: viewport.height, items, images });
      page.cleanup();
    }
  } finally {
    await task.destroy();
  }
  return pages;
}
