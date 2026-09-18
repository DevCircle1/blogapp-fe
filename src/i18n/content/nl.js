/**
 * Dutch page copy for the tool catalogue: page chrome, the /nl directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for Dutch speakers rather than translated from English — the
 * keywords, examples, btw rates, and euro amounts are the ones people in
 * the Netherlands (and Belgium) actually search for and use.
 */
import { developerTools } from './nl/developer.js';
import { calculatorTools } from './nl/calculators.js';
import { financeTools } from './nl/finance.js';
import { textTools } from './nl/text.js';
import { datetimeTools } from './nl/datetime.js';
import { healthTools } from './nl/health.js';
import { seoTools } from './nl/seo.js';

export default {
  chrome: {
    home: 'Home',
    tools: 'Tools',
    breadcrumb: 'Kruimelpad',
    toolRegion: 'Tool: {name}',
    privacy: 'Alles wordt berekend in je browser. Wat je invoert, wordt naar geen enkele server verstuurd.',
    about: '{name}: waar dit voor dient',
    howTo: '{name}: hoe het werkt',
    formula: 'De gebruikte formule',
    faq: 'Veelgestelde vragen',
    related: 'Gerelateerde tools',
    browseAll: 'Bekijk alle tools →',
    alsoAvailable: 'Ook beschikbaar in:',
    openTool: 'Tool openen',
    notFoundTitle: 'Tool niet gevonden',
    notFoundBody: 'Dat adres komt niet overeen met een tool. Bekijk de volledige lijst om te vinden wat je zoekt.',
  },
  categories: {
    Calculator: { name: 'Rekenmachines', blurb: 'Dagelijkse wiskunde: percentages, gemiddelden, verhoudingen, breuken, leeftijd en eenheden omrekenen.' },
    Finance: { name: 'Financieel', blurb: 'Leningen, hypotheken, rente, btw, marges en de berekeningen achter een klein bedrijf.' },
    Health: { name: 'Gezondheid', blurb: 'BMI, calorieën, macro\'s, lichaamsvet, hydratatie en uitgerekende datum, met de beperkingen van elke methode duidelijk uitgelegd.' },
    Developer: { name: 'Ontwikkelaars', blurb: 'JSON, Base64, JWT, regex, hashes, kleuren, CSS en de naslagtabellen die je steeds weer opzoekt.' },
    Security: { name: 'Beveiliging', blurb: 'Genereer en test wachtwoorden, en controleer kaarten en e-mailadressen zonder dat er iets je browser verlaat.' },
    Text: { name: 'Tekst', blurb: 'Tel woorden, wissel hoofdlettergebruik, sorteer, verwijder duplicaten, vergelijk en maak teksten schoon vóór publicatie.' },
    'Date & Time': { name: 'Datum en tijd', blurb: 'Dagen tussen datums, deadlines, werkdagen, gewerkte uren, aftellingen en Unix-timestamps.' },
    SEO: { name: 'SEO', blurb: 'Zoekwoorden, long tail, contentplanning en thematisch clusteren met transparante methodes.' },
  },
  hub: {
    title: 'Gratis online tools: rekenmachines en converters',
    description: 'Gratis rekenmachines, converters en tools online in het Nederlands: percentage, btw, verhoudingen, leningen, BMI, woorden tellen en meer.',
    heading: 'Gratis online tools die direct werken',
    body: 'Rekenmachines, converters, tekstprogramma\'s en tools voor ontwikkelaars. Niets om te installeren, geen registratie, en je gegevens verlaten nooit je browser.',
    badge: '{n} tools, allemaal gratis',
    searchLabel: 'Zoek tools',
    searchPlaceholder: 'Zoek: percentage, btw, verhouding, BMI, JSON…',
    shown: '{shown} van {total} tools',
    empty: 'Geen enkele tool komt overeen met "{q}". Probeer een algemenere term.',
    paragraphs: [
      ['Handige tools zonder downloads of registratie', 'Talk & Tool verzamelt de kleine hulpmiddelen die dagelijks worden opgezocht — een percentage, de maandlast van een lening, de btw op een factuur, een woordentelling of een JSON die niet wil valideren — in één consistente interface. Elke tool opent meteen, werkt op mobiel en legt de methode achter het resultaat uit in plaats van alleen een getal te tonen.'],
      ['Aangepast aan jouw taal en jouw land', 'De tools gebruiken de getalnotatie van je land, de Nederlandse btw-tarieven, de euro als standaardmunt en herkenbare voorbeelden zoals verhoudingen of vakantiegeld. Alles wordt berekend in je browser, dus wat je invoert wordt nooit naar een server verstuurd.'],
    ],
    faqs: [
      { q: 'Zijn de tools echt gratis?', a: 'Ja. Alle tools zijn gratis, zonder account, zonder proefperiode en zonder gebruikslimiet. De site wordt gefinancierd met advertenties, niet door voor de tools te rekenen.' },
      { q: 'Worden mijn gegevens naar een server verstuurd?', a: 'Nee. De rekenmachines, converters en tekstprogramma\'s draaien volledig in je browser. Tekst die je plakt en getallen die je invoert verlaten je apparaat nooit.' },
      { q: 'Werken de tools op mobiel?', a: 'Ja. Alle tools passen zich aan elk scherm aan en werken in elke moderne browser op mobiel of computer. Er hoeft niets geïnstalleerd te worden.' },
      { q: 'Mag ik de resultaten voor mijn werk gebruiken?', a: 'Ja, voor persoonlijk, educatief of zakelijk gebruik. De rekenmachines zijn indicatief en vervangen geen financieel, medisch of juridisch advies van een professional.' },
    ],
  },
  tools: {
    ...developerTools,
    ...calculatorTools,
    ...financeTools,
    ...textTools,
    ...datetimeTools,
    ...healthTools,
    ...seoTools,
  },
};
