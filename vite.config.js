import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Workers (PDF parsing, tokenizing) lazy-load big libraries with dynamic import(),
  // which the default IIFE worker format cannot code-split.
  worker: { format: 'es' },
  ssr: {
    // react-helmet-async's CJS build (lib/index.js) assigns its named
    // exports through a dynamic Object.defineProperty loop rather than
    // static `exports.Foo = ...`, so Node's cjs-module-lexer interop can't
    // see `Helmet`/`HelmetProvider` when the package is left external and
    // plain `import`-ed at runtime — `import { Helmet } from
    // 'react-helmet-async'` throws SyntaxError there. Bundling it instead
    // lets Vite/Rollup's own CJS interop (which doesn't have that
    // limitation) resolve the named exports correctly.
    noExternal: ['react-helmet-async'],
  },
  build: {
    rollupOptions: {
      output: isSsrBuild ? undefined : {
        // The entry chunk loads on every page (react-router routes are
        // React.lazy already). Pulling these out into their own vendor
        // chunks doesn't shrink the total bytes, but it means an app-code
        // change doesn't bust the cache for the framework/UI libraries,
        // and the browser can fetch them in parallel over HTTP/2 instead
        // of waiting on one ~590 KB chunk before it can start parsing.
        // The SSR build externalizes these same packages instead of
        // bundling them (it runs in Node, which can just require() them),
        // so manualChunks would error there — Rollup refuses to chunk a
        // module the "external" option already took out of the bundle.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'lucide-react', 'react-icons'],
        },
      },
    },
  },
}))
