import { Buffer } from 'node:buffer';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './context/AuthContext.jsx';

const RENDER_TIMEOUT_MS = 30000;

/**
 * Renders one route to an HTML string. onAllReady fires only once every
 * Suspense boundary (lazy route chunks, language bundles) has resolved, so the
 * output is the finished page, never a loading fallback. Any error — inside a
 * boundary (onError) or in the shell (onShellError) — rejects: React would
 * otherwise carry on and emit a client-render fallback for that boundary, which
 * is exactly the silent partial HTML a build must not ship.
 */
export function render(path) {
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
      else resolve(Buffer.concat(chunks).toString('utf8'));
    });

    const fail = (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      reject(error);
    };

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={path}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StaticRouter>,
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
