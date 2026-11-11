import RootDocument from './_components/RootDocument.jsx';
import NotFound from '../components/common/NotFound.jsx';

/**
 * The 404 page for URLs no route claims. The site has two root layouts (English
 * and /<lang>), so there is no single layout to compose a 404 from; this renders
 * the full document itself, with the same chrome as every other page.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en" chromeLang="en">
      <NotFound />
    </RootDocument>
  );
}
