import assert from 'node:assert/strict';
import { buildPattern, checkPattern, previewMatches, splitTerms } from '../../src/lib/seo/gscRegex.js';

const match = (pattern, lines) => previewMatches(checkPattern(pattern).regex, lines.join('\n')).matched;

// Question queries
const questions = buildPattern('questions', { terms: '' });
assert.equal(questions.startsWith('(?i)^('), true);
assert.deepEqual(match(questions, ['How to count words', 'word counter how', 'whatsapp export', 'what is ctr']), ['How to count words', 'what is ctr']);

// Brand: metacharacters are literal
const brand = buildPattern('brand', { terms: 'talk & tool, talkandtool, talk.tool' });
assert.deepEqual(match(brand, ['talkandtool login', 'talk & tool', 'talkxtool', 'talk.tool review']), ['talkandtool login', 'talk & tool', 'talk.tool review']);

// Contains all words, any order
const all = buildPattern('containsAll', { terms: 'keyword, density' });
assert.deepEqual(match(all, ['keyword density tool', 'density of keyword', 'keyword tool']), ['keyword density tool', 'density of keyword']);
assert.equal(buildPattern('containsAll', { terms: 'one' }), '');

// Long tail: at least 4 words
const tail = buildPattern('longTail', { minWords: 4 });
assert.deepEqual(match(tail, ['a b c', 'a b c d', 'how to count words online']), ['a b c d', 'how to count words online']);

// Folders on the Page filter
const folder = buildPattern('folder', { terms: '/de/, blogs' });
assert.deepEqual(match(folder, ['https://x.com/de/zinsrechner', 'https://x.com/blogs/article/a', 'https://x.com/design']), ['https://x.com/de/zinsrechner', 'https://x.com/blogs/article/a']);

// Exact
const exact = buildPattern('exact', { terms: 'word counter' });
assert.deepEqual(match(exact, ['word counter', 'word counter online']), ['word counter']);

// Case sensitivity off
assert.deepEqual(match(buildPattern('brand', { terms: 'Tool' }, { caseInsensitive: false }), ['tool', 'Tool']), ['Tool']);

// RE2 checks
assert.ok(checkPattern('^(?!brand).*').problems.some((p) => p.includes('Lookahead')));
assert.ok(checkPattern('(a)\\1').problems.some((p) => p.includes('Backreference')));
assert.ok(checkPattern('x'.repeat(5000)).problems.some((p) => p.includes('4,096')));
assert.ok(checkPattern('(unclosed').problems.some((p) => p.includes('does not compile')));
assert.deepEqual(checkPattern('(?i)^how').problems, []);

// Negation previews "Doesn't match regex"
assert.deepEqual(previewMatches(checkPattern('brand').regex, 'brand x\nother', { negate: true }).matched, ['other']);

assert.deepEqual(splitTerms('a, b\nb,,  c '), ['a', 'b', 'c']);
console.log('[checks] gsc regex: OK');
