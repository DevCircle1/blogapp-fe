/**
 * QUARANTINE: the hand-mirrored page markup scripts/prerender.mjs used for every route
 * before pages were server-rendered from the real components.
 *
 * It exists only for the routes in LEGACY_ROUTES, whose real components cannot be server
 * rendered yet (the reason is beside each). Every other route gets its markup from
 * src/entry-server.jsx. Two sources of truth drift, so this file is meant to shrink: fix a
 * component, remove its route from LEGACY_ROUTES, and once the map is empty delete this file.
 */
import { CHROME, LOCALES, ALL_LANGS, hubPath, toolPath } from '../src/i18n/locales.js';
import { escapeHtml } from './html.mjs';

export const LEGACY_ROUTES = new Map([
  ['/blogs', 'fetches its categories in an effect, so the server render is a spinner with no heading'],
  ['/check-ip', 'fetches IP data in an effect, so the server render is a loading skeleton with no heading'],
  ['/word-game', "reads localStorage and today's date while rendering"],
  ['/text-to-html', 'ReactQuill touches document while rendering'],
]);

// These tools start from the current date or time (useState(today()), Date.now()),
// so the build date would be baked into the HTML and hydration would not match it.
const TIME_DEPENDENT_TOOLS = [
  'date-difference-calculator', 'date-add-subtract', 'working-days-calculator',
  'countdown-timer', 'timestamp-converter', 'age-calculator',
];
TIME_DEPENDENT_TOOLS.forEach((slug) => {
  ALL_LANGS.forEach((lang) => {
    LEGACY_ROUTES.set(lang === 'en' ? `/tools/${slug}` : toolPath(lang, slug), 'initial state is the current date/time, which a static build cannot know');
  });
});

const HREFLANG_NAMES = Object.fromEntries(Object.values(LOCALES).map((locale) => [locale.hreflang, locale]));

// Mirrors of Navbar.jsx and Footer.jsx: same tags, same Tailwind classes, so
// the boxes they occupy are already the right size before React mounts.
// React replaces this markup with the real components on hydration — matching
// structure means that swap does not change the page's height, which is what
// was producing the ~0.32 CLS (the footer sliding down once the real chrome
// appeared) on every prerendered page. Kept in sync by hand: if Navbar.jsx or
// Footer.jsx change their layout, update these to match.
const NAV_ITEMS = [
  ['Home', '/'], ['Blogs', '/blogs'], ['Tools', '/tools'], ['Contact Us', '/contact-us'],
  ['Write Blogs', '/write-blogs'], ['Job Alerts', '/job-alert'], ['Game', '/word-game'],
];
const EN_NAV = { Home: 'Home', Blogs: 'Blogs', Tools: 'Tools', 'Contact Us': 'Contact Us', 'Write Blogs': 'Write Blogs', 'Job Alerts': 'Job Alerts', Game: 'Game', Login: 'Login', Register: 'Register' };
const EN_POPULAR = [
  ['/tools/word-counter', 'Word Counter'], ['/tools/percentage-calculator', 'Percentage Calculator'],
  ['/tools/loan-calculator', 'Loan Calculator'], ['/tools/bmi-calculator', 'BMI Calculator'],
  ['/tools/json-studio', 'JSON Formatter'], ['/tools/password-generator', 'Password Generator'],
];
const EN_FOOTER = {
  company: 'Company', about: 'About Us', blog: 'Blog', help: 'Help Center', contact: 'Contact Us',
  terms: 'Terms of Service', privacy: 'Privacy Policy', stayUpdated: 'Stay Updated',
  emailPlaceholder: 'Enter your email', subscribe: 'Subscribe',
  newsletterNote: 'Get the latest updates and news delivered to your inbox.',
  rights: 'All rights reserved.',
  disclaimer: 'The calculators on this site are provided for general information only and are not financial, medical, or legal advice.',
};
const EN_TAGLINE = 'Free online calculators, converters, and developer tools that run entirely in your browser, plus practical guides.';

