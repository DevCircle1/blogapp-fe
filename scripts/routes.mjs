/**
 * Single source of truth for every indexable URL on the site.
 * Consumed by both the sitemap generator and the prerender step so the two can
 * never disagree about what exists.
 */
import {
  allToolLinks, getRelatedTools, premiumTools, standaloneTools,
} from '../src/components/tools/toolCatalog.js';
import { toolHubSchemas, toolPageSchemas } from '../src/seo/toolSchema.js';
import {
  LOCALES, LOCALIZED_LANGS, hubAlternates, hubPath, toolAlternates, toolPath,
} from '../src/i18n/locales.js';
import es from '../src/i18n/content/es.js';
import pt from '../src/i18n/content/pt.js';
import fr from '../src/i18n/content/fr.js';
import de from '../src/i18n/content/de.js';
import it from '../src/i18n/content/it.js';
import nl from '../src/i18n/content/nl.js';
import pl from '../src/i18n/content/pl.js';
import {
  assertCategorySlugs, categoryHubPage, categoryHubs, toolBreadcrumb,
} from '../src/i18n/categories.js';
import { PILLARS } from '../src/components/common/Terms/aboutUsContent.js';
import { HELP_CENTER_CATEGORIES } from '../src/components/common/Terms/helpCenterContent.js';
import { POPULAR_TOOLS } from '../src/components/common/Home/popularTools.js';
import {
  IP_FAQS, IP_INTRO, IP_EXTRA_PARAGRAPHS, IP_STEPS,
} from '../src/components/tools/ipContent.js';
import {
  SCREEN_RESOLUTION_INTRO, SCREEN_RESOLUTION_EXTRA_PARAGRAPHS, SCREEN_RESOLUTION_STEPS, SCREEN_RESOLUTION_FAQS,
} from '../src/components/tools/screenResolutionContent.js';

export const SITE_URL = 'https://talkandtool.com';
export const SITE_NAME = 'Talk & Tool';

