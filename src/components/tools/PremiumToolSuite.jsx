import { Link, useParams } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';
import { getToolBySlug, getRelatedTools } from './toolCatalog.js';
import { SITE_URL, SITE_NAME, breadcrumbSchema, faqSchema } from '../../seo/siteMeta.js';

import * as dev from './impl/devTools.jsx';
import * as security from './impl/securityTools.jsx';
import * as calc from './impl/calcTools.jsx';
import * as finance from './impl/financeTools.jsx';
import * as text from './impl/textTools.jsx';
import * as date from './impl/dateTools.jsx';
import * as health from './impl/healthTools.jsx';

const TOOL_COMPONENTS = {
  // Developer
  'json-studio': dev.JsonStudio,
  'base64-tool': dev.Base64Tool,
  'url-encoder': dev.UrlEncoder,
  'jwt-inspector': dev.JwtInspector,
  'uuid-generator': dev.UuidGenerator,
  'regex-tester': dev.RegexTester,
  'hash-generator': dev.HashGenerator,
  'html-encoder': dev.HtmlEncoder,
  'csv-to-json': dev.CsvToJson,
  'json-to-csv': dev.JsonToCsv,
  'markdown-to-html': dev.MarkdownToHtml,
  'color-converter': dev.ColorConverter,
  'css-gradient-generator': dev.GradientGenerator,
  'box-shadow-generator': dev.BoxShadowGenerator,
  'http-status-codes': dev.HttpStatusCodes,
  'meta-tag-generator': dev.MetaTagGenerator,
  'robots-txt-generator': dev.RobotsTxtGenerator,
  'user-agent-parser': dev.UserAgentParser,
  // Security
  'password-generator': security.PasswordGenerator,
  'password-strength-checker': security.PasswordStrengthChecker,
  'credit-card-validator': security.CreditCardValidator,
  'email-validator': security.EmailValidator,
  // Calculators
  'percentage-calculator': calc.PercentageCalculator,
  'average-calculator': calc.AverageCalculator,
  'fraction-calculator': calc.FractionCalculator,
  'ratio-calculator': calc.RatioCalculator,
  'number-base-converter': calc.NumberBaseConverter,
  'roman-numeral-converter': calc.RomanNumeralConverter,
  'gpa-calculator': calc.GpaCalculator,
  'random-number-generator': calc.RandomNumberGenerator,
  'unit-converter': calc.UnitConverter,
  'age-calculator': calc.AgeCalculator,
  // Finance
  'loan-calculator': finance.LoanCalculator,
  'mortgage-calculator': finance.MortgageCalculator,
  'compound-interest-calculator': finance.CompoundInterestCalculator,
  'simple-interest-calculator': finance.SimpleInterestCalculator,
  'tip-calculator': finance.TipCalculator,
  'discount-calculator': finance.DiscountCalculator,
  'sales-tax-calculator': finance.SalesTaxCalculator,
  'margin-markup-calculator': finance.MarginMarkupCalculator,
  'roi-calculator': finance.RoiCalculator,
  'break-even-calculator': finance.BreakEvenCalculator,
  'savings-goal-calculator': finance.SavingsGoalCalculator,
  'salary-to-hourly-calculator': finance.SalaryToHourlyCalculator,
  'inflation-calculator': finance.InflationCalculator,
  // Text
  'word-counter': text.WordCounter,
  'case-converter': text.CaseConverter,
  'remove-duplicate-lines': text.RemoveDuplicateLines,
  'sort-text-lines': text.SortTextLines,
  'find-and-replace': text.FindAndReplace,
  'text-diff-checker': text.TextDiffChecker,
  'lorem-ipsum-generator': text.LoremIpsumGenerator,
  'slug-generator': text.SlugGenerator,
  'word-frequency-counter': text.WordFrequencyCounter,
  'remove-line-breaks': text.RemoveLineBreaks,
  'reverse-text': text.ReverseText,
  // Date & time
  'date-difference-calculator': date.DateDifferenceCalculator,
  'date-add-subtract': date.DateAddSubtract,
  'time-duration-calculator': date.TimeDurationCalculator,
  'working-days-calculator': date.WorkingDaysCalculator,
  'countdown-timer': date.CountdownTimer,
  'timestamp-converter': date.TimestampConverter,
  // Health
  'bmi-calculator': health.BmiCalculator,
  'calorie-calculator': health.CalorieCalculator,
  'ideal-weight-calculator': health.IdealWeightCalculator,
  'body-fat-calculator': health.BodyFatCalculator,
  'water-intake-calculator': health.WaterIntakeCalculator,
  'macro-calculator': health.MacroCalculator,
  'pregnancy-due-date-calculator': health.PregnancyDueDateCalculator,
};

const APPLICATION_CATEGORY = {
  Finance: 'FinanceApplication',
  Calculator: 'UtilitiesApplication',
  Health: 'HealthApplication',
  Developer: 'DeveloperApplication',
  Security: 'SecurityApplication',
  Text: 'UtilitiesApplication',
  'Date & Time': 'UtilitiesApplication',
};

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
  const canonical = `${SITE_URL}${path}`;
  const related = getRelatedTools(tool.slug, 4);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      url: canonical,
      description: tool.description,
      applicationCategory: APPLICATION_CATEGORY[tool.category] || 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    faqSchema(tool.faqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: tool.shortTitle, path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${tool.shortTitle}`,
      description: tool.intro,
      totalTime: 'PT1M',
      step: tool.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, text: step })),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <Seo title={tool.title} description={tool.description} path={path} schemas={schemas} />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/tools" className="hover:text-white">Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-300" aria-current="page">{tool.shortTitle}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles size={14} /> {tool.category}
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{tool.title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">{tool.description}</p>
        </header>

        <section aria-label={`${tool.shortTitle} tool`} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-indigo-950/50 md:p-8">
          <Tool />
        </section>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} /> Everything runs in your browser. Your input is not uploaded to a server.
        </p>

        <AdSlot placement="toolInline" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_.6fr]">
          <article className="max-w-none">
            <h2 className="text-2xl font-bold">About the {tool.shortTitle}</h2>
            <p className="mt-4 leading-7 text-slate-400">{tool.intro}</p>

            <h2 className="mt-10 text-2xl font-bold">How to use the {tool.shortTitle}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-400">
              {tool.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>

            {tool.formula && (
              <>
                <h2 className="mt-10 text-2xl font-bold">The formula behind it</h2>
                <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 leading-7 text-slate-300">{tool.formula}</p>
              </>
            )}

            <h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">
              {tool.faqs.map((item) => (
                <details key={item.q} className="py-4" open={item === tool.faqs[0]}>
                  <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
                  <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>

            {tool.disclaimer && (
              <p className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
                {tool.disclaimer}
              </p>
            )}
          </article>

          <aside>
            <h2 className="text-xl font-bold">Related tools</h2>
            <div className="mt-4 space-y-3">
              {related.map((item) => (
                <Link key={item.slug} to={`/tools/${item.slug}`} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/60 hover:bg-white/10">
                  <strong className="text-white">{item.shortTitle}</strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
                </Link>
              ))}
            </div>
            <Link to="/tools" className="mt-5 inline-block text-sm font-semibold text-indigo-300 hover:text-white">Browse all tools →</Link>
            <AdSlot placement="toolFooter" className="mt-8" />
          </aside>
        </div>
      </div>
    </div>
  );
}
