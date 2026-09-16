/**
 * German locale behaviour for the interactive tools.
 *
 * The German page copy is translated in `content/de.js`. Tool labels that do
 * not yet have a German entry deliberately fall back to their readable
 * English source text through `useT`, instead of preventing every production
 * build or borrowing strings from another language.
 */
export const extras = {
  stopWords: [
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einem',
    'einen', 'eines', 'und', 'oder', 'aber', 'in', 'im', 'am', 'an', 'auf',
    'aus', 'bei', 'bis', 'durch', 'für', 'gegen', 'mit', 'nach', 'ohne', 'seit',
    'über', 'um', 'unter', 'von', 'vor', 'zu', 'zum', 'zur', 'ist', 'sind',
    'sein', 'war', 'waren', 'wird', 'werden', 'hat', 'haben', 'ich', 'du', 'er',
    'sie', 'es', 'wir', 'ihr', 'nicht', 'kein', 'keine', 'auch', 'als', 'dass',
    'wenn', 'wie', 'was', 'wer', 'wo', 'warum', 'mehr', 'weniger', 'sehr',
  ],
  salesTax: { rate: '19', presets: [19, 7] },
  tip: { percent: 10, presets: [5, 10, 15] },
  salary: { mode: 'monthly', amount: '4000', hours: '40' },
  glassMl: 250,
};

// An empty dictionary activates the built-in English source-text fallback.
export default {};
