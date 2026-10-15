/**
 * Builds regular expressions for the Search Console Performance report's
 * "Custom (regex)" filter. Search Console uses Google's RE2 engine, matches
 * anywhere in the query or URL unless anchored, is case-sensitive unless the
 * pattern starts with (?i), and rejects patterns over 4,096 characters.
 *
 * Pure functions, no DOM: tested in scripts/checks/gscRegex.mjs.
 */

export const GSC_REGEX_MAX_LENGTH = 4096;

export const QUESTION_WORDS = ['who', 'what', 'when', 'where', 'why', 'how', 'which', 'can', 'does', 'do', 'is', 'are', 'should', 'will'];

/** Escapes RE2 metacharacters so user-typed words match literally. */
export const escapeRegex = (text) => String(text).replace(/[\\^$.|?*+()[\]{}]/g, '\\$&');

/** Comma- or line-separated words, trimmed, de-duplicated, empties dropped. */
export const splitTerms = (text) => [...new Set(String(text || '')
  .split(/[,\n]/)
  .map((term) => term.trim())
  .filter(Boolean))];

const alternation = (terms) => terms.map(escapeRegex).join('|');

/**
 * Pattern recipes. Each takes the user's input and returns the regex body
 * (without the (?i) flag) or '' when there is not enough input yet.
 */
export const RECIPES = {
  questions: {
    label: 'Question queries',
    target: 'Query',
    help: 'Queries that start with a question word: what people want answered, ideal for FAQ sections and guides.',
    build: ({ terms }) => {
      const words = terms.length ? terms : QUESTION_WORDS;
      return `^(${alternation(words)})\\b`;
    },
    termsLabel: 'Question words (leave empty for the English defaults)',
  },
  brand: {
    label: 'Brand queries',
    target: 'Query',
    help: 'Queries containing your brand or its misspellings. Use "Doesn\'t match regex" with the same pattern for non-brand traffic.',
    build: ({ terms }) => (terms.length ? `(${alternation(terms)})` : ''),
    termsLabel: 'Brand names and misspellings',
  },
  containsAny: {
    label: 'Contains any word',
    target: 'Query or Page',
    help: 'Queries or URLs that contain at least one of the words, e.g. every "calculator" or "converter" query.',
    build: ({ terms }) => (terms.length ? `(${alternation(terms)})` : ''),
    termsLabel: 'Words',
  },
  containsAll: {
    label: 'Contains all words (any order)',
    target: 'Query',
    help: 'RE2 has no lookaheads, so every order of the words is listed. Limited to 4 words to keep the pattern short.',
    build: ({ terms }) => {
      const words = terms.slice(0, 4);
      if (words.length < 2) return '';
      const orders = permutations(words).map((order) => order.map(escapeRegex).join('.*'));
      return `(${orders.join('|')})`;
    },
    termsLabel: 'Words (2–4)',
  },
  longTail: {
    label: 'Long-tail queries (word count)',
    target: 'Query',
    help: 'Queries with at least the given number of words: the specific searches that convert and are easiest to win.',
    build: ({ minWords }) => {
      const n = Math.max(2, Math.min(20, Number(minWords) || 5));
      return `^(\\S+\\s+){${n - 1},}\\S+$`;
    },
  },
  folder: {
    label: 'URLs in a folder',
    target: 'Page',
    help: 'Pages under one or more site sections, e.g. /blog/ or /de/. Use it on the Page filter.',
    build: ({ terms }) => {
      const folders = terms.map((term) => `/${term.replace(/^\/+|\/+$/g, '')}/`);
      return folders.length ? `(${folders.map(escapeRegex).join('|')})` : '';
    },
    termsLabel: 'Folders (blog, de, tools/seo)',
  },
  exact: {
    label: 'Exact queries only',
    target: 'Query',
    help: 'Only these exact queries, nothing that merely contains them.',
    build: ({ terms }) => (terms.length ? `^(${alternation(terms)})$` : ''),
    termsLabel: 'Exact queries',
  },
};

function permutations(items) {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)])
    .map((rest) => [item, ...rest]));
}

/** The final pattern as it is pasted into Search Console. */
export const buildPattern = (recipeId, input, { caseInsensitive = true } = {}) => {
  const recipe = RECIPES[recipeId];
  if (!recipe) return '';
  const body = recipe.build({ terms: splitTerms(input.terms), minWords: input.minWords });
  if (!body) return '';
  return `${caseInsensitive ? '(?i)' : ''}${body}`;
};

/**
 * Syntax JavaScript accepts but RE2 (and so Search Console) rejects. A pattern
 * using any of these returns no rows in Search Console instead of an error.
 */
const RE2_UNSUPPORTED = [
  { test: /\(\?[=!]/, message: 'Lookaheads (?= and (?! are not supported by RE2. Use "Doesn\'t match regex" for exclusions.' },
  { test: /\(\?<[=!]/, message: 'Lookbehinds (?<= and (?<! are not supported by RE2.' },
  { test: /\\[1-9]/, message: 'Backreferences such as \\1 are not supported by RE2.' },
  { test: /(\*|\+|\?|\})\+/, message: 'Possessive quantifiers (*+, ++) are not supported by RE2.' },
  { test: /\(\?>/, message: 'Atomic groups (?> are not supported by RE2.' },
];

/**
 * Checks a hand-written or generated pattern: RE2 compatibility, the 4,096
 * character limit, and whether it compiles at all. Returns the problems found
 * and, when it compiles, a JavaScript RegExp that behaves the same for the
 * RE2 subset (used to preview matches).
 */
export const checkPattern = (pattern) => {
  const problems = [];
  if (!pattern) return { problems, regex: null };
  if (pattern.length > GSC_REGEX_MAX_LENGTH) {
    problems.push(`The pattern is ${pattern.length.toLocaleString('en-US')} characters; Search Console accepts at most ${GSC_REGEX_MAX_LENGTH.toLocaleString('en-US')}.`);
  }
  RE2_UNSUPPORTED.forEach(({ test, message }) => { if (test.test(pattern)) problems.push(message); });
  if (/\(\?i\)/.test(pattern.slice(1)) && !pattern.startsWith('(?i)')) {
    problems.push('Put (?i) at the very start of the pattern so it applies to all of it.');
  }

  const caseInsensitive = pattern.startsWith('(?i)');
  const source = caseInsensitive ? pattern.slice(4) : pattern;
  let regex = null;
  try {
    regex = new RegExp(source, caseInsensitive ? 'iu' : 'u');
  } catch (error) {
    problems.push(`The pattern does not compile: ${error.message.replace(/^Invalid regular expression: /, '')}`);
  }
  return { problems, regex };
};

/** Splits pasted test lines into matching and non-matching, the way Search Console would. */
export const previewMatches = (regex, text, { negate = false } = {}) => {
  const lines = String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!regex) return { matched: [], unmatched: lines };
  const matched = [];
  const unmatched = [];
  lines.forEach((line) => ((regex.test(line) !== negate) ? matched : unmatched).push(line));
  return { matched, unmatched };
};
