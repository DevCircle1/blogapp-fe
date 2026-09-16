/**
 * German page copy for the tool catalogue: page chrome, the /de directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for German speakers rather than translated from English — the
 * keywords (Rechner, Dreisatz, Mehrwertsteuer), the 19/7 % VAT rates, and the
 * examples are the ones people there actually search for and use. The formal
 * "Sie" is used throughout, as on German tool and finance sites.
 */
import { developerTools } from './de/developer.js';
import { calculatorTools } from './de/calculators.js';
import { financeTools } from './de/finance.js';
import { textTools } from './de/text.js';
import { datetimeTools } from './de/datetime.js';
import { healthTools } from './de/health.js';
import { seoTools } from './de/seo.js';

export default {
  chrome: {
    home: 'Start',
    tools: 'Tools',
    breadcrumb: 'Navigationspfad',
    toolRegion: 'Tool: {name}',
    privacy: 'Alles wird in Ihrem Browser berechnet. Was Sie eingeben, wird an keinen Server gesendet.',
    about: '{name}: wofür er gut ist',
    howTo: '{name}: so funktioniert er',
    formula: 'Die verwendete Formel',
    faq: 'Häufige Fragen',
    related: 'Verwandte Tools',
    browseAll: 'Alle Tools ansehen →',
    alsoAvailable: 'Auch verfügbar auf:',
    openTool: 'Tool öffnen',
    notFoundTitle: 'Tool nicht gefunden',
    notFoundBody: 'Diese Adresse gehört zu keinem Tool. Im vollständigen Verzeichnis finden Sie, wonach Sie suchen.',
  },
  categories: {
    Calculator: { name: 'Rechner', blurb: 'Alltagsmathematik: Prozente, Mittelwert, Dreisatz, Brüche, Alter und Einheiten umrechnen.' },
    Finance: { name: 'Finanzen', blurb: 'Kredite, Baufinanzierung, Zinsen, Mehrwertsteuer, Margen und die Rechnungen hinter einem kleinen Unternehmen.' },
    Health: { name: 'Gesundheit', blurb: 'BMI, Kalorien, Makros, Körperfett, Trinkmenge und Geburtstermin – mit den Grenzen jeder Methode.' },
    Developer: { name: 'Entwicklung', blurb: 'JSON, Base64, JWT, Regex, Hashes, Farben, CSS und die Referenztabellen, die man ständig wieder sucht.' },
    Security: { name: 'Sicherheit', blurb: 'Passwörter erzeugen und prüfen, Karten und E-Mail-Adressen validieren – alles bleibt im Browser.' },
    Text: { name: 'Text', blurb: 'Zählen, Groß- und Kleinschreibung ändern, sortieren, Duplikate entfernen, vergleichen und Texte säubern.' },
    'Date & Time': { name: 'Datum und Zeit', blurb: 'Tage zwischen Daten, Fristen, Arbeitstage, Arbeitszeit, Countdowns und Unix-Timestamps.' },
    SEO: { name: 'SEO', blurb: 'Keywords, Longtail, Content-Planung und thematische Gruppierung mit nachvollziehbaren Methoden.' },
  },
  hub: {
    title: 'Kostenlose Online-Tools: Rechner und Umrechner',
    description: 'Kostenlose Online-Rechner, Umrechner und Text-Tools auf Deutsch: Prozentrechner, Mehrwertsteuer, Dreisatz, BMI, Wörter zählen und mehr.',
    heading: 'Kostenlose Online-Tools, die sofort funktionieren',
    body: 'Rechner, Umrechner, Text-Werkzeuge und Tools für Entwickler. Nichts zu installieren, keine Anmeldung, und Ihre Daten verlassen den Browser nicht.',
    badge: '{n} Tools, alle kostenlos',
    searchLabel: 'Tools durchsuchen',
    searchPlaceholder: 'Suchen Sie: Prozent, Mehrwertsteuer, Dreisatz, BMI, JSON…',
    shown: '{shown} von {total} Tools',
    empty: 'Kein Tool passt zu „{q}“. Versuchen Sie einen allgemeineren Begriff.',
    paragraphs: [
      ['Nützliche Tools ohne Download und ohne Anmeldung', 'Talk & Tool versammelt die kleinen Helfer, nach denen täglich gesucht wird – ein Prozentwert, die Rate eines Kredits, die Mehrwertsteuer einer Rechnung, eine Wortzahl oder ein JSON, das sich nicht parsen lässt – in einer einheitlichen Oberfläche. Jedes Tool öffnet sofort, funktioniert auf dem Smartphone und erklärt die Methode hinter dem Ergebnis, statt nur eine Zahl auszugeben.'],
      ['Auf Deutsch gedacht, nicht übersetzt', 'Die Tools rechnen mit dem Zahlenformat Ihres Landes, dem Euro als Standardwährung, den deutschen Mehrwertsteuersätzen von 19 und 7 Prozent und vertrauten Beispielen wie dem Dreisatz oder der 40-Stunden-Woche. Alles läuft im Browser, Ihre Eingaben gehen nie an einen Server.'],
    ],
    faqs: [
      { q: 'Sind die Tools wirklich kostenlos?', a: 'Ja. Alle sind kostenlos, ohne Konto, ohne Testphase und ohne Nutzungslimit. Die Seite finanziert sich über Werbung und nicht über Gebühren für die Tools.' },
      { q: 'Werden meine Daten an einen Server gesendet?', a: 'Nein. Rechner, Umrechner und Text-Werkzeuge laufen vollständig in Ihrem Browser. Eingefügte Texte und eingegebene Zahlen verlassen Ihr Gerät nicht.' },
      { q: 'Funktionieren die Tools auf dem Smartphone?', a: 'Ja. Alle passen sich jeder Bildschirmgröße an und laufen in jedem modernen Browser, mobil wie am Rechner. Es muss nichts installiert werden.' },
      { q: 'Darf ich die Ergebnisse beruflich nutzen?', a: 'Ja, privat, für die Ausbildung und gewerblich. Die Rechner dienen der allgemeinen Information und ersetzen keine Finanz-, Medizin- oder Rechtsberatung.' },
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
