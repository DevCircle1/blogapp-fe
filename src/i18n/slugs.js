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
  'json-studio': { es: 'formatear-json', pt: 'formatar-json', fr: 'formater-json', de: 'json-formatieren' },
  'base64-tool': { es: 'codificar-decodificar-base64', pt: 'codificar-decodificar-base64', fr: 'encoder-decoder-base64', de: 'base64-kodieren-dekodieren' },
  'url-encoder': { es: 'codificar-decodificar-url', pt: 'codificar-decodificar-url', fr: 'encoder-decoder-url', de: 'url-kodieren-dekodieren' },
  'jwt-inspector': { es: 'decodificar-jwt', pt: 'decodificar-jwt', fr: 'decoder-jwt', de: 'jwt-dekodieren' },
  'uuid-generator': { es: 'generador-uuid', pt: 'gerador-uuid', fr: 'generateur-uuid', de: 'uuid-generator' },
  'regex-tester': { es: 'probador-regex', pt: 'testador-regex', fr: 'testeur-regex', de: 'regex-tester' },
  'hash-generator': { es: 'generador-hash-sha256', pt: 'gerador-hash-sha256', fr: 'generateur-hash-sha256', de: 'sha256-hash-generator' },
  'html-encoder': { es: 'codificar-entidades-html', pt: 'codificar-entidades-html', fr: 'encoder-entites-html', de: 'html-sonderzeichen-umwandeln' },
  'csv-to-json': { es: 'convertir-csv-a-json', pt: 'converter-csv-para-json', fr: 'convertir-csv-en-json', de: 'csv-in-json-umwandeln' },
  'json-to-csv': { es: 'convertir-json-a-csv', pt: 'converter-json-para-csv', fr: 'convertir-json-en-csv', de: 'json-in-csv-umwandeln' },
  'markdown-to-html': { es: 'convertir-markdown-a-html', pt: 'converter-markdown-para-html', fr: 'convertir-markdown-en-html', de: 'markdown-in-html-umwandeln' },
  'color-converter': { es: 'convertir-hex-a-rgb', pt: 'converter-hex-para-rgb', fr: 'convertir-hex-en-rgb', de: 'hex-in-rgb-umrechnen' },
  'css-gradient-generator': { es: 'generador-degradado-css', pt: 'gerador-gradiente-css', fr: 'generateur-degrade-css', de: 'css-farbverlauf-generator' },
  'box-shadow-generator': { es: 'generador-sombras-css', pt: 'gerador-sombra-css', fr: 'generateur-ombre-css', de: 'css-schatten-generator' },
  'http-status-codes': { es: 'codigos-de-estado-http', pt: 'codigos-de-status-http', fr: 'codes-de-statut-http', de: 'http-statuscodes' },
  'meta-tag-generator': { es: 'generador-meta-tags', pt: 'gerador-meta-tags', fr: 'generateur-balises-meta', de: 'meta-tags-generator' },
  'robots-txt-generator': { es: 'generador-robots-txt', pt: 'gerador-robots-txt', fr: 'generateur-robots-txt', de: 'robots-txt-generator' },
  'user-agent-parser': { es: 'analizador-user-agent', pt: 'analisador-user-agent', fr: 'analyseur-user-agent', de: 'user-agent-analysieren' },
  // Security
  'password-generator': { es: 'generador-de-contrasenas', pt: 'gerador-de-senhas', fr: 'generateur-mot-de-passe', de: 'passwort-generator' },
  'password-strength-checker': { es: 'comprobar-seguridad-contrasena', pt: 'testar-forca-da-senha', fr: 'tester-mot-de-passe', de: 'passwortstaerke-pruefen' },
  'credit-card-validator': { es: 'validar-tarjeta-de-credito', pt: 'validar-cartao-de-credito', fr: 'verifier-numero-carte-bancaire', de: 'kreditkartennummer-pruefen' },
  'email-validator': { es: 'validar-correo-electronico', pt: 'validar-email', fr: 'verifier-adresse-email', de: 'email-adressen-pruefen' },
  // Calculators
  'percentage-calculator': { es: 'calculadora-de-porcentajes', pt: 'calculadora-de-porcentagem', fr: 'calcul-pourcentage', de: 'prozentrechner' },
  'average-calculator': { es: 'calculadora-media-mediana-moda', pt: 'calculadora-media-mediana-moda', fr: 'calcul-moyenne-mediane', de: 'durchschnitt-berechnen' },
  'fraction-calculator': { es: 'calculadora-de-fracciones', pt: 'calculadora-de-fracoes', fr: 'calculatrice-fractions', de: 'bruchrechner' },
  'ratio-calculator': { es: 'calculadora-regla-de-tres', pt: 'calculadora-regra-de-tres', fr: 'calcul-produit-en-croix', de: 'dreisatz-rechner' },
  'number-base-converter': { es: 'conversor-binario-decimal-hexadecimal', pt: 'conversor-binario-decimal-hexadecimal', fr: 'convertisseur-binaire-decimal-hexadecimal', de: 'zahlensysteme-umrechnen' },
  'roman-numeral-converter': { es: 'convertidor-numeros-romanos', pt: 'conversor-numeros-romanos', fr: 'convertisseur-chiffres-romains', de: 'roemische-zahlen-umrechnen' },
  'gpa-calculator': { es: 'calculadora-gpa', pt: 'calculadora-gpa', fr: 'calcul-gpa', de: 'gpa-rechner' },
  'random-number-generator': { es: 'generador-numeros-aleatorios', pt: 'gerador-de-numeros-aleatorios', fr: 'generateur-nombre-aleatoire', de: 'zufallszahlen-generator' },
  'unit-converter': { es: 'conversor-de-unidades', pt: 'conversor-de-unidades', fr: 'convertisseur-unites', de: 'einheiten-umrechnen' },
  'age-calculator': { es: 'calculadora-de-edad', pt: 'calculadora-de-idade', fr: 'calcul-age', de: 'altersrechner' },
  // Finance
  'loan-calculator': { es: 'calculadora-de-prestamos', pt: 'simulador-de-emprestimo', fr: 'simulateur-pret', de: 'kreditrechner' },
  'mortgage-calculator': { es: 'calculadora-de-hipoteca', pt: 'simulador-financiamento-imobiliario', fr: 'simulateur-pret-immobilier', de: 'baufinanzierungsrechner' },
  'compound-interest-calculator': { es: 'calculadora-interes-compuesto', pt: 'calculadora-juros-compostos', fr: 'calcul-interets-composes', de: 'zinseszinsrechner' },
  'simple-interest-calculator': { es: 'calculadora-interes-simple', pt: 'calculadora-juros-simples', fr: 'calcul-interet-simple', de: 'zinsrechner' },
  'tip-calculator': { es: 'calculadora-de-propinas', pt: 'calculadora-de-gorjeta', fr: 'calcul-pourboire', de: 'trinkgeldrechner' },
  'discount-calculator': { es: 'calculadora-de-descuentos', pt: 'calculadora-de-desconto', fr: 'calcul-reduction', de: 'rabattrechner' },
  'sales-tax-calculator': { es: 'calculadora-iva', pt: 'calculadora-de-impostos', fr: 'calcul-tva', de: 'mehrwertsteuerrechner' },
  'margin-markup-calculator': { es: 'calculadora-margen-de-beneficio', pt: 'calculadora-margem-de-lucro-markup', fr: 'calcul-marge-coefficient', de: 'margenrechner' },
  'roi-calculator': { es: 'calculadora-roi', pt: 'calculadora-roi', fr: 'calcul-roi', de: 'roi-rechner' },
  'break-even-calculator': { es: 'calculadora-punto-de-equilibrio', pt: 'calculadora-ponto-de-equilibrio', fr: 'calcul-seuil-de-rentabilite', de: 'break-even-rechner' },
  'savings-goal-calculator': { es: 'calculadora-de-ahorro', pt: 'calculadora-meta-financeira', fr: 'calcul-epargne-mensuelle', de: 'sparrechner' },
  'salary-to-hourly-calculator': { es: 'calculadora-salario-por-hora', pt: 'calculadora-salario-por-hora', fr: 'calcul-taux-horaire', de: 'stundenlohn-rechner' },
  'inflation-calculator': { es: 'calculadora-de-inflacion', pt: 'calculadora-de-inflacao', fr: 'calcul-inflation', de: 'inflationsrechner' },
  // Text
  'word-counter': { es: 'contador-de-palabras', pt: 'contador-de-palavras', fr: 'compteur-de-mots', de: 'woerter-zaehlen' },
  'case-converter': { es: 'convertir-mayusculas-minusculas', pt: 'converter-maiusculas-minusculas', fr: 'convertir-majuscules-minuscules', de: 'gross-kleinschreibung-umwandeln' },
  'remove-duplicate-lines': { es: 'eliminar-lineas-duplicadas', pt: 'remover-linhas-duplicadas', fr: 'supprimer-lignes-en-double', de: 'doppelte-zeilen-entfernen' },
  'sort-text-lines': { es: 'ordenar-alfabeticamente', pt: 'colocar-em-ordem-alfabetica', fr: 'trier-par-ordre-alphabetique', de: 'alphabetisch-sortieren' },
  'find-and-replace': { es: 'buscar-y-reemplazar', pt: 'localizar-e-substituir', fr: 'rechercher-et-remplacer', de: 'suchen-und-ersetzen' },
  'text-diff-checker': { es: 'comparar-textos', pt: 'comparar-textos', fr: 'comparer-deux-textes', de: 'texte-vergleichen' },
  'lorem-ipsum-generator': { es: 'generador-lorem-ipsum', pt: 'gerador-lorem-ipsum', fr: 'generateur-lorem-ipsum', de: 'lorem-ipsum-generator' },
  'slug-generator': { es: 'generador-de-slug', pt: 'gerador-de-slug', fr: 'generateur-de-slug', de: 'slug-generator' },
  'word-frequency-counter': { es: 'densidad-de-palabras-clave', pt: 'densidade-de-palavras-chave', fr: 'densite-mots-cles', de: 'keyword-dichte-pruefen' },
  'remove-line-breaks': { es: 'quitar-saltos-de-linea', pt: 'remover-quebras-de-linha', fr: 'supprimer-sauts-de-ligne', de: 'zeilenumbrueche-entfernen' },
  'reverse-text': { es: 'invertir-texto', pt: 'inverter-texto', fr: 'inverser-texte', de: 'text-umkehren' },
  // Date & time
  'date-difference-calculator': { es: 'calcular-dias-entre-fechas', pt: 'calcular-dias-entre-datas', fr: 'calcul-jours-entre-deux-dates', de: 'tage-zwischen-zwei-daten' },
  'date-add-subtract': { es: 'sumar-dias-a-una-fecha', pt: 'somar-dias-a-uma-data', fr: 'ajouter-jours-a-une-date', de: 'datum-plus-tage' },
  'time-duration-calculator': { es: 'calculadora-de-horas', pt: 'calculadora-de-horas', fr: 'calcul-heures-travaillees', de: 'arbeitszeitrechner' },
  'working-days-calculator': { es: 'calculadora-dias-habiles', pt: 'calculadora-dias-uteis', fr: 'calcul-jours-ouvres', de: 'arbeitstage-rechner' },
  'countdown-timer': { es: 'cuenta-regresiva', pt: 'contagem-regressiva', fr: 'compte-a-rebours', de: 'countdown-timer' },
  'timestamp-converter': { es: 'convertidor-timestamp-unix', pt: 'conversor-timestamp-unix', fr: 'convertisseur-timestamp-unix', de: 'unix-timestamp-umrechnen' },
  // Health
  'bmi-calculator': { es: 'calculadora-imc', pt: 'calculadora-imc', fr: 'calcul-imc', de: 'bmi-rechner' },
  'calorie-calculator': { es: 'calculadora-de-calorias', pt: 'calculadora-de-calorias', fr: 'calcul-besoins-caloriques', de: 'kalorienbedarf-rechner' },
  'ideal-weight-calculator': { es: 'calculadora-peso-ideal', pt: 'calculadora-peso-ideal', fr: 'calcul-poids-ideal', de: 'idealgewicht-rechner' },
  'body-fat-calculator': { es: 'calculadora-grasa-corporal', pt: 'calculadora-gordura-corporal', fr: 'calcul-masse-grasse', de: 'koerperfettrechner' },
  'water-intake-calculator': { es: 'cuanta-agua-tomar-al-dia', pt: 'quanta-agua-beber-por-dia', fr: 'combien-d-eau-boire-par-jour', de: 'wasserbedarf-rechner' },
  'macro-calculator': { es: 'calculadora-de-macros', pt: 'calculadora-de-macros', fr: 'calcul-macros', de: 'makro-rechner' },
  'pregnancy-due-date-calculator': { es: 'calculadora-fecha-de-parto', pt: 'calculadora-de-gravidez', fr: 'calcul-date-accouchement', de: 'geburtstermin-rechner' },
  // SEO
  'low-competition-keyword-finder': { es: 'palabras-clave-poca-competencia', pt: 'palavras-chave-baixa-concorrencia', fr: 'mots-cles-faible-concurrence', de: 'keywords-wenig-konkurrenz' },
  'long-tail-keyword-generator': { es: 'generador-palabras-clave-long-tail', pt: 'gerador-palavras-chave-cauda-longa', fr: 'generateur-mots-cles-longue-traine', de: 'longtail-keyword-generator' },
  'keyword-clustering-tool': { es: 'agrupar-palabras-clave', pt: 'agrupar-palavras-chave', fr: 'regrouper-mots-cles', de: 'keyword-clustering' },
  'search-intent-classifier': { es: 'intencion-de-busqueda', pt: 'intencao-de-busca', fr: 'intention-de-recherche', de: 'suchintention-bestimmen' },
  'seo-content-brief-generator': { es: 'generador-brief-seo', pt: 'gerador-briefing-seo', fr: 'generateur-brief-seo', de: 'seo-briefing-generator' },
  'keyword-cannibalization-checker': { es: 'canibalizacion-palabras-clave', pt: 'canibalizacao-palavras-chave', fr: 'cannibalisation-mots-cles', de: 'keyword-kannibalisierung' },
  'seo-title-meta-checker': { es: 'comprobar-title-y-meta-description', pt: 'verificar-title-e-meta-description', fr: 'verifier-title-meta-description', de: 'title-und-meta-description-pruefen' },
};
