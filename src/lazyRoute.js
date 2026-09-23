import { createElement, lazy } from 'react';

/**
 * A code-split route component that can also be loaded ahead of time.
 *
 * Plain React.lazy() only starts its import when first rendered, so hydrating a
 * server-rendered route leaves a pending Suspense boundary; the first state
 * update above it (AuthProvider's, moments after mount) makes React throw the
 * server markup away and show the loading fallback. preload() lets main.jsx
 * finish the import before hydrateRoot. Once it has, the route renders the real
 * component directly and never suspends; until then it behaves like lazy().
 */
export function lazyRoute(load) {
  let Loaded = null;
  let pending = null;
  const preload = () => {
    pending ??= load().then((module) => { Loaded = module.default; });
    return pending;
  };
  const Deferred = lazy(() => preload().then(() => ({ default: Loaded })));
  const Route = (props) => (Loaded ? createElement(Loaded, props) : createElement(Deferred, props));
  Route.preload = preload;
  return Route;
}
