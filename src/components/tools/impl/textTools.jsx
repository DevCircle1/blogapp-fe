import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, Panel, Segmented, Select,
  Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { getFormatLocale, num } from './toolFormat.js';
import { msg, useExtras, useT } from '../../../i18n/i18n.js';

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'is', 'it', 'for', 'on', 'with', 'as', 'at', 'by', 'from', 'this', 'that', 'these', 'those', 'be', 'are', 'was', 'were', 'been', 'has', 'have', 'had', 'not', 'you', 'your', 'we', 'our', 'they', 'their', 'i', 'he', 'she', 'his', 'her', 'its', 'can', 'will', 'if', 'so', 'than', 'then', 'there', 'when', 'which', 'who', 'what', 'how', 'all', 'more', 'most', 'up', 'out', 'do', 'does', 'no', 'yes', 'also', 'into', 'about', 'over']);

/** Function words of the page language — "de", "la", "que" dominate Spanish text the way "the" dominates English. */
const useStopWords = () => {
  const { stopWords } = useExtras();
  return useMemo(() => (stopWords ? new Set(stopWords) : STOP_WORDS), [stopWords]);
};

/* ---------------------------------------------------------- Word counter */
export function WordCounter() {
  const t = useT();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/u).filter(Boolean) : [];
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) || []).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/u).filter((block) => block.trim()).length : 0;
    return {
      words: words.length,
      characters: text.length,
      noSpaces: text.replace(/\s/gu, '').length,
      sentences,
      paragraphs,
      longest: words.reduce((longest, word) => (word.length > longest.length ? word : longest), ''),
      avgSentence: sentences ? words.length / sentences : 0,
      reading: Math.max(words.length ? 1 : 0, Math.ceil(words.length / 225)),
      speaking: Math.max(words.length ? 1 : 0, Math.ceil(words.length / 130)),
    };
  }, [text]);

  return (
    <>
      <Label htmlFor="wc-text">{t('Your text')}</Label>
      <TextArea id="wc-text" className="mt-2 min-h-64" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Type or paste your text here — counts update as you type.')} />
      <StatGrid columns="md:grid-cols-3 lg:grid-cols-6">
        <Stat label={t('Words')} value={num(stats.words, 0)} accent="emerald" />
        <Stat label={t('Characters')} value={num(stats.characters, 0)} />
        <Stat label={t('No spaces')} value={num(stats.noSpaces, 0)} />
        <Stat label={t('Sentences')} value={num(stats.sentences, 0)} accent="cyan" />
        <Stat label={t('Paragraphs')} value={num(stats.paragraphs, 0)} accent="cyan" />
        <Stat label={t('Reading time')} value={`${stats.reading} min`} accent="emerald" />
      </StatGrid>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Speaking time')} value={`${stats.speaking} min`} />
        <Stat label={t('Avg words per sentence')} value={num(stats.avgSentence, 1)} accent={stats.avgSentence > 25 ? 'indigo' : 'emerald'} />
        <Stat label={t('Longest word')} value={stats.longest || '—'} accent="cyan" />
      </StatGrid>
      {stats.avgSentence > 25 && (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
          {t('Sentences average over 25 words. Splitting the longest ones usually makes the piece considerably easier to read.')}
        </p>
      )}
    </>
  );
}

/* -------------------------------------------------------- Case converter */
const splitWords = (text) => text.trim().split(/\s+/).filter(Boolean);
// Sentence openers may carry leading punctuation: Spanish ¿ and ¡, quotes, guillemets.
const OPENERS = '[\\s¿¡"\'«“(]*';

