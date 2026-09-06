/**
 * Renders every tool component once, server-side, to catch import typos,
 * undefined identifiers, and render-time crashes across all of them at once.
 * Browser-only APIs used during render are stubbed; anything reached only from
 * an event handler or effect is not exercised here.
 *
 * Run with: node scripts/smoke-tools.mjs
 */
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ENTRY = `
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as dev from '<ROOT>/src/components/tools/impl/devTools.jsx';
import * as security from '<ROOT>/src/components/tools/impl/securityTools.jsx';
import * as calc from '<ROOT>/src/components/tools/impl/calcTools.jsx';
import * as finance from '<ROOT>/src/components/tools/impl/financeTools.jsx';
import * as text from '<ROOT>/src/components/tools/impl/textTools.jsx';
import * as dates from '<ROOT>/src/components/tools/impl/dateTools.jsx';
import * as health from '<ROOT>/src/components/tools/impl/healthTools.jsx';
import * as seo from '<ROOT>/src/components/tools/impl/seoTools.jsx';

const modules = { dev, security, calc, finance, text, dates, health, seo };
let failures = 0;
let passed = 0;

for (const [group, mod] of Object.entries(modules)) {
  for (const [name, Component] of Object.entries(mod)) {
    if (typeof Component !== 'function' || !/^[A-Z]/.test(name)) continue;
    try {
      const html = renderToStaticMarkup(React.createElement(Component));
      if (!html || html.length < 20) throw new Error('rendered ' + html.length + ' chars');
      passed += 1;
    } catch (error) {
      failures += 1;
      console.error('FAIL ' + group + '.' + name + ': ' + error.message);
    }
  }
}
console.log(passed + ' tool components rendered, ' + failures + ' failed.');
process.exitCode = failures ? 1 : 0;
`;

const root = pathToFileURL(process.cwd()).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Minimal browser surface for anything touched during a render pass.
const define = (name, value) => {
  // Node 22 exposes `navigator` as a getter-only global, so plain assignment throws.
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
};
define('window', globalThis);
if (!globalThis.navigator?.clipboard) {
  define('navigator', { userAgent: 'node-smoke-test', clipboard: { writeText: async () => {} } });
}
define('document', { createElement: () => ({ innerHTML: '', content: { querySelectorAll: () => [] } }) });
define('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });

// Inside node_modules so the bundle's bare 'react' imports still resolve.
const dir = await mkdtemp(path.join(process.cwd(), 'node_modules', '.tool-smoke-'));
try {
  const entryFile = path.join(dir, 'entry.jsx');
  await writeFile(entryFile, ENTRY.replaceAll('<ROOT>', root), 'utf8');
  const outFile = path.join(dir, 'bundle.mjs');
  await build({
    entryPoints: [entryFile],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: outFile,
    external: ['react', 'react-dom', 'react-dom/server', 'lucide-react'],
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    // The source files rely on the automatic JSX runtime, as Vite configures;
    // esbuild's classic default would emit React.createElement into modules
    // that never import React.
    jsx: 'automatic',
    logLevel: 'error',
  });
  await import(pathToFileURL(outFile).href);
} finally {
  await rm(dir, { recursive: true, force: true });
}
