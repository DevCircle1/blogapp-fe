import { Link, useParams } from 'react-router-dom';
import Seo from '../../common/Seo.jsx';
import ToolPageView from '../ToolPageView.jsx';
import { TOOL_COMPONENTS } from '../toolComponents.js';
import { getRelatedTools, getToolBySlug } from '../toolCatalog.js';
import { toolPageSchemas } from '../../../seo/toolSchema.js';
import I18nProvider from '../../../i18n/I18nProvider.jsx';
import { interpolate } from '../../../i18n/i18n.js';
import { useLocaleBundle } from '../../../i18n/loadBundle.js';
import {
  ALL_LANGS, LOCALES, hubPath, sourceSlug, toolAlternates, toolPath,
} from '../../../i18n/locales.js';

function LocalizedNotFound({ lang, chrome }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-24 text-center text-white">
      <Seo title={chrome.notFoundTitle} description={chrome.notFoundBody} path={hubPath(lang)} lang={lang} noindex />
      <h1 className="text-4xl font-black">{chrome.notFoundTitle}</h1>
      <p className="mx-auto mt-4 max-w-lg text-slate-400">{chrome.notFoundBody}</p>
      <Link to={hubPath(lang)} className="mt-8 inline-block rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400">{chrome.browseAll}</Link>
    </main>
  );
}

/**
 * A catalogue tool in one of the localized languages. The interactive
 * component is the same one the English page uses; the copy, slug, schema,
 * formatting locale, and tool defaults all come from that language's bundle.
 */
export default function LocalizedToolPage({ lang }) {
  const { toolSlug } = useParams();
  const bundle = useLocaleBundle(lang);
  const { chrome, categories, tools } = bundle.content;

  const slug = sourceSlug(lang, toolSlug);
  const base = slug && getToolBySlug(slug);
  const copy = slug && tools[slug];
  const Tool = slug && TOOL_COMPONENTS[slug];
  if (!base || !copy || !Tool) return <LocalizedNotFound lang={lang} chrome={chrome} />;

  // English supplies the language-neutral fields (icon, category id, tags);
  // everything a reader sees comes from the localized copy.
  const tool = { ...base, ...copy, slug };
  const path = toolPath(lang, slug);
  const name = { name: tool.shortTitle };
  const howTo = interpolate(chrome.howTo, name);
  const locale = LOCALES[lang];

  const schemas = toolPageSchemas({
    tool,
    path,
    lang: locale.htmlLang,
    currency: locale.currency,
    breadcrumb: [
      { name: chrome.home, path: '/' },
      { name: chrome.tools, path: hubPath(lang) },
      { name: tool.shortTitle, path },
    ],
    howToName: howTo,
  });

  return (
    <I18nProvider lang={lang} bundle={bundle}>
      <ToolPageView
        tool={tool}
        Tool={Tool}
        seo={{ title: tool.title, description: tool.description, path, schemas, lang, alternates: toolAlternates(slug) }}
        labels={{
          breadcrumb: chrome.breadcrumb,
          home: chrome.home,
          tools: chrome.tools,
          toolsPath: hubPath(lang),
          category: categories[tool.category]?.name || tool.category,
          toolRegion: interpolate(chrome.toolRegion, name),
          privacy: chrome.privacy,
          about: interpolate(chrome.about, name),
          howTo,
          formula: chrome.formula,
          faq: chrome.faq,
          related: chrome.related,
          browseAll: chrome.browseAll,
          alsoAvailable: chrome.alsoAvailable,
        }}
        related={getRelatedTools(slug, 4).filter((item) => tools[item.slug]).map((item) => ({
          path: toolPath(lang, item.slug),
          title: tools[item.slug].shortTitle,
          description: tools[item.slug].description,
        }))}
        languages={ALL_LANGS.filter((other) => other !== lang).map((other) => ({
          lang: other,
          name: LOCALES[other].name,
          hreflang: LOCALES[other].hreflang,
          htmlLang: LOCALES[other].htmlLang,
          path: toolPath(other, slug),
        }))}
      />
    </I18nProvider>
  );
}
