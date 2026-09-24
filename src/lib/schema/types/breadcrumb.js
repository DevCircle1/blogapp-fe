import {
  prune, repeater, text, url,
} from '../core.js';

export default {
  slug: 'breadcrumb',
  pageSlug: 'breadcrumb-schema-generator',
  name: 'BreadcrumbList',
  label: 'Breadcrumb',
  previewKind: 'breadcrumb',
  status: {
    richResult: 'eligible',
    googleNotes: 'Breadcrumb markup lets Google show a page’s position in the site hierarchy in its result. Google needs at least two breadcrumbs, each with a name and a position.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
    verifiedOn: '2026-09-24',
  },
  fields: [
    repeater('items', 'Breadcrumbs', [
      text('name', 'Name', { required: true, placeholder: 'Books' }),
      url('item', 'URL', { placeholder: 'https://example.com/books', help: 'The last breadcrumb may omit the URL.' }),
    ], { required: true, min: 2, itemLabel: 'Breadcrumb', help: 'In order, from the top of the site to the current page. Positions are numbered automatically.' }),
  ],
  check: (v) => {
    const issues = [];
    const items = (v.items || []).filter((i) => i.name || i.item);
    items.slice(0, -1).forEach((entry, i) => {
      if (!entry.item) issues.push({ level: 'error', path: `items[${i}].item`, message: `Breadcrumb ${i + 1} needs a URL. Only the last breadcrumb may omit it.` });
    });
    return issues;
  },
  build: (v) => prune({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (v.items || []).filter((i) => i.name).map((entry, index) => ({
      '@type': 'ListItem', position: index + 1, name: entry.name, item: entry.item,
    })),
  }),
  example: {
    items: [
      { name: 'Books', item: 'https://example.com/books' },
      { name: 'Science Fiction', item: 'https://example.com/books/sciencefiction' },
      { name: 'Award Winners', item: '' },
    ],
  },
  copy: {
    keyword: 'breadcrumb schema generator',
    lead: 'This breadcrumb schema generator builds valid BreadcrumbList JSON-LD from the trail of pages leading to yours. It numbers the positions for you and checks that every breadcrumb but the last has a URL.',
    tableIntro: 'BreadcrumbList has one required property, itemListElement, and each ListItem in it needs a name, a position and, except for the last one, a URL.',
    mistakes: [
      'Providing only one breadcrumb. Google requires at least two ListItems for a valid BreadcrumbList.',
      'Starting the positions at 0. Position 1 is the first breadcrumb.',
      'Leaving the URL off a breadcrumb that is not the last. Only the final item may omit it, because Google uses the page’s own URL.',
      'Mirroring the URL path instead of a real user path. Breadcrumbs should show a typical route to the page, not just the folders in its address.',
      'Markup that does not match the visible breadcrumbs on the page.',
      'Adding a breadcrumb for the home page and the page itself. Neither is required.',
    ],
    notes: [
      'A BreadcrumbList describes where a page sits in your site: Home, then a category, then a sub-category, then the page. Google can use it to show that path in the search result instead of a raw URL, which helps people understand what kind of page they are about to open.',
      'Because it is only a list of names and URLs, it is one of the easiest structured data types to get right. The two rules that trip people up are the minimum of two items and the position numbering, which starts at one.',
    ],
    example: 'A three-level trail — Books, Science Fiction, Award Winners — with the last item leaving out its URL, as generated on this page, is shown below.',
    faqs: [
      { q: 'How many breadcrumbs do I need?', a: 'At least two ListItems for the markup to be valid. Most pages have between two and five.' },
      { q: 'Does the last breadcrumb need a URL?', a: 'No. The last item may omit its URL because Google uses the URL of the page the markup is on.' },
      { q: 'Should breadcrumbs match my URL structure?', a: 'Not necessarily. They should show a typical path a visitor takes to the page, which may differ from the folders in the URL.' },
      { q: 'Do I need to include the home page?', a: 'It is not required. You can include it as the first breadcrumb, or start from the first category.' },
      { q: 'Can a page have more than one breadcrumb trail?', a: 'Yes. A product in two categories can have two BreadcrumbList blocks, one for each route.' },
    ],
  },
};
