import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { preloadRoute } from './appRoutes.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext';
import './index.css'

const container = document.getElementById('root');
const app = (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

// Pages rendered by src/entry-server.jsx mark their root with this attribute,
// and their markup matches what this same tree renders, so it is hydrated in
// place. The routes in scripts/prerender-legacy.mjs still ship hand-written
// markup that is deliberately not the component tree; it is unmarked and gets
// replaced instead. The app.html shell and the dev server have an empty #root
// and take the createRoot branch. Once no legacy routes remain, this check can
// become plain container.hasChildNodes().
if (container.dataset.ssrRendered === 'true') {
  // The page's route chunk (and language bundle) must be in hand before
  // hydrating: otherwise AuthProvider's first state update lands on the
  // still-pending Suspense boundary, React discards the server markup and
  // shows the loading fallback instead. A failed preload still hydrates.
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => ReactDOM.hydrateRoot(container, app));
} else {
  ReactDOM.createRoot(container).render(app);
}