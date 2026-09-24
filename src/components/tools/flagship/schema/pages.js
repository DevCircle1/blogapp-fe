import { SCHEMA_TYPES } from '../../../../lib/schema/registry.js';
import { toJson } from '../../../../lib/schema/core.js';

export const HUB_PATH = '/tools/schema-markup-generator';
const pathFor = (type) => `/tools/${type.pageSlug}`;

/** Title tags from the keyword table; the meta description follows the shared pattern. */
const TITLES = {
  faq: 'FAQ Schema Generator — Free FAQPage JSON-LD',
  'local-business': 'LocalBusiness Schema Generator — Free JSON-LD',
  product: 'Product Schema Generator — JSON-LD for Rich Results',
  article: 'Article Schema Generator — Free JSON-LD Markup',
  event: 'Event Schema Generator — JSON-LD for Events',
  recipe: 'Recipe Schema Generator — Free Recipe JSON-LD',
  howto: 'HowTo Schema Generator — Free JSON-LD Markup',
  breadcrumb: 'Breadcrumb Schema Generator — BreadcrumbList JSON-LD',
  organization: 'Organization Schema Generator — Free JSON-LD',
  video: 'Video Schema Generator — VideoObject JSON-LD',
  'job-posting': 'Job Posting Schema Generator — JobPosting JSON-LD',
};

const FORMAT_LABEL = {
  text: 'Text', textarea: 'Text', url: 'URL', date: 'Date, YYYY-MM-DD', datetime: 'Date and time, ISO 8601', duration: 'Duration, ISO 8601', number: 'Number', select: 'One of a fixed set', checkbox: 'Yes / no', multiselect: 'One or more of a fixed set', currency: 'ISO 4217 code', country: 'ISO 3166-1 alpha-2 code', phone: 'Phone number', email: 'Email address', list: 'List', repeater: 'Repeated group', group: 'Group',
};

const level = (def) => (def.required ? 'Required' : def.recommended ? 'Recommended' : 'Optional');
const rank = { Required: 0, Recommended: 1, Optional: 2 };

/** Flattens a definition's fields into table rows: property, whether Google requires it, format and note. */
function propertyRows(fields, prefix = '') {
  const rows = [];
  fields.forEach((def) => {
    const name = prefix ? `${prefix} › ${def.label}` : def.label;
    if (def.type === 'group' || def.type === 'repeater') {
      rows.push([name, level(def), FORMAT_LABEL[def.type], def.help || '']);
      rows.push(...propertyRows(def.fields, name));
    } else {
      rows.push([name, level(def), FORMAT_LABEL[def.type] || 'Text', def.help || '']);
    }
  });
  return rows;
}

const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const RELATED = [
  { to: '/tools/meta-tag-generator', label: 'Meta Tag Generator', description: 'Create title, description and Open Graph tags for the same page.' },
  { to: '/tools/robots-txt-generator', label: 'Robots.txt Generator', description: 'Control which pages search engines can crawl.' },
  { to: '/tools/json-studio', label: 'JSON Studio', description: 'Validate and format the JSON-LD you generate.' },
];

const SIBLINGS = SCHEMA_TYPES.map((type) => ({ to: pathFor(type), label: `${type.label} schema generator` }));

const typePage = (type) => {
  const status = type.status;
  const rows = propertyRows(type.fields).sort((a, b) => rank[a[1]] - rank[b[1]]);
  const preview = type.previewKind !== 'none';
  return {
    path: pathFor(type),
    toolId: 'schema-markup-generator',
    slug: type.pageSlug,
    typeSlug: type.slug,
    primaryKeyword: type.copy.keyword,
    title: TITLES[type.slug],
    description: preview
      ? `Generate valid ${type.label} JSON-LD with live validation and a rich result preview. Shows required vs recommended fields and Google eligibility. Free.`
      : `Generate valid ${type.label} JSON-LD with live validation. Shows required vs recommended fields and Google’s current status: HowTo rich results are retired. Free.`,
    h1: `${type.label} Schema Generator`,
    crumb: `${type.label} Schema Generator`,
    parent: { name: 'Schema Markup Generator', path: HUB_PATH },
    appName: `${type.label} Schema Generator`,
    category: 'SEO · Structured data',
    applicationCategory: 'BusinessApplication',
    lead: type.copy.lead,
    sections: [
      {
        heading: `${type.label} schema: required vs recommended properties`,
        paragraphs: [type.copy.tableIntro],
        table: { headers: ['Property', 'Status', 'Format', 'Notes'], rows },
      },
      {
        heading: `Is ${type.name} markup eligible for a Google rich result?`,
        paragraphs: [status.googleNotes, `Status verified on ${longDate(status.verifiedOn)}. Google’s documentation: ${status.docsUrl}`],
      },
      { heading: `About ${type.label} structured data`, paragraphs: type.copy.notes },
      { heading: `Common ${type.label} schema mistakes`, list: type.copy.mistakes },
      { heading: `${type.label} schema example`, paragraphs: [type.copy.example], code: toJson(type.build(type.example)) },
    ],
    steps: [
      `Fill in the ${type.label.toLowerCase()} details — the form marks each field Required, Recommended or Optional.`,
      'Watch the JSON-LD and the validation list update as you type.',
      'Copy the JSON-LD, the HTML script tag or the Next.js snippet, or download the .json file.',
      'Paste it into your page, then check it with Google’s Rich Results Test.',
    ],
    faqs: type.copy.faqs,
    related: type.slug === 'job-posting'
      ? [{ to: '/job-alert', label: 'Job Alerts', description: 'Get new job openings by email.' }, ...RELATED.slice(0, 2)]
      : RELATED,
    siblingsHeading: 'Schema generators',
    siblings: [{ to: HUB_PATH, label: 'All schema types' }, ...SIBLINGS.filter((item) => item.to !== pathFor(type))],
    disclaimer: 'Valid markup makes a page eligible for a rich result; it does not guarantee one. Google decides what to show. Test your page with Google’s Rich Results Test before relying on it.',
  };
};

