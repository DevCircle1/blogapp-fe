import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ADSENSE_CLIENT } from '../../seo/siteMeta.js';

/**
 * A single AdSense display unit.
 *
 * Slot IDs come from environment variables so the component renders nothing
 * until real units exist in the AdSense dashboard — an empty <ins> on a live
 * page is an AdSense policy problem, not a harmless placeholder.
 *
 * Never render this on auth screens, error pages, or any page whose main
 * content has not loaded yet: ads beside thin or missing content are the most
 * common reason a site is rejected or limited.
 */
const SLOTS = {
  toolInline: import.meta.env.VITE_ADSENSE_SLOT_TOOL_INLINE,
  toolFooter: import.meta.env.VITE_ADSENSE_SLOT_TOOL_FOOTER,
  articleInline: import.meta.env.VITE_ADSENSE_SLOT_ARTICLE_INLINE,
  listing: import.meta.env.VITE_ADSENSE_SLOT_LISTING,
};

export default function AdSlot({ placement, className = '', label = true }) {
  const slot = SLOTS[placement];
  const insRef = useRef(null);
  const pushed = useRef(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!slot || pushed.current || !insRef.current) return;
    // A re-pushed <ins> throws "already have ads in them"; guard per mount.
    if (insRef.current.getAttribute('data-adsbygoogle-status')) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* Blocked by an ad blocker or the script failed to load — ignore. */
    }
  }, [slot, pathname]);

  if (!slot) return null;

  return (
    <div className={`my-8 ${className}`}>
      {label && <p className="mb-2 text-center text-[10px] uppercase tracking-widest text-slate-500">Advertisement</p>}
      <ins
        ref={insRef}
        key={`${placement}-${pathname}`}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
