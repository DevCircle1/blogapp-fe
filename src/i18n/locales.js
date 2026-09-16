/**
 * Languages the catalogue tools are published in, and the URL helpers that
 * tie the language versions of a page together.
 *
 * English is the source language and keeps its existing unprefixed URLs
 * (/tools/<slug>). Every other language lives under /<code>/ with its own
 * keyword-targeted slug from slugs.js. Plain JS with no JSX so the Node build
 * scripts (sitemap, prerender) can import it directly.
 */
import { TOOL_SLUGS } from './slugs.js';

export const DEFAULT_LANG = 'en';

/**
 * `intl` is the fallback BCP 47 tag for number and date formatting when the
 * visitor's own browser locale does not match the page language. English is
 * deliberately undefined: its pages have always formatted with the visitor's
 * browser locale, and that behaviour is kept.
 */
export const LOCALES = {
  en: { code: 'en', hreflang: 'en', htmlLang: 'en', ogLocale: 'en_US', intl: undefined, name: 'English', currency: 'USD' },
  es: { code: 'es', hreflang: 'es', htmlLang: 'es', ogLocale: 'es_ES', intl: 'es-ES', name: 'Español', currency: 'EUR' },
  pt: { code: 'pt', hreflang: 'pt-BR', htmlLang: 'pt-BR', ogLocale: 'pt_BR', intl: 'pt-BR', name: 'Português', currency: 'BRL' },
  fr: { code: 'fr', hreflang: 'fr', htmlLang: 'fr', ogLocale: 'fr_FR', intl: 'fr-FR', name: 'Français', currency: 'EUR' },
  de: { code: 'de', hreflang: 'de', htmlLang: 'de', ogLocale: 'de_DE', intl: 'de-DE', name: 'Deutsch', currency: 'EUR' },
};

export const LOCALIZED_LANGS = ['es', 'pt', 'fr', 'de'];
export const ALL_LANGS = [DEFAULT_LANG, ...LOCALIZED_LANGS];

/* ------------------------------------------------------------------ paths */
export const langFromPath = (pathname = '/') => {
  const segment = pathname.split('/')[1];
  return LOCALIZED_LANGS.includes(segment) ? segment : DEFAULT_LANG;
};

export const hubPath = (lang) => (lang === DEFAULT_LANG ? '/tools' : `/${lang}`);

export const localizedSlug = (lang, slug) => (lang === DEFAULT_LANG ? slug : TOOL_SLUGS[slug]?.[lang]);

export const toolPath = (lang, slug) => (
  lang === DEFAULT_LANG ? `/tools/${slug}` : `/${lang}/${localizedSlug(lang, slug)}`
);

const SOURCE_SLUGS = Object.fromEntries(LOCALIZED_LANGS.map((lang) => [
  lang,
  new Map(Object.entries(TOOL_SLUGS).map(([slug, slugs]) => [slugs[lang], slug])),
]));

/** Maps a localized slug back to the English catalogue slug, or undefined. */
export const sourceSlug = (lang, slug) => SOURCE_SLUGS[lang]?.get(slug);

/**
 * hreflang set for one page: every language version, including the page
 * itself, plus x-default pointing at English for everyone else. Google
 * ignores the whole cluster unless each version lists all the others.
 */
const alternatesFor = (pathFor) => [
  ...ALL_LANGS.map((lang) => ({ hreflang: LOCALES[lang].hreflang, path: pathFor(lang) })),
  { hreflang: 'x-default', path: pathFor(DEFAULT_LANG) },
];

export const toolAlternates = (slug) => alternatesFor((lang) => toolPath(lang, slug));
export const hubAlternates = () => alternatesFor(hubPath);

