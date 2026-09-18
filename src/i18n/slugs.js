/**
 * Localized URL slug for every catalogue tool, keyed by its English slug.
 *
 * Each slug is the phrase people in that market actually type, not a
 * translation of the English one: Spanish and Portuguese speakers search
 * "regla de tres" / "regra de três" and Germans "Dreisatz" for what English
 * calls a ratio calculator; the French say "calcul TVA" and Brazilians
 * "calculadora de impostos" rather than "sales tax calculator".
 *
 * Like the English slugs, these are permanent once indexed. Renaming one
 * breaks a live URL — add a 301 in netlify.toml instead of editing in place.
 * ASCII only, so URLs never need percent-encoding when shared.
 */
export const TOOL_SLUGS = {
  // Developer
  'json-studio': { es: 'formatear-json', pt: 'formatar-json', fr: 'formater-json', de: 'json-formatieren', it: 'formattare-json', nl: 'json-formatteren', pl: 'formatowanie-json' },
  'base64-tool': { es: 'codificar-decodificar-base64', pt: 'codificar-decodificar-base64', fr: 'encoder-decoder-base64', de: 'base64-kodieren-dekodieren', it: 'codifica-decodifica-base64', nl: 'base64-coderen-decoderen', pl: 'kodowanie-dekodowanie-base64' },
  'url-encoder': { es: 'codificar-decodificar-url', pt: 'codificar-decodificar-url', fr: 'encoder-decoder-url', de: 'url-kodieren-dekodieren', it: 'codifica-decodifica-url', nl: 'url-coderen-decoderen', pl: 'kodowanie-dekodowanie-url' },
  'jwt-inspector': { es: 'decodificar-jwt', pt: 'decodificar-jwt', fr: 'decoder-jwt', de: 'jwt-dekodieren', it: 'decodifica-jwt', nl: 'jwt-decoderen', pl: 'dekodowanie-jwt' },
  'uuid-generator': { es: 'generador-uuid', pt: 'gerador-uuid', fr: 'generateur-uuid', de: 'uuid-generator', it: 'generatore-uuid', nl: 'uuid-generator', pl: 'generator-uuid' },
  'regex-tester': { es: 'probador-regex', pt: 'testador-regex', fr: 'testeur-regex', de: 'regex-tester', it: 'tester-regex', nl: 'regex-tester', pl: 'tester-wyrazen-regularnych' },
  'hash-generator': { es: 'generador-hash-sha256', pt: 'gerador-hash-sha256', fr: 'generateur-hash-sha256', de: 'sha256-hash-generator', it: 'generatore-hash-sha256', nl: 'sha256-hash-generator', pl: 'generator-hash-sha256' },
  'html-encoder': { es: 'codificar-entidades-html', pt: 'codificar-entidades-html', fr: 'encoder-entites-html', de: 'html-sonderzeichen-umwandeln', it: 'codifica-entita-html', nl: 'html-entities-coderen', pl: 'kodowanie-encji-html' },
  'csv-to-json': { es: 'convertir-csv-a-json', pt: 'converter-csv-para-json', fr: 'convertir-csv-en-json', de: 'csv-in-json-umwandeln', it: 'convertire-csv-in-json', nl: 'csv-naar-json-converteren', pl: 'konwersja-csv-do-json' },
  'json-to-csv': { es: 'convertir-json-a-csv', pt: 'converter-json-para-csv', fr: 'convertir-json-en-csv', de: 'json-in-csv-umwandeln', it: 'convertire-json-in-csv', nl: 'json-naar-csv-converteren', pl: 'konwersja-json-do-csv' },
  'markdown-to-html': { es: 'convertir-markdown-a-html', pt: 'converter-markdown-para-html', fr: 'convertir-markdown-en-html', de: 'markdown-in-html-umwandeln', it: 'convertire-markdown-in-html', nl: 'markdown-naar-html-converteren', pl: 'konwersja-markdown-do-html' },
  'color-converter': { es: 'convertir-hex-a-rgb', pt: 'converter-hex-para-rgb', fr: 'convertir-hex-en-rgb', de: 'hex-in-rgb-umrechnen', it: 'convertire-hex-in-rgb', nl: 'hex-naar-rgb-converteren', pl: 'konwersja-hex-na-rgb' },
  'css-gradient-generator': { es: 'generador-degradado-css', pt: 'gerador-gradiente-css', fr: 'generateur-degrade-css', de: 'css-farbverlauf-generator', it: 'generatore-gradienti-css', nl: 'css-gradient-generator', pl: 'generator-gradientow-css' },
  'box-shadow-generator': { es: 'generador-sombras-css', pt: 'gerador-sombra-css', fr: 'generateur-ombre-css', de: 'css-schatten-generator', it: 'generatore-ombre-css', nl: 'css-schaduw-generator', pl: 'generator-cieni-css' },
  'http-status-codes': { es: 'codigos-de-estado-http', pt: 'codigos-de-status-http', fr: 'codes-de-statut-http', de: 'http-statuscodes', it: 'codici-di-stato-http', nl: 'http-statuscodes', pl: 'kody-statusu-http' },
  'meta-tag-generator': { es: 'generador-meta-tags', pt: 'gerador-meta-tags', fr: 'generateur-balises-meta', de: 'meta-tags-generator', it: 'generatore-meta-tag', nl: 'meta-tags-generator', pl: 'generator-meta-tagow' },
  'robots-txt-generator': { es: 'generador-robots-txt', pt: 'gerador-robots-txt', fr: 'generateur-robots-txt', de: 'robots-txt-generator', it: 'generatore-robots-txt', nl: 'robots-txt-generator', pl: 'generator-robots-txt' },
  'user-agent-parser': { es: 'analizador-user-agent', pt: 'analisador-user-agent', fr: 'analyseur-user-agent', de: 'user-agent-analysieren', it: 'analizzatore-user-agent', nl: 'user-agent-analyseren', pl: 'analiza-user-agent' },
  // Security
  'password-generator': { es: 'generador-de-contrasenas', pt: 'gerador-de-senhas', fr: 'generateur-mot-de-passe', de: 'passwort-generator', it: 'generatore-di-password', nl: 'wachtwoord-generator', pl: 'generator-hasel' },
  'password-strength-checker': { es: 'comprobar-seguridad-contrasena', pt: 'testar-forca-da-senha', fr: 'tester-mot-de-passe', de: 'passwortstaerke-pruefen', it: 'verifica-sicurezza-password', nl: 'wachtwoordsterkte-controleren', pl: 'sprawdzanie-sily-hasla' },
  'credit-card-validator': { es: 'validar-tarjeta-de-credito', pt: 'validar-cartao-de-credito', fr: 'verifier-numero-carte-bancaire', de: 'kreditkartennummer-pruefen', it: 'verifica-numero-carta-di-credito', nl: 'creditcardnummer-controleren', pl: 'sprawdzanie-numeru-karty-kredytowej' },
  'email-validator': { es: 'validar-correo-electronico', pt: 'validar-email', fr: 'verifier-adresse-email', de: 'email-adressen-pruefen', it: 'verifica-indirizzo-email', nl: 'e-mailadres-controleren', pl: 'sprawdzanie-adresu-email' },
  // Calculators
  'percentage-calculator': { es: 'calculadora-de-porcentajes', pt: 'calculadora-de-porcentagem', fr: 'calcul-pourcentage', de: 'prozentrechner', it: 'calcolatrice-percentuale', nl: 'percentage-berekenen', pl: 'kalkulator-procentowy' },
  'average-calculator': { es: 'calculadora-media-mediana-moda', pt: 'calculadora-media-mediana-moda', fr: 'calcul-moyenne-mediane', de: 'durchschnitt-berechnen', it: 'calcolatrice-media-mediana-moda', nl: 'gemiddelde-mediaan-modus-berekenen', pl: 'kalkulator-sredniej-mediany-dominanty' },
  'fraction-calculator': { es: 'calculadora-de-fracciones', pt: 'calculadora-de-fracoes', fr: 'calculatrice-fractions', de: 'bruchrechner', it: 'calcolatrice-di-frazioni', nl: 'breuken-rekenmachine', pl: 'kalkulator-ulamkow' },
  'ratio-calculator': { es: 'calculadora-regla-de-tres', pt: 'calculadora-regra-de-tres', fr: 'calcul-produit-en-croix', de: 'dreisatz-rechner', it: 'calcolatrice-di-proporzioni', nl: 'verhoudingen-berekenen', pl: 'kalkulator-proporcji' },
  'number-base-converter': { es: 'conversor-binario-decimal-hexadecimal', pt: 'conversor-binario-decimal-hexadecimal', fr: 'convertisseur-binaire-decimal-hexadecimal', de: 'zahlensysteme-umrechnen', it: 'convertitore-binario-decimale-esadecimale', nl: 'binair-decimaal-hexadecimaal-omzetten', pl: 'konwerter-binarno-dziesietno-szesnastkowy' },
  'roman-numeral-converter': { es: 'convertidor-numeros-romanos', pt: 'conversor-numeros-romanos', fr: 'convertisseur-chiffres-romains', de: 'roemische-zahlen-umrechnen', it: 'convertitore-numeri-romani', nl: 'romeinse-cijfers-omzetten', pl: 'konwerter-cyfr-rzymskich' },
  'gpa-calculator': { es: 'calculadora-gpa', pt: 'calculadora-gpa', fr: 'calcul-gpa', de: 'gpa-rechner', it: 'calcolatrice-media-voti-gpa', nl: 'gpa-rekenmachine', pl: 'kalkulator-sredniej-ocen' },
  'random-number-generator': { es: 'generador-numeros-aleatorios', pt: 'gerador-de-numeros-aleatorios', fr: 'generateur-nombre-aleatoire', de: 'zufallszahlen-generator', it: 'generatore-numeri-casuali', nl: 'willekeurig-getal-genereren', pl: 'generator-liczb-losowych' },
  'unit-converter': { es: 'conversor-de-unidades', pt: 'conversor-de-unidades', fr: 'convertisseur-unites', de: 'einheiten-umrechnen', it: 'convertitore-di-unita', nl: 'eenheden-omrekenen', pl: 'konwerter-jednostek' },
  'age-calculator': { es: 'calculadora-de-edad', pt: 'calculadora-de-idade', fr: 'calcul-age', de: 'altersrechner', it: 'calcolatrice-eta', nl: 'leeftijd-berekenen', pl: 'kalkulator-wieku' },
  // Finance
  'loan-calculator': { es: 'calculadora-de-prestamos', pt: 'simulador-de-emprestimo', fr: 'simulateur-pret', de: 'kreditrechner', it: 'calcolatrice-prestiti', nl: 'lening-berekenen', pl: 'kalkulator-kredytu' },
  'mortgage-calculator': { es: 'calculadora-de-hipoteca', pt: 'simulador-financiamento-imobiliario', fr: 'simulateur-pret-immobilier', de: 'baufinanzierungsrechner', it: 'calcolatrice-mutuo', nl: 'hypotheek-berekenen', pl: 'kalkulator-hipoteczny' },
  'compound-interest-calculator': { es: 'calculadora-interes-compuesto', pt: 'calculadora-juros-compostos', fr: 'calcul-interets-composes', de: 'zinseszinsrechner', it: 'calcolatrice-interesse-composto', nl: 'rente-op-rente-berekenen', pl: 'kalkulator-procentu-skladanego' },
  'simple-interest-calculator': { es: 'calculadora-interes-simple', pt: 'calculadora-juros-simples', fr: 'calcul-interet-simple', de: 'zinsrechner', it: 'calcolatrice-interesse-semplice', nl: 'enkelvoudige-rente-berekenen', pl: 'kalkulator-procentu-prostego' },
  'tip-calculator': { es: 'calculadora-de-propinas', pt: 'calculadora-de-gorjeta', fr: 'calcul-pourboire', de: 'trinkgeldrechner', it: 'calcolatrice-mancia', nl: 'fooi-berekenen', pl: 'kalkulator-napiwku' },
  'discount-calculator': { es: 'calculadora-de-descuentos', pt: 'calculadora-de-desconto', fr: 'calcul-reduction', de: 'rabattrechner', it: 'calcolatrice-sconto', nl: 'korting-berekenen', pl: 'kalkulator-rabatu' },
  'sales-tax-calculator': { es: 'calculadora-iva', pt: 'calculadora-de-impostos', fr: 'calcul-tva', de: 'mehrwertsteuerrechner', it: 'calcolatrice-iva', nl: 'btw-calculator', pl: 'kalkulator-vat' },
  'margin-markup-calculator': { es: 'calculadora-margen-de-beneficio', pt: 'calculadora-margem-de-lucro-markup', fr: 'calcul-marge-coefficient', de: 'margenrechner', it: 'calcolatrice-margine-di-profitto', nl: 'winstmarge-berekenen', pl: 'kalkulator-marzy' },
  'roi-calculator': { es: 'calculadora-roi', pt: 'calculadora-roi', fr: 'calcul-roi', de: 'roi-rechner', it: 'calcolatrice-roi', nl: 'roi-berekenen', pl: 'kalkulator-roi' },
  'break-even-calculator': { es: 'calculadora-punto-de-equilibrio', pt: 'calculadora-ponto-de-equilibrio', fr: 'calcul-seuil-de-rentabilite', de: 'break-even-rechner', it: 'calcolatrice-punto-di-pareggio', nl: 'break-evenpunt-berekenen', pl: 'kalkulator-progu-rentownosci' },
  'savings-goal-calculator': { es: 'calculadora-de-ahorro', pt: 'calculadora-meta-financeira', fr: 'calcul-epargne-mensuelle', de: 'sparrechner', it: 'calcolatrice-obiettivo-di-risparmio', nl: 'spaardoel-berekenen', pl: 'kalkulator-celu-oszczednosciowego' },
  'salary-to-hourly-calculator': { es: 'calculadora-salario-por-hora', pt: 'calculadora-salario-por-hora', fr: 'calcul-taux-horaire', de: 'stundenlohn-rechner', it: 'calcolatrice-stipendio-orario', nl: 'uurloon-berekenen', pl: 'kalkulator-stawki-godzinowej' },
  'inflation-calculator': { es: 'calculadora-de-inflacion', pt: 'calculadora-de-inflacao', fr: 'calcul-inflation', de: 'inflationsrechner', it: 'calcolatrice-inflazione', nl: 'inflatie-berekenen', pl: 'kalkulator-inflacji' },
  // Text
  'word-counter': { es: 'contador-de-palabras', pt: 'contador-de-palavras', fr: 'compteur-de-mots', de: 'woerter-zaehlen', it: 'contatore-di-parole', nl: 'woorden-tellen', pl: 'licznik-slow' },
  'case-converter': { es: 'convertir-mayusculas-minusculas', pt: 'converter-maiusculas-minusculas', fr: 'convertir-majuscules-minuscules', de: 'gross-kleinschreibung-umwandeln', it: 'convertire-maiuscole-minuscole', nl: 'hoofdletters-kleine-letters-omzetten', pl: 'zamiana-wielkich-i-malych-liter' },
  'remove-duplicate-lines': { es: 'eliminar-lineas-duplicadas', pt: 'remover-linhas-duplicadas', fr: 'supprimer-lignes-en-double', de: 'doppelte-zeilen-entfernen', it: 'rimuovere-righe-duplicate', nl: 'dubbele-regels-verwijderen', pl: 'usuwanie-duplikatow-linii' },
  'sort-text-lines': { es: 'ordenar-alfabeticamente', pt: 'colocar-em-ordem-alfabetica', fr: 'trier-par-ordre-alphabetique', de: 'alphabetisch-sortieren', it: 'ordinare-alfabeticamente', nl: 'alfabetisch-sorteren', pl: 'sortowanie-alfabetyczne' },
  'find-and-replace': { es: 'buscar-y-reemplazar', pt: 'localizar-e-substituir', fr: 'rechercher-et-remplacer', de: 'suchen-und-ersetzen', it: 'trova-e-sostituisci', nl: 'zoeken-en-vervangen', pl: 'znajdz-i-zamien' },
  'text-diff-checker': { es: 'comparar-textos', pt: 'comparar-textos', fr: 'comparer-deux-textes', de: 'texte-vergleichen', it: 'confrontare-testi', nl: 'teksten-vergelijken', pl: 'porownywanie-tekstow' },
  'lorem-ipsum-generator': { es: 'generador-lorem-ipsum', pt: 'gerador-lorem-ipsum', fr: 'generateur-lorem-ipsum', de: 'lorem-ipsum-generator', it: 'generatore-lorem-ipsum', nl: 'lorem-ipsum-generator', pl: 'generator-lorem-ipsum' },
  'slug-generator': { es: 'generador-de-slug', pt: 'gerador-de-slug', fr: 'generateur-de-slug', de: 'slug-generator', it: 'generatore-di-slug', nl: 'slug-generator', pl: 'generator-slugow' },
  'word-frequency-counter': { es: 'densidad-de-palabras-clave', pt: 'densidade-de-palavras-chave', fr: 'densite-mots-cles', de: 'keyword-dichte-pruefen', it: 'densita-parole-chiave', nl: 'keyword-dichtheid-controleren', pl: 'gestosc-slow-kluczowych' },
  'remove-line-breaks': { es: 'quitar-saltos-de-linea', pt: 'remover-quebras-de-linha', fr: 'supprimer-sauts-de-ligne', de: 'zeilenumbrueche-entfernen', it: 'rimuovere-interruzioni-di-riga', nl: 'regeleinden-verwijderen', pl: 'usuwanie-znakow-nowej-linii' },
  'reverse-text': { es: 'invertir-texto', pt: 'inverter-texto', fr: 'inverser-texte', de: 'text-umkehren', it: 'invertire-testo', nl: 'tekst-omkeren', pl: 'odwracanie-tekstu' },
  // Date & time
  'date-difference-calculator': { es: 'calcular-dias-entre-fechas', pt: 'calcular-dias-entre-datas', fr: 'calcul-jours-entre-deux-dates', de: 'tage-zwischen-zwei-daten', it: 'calcolare-giorni-tra-due-date', nl: 'dagen-tussen-twee-datums-berekenen', pl: 'obliczanie-dni-miedzy-datami' },
  'date-add-subtract': { es: 'sumar-dias-a-una-fecha', pt: 'somar-dias-a-uma-data', fr: 'ajouter-jours-a-une-date', de: 'datum-plus-tage', it: 'sommare-giorni-a-una-data', nl: 'dagen-optellen-bij-datum', pl: 'dodawanie-dni-do-daty' },
  'time-duration-calculator': { es: 'calculadora-de-horas', pt: 'calculadora-de-horas', fr: 'calcul-heures-travaillees', de: 'arbeitszeitrechner', it: 'calcolatrice-ore-lavorate', nl: 'gewerkte-uren-berekenen', pl: 'kalkulator-czasu-pracy' },
  'working-days-calculator': { es: 'calculadora-dias-habiles', pt: 'calculadora-dias-uteis', fr: 'calcul-jours-ouvres', de: 'arbeitstage-rechner', it: 'calcolatrice-giorni-lavorativi', nl: 'werkdagen-berekenen', pl: 'kalkulator-dni-roboczych' },
  'countdown-timer': { es: 'cuenta-regresiva', pt: 'contagem-regressiva', fr: 'compte-a-rebours', de: 'countdown-timer', it: 'conto-alla-rovescia', nl: 'countdown-timer', pl: 'odliczanie-czasu' },
  'timestamp-converter': { es: 'convertidor-timestamp-unix', pt: 'conversor-timestamp-unix', fr: 'convertisseur-timestamp-unix', de: 'unix-timestamp-umrechnen', it: 'convertitore-timestamp-unix', nl: 'unix-timestamp-omzetten', pl: 'konwerter-znacznika-czasu-unix' },
  // Health
  'bmi-calculator': { es: 'calculadora-imc', pt: 'calculadora-imc', fr: 'calcul-imc', de: 'bmi-rechner', it: 'calcolatrice-imc', nl: 'bmi-calculator', pl: 'kalkulator-bmi' },
  'calorie-calculator': { es: 'calculadora-de-calorias', pt: 'calculadora-de-calorias', fr: 'calcul-besoins-caloriques', de: 'kalorienbedarf-rechner', it: 'calcolatrice-calorie', nl: 'caloriebehoefte-berekenen', pl: 'kalkulator-zapotrzebowania-kalorycznego' },
  'ideal-weight-calculator': { es: 'calculadora-peso-ideal', pt: 'calculadora-peso-ideal', fr: 'calcul-poids-ideal', de: 'idealgewicht-rechner', it: 'calcolatrice-peso-ideale', nl: 'ideaal-gewicht-berekenen', pl: 'kalkulator-wagi-idealnej' },
  'body-fat-calculator': { es: 'calculadora-grasa-corporal', pt: 'calculadora-gordura-corporal', fr: 'calcul-masse-grasse', de: 'koerperfettrechner', it: 'calcolatrice-massa-grassa', nl: 'lichaamsvetpercentage-berekenen', pl: 'kalkulator-tkanki-tluszczowej' },
  'water-intake-calculator': { es: 'cuanta-agua-tomar-al-dia', pt: 'quanta-agua-beber-por-dia', fr: 'combien-d-eau-boire-par-jour', de: 'wasserbedarf-rechner', it: 'quanta-acqua-bere-al-giorno', nl: 'hoeveel-water-per-dag-drinken', pl: 'ile-wody-pic-dziennie' },
  'macro-calculator': { es: 'calculadora-de-macros', pt: 'calculadora-de-macros', fr: 'calcul-macros', de: 'makro-rechner', it: 'calcolatrice-macro', nl: 'macros-berekenen', pl: 'kalkulator-makroskladnikow' },
  'pregnancy-due-date-calculator': { es: 'calculadora-fecha-de-parto', pt: 'calculadora-de-gravidez', fr: 'calcul-date-accouchement', de: 'geburtstermin-rechner', it: 'calcolatrice-data-parto', nl: 'uitgerekende-datum-berekenen', pl: 'kalkulator-terminu-porodu' },
  // SEO
  'low-competition-keyword-finder': { es: 'palabras-clave-poca-competencia', pt: 'palavras-chave-baixa-concorrencia', fr: 'mots-cles-faible-concurrence', de: 'keywords-wenig-konkurrenz', it: 'parole-chiave-poca-concorrenza', nl: 'zoekwoorden-lage-concurrentie', pl: 'slowa-kluczowe-niska-konkurencja' },
  'long-tail-keyword-generator': { es: 'generador-palabras-clave-long-tail', pt: 'gerador-palavras-chave-cauda-longa', fr: 'generateur-mots-cles-longue-traine', de: 'longtail-keyword-generator', it: 'generatore-parole-chiave-long-tail', nl: 'long-tail-zoekwoorden-generator', pl: 'generator-fraz-long-tail' },
  'keyword-clustering-tool': { es: 'agrupar-palabras-clave', pt: 'agrupar-palavras-chave', fr: 'regrouper-mots-cles', de: 'keyword-clustering', it: 'raggruppare-parole-chiave', nl: 'zoekwoorden-clusteren', pl: 'grupowanie-slow-kluczowych' },
  'search-intent-classifier': { es: 'intencion-de-busqueda', pt: 'intencao-de-busca', fr: 'intention-de-recherche', de: 'suchintention-bestimmen', it: 'intento-di-ricerca', nl: 'zoekintentie-bepalen', pl: 'intencja-wyszukiwania' },
  'seo-content-brief-generator': { es: 'generador-brief-seo', pt: 'gerador-briefing-seo', fr: 'generateur-brief-seo', de: 'seo-briefing-generator', it: 'generatore-brief-seo', nl: 'seo-briefing-generator', pl: 'generator-briefu-seo' },
  'keyword-cannibalization-checker': { es: 'canibalizacion-palabras-clave', pt: 'canibalizacao-palavras-chave', fr: 'cannibalisation-mots-cles', de: 'keyword-kannibalisierung', it: 'cannibalizzazione-parole-chiave', nl: 'keyword-kannibalisatie-controleren', pl: 'kanibalizacja-slow-kluczowych' },
  'seo-title-meta-checker': { es: 'comprobar-title-y-meta-description', pt: 'verificar-title-e-meta-description', fr: 'verifier-title-meta-description', de: 'title-und-meta-description-pruefen', it: 'verifica-title-e-meta-description', nl: 'title-en-meta-description-controleren', pl: 'sprawdzanie-title-i-meta-description' },
};
