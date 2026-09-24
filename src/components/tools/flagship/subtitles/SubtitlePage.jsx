import FlagshipShell from '../FlagshipShell.jsx';
import SubtitleClient from './SubtitleClient.jsx';
import { SUBTITLE_CONFIG, SUBTITLE_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your subtitle file is processed in this browser and never uploaded.';

/** The subtitle toolkit pages: hub, four converters, sync and merge. */
export default function SubtitlePage({ path }) {
  const page = SUBTITLE_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  const config = SUBTITLE_CONFIG[path];
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <SubtitleClient mode={config.mode} from={config.from} to={config.to} />
    </FlagshipShell>
  );
}