const hub = {
  path: HUB_PATH,
  toolId: 'schema-markup-generator',
  slug: 'schema-markup-generator',
  title: 'Schema Markup Generator — Free JSON-LD for Any Type',
  description: 'Generate valid JSON-LD structured data for FAQ, Product, Article, Event, Recipe, LocalBusiness and more, with live validation. Free, in your browser.',
  h1: 'Schema Markup Generator',
  crumb: 'Schema Markup Generator',
  appName: 'Schema Markup Generator',
  category: 'SEO · Structured data',
  applicationCategory: 'BusinessApplication',
  parent: { name: 'Tools', path: '/tools' },
  lead: 'This schema markup generator produces valid JSON-LD structured data for eleven types — FAQ, Product, Article, Event, Recipe, local business, organization, video, job posting, breadcrumb and how-to — with live validation, required and recommended fields marked, and a clear note of what Google currently supports.',
  sections: [
    {
      heading: 'How the schema markup generator works',
      paragraphs: [
        'Choose a type, fill in the form, and the JSON-LD updates as you type. Each field is marked Required, Recommended or Optional according to Google’s documentation, formats such as ISO 8601 dates and durations are checked, and errors and warnings appear in a list beside the output. When it looks right, copy the JSON-LD, the complete script tag or a Next.js snippet.',
        'Each type also has its own page with the full property table, the mistakes people make with that type and a worked example, linked below.',
      ],
    },
    {
      heading: 'Which schema types does Google still show?',
      paragraphs: ['Google changes which structured data features it supports. Each generator page shows the current status and the date it was verified. In short:'],
      list: SCHEMA_TYPES.map((type) => `${type.label} (${type.name}): ${type.status.richResult === 'eligible' ? 'eligible for a rich result' : type.status.richResult === 'limited' ? 'rich result limited to a narrow set of sites' : 'rich result no longer shown'}.`),
    },
    {
      heading: 'How to add JSON-LD to your page',
      paragraphs: [
        'JSON-LD goes in a script tag with the type application/ld+json, in the head or the body of the page. It does not change how the page looks. In Next.js, render the tag with dangerouslySetInnerHTML from a server component, escaping any less-than signs, which the generator’s Next.js tab does for you.',
        'After adding it, test the page with Google’s Rich Results Test and watch the Enhancements reports in Search Console for errors.',
      ],
    },
    {
      heading: 'Structured data guidelines that apply to every type',
      list: [
        'Mark up only what is visible on the page. Hidden or misleading markup can lead to a manual action.',
        'Use the most specific type that fits, and fill in the recommended properties, not just the required ones.',
        'Keep the markup accurate as the page changes: prices, dates and availability that no longer match the page are worse than no markup.',
        'Valid markup makes a page eligible for a rich result; it does not guarantee one.',
      ],
    },
  ],
  steps: ['Pick the schema type that matches your page.', 'Fill in the form, or edit the worked example.', 'Fix any errors in the validation list.', 'Copy the markup into your page and test it.'],
  faqs: [
    { q: 'What is JSON-LD?', a: 'JSON-LD is a way of writing structured data as a block of JSON in a script tag. It is the format Google recommends for schema.org markup, and it sits separately from your visible HTML.' },
    { q: 'Which schema types should I use?', a: 'The ones that describe what the page really is: Article for a blog post, Product for a product page, Event for an event, Recipe for a recipe, and so on. Do not add a type only to try to get a rich result.' },
    { q: 'Does schema markup improve rankings?', a: 'Google does not say that structured data is a ranking factor. It helps Google understand a page and can make it eligible for rich results, which can improve how the result looks and how often it is clicked.' },
    { q: 'How do I test my structured data?', a: 'Use Google’s Rich Results Test on the page URL or the code, and the Search Console Enhancements reports after the page is live. This generator also validates fields as you type.' },
    { q: 'Why does the generator say some rich results are no longer shown?', a: 'Because Google has retired or restricted some of them: HowTo rich results were removed in 2023 and FAQ rich results are limited to well-known authoritative government and health sites. The generator warns you rather than letting you expect a result that will not appear.' },
    { q: 'Is my data sent anywhere?', a: 'No. The markup is generated in your browser from what you type, and nothing you enter is uploaded or stored.' },
  ],
  related: RELATED,
  siblingsHeading: 'Schema generators',
  siblings: SIBLINGS,
  disclaimer: 'Valid markup makes a page eligible for a rich result; it does not guarantee one. Google decides what to show.',
};

export const SCHEMA_PAGES = [hub, ...SCHEMA_TYPES.map(typePage)];
