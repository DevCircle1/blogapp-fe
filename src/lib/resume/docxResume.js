import { strFromU8, unzipSync } from 'fflate';
import mammoth from 'mammoth';

/**
 * DOCX → { html, headerFooter, hasImages }. mammoth gives the body structure;
 * it ignores headers and footers, so those are read from the zip directly,
 * because whether contact details live there is something an ATS check needs.
 */
export async function readDocx(buffer) {
  const [{ value: html }, headerFooter] = await Promise.all([
    mammoth.convertToHtml({ arrayBuffer: buffer }),
    Promise.resolve().then(() => {
      try {
        const files = unzipSync(new Uint8Array(buffer));
        return Object.entries(files)
          .filter(([name]) => /^word\/(header|footer)\d*\.xml$/.test(name))
          .map(([, bytes]) => strFromU8(bytes).replace(/<w:tab\/>/g, ' ').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
          .filter(Boolean);
      } catch { return []; }
    }),
  ]);
  return { html, headerFooter, hasImages: (html.match(/<img\b/gi) || []).length };
}
