'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT } from '../../seo/siteMeta.js';

const SLOTS = {
  toolInline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_INLINE,
  toolFooter: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_FOOTER,
  articleInline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INLINE,
  listing: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING,
};

export default function AdSlot({ placement, className = '', label = true }) {
  const slot = SLOTS[placement];
  const insRef = useRef(null);
  const pushed = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!slot || pushed.current || !insRef.current) return;
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
