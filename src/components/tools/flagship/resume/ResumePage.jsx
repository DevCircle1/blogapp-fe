import { useParams } from 'react-router-dom';
import FlagshipShell from '../FlagshipShell.jsx';
import ResumeClient from './ResumeClient.jsx';
import {
  ATS_PATH, RESUME_PAGES, RESUME_VIEW_BY_PATH, ROLES,
} from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

/** /tools/ats-resume-checker, its /:role pages, and the three sibling resume tools. */
export default function ResumePage({ path: fixedPath }) {
  const { role } = useParams();
  const path = fixedPath || `${ATS_PATH}/${role}`;
  const page = RESUME_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  const roleData = page.roleSlug ? ROLES[page.roleSlug] : null;
  return (
    <FlagshipShell page={page} privacy="Your resume is read in this browser and never uploaded.">
      <ResumeClient view={RESUME_VIEW_BY_PATH[path] || 'checker'} roleKeywords={roleData?.keywords || null} />
    </FlagshipShell>
  );
}
