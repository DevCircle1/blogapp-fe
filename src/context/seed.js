import { createContext, useContext } from 'react';

/**
 * Data a prerendered page was rendered with, keyed per page ("home", "blogs",
 * "category:<slug>", "post:<lang>:<slug>", "blogIndex:<lang>"). The build
 * passes it to the server render and embeds the same object in the page
 * (<script id="page-seed">), and src/main.jsx provides it again before
 * hydrating, so a page's first client render matches its HTML. Pages still
 * refetch in the background; the seed only replaces the loading state.
 */
export const SeedContext = createContext({});

export const useSeed = (key) => useContext(SeedContext)?.[key];

export const SEED_ELEMENT_ID = 'page-seed';

/** Reads the seed the build embedded in this page, if any. */
export const readEmbeddedSeed = () => {
  try {
    const element = typeof document === 'undefined' ? null : document.getElementById(SEED_ELEMENT_ID);
    return element ? JSON.parse(element.textContent) : {};
  } catch {
    return {};
  }
};
