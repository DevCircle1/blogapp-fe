import FlagshipShell from '../FlagshipShell.jsx';
import ImageClient from './ImageClient.jsx';
import { IMAGE_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your photos are converted in this browser and never uploaded.';

/** The image converter hub and its HEIC / RAW pages. */
export default function ImagePage({ path }) {
  const page = IMAGE_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <ImageClient defaultFormat={page.defaultFormat} focus={page.focus} />
    </FlagshipShell>
  );
}
