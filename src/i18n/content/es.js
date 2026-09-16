/**
 * Spanish page copy for the tool catalogue: page chrome, the /es directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for Spanish speakers in Spain and Latin America rather than
 * translated from English — the keywords, examples, tax rates, and currency
 * references are the ones people there actually search for and use.
 */
import { developerTools } from './es/developer.js';
import { calculatorTools } from './es/calculators.js';
import { financeTools } from './es/finance.js';
import { textTools } from './es/text.js';
import { datetimeTools } from './es/datetime.js';
import { healthTools } from './es/health.js';
import { seoTools } from './es/seo.js';

export default {
  chrome: {
    home: 'Inicio',
    tools: 'Herramientas',
    breadcrumb: 'Ruta de navegación',
    toolRegion: 'Herramienta: {name}',
    privacy: 'Todo se calcula en tu navegador. Lo que escribes no se envía a ningún servidor.',
    about: '{name}: para qué sirve',
    howTo: '{name}: cómo se usa',
    formula: 'La fórmula que utiliza',
    faq: 'Preguntas frecuentes',
    related: 'Herramientas relacionadas',
    browseAll: 'Ver todas las herramientas →',
    alsoAvailable: 'También disponible en:',
    openTool: 'Abrir herramienta',
    notFoundTitle: 'Herramienta no encontrada',
    notFoundBody: 'Esa dirección no corresponde a ninguna herramienta. Consulta el directorio completo para encontrar la que buscas.',
  },
  categories: {
    Calculator: { name: 'Calculadoras', blurb: 'Matemáticas del día a día: porcentajes, medias, regla de tres, fracciones, edad y conversión de unidades.' },
    Finance: { name: 'Finanzas', blurb: 'Préstamos, hipotecas, intereses, IVA, márgenes y las cuentas que hay detrás de un pequeño negocio.' },
    Health: { name: 'Salud', blurb: 'IMC, calorías, macros, grasa corporal, hidratación y fecha de parto, con los límites de cada método explicados con claridad.' },
    Developer: { name: 'Desarrollo', blurb: 'JSON, Base64, JWT, regex, hashes, colores, CSS y las tablas de referencia que siempre vuelves a buscar.' },
    Security: { name: 'Seguridad', blurb: 'Genera y evalúa contraseñas, y valida tarjetas y correos sin que nada salga de tu navegador.' },
    Text: { name: 'Texto', blurb: 'Cuenta palabras, cambia mayúsculas, ordena, elimina duplicados, compara y limpia textos antes de publicarlos.' },
    'Date & Time': { name: 'Fechas y horas', blurb: 'Días entre fechas, plazos, días hábiles, horas trabajadas, cuentas regresivas y timestamps Unix.' },
    SEO: { name: 'SEO', blurb: 'Palabras clave, long tail, planificación de contenidos y agrupación temática con métodos transparentes.' },
  },
  hub: {
    title: 'Herramientas online gratis: calculadoras y conversores',
    description: 'Calculadoras, conversores y utilidades online gratis en español: porcentajes, IVA, regla de tres, préstamos, IMC, contador de palabras y más. Sin registro.',
    heading: 'Herramientas online gratis que funcionan al instante',
    body: 'Calculadoras, conversores, utilidades de texto y herramientas para desarrolladores. Sin instalar nada, sin registrarte y sin que tus datos salgan de tu navegador.',
    badge: '{n} herramientas, todas gratis',
    searchLabel: 'Buscar herramientas',
    searchPlaceholder: 'Busca: porcentaje, IVA, regla de tres, IMC, JSON…',
    shown: '{shown} de {total} herramientas',
    empty: 'Ninguna herramienta coincide con «{q}». Prueba con un término más general.',
    paragraphs: [
      ['Herramientas útiles sin descargas ni registros', 'Talk & Tool reúne las pequeñas utilidades que se buscan a diario —un porcentaje, la cuota de un préstamo, el IVA de una factura, un recuento de palabras o un JSON que no valida— con una interfaz coherente. Cada herramienta se abre al instante, funciona en el móvil y explica el método que hay detrás del resultado en lugar de limitarse a mostrar un número.'],
      ['Adaptadas a tu idioma y a tu país', 'Las herramientas usan el formato numérico de tu país, los tipos de IVA de España y Latinoamérica, el euro o tu moneda local y ejemplos cercanos como la regla de tres o las pagas extra. Todo se calcula en tu navegador, así que lo que escribes nunca se envía a un servidor.'],
    ],
    faqs: [
      { q: '¿Las herramientas son realmente gratis?', a: 'Sí. Todas son gratuitas, sin cuenta, sin periodo de prueba y sin límite de uso. El sitio se financia con publicidad, no cobrando por las herramientas.' },
      { q: '¿Se envían mis datos a algún servidor?', a: 'No. Las calculadoras, los conversores y las utilidades de texto se ejecutan por completo en tu navegador. Los textos que pegas y los números que escribes no salen de tu dispositivo.' },
      { q: '¿Funcionan en el móvil?', a: 'Sí. Todas las herramientas se adaptan a cualquier pantalla y funcionan en cualquier navegador moderno de móvil u ordenador. No hay que instalar nada.' },
      { q: '¿Puedo usar los resultados en mi trabajo?', a: 'Sí, en trabajos personales, académicos o comerciales. Las calculadoras son orientativas y no sustituyen el asesoramiento financiero, médico o legal de un profesional.' },
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