const navHtml = (route) => {
  const lang = route.lang || 'en';
  const nav = CHROME[lang]?.nav || EN_NAV;
  const links = NAV_ITEMS.map(([name, href]) => {
    const resolvedHref = href === '/tools' ? hubPath(lang) : href;
    return `<a href="${escapeHtml(resolvedHref)}" class="rounded-md px-3 py-2 text-sm font-medium text-gray-600">${escapeHtml(nav[name] ?? name)}</a>`;
  }).join('');
  return `<nav class="relative bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex items-center sm:hidden">
            <span class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600">
              <svg class="block h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></svg>
            </span>
            <div class="ml-4 flex items-center"><img alt="Talk &amp; Tool" src="/3.png" width="40" height="40" class="h-10 w-auto sm:h-10"></div>
          </div>
          <div class="hidden sm:flex flex-shrink-0 items-center sm:absolute sm:left-0"><img alt="Talk &amp; Tool" src="/3.png" width="96" height="96" class="h-8 w-auto sm:h-24"></div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center flex-wrap"><div class="flex flex-wrap space-x-4">${links}</div></div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div class="flex space-x-2">
              <a href="/login" class="px-3 py-2 text-sm font-medium rounded-md text-gray-600">${escapeHtml(nav.Login ?? 'Login')}</a>
              <a href="/signup" class="px-3 py-2 text-sm font-medium rounded-md text-gray-600">${escapeHtml(nav.Register ?? 'Register')}</a>
            </div>
          </div>
        </div>
      </div>
    </nav>`;
};

const footerHtml = (route) => {
  const lang = route.lang || 'en';
  const copy = CHROME[lang] || { tagline: EN_TAGLINE, popularTools: 'Popular tools', allTools: 'All tools →', footer: EN_FOOTER, popular: EN_POPULAR };
  const popular = lang === 'en' ? EN_POPULAR : copy.popular.map(([slug, label]) => [toolPath(lang, slug), label]);
  const footerCopy = copy.footer || EN_FOOTER;
  const popularLinks = popular.map(([href, label]) => `<li><a href="${escapeHtml(href)}" class="hover:text-gray-900 transition">${escapeHtml(label)}</a></li>`).join('');
  const langLinks = ALL_LANGS.map((code) => (
    `<a href="${escapeHtml(hubPath(code))}" hreflang="${LOCALES[code].hreflang}" lang="${LOCALES[code].htmlLang}" class="${code === lang ? 'font-semibold text-gray-900' : 'hover:text-gray-900 transition'}">${escapeHtml(LOCALES[code].name)}</a>`
  )).join('');
  return `<footer class="bg-gray-100 text-gray-700 py-10 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div><h2 class="text-2xl font-bold text-gray-900">Talk &amp; Tool</h2><p class="mt-4 text-sm text-gray-600">${escapeHtml(copy.tagline)}</p></div>
        <div><h3 class="text-lg font-semibold text-gray-900">${escapeHtml(copy.popularTools)}</h3><ul class="mt-4 space-y-2 text-sm">${popularLinks}<li><a href="${escapeHtml(hubPath(lang))}" class="font-semibold text-blue-600 hover:underline">${escapeHtml(copy.allTools)}</a></li></ul></div>
        <div><h3 class="text-lg font-semibold text-gray-900">${escapeHtml(footerCopy.company)}</h3><ul class="mt-4 space-y-2 text-sm">
          <li><a href="/about-us" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.about)}</a></li>
          <li><a href="/blogs" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.blog)}</a></li>
          <li><a href="/help-center" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.help)}</a></li>
          <li><a href="/contact-us" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.contact)}</a></li>
          <li><a href="/terms-and-conditions" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.terms)}</a></li>
          <li><a href="/privacy-policy" class="hover:text-gray-900 transition">${escapeHtml(footerCopy.privacy)}</a></li>
        </ul></div>
        <div><h3 class="text-lg font-semibold text-gray-900">${escapeHtml(footerCopy.stayUpdated)}</h3>
          <div class="mt-4 flex">
            <input type="email" placeholder="${escapeHtml(footerCopy.emailPlaceholder)}" class="w-full px-3 py-2 rounded-l-lg bg-white text-sm border border-gray-300" disabled>
            <span class="px-4 py-2 rounded-r-lg text-sm font-medium text-white bg-gray-400">${escapeHtml(footerCopy.subscribe)}</span>
          </div>
          <p class="mt-2 text-xs text-gray-600">${escapeHtml(footerCopy.newsletterNote)}</p>
        </div>
      </div>
      <div class="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
        <nav aria-label="Languages" class="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>
          ${langLinks}
        </nav>
        <p>© ${new Date().getFullYear()} Talk &amp; Tool. ${escapeHtml(footerCopy.rights)}</p>
        <p class="mt-2 text-xs text-gray-500">${escapeHtml(footerCopy.disclaimer)}</p>
      </div>
    </footer>`;
};

