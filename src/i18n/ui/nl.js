/**
 * Dutch locale behaviour for the tool interfaces.
 *
 * UI labels that are not present in this dictionary intentionally fall back
 * to their readable English source text in useT(). This keeps the Dutch
 * catalogue available while its full tool-interface translation is prepared.
 */
export const extras = {
  stopWords: [
    'aan', 'als', 'bij', 'dat', 'de', 'den', 'der', 'des', 'dit', 'die',
    'een', 'en', 'er', 'het', 'hoe', 'hun', 'ik', 'in', 'is', 'je', 'met',
    'naar', 'niet', 'of', 'om', 'onze', 'ook', 'op', 'over', 'te', 'tot',
    'uit', 'van', 'voor', 'wat', 'we', 'wel', 'wie', 'wij', 'worden', 'ze',
    'zij', 'zijn', 'zo', 'zonder',
  ],
  salesTax: { rate: '21', presets: [21, 9] },
  tip: { percent: 10, presets: [5, 10, 15] },
  salary: { mode: 'monthly', amount: '3500', hours: '40' },
  glassMl: 250,
};

export default {};