/* -------------------------------------------------- runtime locale choice */
const REGION_CURRENCY = {
  MX: 'MXN', AR: 'ARS', CO: 'COP', CL: 'CLP', PE: 'PEN', US: 'USD', CA: 'CAD',
  CH: 'CHF', GB: 'GBP', BR: 'BRL', PT: 'EUR', ES: 'EUR', FR: 'EUR', DE: 'EUR',
  AT: 'EUR', BE: 'EUR', LU: 'EUR', IE: 'EUR', IT: 'EUR', NL: 'EUR',
};

const browserLocale = () => (typeof navigator !== 'undefined' && navigator.language) || '';

/**
 * A Mexican reading the Spanish page expects 1,234.56 and a Swiss reader of
 * the German page expects 1’234.56, so the visitor's own regional variant wins
 * whenever it is the same language as the page.
 */
export const resolveIntl = (lang) => {
  if (lang === DEFAULT_LANG) return undefined;
  const preferred = browserLocale();
  const lower = preferred.toLowerCase();
  return lower === lang || lower.startsWith(`${lang}-`) ? preferred : LOCALES[lang].intl;
};

export const resolveCurrency = (lang) => {
  if (lang === DEFAULT_LANG) return LOCALES.en.currency;
  const region = (resolveIntl(lang) || '').split('-')[1]?.toUpperCase();
  return REGION_CURRENCY[region] || LOCALES[lang].currency;
};

/* ------------------------------------------------------ site chrome copy */
/**
 * Navbar and footer labels for the localized sections. Kept here rather than
 * in the per-language bundles because the chrome renders on every page and
 * must not wait on a lazy-loaded chunk.
 */
