'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls to the top (or to the #anchor) after each client-side navigation.
 * Next's router already resets scroll on route changes, but it does not honour
 * the smooth in-page anchors these pages use, so that case is handled here.
 * The hash is read from window.location because useSearchParams-style hooks
 * would force every page that renders this out of static generation.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // CodeShare rewrites the URL with history.pushState when a snippet is shared; that is not a navigation.
    if (pathname.startsWith('/codes')) return;
    const hash = window.location.hash;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);

  return null;
}
