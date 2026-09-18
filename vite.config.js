import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // The entry chunk loads on every page (react-router routes are
        // React.lazy already). Pulling these out into their own vendor
        // chunks doesn't shrink the total bytes, but it means an app-code
        // change doesn't bust the cache for the framework/UI libraries,
        // and the browser can fetch them in parallel over HTTP/2 instead
        // of waiting on one ~590 KB chunk before it can start parsing.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'lucide-react', 'react-icons'],
        },
      },
    },
  },
})
