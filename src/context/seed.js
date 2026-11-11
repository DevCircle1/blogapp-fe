import { createContext, useContext } from 'react';

/**
 * Data a page was rendered with on the server, keyed per page ("home",
 * "blogs", "category:<slug>", "post:<lang>:<slug>", "blogIndex:<lang>",
 * "guides:<path>"). The server page builds it (src/app/_components/Seeded.jsx)
 * and provides it through SeedProvider, so the page's first client render
 * matches its HTML. Pages still refetch in the background; the seed only
 * replaces the loading state.
 */
export const SeedContext = createContext({});

export const useSeed = (key) => useContext(SeedContext)?.[key];
