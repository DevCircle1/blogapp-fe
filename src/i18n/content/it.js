/**
 * Italian page copy for the tool catalogue: page chrome, the /it directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for Italian speakers rather than translated from English — the
 * keywords, examples, IVA rates, and the stipendio lordo mensile are the
 * ones people there actually search for and use.
 */
import { developerTools } from './it/developer.js';
import { calculatorTools } from './it/calculators.js';
import { financeTools } from './it/finance.js';
import { textTools } from './it/text.js';
import { datetimeTools } from './it/datetime.js';
import { healthTools } from './it/health.js';
import { seoTools } from './it/seo.js';

export default {
  chrome: {
    home: 'Home',
    tools: 'Strumenti',
    breadcrumb: 'Percorso di navigazione',
    toolRegion: 'Strumento: {name}',
    privacy: 'Tutto viene calcolato nel tuo browser. Quello che scrivi non viene inviato a nessun server.',
    about: '{name}: a cosa serve',
    howTo: '{name}: come si usa',
    formula: 'La formula utilizzata',
    faq: 'Domande frequenti',
    related: 'Strumenti correlati',
    browseAll: 'Vedi tutti gli strumenti →',
    alsoAvailable: 'Disponibile anche in:',
    openTool: 'Apri lo strumento',
    notFoundTitle: 'Strumento non trovato',
    notFoundBody: 'Questo indirizzo non corrisponde a nessuno strumento. Consulta l’elenco completo per trovare quello che cerchi.',
  },
  categories: {
    Calculator: { name: 'Calcolatrici', blurb: 'La matematica di ogni giorno: percentuali, medie, proporzioni, frazioni, età e conversione di unità.' },
    Finance: { name: 'Finanza', blurb: 'Prestiti, mutui, interessi, IVA, margini e i conti che tengono in piedi una piccola attività.' },
    Health: { name: 'Salute', blurb: 'IMC, calorie, macro, massa grassa, idratazione e data del parto, con i limiti di ogni metodo spiegati con chiarezza.' },
    Developer: { name: 'Sviluppo', blurb: 'JSON, Base64, JWT, regex, hash, colori, CSS e le tabelle di riferimento che cerchi sempre di nuovo.' },
    Security: { name: 'Sicurezza', blurb: 'Genera e valuta password, verifica carte ed email senza che nulla esca dal tuo browser.' },
    Text: { name: 'Testo', blurb: 'Conta parole, cambia maiuscole e minuscole, ordina, elimina duplicati, confronta e ripulisci i testi prima di pubblicarli.' },
    'Date & Time': { name: 'Date e orari', blurb: 'Giorni tra due date, scadenze, giorni lavorativi, ore lavorate, conto alla rovescia e timestamp Unix.' },
    SEO: { name: 'SEO', blurb: 'Parole chiave, long tail, pianificazione dei contenuti e clustering tematico con metodi trasparenti.' },
  },
  hub: {
    title: 'Strumenti online gratuiti: calcolatrici e convertitori',
    description: 'Calcolatrici, convertitori e utilità online gratuite in italiano: percentuali, IVA, proporzioni, prestiti, IMC, contatore di parole e altro. Senza registrazione.',
    heading: 'Strumenti online gratuiti che funzionano all’istante',
    body: 'Calcolatrici, convertitori, utilità per il testo e strumenti per sviluppatori. Niente da installare, nessuna registrazione e i tuoi dati non escono mai dal browser.',
    badge: '{n} strumenti, tutti gratuiti',
    searchLabel: 'Cerca uno strumento',
    searchPlaceholder: 'Cerca: percentuale, IVA, proporzione, IMC, JSON…',
    shown: '{shown} di {total} strumenti',
    empty: 'Nessuno strumento corrisponde a «{q}». Prova con un termine più generico.',
    paragraphs: [
      ['Strumenti utili, senza download né registrazione', 'Talk & Tool riunisce le piccole utilità che si cercano ogni giorno — una percentuale, la rata di un prestito, l’IVA di una fattura, un conteggio di parole o un JSON che non si valida — in un’interfaccia coerente. Ogni strumento si apre all’istante, funziona da smartphone e spiega il metodo dietro il risultato invece di limitarsi a mostrare un numero.'],
      ['Pensati per l’italiano e per come lavori davvero', 'Gli strumenti usano la virgola come separatore decimale, l’euro come valuta, le aliquote IVA italiane e riferimenti familiari come lo stipendio lordo mensile o la settimana di 40 ore. Tutto viene calcolato nel tuo browser, quindi quello che scrivi non viene mai inviato a un server.'],
    ],
    faqs: [
      { q: 'Gli strumenti sono davvero gratuiti?', a: 'Sì. Sono tutti gratuiti, senza account, senza periodo di prova e senza limiti d’uso. Il sito si finanzia con la pubblicità, non facendo pagare gli strumenti.' },
      { q: 'I miei dati vengono inviati a un server?', a: 'No. Le calcolatrici, i convertitori e le utilità per il testo funzionano interamente nel tuo browser. I testi che incolli e i numeri che scrivi non lasciano mai il tuo dispositivo.' },
      { q: 'Funzionano da smartphone?', a: 'Sì. Tutti gli strumenti si adattano a qualsiasi schermo e funzionano in qualsiasi browser moderno, da smartphone o da computer. Non c’è nulla da installare.' },
      { q: 'Posso usare i risultati per lavoro?', a: 'Sì, per uso personale, scolastico o professionale. Le calcolatrici hanno scopo indicativo e non sostituiscono la consulenza di un professionista in ambito finanziario, medico o legale.' },
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