export const CONTENT = { es, pt, fr, de, it, nl, pl };
LOCALIZED_LANGS.forEach((lang) => assertCategorySlugs(lang, CONTENT[lang].categories));
const fill = (template, name) => template.replace('{name}', name);

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/3.png`,
  description: 'Talk & Tool publishes free online calculators, converters, text utilities, and developer tools that run entirely in your browser.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export const staticRoutes = [
  {
    path: '/',
    schemas: [websiteSchema, organizationSchema],
    title: 'Talk & Tool — 70+ Free Online Tools, Calculators & Guides',
    description: 'Free online calculators, unit converters, text utilities, and developer tools that run entirely in your browser, plus practical guides. No sign-up, no downloads.',
    priority: '1.0',
    changefreq: 'daily',
    // Must mirror the rendered <h1> and hero copy: what a crawler reads before
    // JavaScript runs should describe the same page a visitor ends up on.
    heading: 'Free online tools and calculators',
    body: 'Over 70 calculators, converters, text utilities, and developer tools that run entirely in your browser. No sign-up, no downloads, and nothing you type is uploaded.',
    listHeading: 'Popular tools',
    list: POPULAR_TOOLS.map((tool) => ({ name: tool.name, path: tool.path, description: tool.description })),
  },
  {
    path: '/tools',
    title: `Free Online Tools, Calculators & Converters | ${SITE_NAME}`,
    description: 'Browse free online tools: calculators, unit converters, text utilities, and developer tools. Fast, mobile-friendly, and private — everything runs in your browser.',
    priority: '1.0',
    changefreq: 'weekly',
    heading: 'Free online tools that work instantly',
    body: 'A directory of free calculators, converters, text utilities, and developer tools. Every tool opens instantly, works on mobile, and processes your input locally in the browser.',
    list: allToolLinks.map((tool) => ({ name: tool.shortTitle || tool.title, path: tool.link })),
    alternates: hubAlternates(),
  },
  {
    path: '/blogs',
    title: `Blog — Guides, Tutorials and Practical How-Tos | ${SITE_NAME}`,
    description: 'Browse articles and guides from Talk & Tool, organised by topic. Practical tutorials on tools, calculations, development, and productivity.',
    priority: '0.8',
    changefreq: 'daily',
    heading: 'Guides, tutorials and practical how-tos',
    body: 'Articles and guides organised by topic, covering the tools on this site and the ideas behind them.',
    // New copy, written for the prerendered snapshot specifically: the
    // category grid on the live page is populated from the API at runtime, so
    // there is no static list of categories to mirror here.
    extraParagraphs: [
      'Every guide explains the method behind a result, not just the number — the same standard the calculators on this site hold themselves to. Recent topics include walkthroughs for the finance, health, and developer tools, plus general explainers on the maths and formulas they use.',
      'Articles are grouped into categories that update as new posts are published, spanning technology, health, travel, education, and more — browse by topic below or use the search on any tool page to find a related guide.',
      'Most posts pair directly with a tool on the site: a guide on compound interest links to the loan calculator, a piece on password entropy links to the password generator, and so on, so you can read the reasoning and then use the result straight away.',
    ],
  },
  {
    path: '/about-us',
    // No " | Talk & Tool" suffix: the title already names the brand, and the
    // Seo component skips the suffix in that case. Adding it here would make
    // the prerendered title differ from the one React sets on mount.
    title: 'About Talk & Tool',
    description: 'Talk & Tool builds free browser-based calculators, converters, and developer tools, plus practical guides. Learn who we are and how the site works.',
    priority: '0.5',
    changefreq: 'monthly',
    heading: 'About Talk & Tool',
    body: 'Talk & Tool is an independent site publishing free online tools and practical guides.',
    extraParagraphs: [
      'Talk & Tool is an independent website publishing free online calculators, unit converters, text utilities, and developer tools, alongside written guides that explain the ideas behind them. There are currently more than seventy tools on the site, and all of them are free to use without an account.',
      'The site exists because of a small, repeated annoyance: the everyday utilities people search for — a percentage, a loan repayment, a word count, a JSON document that will not parse — are usually buried under interstitials, sign-up prompts, and pages of filler before the actual tool appears. We wanted a place where the tool is at the top, the explanation is underneath for anyone who wants it, and nothing is gated.',
    ],
    // Mirrors AboutUs.jsx: the three pillars come straight from
    // src/components/common/Terms/aboutUsContent.js, and the sections below
    // are the plain-text equivalent of that page's remaining copy.
    sections: [
      {
        heading: 'What we care about',
        list: PILLARS.map((pillar) => `${pillar.title} — ${pillar.body}`),
      },
      {
        heading: 'What you will find here',
        list: [
          'Calculators — percentages, averages, ratios, fractions, ages, GPA, and random numbers.',
          'Finance tools — loan and mortgage repayments, compound interest, sales tax, margins and markup, break-even points, and inflation.',
          'Health calculators — BMI, calories, macros, body composition, hydration, and pregnancy dates, each with its limitations stated plainly.',
          'Text utilities — word counting, case conversion, sorting, deduplicating, diffing, and cleaning text before it goes anywhere else.',
          'Developer tools — JSON, Base64, JWT, regex, hashing, colour conversion, CSS generators, and reference tables.',
          'Guides — longer written pieces on our blog.',
        ],
      },
      {
        heading: 'How the site is funded',
        paragraphs: [
          'Talk & Tool is funded by advertising, which is what keeps every tool free and unmetered. We do not sell subscriptions and we do not sell your data — the tools process your input inside your own browser, so there is nothing about your usage for us to pass on. Our privacy policy sets out exactly what is collected and how to opt out of personalised advertising.',
        ],
      },
      {
        heading: 'Accuracy and corrections',
        paragraphs: [
          'Every calculator implements a published, checkable formula, and the formula is shown on the page so you can verify the result by hand. The health and finance tools are general information rather than professional advice, and each one says so where it matters. If you find a result that looks wrong, we would genuinely like to know — tell us about it and we will check and correct it.',
        ],
      },
    ],
  },
  {
    path: '/contact-us',
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Get in touch with Talk & Tool for support, feedback, tool suggestions, or business enquiries.',
    priority: '0.5',
    changefreq: 'monthly',
    heading: 'Contact Talk & Tool',
    body: "Have questions, suggestions, or want to learn more about our services? We'd love to hear from you.",
    extraParagraphs: [
      'Reach out to us for information about our blogs, tools, job notification services, or any other inquiries.',
      "We read every message that comes through this form, whether it's a bug report on a calculator, a suggestion for a tool we haven't built yet, a correction to something on the blog, or a business enquiry. If you are looking for an answer to a common question instead, the help centre covers account, tool, and publishing questions without waiting for a reply.",
    ],
    sections: [
      {
        heading: 'Ways to reach us',
        list: [
          'Email — info.devcircle@gmail.com',
          'Community — Join our growing developer network',
          'Response time — We typically reply within 24 hours',
        ],
      },
    ],
  },
  {
    path: '/help-center',
    title: `Help Center | ${SITE_NAME}`,
    description: 'Answers to common questions about using Talk & Tool: the free online tools, publishing articles, accounts, and getting in touch.',
    priority: '0.4',
    changefreq: 'monthly',
    heading: 'Help Center',
    body: 'Answers to common questions about the tools, accounts, publishing, and contacting us.',
    // The exact FAQ corpus HelpCenter.jsx renders one category's worth of at
    // a time behind an accordion; flattened here so a crawler sees all of it.
    faqs: HELP_CENTER_CATEGORIES.flatMap((category) => category.questions.map(
      (item) => ({ q: item.question, a: item.answer }),
    )),
  },
  {
    path: '/privacy-policy',
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How Talk & Tool collects, uses, and protects your information, including cookies, analytics, and third-party advertising by Google AdSense.',
    priority: '0.3',
    changefreq: 'yearly',
    heading: 'Privacy Policy',
    body: 'How we collect, use, and protect your information, including cookies, analytics, and third-party advertising.',
    // Plain-text equivalent of the 11 sections PrivacyPolicy.jsx renders
    // behind a scrollspy sidebar; keep in sync with that file.
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our website and services.',
          'Our website offers blog content and various tools including IP checking, screen resolution detection, and other utilities. By using our website, you agree to the collection and use of information in accordance with this policy.',
        ],
      },
      {
        heading: 'Information We Collect',
        paragraphs: [
          'We collect several different types of information for various purposes to provide and improve our services to you.',
          'Personal data: while using our website, we may ask you to provide certain personally identifiable information, which may include your email address, first and last name, and cookies and usage data.',
          "Usage data: we may also collect information on how the website is accessed and used, including your device's IP address, browser type and version, the pages you visit, the time and date of your visit, time spent on those pages, unique device identifiers, and other diagnostic data.",
        ],
      },
      {
        heading: 'How We Use Your Information',
        list: [
          'To provide and maintain our website and services',
          'To notify you about changes to our website or services',
          'To allow you to participate in interactive features when you choose to do so',
          'To provide customer support',
          'To gather analysis or valuable information so that we can improve our website',
          'To monitor the usage of our website',
          'To detect, prevent and address technical issues',
        ],
      },
      {
        heading: 'Cookies and Tracking Technologies',
        paragraphs: [
          'We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are small files, which may include an anonymous unique identifier, sent to your browser and stored on your device. Other tracking technologies such as beacons, tags, and scripts are also used to collect and analyse information.',
          'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.',
        ],
      },
      {
        heading: 'Advertising and Google AdSense',
        paragraphs: [
          'This website is funded by advertising. We use Google AdSense to display adverts, which allows us to keep every tool on the site free to use.',
        ],
        list: [
          "Third-party vendors, including Google, use cookies to serve adverts based on your prior visits to this website or other websites.",
          "Google's use of advertising cookies enables it and its partners to serve adverts to you based on your visit to this site and/or other sites on the internet.",
          'You may opt out of personalised advertising by visiting Google Ads Settings.',
          "You can opt out of a third-party vendor's use of cookies for personalised advertising at aboutads.info/choices or youronlinechoices.com.",
          'Where required by law, including for visitors in the European Economic Area, the United Kingdom, and Switzerland, consent for personalised advertising is collected before such cookies are set.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'We use Google Analytics to understand which pages are visited and how the site is used. Google Analytics collects information such as pages viewed, approximate location derived from IP address, device type, and referring website, used in aggregate to improve the site.',
          'You can prevent Google Analytics from collecting your data by installing the Google Analytics opt-out browser add-on.',
        ],
      },
      {
        heading: 'Third-Party Services',
        paragraphs: [
          'We may employ third-party companies and individuals to facilitate our website, to provide the website on our behalf, to perform website-related services, or to assist us in analysing how our website is used.',
          'These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
        ],
      },
      {
        heading: 'Data Security',
        paragraphs: [
          'The security of your data is important to us, but remember that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.',
          'We implement appropriate technical and organisational measures to protect personal information against unauthorised access, alteration, disclosure, or destruction.',
        ],
      },
      {
        heading: 'Your Data Protection Rights',
        paragraphs: ['Depending on your location, you may have the following rights regarding your personal data:'],
        list: [
          'The right to access, update or delete the information we have on you',
          'The right of rectification to have your information corrected if it is inaccurate or incomplete',
          'The right to object to our processing of your personal data',
          'The right to restrict the processing of your personal information',
          'The right to data portability to receive a copy of your personal data in a structured format',
          'The right to withdraw consent where we have relied on your consent to process your personal information',
        ],
      },
      {
        heading: 'Changes to This Privacy Policy',
        paragraphs: [
          'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of it.',
          'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
        ],
      },
      {
        heading: 'Contact Us',
        paragraphs: [
          'If you have any questions about this Privacy Policy, please contact us at info.devcircle@gmail.com.',
        ],
      },
    ],
  },
  {
    path: '/terms-and-conditions',
    title: `Terms and Conditions | ${SITE_NAME}`,
    description: 'The terms and conditions governing use of Talk & Tool, including acceptable use, disclaimers, and limitation of liability.',
    priority: '0.3',
    changefreq: 'yearly',
    heading: 'Terms and Conditions',
    body: 'The terms governing use of this site, including acceptable use, disclaimers, and limitation of liability.',
  },
  {
    path: '/word-game',
    title: `Daily Word Game — Guess the 5-Letter Word | ${SITE_NAME}`,
    description: 'Play the free daily word game. Guess the five-letter word of the day in six tries, with colour hints after every guess.',
    priority: '0.6',
    changefreq: 'daily',
    heading: 'Daily word game',
    body: 'Guess the five-letter word of the day in six tries. A new word every day, no sign-up required.',
  },
];

const STANDALONE_COPY = {
  'check-ip': {
    title: `What Is My IP Address? Free IP & Location Checker | ${SITE_NAME}`,
    description: 'Find your public IP address instantly, plus your approximate city, region, country, time zone, and internet provider. Free, no sign-up, nothing stored.',
    heading: 'What is my IP address?',
    body: IP_INTRO,
    extraParagraphs: IP_EXTRA_PARAGRAPHS,
    steps: IP_STEPS,
    faqs: IP_FAQS,
    links: [
      { href: '/screen-resolution', label: 'Screen Resolution Checker' },
      { href: '/tools/user-agent-parser', label: 'User Agent Parser' },
      { href: '/tools/password-generator', label: 'Password Generator' },
      { href: '/tools/number-base-converter', label: 'Number Base Converter' },
      { href: '/tools', label: 'All free tools' },
    ],
  },
  'screen-resolution': {
    title: `What Is My Screen Resolution? Free Screen Size Checker | ${SITE_NAME}`,
    description: 'Check your screen resolution, browser viewport size, device pixel ratio, colour depth, and current CSS breakpoint instantly.',
    heading: 'What is my screen resolution?',
    body: SCREEN_RESOLUTION_INTRO,
    extraParagraphs: SCREEN_RESOLUTION_EXTRA_PARAGRAPHS,
    steps: SCREEN_RESOLUTION_STEPS,
    faqs: SCREEN_RESOLUTION_FAQS,
    links: [
      { href: '/check-ip', label: 'IP Address Checker' },
      { href: '/tools/color-converter', label: 'Colour Converter' },
      { href: '/tools/css-gradient-generator', label: 'CSS Gradient Generator' },
      { href: '/tools/user-agent-parser', label: 'User Agent Parser' },
      { href: '/tools', label: 'All free tools' },
    ],
  },
  'text-to-html': {
    title: `Rich Text to HTML Converter — Free WYSIWYG Editor | ${SITE_NAME}`,
    description: 'Write formatted content in a visual editor and export clean, valid HTML instantly. Headings, lists, links, and styling with no markup knowledge required.',
    heading: 'Rich text to HTML converter',
    body: 'Compose content in a visual editor and export clean semantic HTML ready to paste into a CMS, template, or page.',
  },
};

/*
 * The same structured data the page emits at runtime, baked in statically.
 * Google renders JavaScript, but static JSON-LD is picked up on the first pass
 * instead of waiting for the render queue — which matters most for the FAQ and
 * HowTo markup that drives rich results.
 */
export const toolRoutes = premiumTools.map((tool) => {
  const path = `/tools/${tool.slug}`;
  return {
    path,
    title: `${tool.title} | ${SITE_NAME}`,
    description: tool.description,
    priority: '0.8',
    changefreq: 'monthly',
    heading: tool.title,
    body: tool.intro,
    steps: tool.steps,
    faqs: tool.faqs,
    // Related tools, then the tools hub: the same internal links
    // PremiumToolSuite renders once React hydrates.
    links: [
      ...getRelatedTools(tool.slug).map((item) => ({ href: `/tools/${item.slug}`, label: item.shortTitle })),
      { href: '/tools', label: 'All free tools' },
    ],
    alternates: toolAlternates(tool.slug),
    schemas: toolPageSchemas({
      tool,
      path,
      breadcrumb: [
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
        { name: tool.shortTitle, path },
      ],
      howToName: `How to use the ${tool.shortTitle}`,
    }),
  };
});

export const standaloneRoutes = standaloneTools
  .filter((tool) => STANDALONE_COPY[tool.slug])
  .map((tool) => ({
    path: tool.link,
    priority: '0.7',
    changefreq: 'monthly',
    ...STANDALONE_COPY[tool.slug],
  }));

/** /es, /pt, /fr, /de — each language's tool directory. */
export const localizedHubRoutes = LOCALIZED_LANGS.map((lang) => {
  const { hub, chrome, tools } = CONTENT[lang];
  const path = hubPath(lang);
  // Descriptions carried through (not just names): the live hub renders a
  // card per tool with its title and description, so the prerendered list
  // should too, rather than a bare list of links.
  const items = premiumTools
    .filter((tool) => tools[tool.slug])
    .map((tool) => ({
      name: tools[tool.slug].shortTitle,
      path: toolPath(lang, tool.slug),
      description: tools[tool.slug].description,
    }));
  return {
    path,
    lang,
    title: `${hub.title} | ${SITE_NAME}`,
    description: hub.description,
    priority: '0.9',
    changefreq: 'weekly',
    heading: hub.heading,
    body: hub.body,
    // hub.paragraphs holds the two [subheading, body] intro paragraphs the
    // live hub renders above the tool grid — dropped from the old snapshot,
    // which passed only the one-sentence hub.body through.
    sections: (hub.paragraphs || []).map(([sectionHeading, paragraph]) => ({
      heading: sectionHeading,
      paragraphs: [paragraph],
    })),
    list: items,
    faqs: hub.faqs,
    faqHeading: chrome.faq,
    alsoAvailable: chrome.alsoAvailable,
    links: [{ href: '/tools', label: 'English' }],
    alternates: hubAlternates(),
    schemas: toolHubSchemas({
      name: hub.title,
      path,
      description: hub.description,
      lang: LOCALES[lang].htmlLang,
      items,
      faqs: hub.faqs,
      breadcrumb: [{ name: chrome.home, path: '/' }, { name: chrome.tools, path }],
    }),
  };
});

/**
 * Category hubs (/de/textwerkzeuge, …) for the languages whose categories have
 * slugs. German-only hubs, so no hreflang alternates.
 */
export const categoryHubRoutes = LOCALIZED_LANGS.flatMap((lang) => (
  categoryHubs(lang, CONTENT[lang]).map(({ id }) => {
    const page = categoryHubPage(lang, CONTENT[lang], id);
    return {
      path: page.path,
      lang,
      title: `${page.title} | ${SITE_NAME}`,
      description: page.description,
      priority: '0.8',
      changefreq: 'weekly',
      schemas: page.schemas,
    };
  })
));

/** Every catalogue tool in every localized language. */
export const localizedToolRoutes = LOCALIZED_LANGS.flatMap((lang) => {
  const { chrome, tools } = CONTENT[lang];
  return premiumTools.filter((base) => tools[base.slug]).map((base) => {
    const tool = { ...base, ...tools[base.slug] };
    const path = toolPath(lang, base.slug);
    const howTo = fill(chrome.howTo, tool.shortTitle);
    return {
      path,
      lang,
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.description,
      priority: '0.7',
      changefreq: 'monthly',
      heading: tool.title,
      body: tool.intro,
      steps: tool.steps,
      faqs: tool.faqs,
      howToHeading: howTo,
      faqHeading: chrome.faq,
      alsoAvailable: chrome.alsoAvailable,
      // Related tools in the same language, then the language hub: the same
      // internal links the rendered page carries.
      links: [
        ...getRelatedTools(base.slug)
          .filter((item) => tools[item.slug])
          .map((item) => ({ href: toolPath(lang, item.slug), label: tools[item.slug].shortTitle })),
        { href: hubPath(lang), label: chrome.browseAll.replace(/\s*→\s*$/, '') },
      ],
      alternates: toolAlternates(base.slug),
      schemas: toolPageSchemas({
        tool,
        path,
        lang: LOCALES[lang].htmlLang,
        breadcrumb: toolBreadcrumb(lang, CONTENT[lang], tool, path),
        howToName: howTo,
      }),
    };
  });
});

export const allRoutes = [
  ...staticRoutes,
  ...standaloneRoutes,
  ...toolRoutes,
  ...localizedHubRoutes,
  ...categoryHubRoutes,
  ...localizedToolRoutes,
];
