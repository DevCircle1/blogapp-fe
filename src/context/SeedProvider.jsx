'use client';

import { SeedContext } from './seed.js';

/** Client boundary for SeedContext, so server components can provide a page's seed. */
export default function SeedProvider({ value, children }) {
  return <SeedContext.Provider value={value}>{children}</SeedContext.Provider>;
}
