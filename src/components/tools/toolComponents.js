import * as dev from './impl/devTools.jsx';
import * as security from './impl/securityTools.jsx';
import * as calc from './impl/calcTools.jsx';
import * as finance from './impl/financeTools.jsx';
import * as text from './impl/textTools.jsx';
import * as date from './impl/dateTools.jsx';
import * as health from './impl/healthTools.jsx';
import * as seo from './impl/seoTools.jsx';

/**
 * Interactive component for every catalogue slug. One implementation serves
 * every language: the component reads its labels and locale defaults from
 * the surrounding I18nProvider rather than being duplicated per language.
 */
export const TOOL_COMPONENTS = {
  // Developer
  'json-studio': dev.JsonStudio,
  'base64-tool': dev.Base64Tool,
  'url-encoder': dev.UrlEncoder,
  'jwt-inspector': dev.JwtInspector,
  'uuid-generator': dev.UuidGenerator,
  'regex-tester': dev.RegexTester,
  'hash-generator': dev.HashGenerator,
  'html-encoder': dev.HtmlEncoder,
  'csv-to-json': dev.CsvToJson,
  'json-to-csv': dev.JsonToCsv,
  'markdown-to-html': dev.MarkdownToHtml,
  'color-converter': dev.ColorConverter,
  'css-gradient-generator': dev.GradientGenerator,
  'box-shadow-generator': dev.BoxShadowGenerator,
  'http-status-codes': dev.HttpStatusCodes,
  'meta-tag-generator': dev.MetaTagGenerator,
  'robots-txt-generator': dev.RobotsTxtGenerator,
  'user-agent-parser': dev.UserAgentParser,
  // Security
  'password-generator': security.PasswordGenerator,
  'password-strength-checker': security.PasswordStrengthChecker,
  'credit-card-validator': security.CreditCardValidator,
  'email-validator': security.EmailValidator,
  // Calculators
  'percentage-calculator': calc.PercentageCalculator,
  'average-calculator': calc.AverageCalculator,
  'fraction-calculator': calc.FractionCalculator,
  'ratio-calculator': calc.RatioCalculator,
  'number-base-converter': calc.NumberBaseConverter,
  'roman-numeral-converter': calc.RomanNumeralConverter,
  'gpa-calculator': calc.GpaCalculator,
  'random-number-generator': calc.RandomNumberGenerator,
  'unit-converter': calc.UnitConverter,
  'age-calculator': calc.AgeCalculator,
  // Finance
  'loan-calculator': finance.LoanCalculator,
  'mortgage-calculator': finance.MortgageCalculator,
  'compound-interest-calculator': finance.CompoundInterestCalculator,
  'simple-interest-calculator': finance.SimpleInterestCalculator,
  'tip-calculator': finance.TipCalculator,
  'discount-calculator': finance.DiscountCalculator,
  'sales-tax-calculator': finance.SalesTaxCalculator,
  'margin-markup-calculator': finance.MarginMarkupCalculator,
  'roi-calculator': finance.RoiCalculator,
  'break-even-calculator': finance.BreakEvenCalculator,
  'savings-goal-calculator': finance.SavingsGoalCalculator,
  'salary-to-hourly-calculator': finance.SalaryToHourlyCalculator,
  'inflation-calculator': finance.InflationCalculator,
  // Text
  'word-counter': text.WordCounter,
  'case-converter': text.CaseConverter,
  'remove-duplicate-lines': text.RemoveDuplicateLines,
  'sort-text-lines': text.SortTextLines,
  'find-and-replace': text.FindAndReplace,
  'text-diff-checker': text.TextDiffChecker,
  'lorem-ipsum-generator': text.LoremIpsumGenerator,
  'slug-generator': text.SlugGenerator,
  'word-frequency-counter': text.WordFrequencyCounter,
  'remove-line-breaks': text.RemoveLineBreaks,
  'reverse-text': text.ReverseText,
  // Date & time
  'date-difference-calculator': date.DateDifferenceCalculator,
  'date-add-subtract': date.DateAddSubtract,
  'time-duration-calculator': date.TimeDurationCalculator,
  'working-days-calculator': date.WorkingDaysCalculator,
  'countdown-timer': date.CountdownTimer,
  'timestamp-converter': date.TimestampConverter,
  // Health
  'bmi-calculator': health.BmiCalculator,
  'calorie-calculator': health.CalorieCalculator,
  'ideal-weight-calculator': health.IdealWeightCalculator,
  'body-fat-calculator': health.BodyFatCalculator,
  'water-intake-calculator': health.WaterIntakeCalculator,
  'macro-calculator': health.MacroCalculator,
  'pregnancy-due-date-calculator': health.PregnancyDueDateCalculator,
  // SEO
  'low-competition-keyword-finder': seo.LowCompetitionKeywordFinder,
  'long-tail-keyword-generator': seo.LongTailKeywordGenerator,
  'keyword-clustering-tool': seo.KeywordClusteringTool,
  'search-intent-classifier': seo.SearchIntentClassifier,
  'seo-content-brief-generator': seo.SeoContentBriefGenerator,
  'keyword-cannibalization-checker': seo.KeywordCannibalizationChecker,
  'seo-title-meta-checker': seo.SeoTitleMetaChecker,
};
