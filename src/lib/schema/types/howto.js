import {
  currency, duration, group, list, number, prune, repeater, text, textarea, url, asList, numeric,
} from '../core.js';

export default {
  slug: 'howto',
  pageSlug: 'howto-schema-generator',
  name: 'HowTo',
  label: 'HowTo',
  previewKind: 'none',
  status: {
    richResult: 'deprecated',
    googleNotes: 'Google removed HowTo rich results from Search on desktop and mobile in September 2023 and retired its documentation, so this markup no longer changes how a result looks in Google. It remains valid schema.org and other systems may still read it.',
    docsUrl: 'https://developers.google.com/search/blog/2023/08/howto-faq-changes',
    verifiedOn: '2026-09-24',
  },
  fields: [
    text('name', 'Title', { required: true, placeholder: 'How to repot a houseplant' }),
    textarea('description', 'Description', { recommended: true }),
    url('image', 'Image URL'),
    duration('totalTime', 'Total time', { placeholder: 'PT30M', help: 'ISO 8601 duration.' }),
    group('cost', 'Estimated cost', [
      currency('currency', 'Currency', { placeholder: 'USD' }),
      number('value', 'Amount', { placeholder: '15' }),
    ]),
    list('supplies', 'Supplies', { help: 'Materials used up in the process, one per line.' }),
    list('tools', 'Tools', { help: 'Equipment that is not used up, one per line.' }),
    repeater('steps', 'Steps', [
      text('name', 'Step title'),
      textarea('text', 'Instructions', { required: true }),
      url('url', 'Link to this step'),
      url('image', 'Step image URL'),
    ], { required: true, min: 1, recommendedMin: 2, itemLabel: 'Step' }),
  ],
  build: (v) => prune({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: v.name,
    description: v.description,
    image: v.image,
    totalTime: v.totalTime,
    estimatedCost: v.cost && v.cost.value ? { '@type': 'MonetaryAmount', currency: v.cost.currency, value: numeric(v.cost.value) } : undefined,
    supply: asList(v.supplies).map((name) => ({ '@type': 'HowToSupply', name })),
    tool: asList(v.tools).map((name) => ({ '@type': 'HowToTool', name })),
    step: (v.steps || []).filter((s) => s.text).map((s) => ({
      '@type': 'HowToStep', name: s.name, text: s.text, url: s.url, image: s.image,
    })),
  }),
  example: {
    name: 'How to repot a houseplant',
    description: 'Move a root-bound houseplant into a larger pot without damaging its roots.',
    image: 'https://example.com/img/repotting.jpg',
    totalTime: 'PT30M',
    cost: { currency: 'USD', value: '15' },
    supplies: ['Fresh potting mix', 'A pot one size larger'],
    tools: ['Trowel', 'Gardening gloves'],
    steps: [
      { name: 'Water the plant', text: 'Water the plant a day before repotting so the root ball slides out easily.' },
      { name: 'Loosen the roots', text: 'Tip the pot on its side, ease the plant out and gently loosen the outer roots.' },
      { name: 'Pot it up', text: 'Add potting mix to the new pot, set the plant at the same depth as before and fill around it.' },
    ],
  },
  copy: {
    keyword: 'howto schema generator',
    lead: 'This HowTo schema generator builds valid HowTo JSON-LD with steps, supplies, tools, time and cost. Note first that Google stopped showing HowTo rich results in 2023, so the markup is valid but will not change how your page looks in Google Search.',
    tableIntro: 'Google no longer documents required or recommended HowTo properties, because it no longer shows the feature. The table shows the schema.org properties this generator uses, and which ones it treats as needed for the markup to be meaningful.',
    mistakes: [
      'Adding HowTo markup in order to get a how-to rich result. Google removed the feature from Search on desktop and mobile in September 2023, so it will not appear.',
      'Marking up a page that is not a set of instructions — an article about a topic, or a list of tips with no order.',
      'Steps that are not on the page. Everything in the markup should appear in the visible content.',
      'One step containing all the instructions. Each HowToStep should be a single action.',
      'Putting durations in plain text. totalTime is an ISO 8601 duration such as PT30M.',
      'Mixing up supply and tool. A supply is used up (potting mix); a tool is not (a trowel).',
    ],
    notes: [
      'HowTo is the clearest example of a structured data type that Google has retired. In August 2023 Google announced that it would stop showing how-to rich results, and by September 2023 they were removed from Search on both desktop and mobile, along with the documentation.',
      'The markup is still valid schema.org, and other search engines, assistants and tools may still make use of it. It costs little to keep, but it should be added because it describes the page accurately, not in expectation of any change in Google. This generator shows a clear warning for that reason.',
    ],
    example: 'A three-step repotting guide with supplies, tools, a time and a cost, as generated on this page, is shown below.',
    faqs: [
      { q: 'Does Google still show HowTo rich results?', a: 'No. Google removed HowTo rich results from Search on desktop and mobile in September 2023 and retired the documentation for the feature.' },
      { q: 'Should I remove existing HowTo markup?', a: 'You do not need to. It is valid and harmless. Leave it if it accurately describes the page, but do not expect it to change how your result looks in Google.' },
      { q: 'What is the difference between a supply and a tool?', a: 'A supply is consumed during the process, such as paint or potting mix. A tool is used but not consumed, such as a brush or a trowel.' },
      { q: 'How do I write the time a task takes?', a: 'As an ISO 8601 duration in totalTime, for example PT45M for 45 minutes or PT2H for two hours.' },
      { q: 'What should I use instead for recipes?', a: 'Use Recipe markup for cooking instructions. Google still supports Recipe, and it contains its own instructions and step structure.' },
    ],
  },
};