const CASES = [
  [msg('UPPERCASE'), (text, locale) => text.toLocaleUpperCase(locale)],
  [msg('lowercase'), (text, locale) => text.toLocaleLowerCase(locale)],
  // Letters after an apostrophe stay lowercase, so "don't" does not become "Don'T".
  [msg('Title Case'), (text, locale) => text.toLocaleLowerCase(locale).replace(/(^|[^\p{L}\p{N}'’])(\p{L})/gu, (match, before, char) => before + char.toLocaleUpperCase(locale))],
  [msg('Sentence case'), (text, locale) => text.toLocaleLowerCase(locale).replace(new RegExp(`(^${OPENERS}\\p{L}|[.!?]\\s+${OPENERS}\\p{L})`, 'gu'), (match) => match.toLocaleUpperCase(locale))],
  ['camelCase', (text) => splitWords(text).map((word, index) => (index ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())).join('')],
  ['PascalCase', (text) => splitWords(text).map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join('')],
  ['snake_case', (text) => splitWords(text).join('_').toLowerCase()],
  ['kebab-case', (text) => splitWords(text).join('-').toLowerCase()],
];

export function CaseConverter() {
  const t = useT();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  return (
    <>
      <Label htmlFor="cc-text">{t('Your text')}</Label>
      <TextArea id="cc-text" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Paste the text you want to convert…')} />
      <div className="my-5 flex flex-wrap gap-2">
        {CASES.map(([name, convert]) => (
          <Button key={name} variant="ghost" onClick={() => setResult(convert(text, getFormatLocale()))}>{t(name)}</Button>
        ))}
      </div>
      <Label htmlFor="cc-result">{t('Result')}</Label>
      <TextArea id="cc-result" className="mt-2 min-h-32" value={result} readOnly />
      <div className="mt-4"><CopyButton value={result} /></div>
    </>
  );
}

/* ------------------------------------------------------ Remove duplicates */
export function RemoveDuplicateLines() {
  const t = useT();
  const [text, setText] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [mode, setMode] = useState('unique');

  const result = useMemo(() => {
    const lines = text.split('\n');
    const key = (line) => {
      let value = trim ? line.trim() : line;
      return ignoreCase ? value.toLowerCase() : value;
    };
    const counts = lines.reduce((map, line) => map.set(key(line), (map.get(key(line)) || 0) + 1), new Map());
    const seen = new Set();
    const unique = lines.filter((line) => {
      const id = key(line);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    const duplicatesOnly = unique.filter((line) => counts.get(key(line)) > 1);
    return {
      output: (mode === 'unique' ? unique : duplicatesOnly).join('\n'),
      removed: lines.length - unique.length,
      total: text ? lines.length : 0,
      duplicateCount: duplicatesOnly.length,
    };
  }, [text, ignoreCase, trim, mode]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented ariaLabel={t('Output mode')} value={mode} onChange={setMode}
          options={[{ value: 'unique', label: t('Remove duplicates') }, { value: 'duplicates', label: t('Show duplicates only') }]} />
        <Toggle checked={ignoreCase} onChange={() => setIgnoreCase(!ignoreCase)} label={t('Ignore case')} />
        <Toggle checked={trim} onChange={() => setTrim(!trim)} label={t('Trim whitespace')} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="dup-in">{t('Input list')}</Label>
          <TextArea id="dup-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('One item per line…')} />
        </div>
        <div>
          <Label htmlFor="dup-out">{t('Result')}</Label>
          <TextArea id="dup-out" className="mt-2" value={result.output} readOnly />
        </div>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Lines in')} value={result.total} />
        <Stat label={t('Duplicates removed')} value={result.removed} accent="cyan" />
        <Stat label={t('Repeated entries')} value={result.duplicateCount} accent="emerald" />
      </StatGrid>
      <div className="mt-4"><CopyButton value={result.output} /></div>
    </>
  );
}

/* ------------------------------------------------------------ Sort lines */
export function SortTextLines() {
  const t = useT();
  const [text, setText] = useState('');
  const [sortBy, setSortBy] = useState('alpha');
  const [direction, setDirection] = useState('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const locale = getFormatLocale();

  const output = useMemo(() => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    if (sortBy === 'shuffle') {
      const shuffled = [...lines];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.join('\n');
    }
    // Locale-aware, so Spanish ñ sorts after n and German ä sits beside a.
    const compare = (a, b) => {
      if (sortBy === 'length') return a.length - b.length;
      if (sortBy === 'numeric') return a.localeCompare(b, locale, { numeric: true, sensitivity: caseSensitive ? 'case' : 'base' });
      return a.localeCompare(b, locale, { sensitivity: caseSensitive ? 'case' : 'base' });
    };
    const sorted = [...lines].sort(compare);
    return (direction === 'desc' ? sorted.reverse() : sorted).join('\n');
  }, [text, sortBy, direction, caseSensitive, locale]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-auto" aria-label={t('Sort by')}>
          <option value="alpha">{t('Alphabetical')}</option>
          <option value="numeric">{t('Natural / numeric')}</option>
          <option value="length">{t('Line length')}</option>
          <option value="shuffle">{t('Shuffle randomly')}</option>
        </Select>
        {sortBy !== 'shuffle' && (
          <Segmented ariaLabel={t('Sort direction')} value={direction} onChange={setDirection}
            options={[{ value: 'asc', label: t('Ascending') }, { value: 'desc', label: t('Descending') }]} />
        )}
        <Toggle checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} label={t('Case sensitive')} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="sort-in">{t('Input')}</Label>
          <TextArea id="sort-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('One item per line…')} />
        </div>
        <div>
          <Label htmlFor="sort-out">{t('Sorted')}</Label>
          <TextArea id="sort-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* -------------------------------------------------------- Find & replace */
export function FindAndReplace() {
  const t = useT();
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const result = useMemo(() => {
    if (!find) return { output: text, count: 0, error: '' };
    try {
      const escaped = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // \b only knows ASCII letters and would match inside "más" or "Größe",
      // so whole-word mode checks Unicode letters on either side instead.
      const unicodeWord = wholeWord && !useRegex;
      const pattern = unicodeWord ? `(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])` : escaped;
      const regex = new RegExp(pattern, `${caseSensitive ? 'g' : 'gi'}${unicodeWord ? 'u' : ''}`);
      const count = (text.match(regex) || []).length;
      return { output: text.replace(regex, replace), count, error: '' };
    } catch (err) { return { output: text, count: 0, error: err.message }; }
  }, [text, find, replace, caseSensitive, wholeWord, useRegex]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label={t('Find')} id="fr-find" value={find} onChange={(e) => setFind(e.target.value)} placeholder={useRegex ? '\\d{4}-\\d{2}-\\d{2}' : t('text to find')} className="font-mono" />
        <LabelledField label={t('Replace with')} id="fr-replace" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder={useRegex ? '$1' : t('replacement')} className="font-mono" />
      </Grid>
      <div className="mt-4 flex flex-wrap gap-3">
        <Toggle checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} label={t('Case sensitive')} />
        <Toggle checked={wholeWord} onChange={() => setWholeWord(!wholeWord)} label={t('Whole word only')} />
        <Toggle checked={useRegex} onChange={() => setUseRegex(!useRegex)} label={t('Regular expression')} />
      </div>
      <ErrorNote>{result.error}</ErrorNote>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="fr-in">{t('Original text')}</Label>
          <TextArea id="fr-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="fr-out">{t('Result')} <span className="text-emerald-300">{t('({n} replaced)', { n: result.count })}</span></Label>
          <TextArea id="fr-out" className="mt-2" value={result.output} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={result.output} /></div>
    </>
  );
}

/* ------------------------------------------------------------ Diff check */
const diffLines = (a, b) => {
  const left = a.split('\n');
  const right = b.split('\n');
  const table = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { result.push({ type: 'same', text: left[i] }); i += 1; j += 1; }
    else if (table[i + 1][j] >= table[i][j + 1]) { result.push({ type: 'removed', text: left[i] }); i += 1; }
    else { result.push({ type: 'added', text: right[j] }); j += 1; }
  }
  while (i < left.length) { result.push({ type: 'removed', text: left[i] }); i += 1; }
  while (j < right.length) { result.push({ type: 'added', text: right[j] }); j += 1; }
  return result;
};

export function TextDiffChecker() {
  const t = useT();
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const diff = useMemo(() => diffLines(original, modified), [original, modified]);
  const added = diff.filter((line) => line.type === 'added').length;
  const removed = diff.filter((line) => line.type === 'removed').length;

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="diff-a">{t('Original')}</Label>
          <TextArea id="diff-a" className="mt-2" value={original} onChange={(e) => setOriginal(e.target.value)} placeholder={t('Paste the original version…')} />
        </div>
        <div>
          <Label htmlFor="diff-b">{t('Modified')}</Label>
          <TextArea id="diff-b" className="mt-2" value={modified} onChange={(e) => setModified(e.target.value)} placeholder={t('Paste the changed version…')} />
        </div>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Lines added')} value={added} accent="emerald" />
        <Stat label={t('Lines removed')} value={removed} />
        <Stat label={t('Lines unchanged')} value={diff.length - added - removed} accent="cyan" />
      </StatGrid>
      <div className="mt-5 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm">
        {diff.length ? diff.map((line, index) => (
          <div key={index} className={line.type === 'added' ? 'bg-emerald-400/10 text-emerald-300' : line.type === 'removed' ? 'bg-rose-400/10 text-rose-300' : 'text-slate-400'}>
            <span className="mr-3 select-none text-slate-600">{line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}</span>
            {line.text || ' '}
          </div>
        )) : <p className="text-slate-500">{t('Paste two versions to compare them.')}</p>}
      </div>
    </>
  );
}

/* ----------------------------------------------------------- Lorem ipsum */
const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

const randomWords = (count) => Array.from({ length: count }, () => LOREM[Math.floor(Math.random() * LOREM.length)]);

const makeSentence = () => {
  const words = randomWords(6 + Math.floor(Math.random() * 12));
  return `${words[0][0].toUpperCase()}${words[0].slice(1)} ${words.slice(1).join(' ')}.`;
};

export function LoremIpsumGenerator() {
  const t = useT();
  const [unit, setUnit] = useState('paragraphs');
  const [count, setCount] = useState('3');
  const [classic, setClassic] = useState(true);
  const [wrapHtml, setWrapHtml] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const amount = Math.max(1, Math.min(100, Math.floor(Number(count) || 1)));
    let blocks = [];
    if (unit === 'words') blocks = [randomWords(amount).join(' ')];
    else if (unit === 'sentences') blocks = [Array.from({ length: amount }, makeSentence).join(' ')];
    else blocks = Array.from({ length: amount }, () => Array.from({ length: 3 + Math.floor(Math.random() * 4) }, makeSentence).join(' '));

    if (classic && blocks.length) blocks[0] = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${blocks[0]}`;
    setOutput(wrapHtml ? blocks.map((block) => `<p>${block}</p>`).join('\n') : blocks.join('\n\n'));
  };

  return (
    <>
      <Grid className="md:grid-cols-[200px_1fr_auto]">
        <div>
          <Label htmlFor="li-unit">{t('Generate')}</Label>
          <Select id="li-unit" className="mt-2" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="paragraphs">{t('Paragraphs')}</option>
            <option value="sentences">{t('Sentences')}</option>
            <option value="words">{t('Words')}</option>
          </Select>
        </div>
        <LabelledField label={t('How many')} id="li-count" type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} />
        <div className="flex items-end"><Button onClick={generate} className="w-full md:w-auto">{t('Generate')}</Button></div>
      </Grid>
      <div className="mt-4 flex flex-wrap gap-3">
        <Toggle checked={classic} onChange={() => setClassic(!classic)} label={t('Start with "Lorem ipsum dolor sit amet"')} />
        <Toggle checked={wrapHtml} onChange={() => setWrapHtml(!wrapHtml)} label={t('Wrap in <p> tags')} />
      </div>
      <TextArea className="mt-5 min-h-64" value={output} readOnly placeholder={t('Your placeholder text will appear here.')} />
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* --------------------------------------------------------- Slug generator */
// Letters that Unicode decomposition does not reduce to a base letter.
const FOLDED = { ß: 'ss', æ: 'ae', œ: 'oe', ø: 'o', ł: 'l', đ: 'd', þ: 'th' };

export function SlugGenerator() {
  const t = useT();
  const { slugReplacements } = useExtras();
  const stopWords = useStopWords();
  const [title, setTitle] = useState('');
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxWords, setMaxWords] = useState('0');

  const slug = useMemo(() => {
    // Language-specific transliteration first: German convention writes
    // "Größe" as "groesse", not the "grosse" that plain accent-stripping gives.
    let source = title;
    Object.entries(slugReplacements || {}).forEach(([from, to]) => { source = source.split(from).join(to); });
    let words = source
      .toLowerCase()
      .replace(/[ßæœøłđþ]/g, (char) => FOLDED[char])
      // Decompose accents into base letter + combining mark, then drop the
      // marks, so "café" transliterates to "cafe" rather than "caf".
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      // Apostrophes vanish rather than becoming separators: "don't" -> "dont".
      .replace(/['‘’`]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim().split(/\s+/).filter(Boolean);
    if (removeStopWords) {
      const kept = words.filter((word) => !stopWords.has(word));
      if (kept.length) words = kept;
    }
    const limit = Math.floor(Number(maxWords) || 0);
    if (limit > 0) words = words.slice(0, limit);
    return words.join('-');
  }, [title, removeStopWords, maxWords, slugReplacements, stopWords]);

  return (
    <>
      <Label htmlFor="slug-title">{t('Page or article title')}</Label>
      <Field id="slug-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('How to Calculate Profit Margin in 2026')} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Toggle checked={removeStopWords} onChange={() => setRemoveStopWords(!removeStopWords)} label={t('Remove stop words')} />
        <div className="w-40">
          <Field type="number" min="0" max="20" value={maxWords} onChange={(e) => setMaxWords(e.target.value)} aria-label={t('Maximum words (0 for no limit)')} placeholder={t('Max words')} />
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
        <span className="text-sm text-slate-400">{t('URL slug')}</span>
        <p className="mt-2 break-all font-mono text-xl text-emerald-300">{slug || t('your-slug-appears-here')}</p>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Characters')} value={slug.length} accent={slug.length > 60 ? 'indigo' : 'emerald'} />
        <Stat label={t('Words')} value={slug ? slug.split('-').length : 0} accent="cyan" />
        <Stat label={t('Length check')} value={slug.length > 60 ? t('A bit long') : slug.length ? t('Good') : '—'} />
      </StatGrid>
      <div className="mt-4"><CopyButton value={slug} /></div>
    </>
  );
}

/* ------------------------------------------------------- Word frequency */
export function WordFrequencyCounter() {
  const t = useT();
  const stopWords = useStopWords();
  const [text, setText] = useState('');
  const [mode, setMode] = useState('1');
  const [filterStopWords, setFilterStopWords] = useState(true);

  const analysis = useMemo(() => {
    const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, ' ').split(/\s+/).filter(Boolean);
    const size = Number(mode);
    const grams = [];
    for (let i = 0; i <= words.length - size; i += 1) {
      const gram = words.slice(i, i + size);
      if (size === 1 && filterStopWords && stopWords.has(gram[0])) continue;
      if (size > 1 && filterStopWords && gram.every((word) => stopWords.has(word))) continue;
      grams.push(gram.join(' '));
    }
    const counts = grams.reduce((map, gram) => map.set(gram, (map.get(gram) || 0) + 1), new Map());
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
    return { entries, total: words.length };
  }, [text, mode, filterStopWords, stopWords]);

  return (
    <>
      <Label htmlFor="wf-text">{t('Text to analyse')}</Label>
      <TextArea id="wf-text" className="mt-2 min-h-48" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Paste an article, page copy, or draft…')} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Segmented ariaLabel={t('Phrase length')} value={mode} onChange={setMode}
          options={[{ value: '1', label: t('Single words') }, { value: '2', label: t('Two-word phrases') }, { value: '3', label: t('Three-word phrases') }]} />
        <Toggle checked={filterStopWords} onChange={() => setFilterStopWords(!filterStopWords)} label={t('Filter common words')} />
      </div>
      {analysis.entries.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr><th className="p-3">#</th><th className="p-3">{t('Term')}</th><th className="p-3">{t('Count')}</th><th className="p-3">{t('Density')}</th></tr>
            </thead>
            <tbody>
              {analysis.entries.map(([term, count], index) => {
                const density = analysis.total ? (count * Number(mode) / analysis.total) * 100 : 0;
                return (
                  <tr key={term} className="border-t border-white/5">
                    <td className="p-3 text-slate-500">{index + 1}</td>
                    <td className="p-3 font-medium text-white">{term}</td>
                    <td className="p-3 text-emerald-300">{count}</td>
                    <td className={`p-3 ${density > 3 ? 'text-amber-300' : 'text-slate-400'}`}>{num(density, 2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-sm text-slate-500">{t('Total words analysed: {n}. There is no density target to hit — anything above roughly 3% for one term tends to read as repetitive.', { n: num(analysis.total, 0) })}</p>
    </>
  );
}

/* --------------------------------------------------- Remove line breaks */
export function RemoveLineBreaks() {
  const t = useT();
  const [text, setText] = useState('');
  const [keepParagraphs, setKeepParagraphs] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [joinHyphens, setJoinHyphens] = useState(true);

  const output = useMemo(() => {
    let result = text.replace(/\r\n/g, '\n');
    if (joinHyphens) result = result.replace(/(\p{L})-\n(\p{L})/gu, '$1$2');
    if (keepParagraphs) {
      result = result.split(/\n\s*\n/).map((block) => block.replace(/\n/g, ' ')).join('\n\n');
    } else {
      result = result.replace(/\n+/g, ' ');
    }
    if (collapseSpaces) result = result.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n');
    return result.trim();
  }, [text, keepParagraphs, collapseSpaces, joinHyphens]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Toggle checked={keepParagraphs} onChange={() => setKeepParagraphs(!keepParagraphs)} label={t('Keep paragraph breaks')} />
        <Toggle checked={collapseSpaces} onChange={() => setCollapseSpaces(!collapseSpaces)} label={t('Collapse extra spaces')} />
        <Toggle checked={joinHyphens} onChange={() => setJoinHyphens(!joinHyphens)} label={t('Rejoin hyphenated words')} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="rlb-in">{t('Text with broken lines')}</Label>
          <TextArea id="rlb-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Paste text copied from a PDF or email…')} />
        </div>
        <div>
          <Label htmlFor="rlb-out">{t('Cleaned text')}</Label>
          <TextArea id="rlb-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* ---------------------------------------------------------- Reverse text */
// Accents and punctuation are ignored, so "Anita lava la tina" is recognised.
const palindromeKey = (value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export function ReverseText() {
  const t = useT();
  const [text, setText] = useState('');
  const [mode, setMode] = useState('characters');

  const output = useMemo(() => {
    if (mode === 'characters') return Array.from(text).reverse().join('');
    if (mode === 'words') return text.split(/(\s+)/).reverse().join('');
    return text.split('\n').reverse().join('\n');
  }, [text, mode]);

  const key = palindromeKey(text);
  const isPalindrome = text.trim() && key && key === Array.from(key).reverse().join('');

  return (
    <>
      <Segmented ariaLabel={t('Reverse mode')} value={mode} onChange={setMode}
        options={[{ value: 'characters', label: t('Reverse characters') }, { value: 'words', label: t('Reverse word order') }, { value: 'lines', label: t('Reverse line order') }]} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="rev-in">{t('Input')}</Label>
          <TextArea id="rev-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rev-out">{t('Reversed')}</Label>
          <TextArea id="rev-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      {isPalindrome && <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{t('That text is a palindrome — it reads the same in both directions.')}</p>}
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}
