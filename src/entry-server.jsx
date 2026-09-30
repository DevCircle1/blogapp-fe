import { Buffer } from 'node:buffer';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './context/AuthContext.jsx';
import { SeedContext } from './context/seed.js';

const RENDER_TIMEOUT_MS = 30000;

/**
 * Renders one route to { html, helmet }. onAllReady fires only once every
 * Suspense boundary (lazy route chunks, language bundles) has resolved, so the
 * output is the finished page, never a loading fallback. Any error — inside a
 * boundary (onError) or in the shell (onShellError) — rejects: React would
 * otherwise carry on and emit a client-render fallback for that boundary, which
 * is exactly the silent partial HTML a build must not ship.
 *
 * seed is the page data the build has for this route (src/context/seed.js).
 * helmet is react-helmet-async's server state: the <head> tags the page's
 * <Seo> declared, for the prerender to write into the static <head>.
 */
export function render(path, { seed = {} } = {}) {
  const helmetContext = {};
  return new Promise((resolve, reject) => {
    let firstError = null;
    let settled = false;
    const chunks = [];
    const sink = new PassThrough();
    sink.on('data', (chunk) => chunks.push(chunk));
    sink.on('end', () => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      if (firstError) reject(firstError);
      // React 18's stream writer pads with a zero byte when a multibyte UTF-8
      // character (’, é, ß, …) straddles the edge of its internal buffer. That
      // byte is never real content; left in, browsers show it as U+FFFD and
      // hydration sees a text mismatch.
      else resolve({ html: Buffer.concat(chunks).toString('utf8').replace(/\0/g, ''), helmet: helmetContext.helmet });
    });

    const fail = (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      reject(error);
    };

    const { pipe, abort } = renderToPipeableStream(
      <SeedContext.Provider value={seed}>
        <StaticRouter location={path}>
          <AuthProvider>
            <App helmetContext={helmetContext} />
          </AuthProvider>
        </StaticRouter>
      </SeedContext.Provider>,
      {
        onAllReady() { pipe(sink); },
        onShellError: fail,
        onError(error) { firstError ??= error; },
      },
    );

    const timer = setTimeout(() => {
      abort();
      fail(new Error(`Render of ${path} did not finish within ${RENDER_TIMEOUT_MS / 1000}s`));
    }, RENDER_TIMEOUT_MS);
  });
}
