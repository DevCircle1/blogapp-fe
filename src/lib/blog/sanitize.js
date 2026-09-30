import { SITE_URL } from '../../seo/siteMeta.js';

/**
 * Post bodies come from the editor as HTML. Strip anything executable before it
 * reaches dangerouslySetInnerHTML — a stored script in a post body would run
 * with full access to the visitor's session.
 *
 * Takes the document to parse with, so the same code runs in the browser
 * (window.document) and at build time (a linkedom document in
 * scripts/blog-data.mjs), where every post is sanitised before it is
 * prerendered.
 */
export const sanitiseHtml = (html, doc) => {
  if (!html) return '';
  const template = doc.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta, form').forEach((node) => node.remove());
  template.content.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || value.startsWith('javascript:')) node.removeAttribute(attribute.name);
    });
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // Editorial links to this site should remain crawlable and pass context
      // between related pages. Only untrusted off-site links receive UGC and
      // nofollow attributes.
      try {
        const url = new URL(href, SITE_URL);
        if (url.origin === new URL(SITE_URL).origin) {
          node.removeAttribute('rel');
          node.removeAttribute('target');
        } else {
          node.setAttribute('rel', 'nofollow ugc noopener');
          node.setAttribute('target', '_blank');
        }
      } catch {
        node.removeAttribute('href');
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
    }
  });
  // Serialised from the cleaned fragment itself: linkedom's template.innerHTML
  // does not reflect edits made through .content (browsers' does). By now no
  // handler or script is left, so moving the nodes out is safe.
  const out = doc.createElement('div');
  out.append(...template.content.childNodes);
  return out.innerHTML;
};
