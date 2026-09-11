/**
 * Each language ships as its own pair of chunks — page content and tool UI
 * strings — so English visitors never download any of them and a Spanish
 * visitor never downloads the German ones.
 */
const LOADERS = {
  es: () => Promise.all([import('./content/es.js'), import('./ui/es.js')]),
  pt: () => Promise.all([import('./content/pt.js'), import('./ui/pt.js')]),
  fr: () => Promise.all([import('./content/fr.js'), import('./ui/fr.js')]),
  de: () => Promise.all([import('./content/de.js'), import('./ui/de.js')]),
};

const cache = new Map();

/**
 * Suspends until the language bundle is loaded; the route-level <Suspense>
 * in App.jsx shows its fallback meanwhile. A failed load is evicted so the
 * next render retries instead of caching the failure.
 */
export function useLocaleBundle(lang) {
  let entry = cache.get(lang);
  if (!entry) {
    entry = { status: 'pending' };
    entry.promise = LOADERS[lang]().then(
      ([content, ui]) => {
        entry.status = 'ready';
        entry.value = { content: content.default, dict: ui.default, extras: ui.extras || {} };
      },
      (error) => {
        entry.status = 'error';
        entry.error = error;
      },
    );
    cache.set(lang, entry);
  }
  if (entry.status === 'pending') throw entry.promise;
  if (entry.status === 'error') {
    cache.delete(lang);
    throw entry.error;
  }
  return entry.value;
}