export const CHROME = {
  es: {
    nav: { Home: 'Inicio', Blogs: 'Blog', Tools: 'Herramientas', 'Contact Us': 'Contacto', 'Write Blogs': 'Escribir', 'Job Alerts': 'Empleo', Game: 'Juego', Login: 'Entrar', Register: 'Registrarse' },
    tagline: 'Calculadoras, conversores y herramientas online gratis que funcionan en tu navegador, sin registro.',
    popularTools: 'Herramientas populares',
    allTools: 'Todas las herramientas →',
    popular: [
      ['percentage-calculator', 'Calculadora de porcentajes'], ['sales-tax-calculator', 'Calculadora de IVA'],
      ['ratio-calculator', 'Regla de tres'], ['bmi-calculator', 'Calculadora de IMC'],
      ['word-counter', 'Contador de palabras'], ['loan-calculator', 'Calculadora de préstamos'],
    ],
    footer: {
      company: 'Empresa', about: 'Quiénes somos', blog: 'Blog', help: 'Centro de ayuda', contact: 'Contacto',
      terms: 'Términos del servicio', privacy: 'Política de privacidad', stayUpdated: 'Novedades',
      emailPlaceholder: 'Tu correo electrónico', subscribe: 'Suscribirme', subscribing: 'Enviando…',
      newsletterNote: 'Recibe las novedades y las herramientas nuevas en tu correo.',
      rights: 'Todos los derechos reservados.',
      disclaimer: 'Las calculadoras de este sitio son orientativas y no constituyen asesoramiento financiero, médico ni legal.',
    },
  },
  pt: {
    nav: { Home: 'Início', Blogs: 'Blog', Tools: 'Ferramentas', 'Contact Us': 'Contato', 'Write Blogs': 'Escrever', 'Job Alerts': 'Vagas', Game: 'Jogo', Login: 'Entrar', Register: 'Cadastrar' },
    tagline: 'Calculadoras, conversores e ferramentas online grátis que funcionam direto no navegador, sem cadastro.',
    popularTools: 'Ferramentas populares',
    allTools: 'Todas as ferramentas →',
    popular: [
      ['percentage-calculator', 'Calculadora de porcentagem'], ['ratio-calculator', 'Regra de três'],
      ['compound-interest-calculator', 'Juros compostos'], ['bmi-calculator', 'Calculadora de IMC'],
      ['word-counter', 'Contador de palavras'], ['loan-calculator', 'Simulador de empréstimo'],
    ],
    footer: {
      company: 'Empresa', about: 'Sobre nós', blog: 'Blog', help: 'Central de ajuda', contact: 'Contato',
      terms: 'Termos de uso', privacy: 'Política de privacidade', stayUpdated: 'Novidades',
      emailPlaceholder: 'Seu e-mail', subscribe: 'Assinar', subscribing: 'Enviando…',
      newsletterNote: 'Receba novidades e ferramentas novas no seu e-mail.',
      rights: 'Todos os direitos reservados.',
      disclaimer: 'As calculadoras deste site têm caráter informativo e não substituem orientação financeira, médica ou jurídica.',
    },
  },
  fr: {
    nav: { Home: 'Accueil', Blogs: 'Blog', Tools: 'Outils', 'Contact Us': 'Contact', 'Write Blogs': 'Écrire', 'Job Alerts': 'Emplois', Game: 'Jeu', Login: 'Connexion', Register: 'Inscription' },
    tagline: 'Calculateurs, convertisseurs et outils en ligne gratuits qui fonctionnent dans votre navigateur, sans inscription.',
    popularTools: 'Outils populaires',
    allTools: 'Tous les outils →',
    popular: [
      ['percentage-calculator', 'Calcul de pourcentage'], ['sales-tax-calculator', 'Calcul TVA'],
      ['ratio-calculator', 'Produit en croix'], ['bmi-calculator', 'Calcul IMC'],
      ['word-counter', 'Compteur de mots'], ['loan-calculator', 'Simulateur de prêt'],
    ],
    footer: {
      company: 'Société', about: 'À propos', blog: 'Blog', help: 'Centre d’aide', contact: 'Contact',
      terms: 'Conditions d’utilisation', privacy: 'Politique de confidentialité', stayUpdated: 'Restez informé',
      emailPlaceholder: 'Votre adresse e-mail', subscribe: 'S’abonner', subscribing: 'Envoi…',
      newsletterNote: 'Recevez les nouveautés et les nouveaux outils par e-mail.',
      rights: 'Tous droits réservés.',
      disclaimer: 'Les calculateurs de ce site sont fournis à titre indicatif et ne constituent pas un conseil financier, médical ou juridique.',
    },
  },
  de: {
    nav: { Home: 'Start', Blogs: 'Blog', Tools: 'Tools', 'Contact Us': 'Kontakt', 'Write Blogs': 'Schreiben', 'Job Alerts': 'Jobs', Game: 'Spiel', Login: 'Anmelden', Register: 'Registrieren' },
    tagline: 'Kostenlose Online-Rechner, Umrechner und Tools, die direkt im Browser laufen – ohne Anmeldung.',
    popularTools: 'Beliebte Tools',
    allTools: 'Alle Tools →',
    popular: [
      ['percentage-calculator', 'Prozentrechner'], ['sales-tax-calculator', 'Mehrwertsteuerrechner'],
      ['ratio-calculator', 'Dreisatz-Rechner'], ['bmi-calculator', 'BMI-Rechner'],
      ['word-counter', 'Wörter zählen'], ['loan-calculator', 'Kreditrechner'],
    ],
    footer: {
      company: 'Unternehmen', about: 'Über uns', blog: 'Blog', help: 'Hilfe', contact: 'Kontakt',
      terms: 'Nutzungsbedingungen', privacy: 'Datenschutz', stayUpdated: 'Auf dem Laufenden bleiben',
      emailPlaceholder: 'Ihre E-Mail-Adresse', subscribe: 'Abonnieren', subscribing: 'Wird gesendet…',
      newsletterNote: 'Neuigkeiten und neue Tools direkt in Ihr Postfach.',
      rights: 'Alle Rechte vorbehalten.',
      disclaimer: 'Die Rechner auf dieser Website dienen der allgemeinen Information und ersetzen keine Finanz-, Medizin- oder Rechtsberatung.',
    },
  },
};
