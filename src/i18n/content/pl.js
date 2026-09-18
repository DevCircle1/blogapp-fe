/**
 * Polish page copy for the tool catalogue: page chrome, the /pl directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for Polish speakers rather than translated from English — the
 * keywords, examples, VAT rates, and PLN currency references are the ones
 * people there actually search for and use.
 */
import { developerTools } from './pl/developer.js';
import { calculatorTools } from './pl/calculators.js';
import { financeTools } from './pl/finance.js';
import { textTools } from './pl/text.js';
import { datetimeTools } from './pl/datetime.js';
import { healthTools } from './pl/health.js';
import { seoTools } from './pl/seo.js';

export default {
  chrome: {
    home: 'Strona główna',
    tools: 'Narzędzia',
    breadcrumb: 'Ścieżka nawigacji',
    toolRegion: 'Narzędzie: {name}',
    privacy: 'Wszystko liczy się w twojej przeglądarce. To, co wpisujesz, nie trafia na żaden serwer.',
    about: '{name}: do czego służy',
    howTo: '{name}: jak korzystać',
    formula: 'Zastosowany wzór',
    faq: 'Najczęściej zadawane pytania',
    related: 'Powiązane narzędzia',
    browseAll: 'Zobacz wszystkie narzędzia →',
    alsoAvailable: 'Dostępne również w:',
    openTool: 'Otwórz narzędzie',
    notFoundTitle: 'Nie znaleziono narzędzia',
    notFoundBody: 'Ten adres nie odpowiada żadnemu narzędziu. Sprawdź pełny katalog, żeby znaleźć to, którego szukasz.',
  },
  categories: {
    Calculator: { name: 'Kalkulatory', blurb: 'Codzienna matematyka: procenty, średnie, proporcje, ułamki, wiek i konwersja jednostek.' },
    Finance: { name: 'Finanse', blurb: 'Kredyty, hipoteki, odsetki, VAT, marże i rachunki, które stoją za małą firmą.' },
    Health: { name: 'Zdrowie', blurb: 'BMI, kalorie, makroskładniki, tkanka tłuszczowa, nawodnienie i termin porodu, z jasno wyjaśnionymi ograniczeniami każdej metody.' },
    Developer: { name: 'Dla programistów', blurb: 'JSON, Base64, JWT, regex, hashe, kolory, CSS i tabele referencyjne, do których zawsze wracasz.' },
    Security: { name: 'Bezpieczeństwo', blurb: 'Generuj i sprawdzaj hasła oraz waliduj karty i e-maile bez wysyłania czegokolwiek poza przeglądarkę.' },
    Text: { name: 'Tekst', blurb: 'Licz słowa, zmieniaj wielkość liter, sortuj, usuwaj duplikaty, porównuj i czyść teksty przed publikacją.' },
    'Date & Time': { name: 'Data i czas', blurb: 'Dni między datami, terminy, dni robocze, przepracowane godziny, odliczanie czasu i timestampy Unix.' },
    SEO: { name: 'SEO', blurb: 'Frazy kluczowe, długi ogon, planowanie treści i grupowanie tematyczne z przejrzystymi metodami.' },
  },
  hub: {
    title: 'Darmowe narzędzia online: kalkulatory i konwertery',
    description: 'Darmowe kalkulatory, konwertery i narzędzia online po polsku: procenty, VAT, proporcje, kredyty, BMI, licznik słów i więcej. Bez rejestracji.',
    heading: 'Darmowe narzędzia online, które działają od razu',
    body: 'Kalkulatory, konwertery, narzędzia tekstowe i narzędzia dla programistów. Bez instalowania czegokolwiek, bez rejestracji i bez wysyłania twoich danych poza przeglądarkę.',
    badge: '{n} narzędzi, wszystkie za darmo',
    searchLabel: 'Szukaj narzędzi',
    searchPlaceholder: 'Szukaj: procent, VAT, proporcje, BMI, JSON…',
    shown: '{shown} z {total} narzędzi',
    empty: 'Żadne narzędzie nie pasuje do „{q}”. Spróbuj bardziej ogólnego terminu.',
    paragraphs: [
      ['Przydatne narzędzia bez pobierania i bez rejestracji', 'Talk & Tool gromadzi drobne narzędzia, których szuka się na co dzień — procent, ratę kredytu, VAT z faktury, liczbę słów albo JSON, który nie chce się zwalidować — w jednym spójnym interfejsie. Każde narzędzie otwiera się od razu, działa na telefonie i wyjaśnia metodę stojącą za wynikiem zamiast pokazywać tylko samą liczbę.'],
      ['Dopasowane do polskiego języka i realiów', 'Narzędzia stosują polski format liczb, stawki VAT obowiązujące w Polsce, złotego jako walutę domyślną i bliskie przykłady, jak proporcje w przepisie kulinarnym czy trzynasta pensja. Wszystko liczy się w twojej przeglądarce, więc to, co wpisujesz, nigdy nie trafia na żaden serwer.'],
    ],
    faqs: [
      { q: 'Czy te narzędzia są naprawdę darmowe?', a: 'Tak. Wszystkie są bezpłatne, bez konta, bez okresu próbnego i bez limitu użycia. Serwis utrzymuje się z reklam, a nie z opłat za narzędzia.' },
      { q: 'Czy moje dane są wysyłane na jakiś serwer?', a: 'Nie. Kalkulatory, konwertery i narzędzia tekstowe działają w całości w twojej przeglądarce. Wklejane teksty i wpisywane liczby nigdy nie opuszczają twojego urządzenia.' },
      { q: 'Czy działają na telefonie?', a: 'Tak. Wszystkie narzędzia dopasowują się do dowolnego ekranu i działają w każdej nowoczesnej przeglądarce, na telefonie czy komputerze. Nie trzeba niczego instalować.' },
      { q: 'Czy mogę użyć wyników w pracy zawodowej?', a: 'Tak, do celów osobistych, naukowych i komercyjnych. Kalkulatory mają charakter orientacyjny i nie zastępują porady finansowej, medycznej ani prawnej udzielonej przez specjalistę.' },
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