const DEFAULT_LINKS = [
  { href: '/tools', label: 'All free tools' },
  { href: '/blogs', label: 'Blog' },
  { href: '/about-us', label: 'About' },
  { href: '/contact-us', label: 'Contact' },
];

const linkList = (links) => links
  .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
  .join(' &middot; ');


/** Mirrors the top of the rendered page so a non-JS crawler reads the same thing. */
const bodyFor = (route) => {
  const parts = [
    `<h1>${escapeHtml(route.heading || route.title)}</h1>`,
    `<p>${escapeHtml(route.body || route.description)}</p>`,
  ];
  // Paragraphs that continue directly under the hero copy on the live page,
  // with no sub-heading of their own (e.g. the extra intro paragraphs on the
  // /check-ip and /screen-resolution "About this tool" blocks).
  if (route.extraParagraphs?.length) {
    parts.push(route.extraParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(''));
  }
  // Extra <h2>/<p>/<ul> blocks for pages whose real content is longer prose
  // than a single body sentence (About, Privacy Policy, Help Center, the
  // localized tool hubs, ...) — each entry mirrors a section already
  // rendered by the live React page. Placed before the list/steps/faqs
  // below to match where this copy actually sits on those pages (e.g. the
  // localized hubs' intro paragraphs come before the tool grid).
  if (route.sections?.length) {
    parts.push(route.sections.map((section) => {
      const heading = `<h2>${escapeHtml(section.heading)}</h2>`;
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
      const list = section.list?.length
        ? `<ul>${section.list.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul>`
        : '';
      return heading + paragraphs + list;
    }).join(''));
  }
  if (route.list?.length) {
    if (route.listHeading) parts.push(`<h2>${escapeHtml(route.listHeading)}</h2>`);
    parts.push(`<ul>${route.list.map((item) => `<li><a href="${escapeHtml(item.path)}">${escapeHtml(item.name)}</a>${item.description ? ` — ${escapeHtml(item.description)}` : ''}</li>`).join('')}</ul>`);
  }
  if (route.steps?.length) {
    parts.push(`<h2>${escapeHtml(route.howToHeading || 'How to use it')}</h2>`);
    parts.push(`<ol>${route.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`);
  }
  if (route.faqs?.length) {
    parts.push(`<h2>${escapeHtml(route.faqHeading || 'Frequently asked questions')}</h2>`);
    parts.push(route.faqs.map((item) => `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`).join(''));
  }
  parts.push(`<p>${linkList(route.links || DEFAULT_LINKS)}</p>`);

  // Visible links to the other language versions, matching the rendered
  // "Also available in" line and giving crawlers a plain <a> path to each.
  const selfLang = LOCALES[route.lang || 'en'].hreflang;
  const others = (route.alternates || []).filter((alternate) => alternate.hreflang !== 'x-default' && alternate.hreflang !== selfLang);
  if (others.length) {
    parts.push(`<p>${escapeHtml(route.alsoAvailable || 'Also available in:')} ${others.map((alternate) => {
      const locale = HREFLANG_NAMES[alternate.hreflang];
      return `<a href="${escapeHtml(alternate.path)}" hreflang="${alternate.hreflang}" lang="${locale.htmlLang}">${escapeHtml(locale.name)}</a>`;
    }).join(' &middot; ')}</p>`);
  }
  return parts.join('\n      ');
};

/** The markup that goes inside #root for a legacy route. */
export const legacyRootHtml = (route) => `${navHtml(route)}
      <main>${bodyFor(route)}</main>
      ${footerHtml(route)}
    `;
