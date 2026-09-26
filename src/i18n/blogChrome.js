/**
 * Interface copy for the blog pages in each blog language (see BLOG_SEGMENTS
 * in locales.js). Small and needed on first paint, so it is not lazy-loaded.
 */
export const BLOG_CHROME = {
  en: {
    home: 'Home',
    blog: 'Blog',
    by: 'By',
    minRead: 'min read',
    moreGuides: 'More guides',
    readGuide: 'Read this guide →',
    backToAll: '← Read more articles',
    browseTools: 'Browse free online tools',
    notFoundTitle: 'Article not available',
    notFoundBody: 'This post may have been moved or removed.',
    guidesForTool: 'Guides for this tool',
  },
  de: {
    home: 'Start',
    blog: 'Ratgeber',
    by: 'Von',
    minRead: 'Min. Lesezeit',
    moreGuides: 'Weitere Ratgeber',
    readGuide: 'Ratgeber lesen →',
    backToAll: '← Alle Ratgeber',
    browseTools: 'Kostenlose Online-Tools ansehen',
    notFoundTitle: 'Artikel nicht verfügbar',
    notFoundBody: 'Dieser Beitrag wurde verschoben oder entfernt.',
    guidesForTool: 'Ratgeber zu diesem Tool',
    indexTitle: 'Ratgeber: Rechner und Formeln verständlich erklärt',
    indexDescription: 'Ratgeber von Talk & Tool: Wörter und Zeichen zählen, Geburtstermin und SSW berechnen, Zinsen, Mehrwertsteuer und SEO, Schritt für Schritt mit Beispielen.',
    indexHeading: 'Ratgeber',
    indexIntro: 'Schritt-für-Schritt-Anleitungen zu den Rechnern und Tools auf Talk & Tool: die Formel, ein durchgerechnetes Beispiel und die typischen Fehler, jeweils mit dem passenden kostenlosen Tool.',
    empty: 'Hier erscheinen bald die ersten Ratgeber.',
  },
  es: {
    home: 'Inicio',
    blog: 'Guías',
    by: 'Por',
    minRead: 'min de lectura',
    moreGuides: 'Más guías',
    readGuide: 'Leer la guía →',
    backToAll: '← Todas las guías',
    browseTools: 'Ver herramientas online gratis',
    notFoundTitle: 'Artículo no disponible',
    notFoundBody: 'Es posible que este artículo se haya movido o eliminado.',
    guidesForTool: 'Guías sobre esta herramienta',
    indexTitle: 'Guías: calculadoras y fórmulas explicadas paso a paso',
    indexDescription: 'Guías de Talk & Tool: fecha de parto, cuota de un préstamo, IVA, días hábiles y metabolismo basal, explicados paso a paso con ejemplos y calculadoras gratis.',
    indexHeading: 'Guías',
    indexIntro: 'Guías paso a paso sobre las calculadoras y herramientas de Talk & Tool: la fórmula, un ejemplo resuelto y los errores más comunes, siempre con la herramienta gratis para comprobar el resultado.',
    empty: 'Muy pronto publicaremos aquí las primeras guías.',
  },
};

export const blogChrome = (lang) => BLOG_CHROME[lang] || BLOG_CHROME.en;
