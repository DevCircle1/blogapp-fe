import SeedProvider from '../../context/SeedProvider.jsx';
import { getPageSeed } from '../_lib/blogSite.js';

/** Renders its children with the server-built seed for `path` (see src/context/seed.js). */
export default async function Seeded({ path, children }) {
  return <SeedProvider value={await getPageSeed(path)}>{children}</SeedProvider>;
}
