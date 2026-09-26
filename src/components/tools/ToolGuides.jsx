import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { publicRequest } from '../../services/api';
import { articlePath } from '../../i18n/locales.js';
import { blogChrome } from '../../i18n/blogChrome.js';

/**
 * Articles in the page's language that link to this tool page, listed in the
 * tool sidebar so each guide and its tool link to each other. Loaded after
 * mount, so the prerendered markup is unchanged and nothing renders when a
 * tool has no guides yet.
 */
export default function ToolGuides({ lang, path }) {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    let cancelled = false;
    publicRequest.get(`/guides/${lang}/?path=${encodeURIComponent(path)}`)
      .then((response) => { if (!cancelled) setGuides(response.data || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [lang, path]);

  if (!guides.length) return null;
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <BookOpen size={18} aria-hidden="true" /> {blogChrome(lang).guidesForTool}
      </h2>
      <ul className="mt-3 space-y-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link to={articlePath(lang, guide.slug)} className="text-sm font-semibold leading-6 text-indigo-300 hover:text-white">
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
