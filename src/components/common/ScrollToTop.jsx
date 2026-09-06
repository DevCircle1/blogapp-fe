import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A client-side route change does not reset scroll position the way a real
 * navigation does, so following a link from halfway down a long tool page lands
 * the visitor halfway down the next one.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  return null;
}
