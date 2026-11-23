/**
 * Hand-curated "related tools" for the catalogue. Keyed by the English
 * (source) slug, valued as 4-6 other source slugs, ordered by relevance.
 *
 * This exists because automatic same-category matching produces bad
 * neighbours for tools whose category is broader than their topic — e.g.
 * "Health" holds both body-composition calculators and the pregnancy due
 * date calculator, which have nothing to do with each other. Curating the
 * list by hand keeps every related-tools block genuinely useful instead of
 * thin filler links.
 *
 * To add a new tool: add one line here with 4-6 slugs that a visitor to
 * that tool would plausibly want next. If a tool is left out of this map
 * (e.g. right after adding it), getRelatedTools() in toolCatalog.js falls
 * back to same-category/shared-tag matching so the section is never empty
 * — but a curated entry should follow soon after.
 */
export const RELATED_TOOLS = {
  // Calculator
  'percentage-calculator': ['ratio-calculator', 'fraction-calculator', 'average-calculator', 'discount-calculator', 'sales-tax-calculator', 'scientific-notation-converter', 'vat-calculator', 'gcf-lcm-calculator'],
  'average-calculator': ['percentage-calculator', 'fraction-calculator', 'ratio-calculator', 'gpa-calculator', 'random-number-generator', 'grade-calculator', 'gcf-lcm-calculator'],
  'fraction-calculator': ['percentage-calculator', 'ratio-calculator', 'average-calculator', 'unit-converter', 'scientific-notation-converter', 'gcf-lcm-calculator'],
  'ratio-calculator': ['fraction-calculator', 'percentage-calculator', 'unit-converter', 'average-calculator', 'area-calculator', 'gcf-lcm-calculator'],
  'number-base-converter': ['roman-numeral-converter', 'hash-generator', 'base64-tool', 'unit-converter', 'text-to-binary-converter', 'number-to-words-converter'],
  'roman-numeral-converter': ['number-base-converter', 'unit-converter', 'percentage-calculator', 'number-to-words-converter'],
  'gpa-calculator': ['average-calculator', 'percentage-calculator', 'age-calculator', 'grade-calculator'],
  'random-number-generator': ['uuid-generator', 'password-generator', 'average-calculator', 'cps-test', 'reaction-time-test'],
  'unit-converter': ['percentage-calculator', 'ratio-calculator', 'number-base-converter', 'fraction-calculator', 'height-converter'],
  'age-calculator': ['date-difference-calculator', 'countdown-timer', 'working-days-calculator', 'pregnancy-due-date-calculator', 'gpa-calculator', 'ovulation-calculator'],

  // Date & Time
  'date-difference-calculator': ['date-add-subtract', 'age-calculator', 'working-days-calculator', 'countdown-timer', 'pregnancy-due-date-calculator', 'week-number-calculator', 'time-zone-converter'],
  'date-add-subtract': ['date-difference-calculator', 'working-days-calculator', 'countdown-timer', 'timestamp-converter', 'week-number-calculator'],
  'time-duration-calculator': ['date-difference-calculator', 'timestamp-converter', 'countdown-timer', 'working-days-calculator', 'timesheet-hours-calculator', 'time-zone-converter'],
  'working-days-calculator': ['date-difference-calculator', 'date-add-subtract', 'time-duration-calculator', 'countdown-timer', 'timesheet-hours-calculator', 'week-number-calculator'],
  'countdown-timer': ['date-difference-calculator', 'date-add-subtract', 'timestamp-converter', 'pregnancy-due-date-calculator', 'time-zone-converter', 'week-number-calculator'],
  'timestamp-converter': ['date-difference-calculator', 'time-duration-calculator', 'date-add-subtract', 'time-zone-converter'],

  // Developer
  'json-studio': ['csv-to-json', 'json-to-csv', 'base64-tool', 'regex-tester'],
  'base64-tool': ['url-encoder', 'html-encoder', 'hash-generator', 'json-studio', 'text-to-binary-converter'],
  'url-encoder': ['base64-tool', 'html-encoder', 'slug-generator', 'robots-txt-generator'],
  'jwt-inspector': ['base64-tool', 'hash-generator', 'uuid-generator', 'password-strength-checker'],
  'uuid-generator': ['hash-generator', 'random-number-generator', 'jwt-inspector', 'password-generator'],
  'regex-tester': ['find-and-replace', 'text-diff-checker', 'json-studio', 'url-encoder'],
  'hash-generator': ['base64-tool', 'uuid-generator', 'jwt-inspector', 'password-strength-checker'],
  'html-encoder': ['url-encoder', 'base64-tool', 'markdown-to-html'],
  'csv-to-json': ['json-to-csv', 'json-studio', 'base64-tool'],
  'json-to-csv': ['csv-to-json', 'json-studio', 'base64-tool'],
  'markdown-to-html': ['html-encoder', 'csv-to-json', 'json-studio'],
  'color-converter': ['css-gradient-generator', 'box-shadow-generator', 'html-encoder'],
  'css-gradient-generator': ['color-converter', 'box-shadow-generator', 'html-encoder'],
  'box-shadow-generator': ['css-gradient-generator', 'color-converter', 'html-encoder'],
  'http-status-codes': ['user-agent-parser', 'robots-txt-generator', 'url-encoder'],
  'meta-tag-generator': ['seo-title-meta-checker', 'robots-txt-generator', 'http-status-codes', 'keyword-cannibalization-checker', 'hreflang-tag-generator'],
  'robots-txt-generator': ['meta-tag-generator', 'http-status-codes', 'url-encoder', 'user-agent-parser', 'hreflang-tag-generator'],
  'user-agent-parser': ['http-status-codes', 'robots-txt-generator', 'uuid-generator'],

  // Security
  'password-generator': ['password-strength-checker', 'uuid-generator', 'hash-generator', 'email-validator'],
  'password-strength-checker': ['password-generator', 'hash-generator', 'email-validator', 'jwt-inspector'],
  'credit-card-validator': ['email-validator', 'password-strength-checker', 'password-generator'],
  'email-validator': ['password-strength-checker', 'password-generator', 'credit-card-validator', 'regex-tester'],

  // Finance
  'loan-calculator': ['mortgage-calculator', 'compound-interest-calculator', 'simple-interest-calculator', 'savings-goal-calculator', 'credit-card-payoff-calculator'],
  'mortgage-calculator': ['loan-calculator', 'compound-interest-calculator', 'savings-goal-calculator', 'inflation-calculator'],
  'compound-interest-calculator': ['simple-interest-calculator', 'savings-goal-calculator', 'loan-calculator', 'inflation-calculator', 'credit-card-payoff-calculator'],
  'simple-interest-calculator': ['compound-interest-calculator', 'loan-calculator', 'savings-goal-calculator'],
  'tip-calculator': ['discount-calculator', 'sales-tax-calculator', 'percentage-calculator'],
  'discount-calculator': ['sales-tax-calculator', 'tip-calculator', 'margin-markup-calculator', 'percentage-calculator', 'vat-calculator'],
  'sales-tax-calculator': ['discount-calculator', 'margin-markup-calculator', 'tip-calculator', 'vat-calculator'],
  'margin-markup-calculator': ['discount-calculator', 'sales-tax-calculator', 'roi-calculator', 'break-even-calculator', 'vat-calculator'],
  'roi-calculator': ['break-even-calculator', 'margin-markup-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  'break-even-calculator': ['roi-calculator', 'margin-markup-calculator', 'savings-goal-calculator'],
  'savings-goal-calculator': ['compound-interest-calculator', 'simple-interest-calculator', 'inflation-calculator', 'loan-calculator', 'credit-card-payoff-calculator'],
  'salary-to-hourly-calculator': ['savings-goal-calculator', 'percentage-calculator', 'inflation-calculator', 'timesheet-hours-calculator'],
  'inflation-calculator': ['savings-goal-calculator', 'compound-interest-calculator', 'roi-calculator'],

  // Health — curated by topic, not just category, since "Health" spans
  // both body-composition tools and the unrelated pregnancy calculator.
  'bmi-calculator': ['ideal-weight-calculator', 'body-fat-calculator', 'calorie-calculator', 'macro-calculator', 'height-converter', 'sleep-calculator'],
  'calorie-calculator': ['macro-calculator', 'bmi-calculator', 'body-fat-calculator', 'water-intake-calculator', 'pace-calculator', 'sleep-calculator'],
  'ideal-weight-calculator': ['bmi-calculator', 'body-fat-calculator', 'calorie-calculator', 'water-intake-calculator'],
  'body-fat-calculator': ['bmi-calculator', 'ideal-weight-calculator', 'calorie-calculator', 'macro-calculator'],
  'water-intake-calculator': ['calorie-calculator', 'bmi-calculator', 'macro-calculator', 'pace-calculator', 'sleep-calculator'],
  'macro-calculator': ['calorie-calculator', 'bmi-calculator', 'body-fat-calculator', 'ideal-weight-calculator', 'water-intake-calculator'],
  'pregnancy-due-date-calculator': ['age-calculator', 'date-difference-calculator', 'countdown-timer', 'calorie-calculator', 'water-intake-calculator', 'ovulation-calculator'],

  // SEO
  'low-competition-keyword-finder': ['long-tail-keyword-generator', 'keyword-clustering-tool', 'search-intent-classifier', 'seo-content-brief-generator'],
  'long-tail-keyword-generator': ['low-competition-keyword-finder', 'keyword-clustering-tool', 'seo-content-brief-generator', 'search-intent-classifier'],
  'keyword-clustering-tool': ['keyword-cannibalization-checker', 'long-tail-keyword-generator', 'low-competition-keyword-finder', 'search-intent-classifier'],
  'search-intent-classifier': ['seo-content-brief-generator', 'keyword-clustering-tool', 'long-tail-keyword-generator'],
  'seo-content-brief-generator': ['search-intent-classifier', 'keyword-clustering-tool', 'long-tail-keyword-generator', 'seo-title-meta-checker'],
  'keyword-cannibalization-checker': ['keyword-clustering-tool', 'seo-content-brief-generator', 'low-competition-keyword-finder', 'seo-title-meta-checker'],
  'seo-title-meta-checker': ['meta-tag-generator', 'keyword-cannibalization-checker', 'seo-content-brief-generator', 'robots-txt-generator', 'readability-score-checker'],
  'readability-score-checker': ['word-counter', 'seo-content-brief-generator', 'word-frequency-counter', 'seo-title-meta-checker', 'search-intent-classifier', 'typing-speed-test'],
  'hreflang-tag-generator': ['meta-tag-generator', 'robots-txt-generator', 'seo-title-meta-checker', 'http-status-codes', 'keyword-cannibalization-checker'],

  // Text
  'word-counter': ['word-frequency-counter', 'case-converter', 'text-diff-checker', 'remove-line-breaks', 'readability-score-checker', 'typing-speed-test', 'fancy-text-generator'],
  'case-converter': ['word-counter', 'slug-generator', 'remove-line-breaks', 'find-and-replace', 'morse-code-translator', 'fancy-text-generator'],
  'remove-duplicate-lines': ['sort-text-lines', 'remove-line-breaks', 'find-and-replace', 'text-diff-checker'],
  'sort-text-lines': ['remove-duplicate-lines', 'remove-line-breaks', 'find-and-replace'],
  'find-and-replace': ['text-diff-checker', 'remove-duplicate-lines', 'case-converter', 'regex-tester'],
  'text-diff-checker': ['find-and-replace', 'remove-duplicate-lines', 'word-counter'],
  'lorem-ipsum-generator': ['word-counter', 'slug-generator', 'case-converter'],
  'slug-generator': ['case-converter', 'url-encoder', 'word-counter'],
  'word-frequency-counter': ['word-counter', 'text-diff-checker', 'case-converter'],
  'remove-line-breaks': ['remove-duplicate-lines', 'word-counter', 'case-converter'],
  'reverse-text': ['case-converter', 'word-counter', 'find-and-replace', 'morse-code-translator', 'fancy-text-generator'],

  // Added with the quick-win tools
  'grade-calculator': ['gpa-calculator', 'average-calculator', 'percentage-calculator', 'fraction-calculator'],
  'credit-card-payoff-calculator': ['loan-calculator', 'compound-interest-calculator', 'savings-goal-calculator', 'simple-interest-calculator', 'inflation-calculator'],
  'height-converter': ['unit-converter', 'bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator'],
  'text-to-binary-converter': ['number-base-converter', 'base64-tool', 'hash-generator', 'morse-code-translator', 'url-encoder'],
  'morse-code-translator': ['text-to-binary-converter', 'case-converter', 'reverse-text', 'word-counter', 'fancy-text-generator'],
  'timesheet-hours-calculator': ['time-duration-calculator', 'salary-to-hourly-calculator', 'working-days-calculator', 'date-difference-calculator'],
  'pace-calculator': ['calorie-calculator', 'bmi-calculator', 'time-duration-calculator', 'unit-converter', 'water-intake-calculator'],
  'ovulation-calculator': ['pregnancy-due-date-calculator', 'date-add-subtract', 'date-difference-calculator', 'age-calculator'],
  'scientific-notation-converter': ['number-base-converter', 'unit-converter', 'percentage-calculator', 'fraction-calculator', 'number-to-words-converter'],
  'area-calculator': ['unit-converter', 'ratio-calculator', 'percentage-calculator', 'fraction-calculator', 'discount-calculator'],
  // Added with the high-demand everyday tools
  'vat-calculator': ['sales-tax-calculator', 'discount-calculator', 'percentage-calculator', 'margin-markup-calculator', 'roi-calculator'],
  'time-zone-converter': ['timestamp-converter', 'time-duration-calculator', 'countdown-timer', 'date-difference-calculator', 'week-number-calculator'],
  'typing-speed-test': ['word-counter', 'cps-test', 'reaction-time-test', 'readability-score-checker', 'fancy-text-generator'],
  'cps-test': ['reaction-time-test', 'typing-speed-test', 'random-number-generator', 'countdown-timer'],
  'reaction-time-test': ['cps-test', 'typing-speed-test', 'sleep-calculator', 'random-number-generator'],
  'number-to-words-converter': ['roman-numeral-converter', 'number-base-converter', 'scientific-notation-converter', 'percentage-calculator', 'word-counter'],
  'gcf-lcm-calculator': ['fraction-calculator', 'ratio-calculator', 'percentage-calculator', 'average-calculator', 'number-to-words-converter'],
  'week-number-calculator': ['date-difference-calculator', 'date-add-subtract', 'working-days-calculator', 'countdown-timer', 'time-zone-converter'],
  'sleep-calculator': ['water-intake-calculator', 'calorie-calculator', 'bmi-calculator', 'time-duration-calculator', 'reaction-time-test'],
  'fancy-text-generator': ['case-converter', 'reverse-text', 'morse-code-translator', 'word-counter', 'typing-speed-test'],
};
