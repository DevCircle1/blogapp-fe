import { repeater, text, textarea, prune } from '../core.js';

export default {
  slug: 'faq',
  pageSlug: 'faq-schema-generator',
  name: 'FAQPage',
  label: 'FAQ',
  previewKind: 'faq',
  status: {
    richResult: 'limited',
    googleNotes: 'Google now shows FAQ rich results only for well-known, authoritative government and health websites. Markup on other sites is valid and harmless, but should not be expected to produce a rich result.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    verifiedOn: '2026-09-24',
  },
  fields: [
    repeater('questions', 'Questions', [
      text('question', 'Question', { required: true, help: 'Exactly as it appears on the page.' }),
      textarea('answer', 'Answer', { required: true, help: 'The full answer. A small set of HTML tags (a, p, ul, ol, li, br, strong, em, h1–h6, div) is allowed.' }),
    ], { required: true, min: 1, recommendedMin: 2, itemLabel: 'Question' }),
  ],
  build: (v) => prune({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (v.questions || []).map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }),
  example: {
    questions: [
      { question: 'Do you offer free delivery?', answer: 'Yes. Orders over $50 ship free within the United States, and arrive in 3–5 working days.' },
      { question: 'What is your returns policy?', answer: 'You can return any unused item within 30 days for a full refund. We email you a prepaid label.' },
    ],
  },
  copy: {
    keyword: 'faq schema generator',
    lead: 'This FAQ schema generator builds valid FAQPage JSON-LD from your questions and answers, checks it as you type, and tells you plainly what Google will and will not do with it. Fill in the form, copy the markup and paste it into your page.',
    tableIntro: 'Google’s FAQPage documentation names only a handful of properties, all of them about the questions and their answers. There is no “recommended” tier beyond making the markup match the page.',
    mistakes: [
      'Marking up questions that are not visible on the page. Every question and answer in the markup must appear on the page for users; markup for hidden content is against Google’s guidelines.',
      'Using FAQPage for a page where users submit their own answers, which is what QAPage is for. FAQPage is for a single answer to each question, written by the site.',
      'Using FAQ markup as advertising: answers that are mostly promotional text or links to sales pages.',
      'Repeating the same question on many pages of a site. Mark it up once, where it matters.',
      'Expecting a rich result. Since 2023 Google has limited FAQ rich results to well-known authoritative government and health sites, so most valid markup shows nothing.',
    ],
    notes: [
      'FAQPage is one of the best-known structured data types and one of the most misunderstood. For a few years, adding it earned an expandable list of questions under a result, and many sites marked up every page. Google then restricted the feature to well-known, authoritative government and health websites, so for most sites the markup no longer produces the rich result it once did.',
      'That does not make the markup wrong. It is still valid schema.org, it still describes your content accurately to machines, and other systems can read it. What it changes is what to expect: use it because the page really is a list of questions and answers, not because you expect a visual change in search.',
    ],
    example: 'A two-question FAQ for a shop, as generated on this page, is shown below. Each question is a Question with a name, and each answer is an Answer with text. Both must match the text on the page.',
    faqs: [
      { q: 'Does FAQ schema still show rich results in Google?', a: 'Only for well-known, authoritative government and health websites, according to Google’s documentation. For other sites the markup is valid but is not expected to produce an expandable rich result.' },
      { q: 'How many questions should I include?', a: 'As many as are genuinely on the page. Google needs at least one Question, and two or more is typical for a real FAQ section.' },
      { q: 'Can answers contain HTML?', a: 'Yes, a limited set of tags: headings, lists, links, line breaks, paragraphs and basic emphasis. Keep the answer identical in meaning to what is visible on the page.' },
      { q: 'What is the difference between FAQPage and QAPage?', a: 'FAQPage is for a page where the site provides one answer to each question. QAPage is for a page with one question that users can answer in several ways, like a forum thread.' },
      { q: 'Where do I put the JSON-LD?', a: 'In a script tag of type application/ld+json in the head or body of the page. The generator gives you the complete tag, and a Next.js snippet if you use the App Router.' },
    ],
  },
};
