import { Link, useParams } from 'react-router-dom';
import Seo from '../common/Seo.jsx';
import ToolPageView from './ToolPageView.jsx';
import { TOOL_COMPONENTS } from './toolComponents.js';
import { getToolBySlug, getRelatedTools } from './toolCatalog.js';
import { toolPageSchemas } from '../../seo/toolSchema.js';
import I18nProvider from '../../i18n/I18nProvider.jsx';
import { LOCALES, LOCALIZED_LANGS, toolAlternates, toolPath } from '../../i18n/locales.js';

function ToolNotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-24 text-center text-white">
      <Seo title="Tool not found" description="This tool does not exist." path="/tools" noindex />
      <h1 className="text-4xl font-black">Tool not found</h1>
      <p className="mx-auto mt-4 max-w-lg text-slate-400">That address does not match any tool. Browse the full directory to find what you need.</p>
      <Link to="/tools" className="mt-8 inline-block rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400">Browse all tools</Link>
    </main>
  );
}

export default function PremiumToolSuite() {
  const { toolSlug } = useParams();
  const tool = getToolBySlug(toolSlug);
  const Tool = TOOL_COMPONENTS[toolSlug];

  if (!tool || !Tool) return <ToolNotFound />;

  const path = `/tools/${tool.slug}`;
  const schemas = toolPageSchemas({
    tool,
    path,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: tool.shortTitle, path },
    ],
    howToName: `How to use the ${tool.shortTitle}`,
  });

  return (
    // The provider resets number formatting to the visitor's browser locale
    // after they arrive here from one of the language versions.
    <I18nProvider lang="en">
      <ToolPageView
        tool={tool}
        Tool={Tool}
        seo={{ title: tool.title, description: tool.description, path, schemas, alternates: toolAlternates(tool.slug) }}
        labels={{
          breadcrumb: 'Breadcrumb',
          home: 'Home',
          tools: 'Tools',
          toolsPath: '/tools',
          category: tool.category,
          toolRegion: `${tool.shortTitle} tool`,
          privacy: 'Everything runs in your browser. Your input is not uploaded to a server.',
          about: `About the ${tool.shortTitle}`,
          howTo: `How to use the ${tool.shortTitle}`,
          formula: 'The formula behind it',
          faq: 'Frequently asked questions',
          related: 'Related tools',
          browseAll: 'Browse all tools →',
          alsoAvailable: 'Also available in:',
        }}
        related={getRelatedTools(tool.slug, 4).map((item) => ({ path: `/tools/${item.slug}`, title: item.shortTitle, description: item.description }))}
        languages={LOCALIZED_LANGS.map((lang) => ({
          lang,
          name: LOCALES[lang].name,
          hreflang: LOCALES[lang].hreflang,
          htmlLang: LOCALES[lang].htmlLang,
          path: toolPath(lang, tool.slug),
        }))}
      />
    </I18nProvider>
  );
}
