import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, Panel, Segmented, Select,
  Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { num } from './toolFormat.js';

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'is', 'it', 'for', 'on', 'with', 'as', 'at', 'by', 'from', 'this', 'that', 'these', 'those', 'be', 'are', 'was', 'were', 'been', 'has', 'have', 'had', 'not', 'you', 'your', 'we', 'our', 'they', 'their', 'i', 'he', 'she', 'his', 'her', 'its', 'can', 'will', 'if', 'so', 'than', 'then', 'there', 'when', 'which', 'who', 'what', 'how', 'all', 'more', 'most', 'up', 'out', 'do', 'does', 'no', 'yes', 'also', 'into', 'about', 'over']);

/* ---------------------------------------------------------- Word counter */
export function WordCounter() {
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
      <Label htmlFor="wc-text">Your text</Label>
      <TextArea id="wc-text" className="mt-2 min-h-64" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here — counts update as you type." />
      <StatGrid columns="md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={stats.words.toLocaleString()} accent="emerald" />
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat label="No spaces" value={stats.noSpaces.toLocaleString()} />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} accent="cyan" />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} accent="cyan" />
        <Stat label="Reading time" value={`${stats.reading} min`} accent="emerald" />
      </StatGrid>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Speaking time" value={`${stats.speaking} min`} />
        <Stat label="Avg words per sentence" value={num(stats.avgSentence, 1)} accent={stats.avgSentence > 25 ? 'indigo' : 'emerald'} />
        <Stat label="Longest word" value={stats.longest || '—'} accent="cyan" />
      </StatGrid>
      {stats.avgSentence > 25 && (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
          Sentences average over 25 words. Splitting the longest ones usually makes the piece considerably easier to read.
        </p>
      )}
    </>
  );
}

/* -------------------------------------------------------- Case converter */
export function CaseConverter() {
  const [text, setText] = useState('');
  const words = () => text.trim().split(/\s+/).filter(Boolean);

  const actions = {
    UPPERCASE: () => text.toUpperCase(),
    lowercase: () => text.toLowerCase(),
    'Title Case': () => text.toLowerCase().replace(/\b\p{L}/gu, (char) => char.toUpperCase()),
    'Sentence case': () => text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase()),
    camelCase: () => words().map((word, index) => (index ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())).join(''),
    PascalCase: () => words().map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(''),
    snake_case: () => words().join('_').toLowerCase(),
    'kebab-case': () => words().join('-').toLowerCase(),
  };

  const [result, setResult] = useState('');

  return (
    <>
      <Label htmlFor="cc-text">Your text</Label>
      <TextArea id="cc-text" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the text you want to convert…" />
      <div className="my-5 flex flex-wrap gap-2">
        {Object.entries(actions).map(([name, action]) => (
          <Button key={name} variant="ghost" onClick={() => setResult(action())}>{name}</Button>
        ))}
      </div>
      <Label htmlFor="cc-result">Result</Label>
      <TextArea id="cc-result" className="mt-2 min-h-32" value={result} readOnly />
      <div className="mt-4"><CopyButton value={result} /></div>
    </>
  );
}

/* ------------------------------------------------------ Remove duplicates */
export function RemoveDuplicateLines() {
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
        <Segmented ariaLabel="Output mode" value={mode} onChange={setMode}
          options={[{ value: 'unique', label: 'Remove duplicates' }, { value: 'duplicates', label: 'Show duplicates only' }]} />
        <Toggle checked={ignoreCase} onChange={() => setIgnoreCase(!ignoreCase)} label="Ignore case" />
        <Toggle checked={trim} onChange={() => setTrim(!trim)} label="Trim whitespace" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="dup-in">Input list</Label>
          <TextArea id="dup-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" />
        </div>
        <div>
          <Label htmlFor="dup-out">Result</Label>
          <TextArea id="dup-out" className="mt-2" value={result.output} readOnly />
        </div>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Lines in" value={result.total} />
        <Stat label="Duplicates removed" value={result.removed} accent="cyan" />
        <Stat label="Repeated entries" value={result.duplicateCount} accent="emerald" />
      </StatGrid>
      <div className="mt-4"><CopyButton value={result.output} /></div>
    </>
  );
}

/* ------------------------------------------------------------ Sort lines */
export function SortTextLines() {
  const [text, setText] = useState('');
  const [sortBy, setSortBy] = useState('alpha');
  const [direction, setDirection] = useState('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

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
    const compare = (a, b) => {
      if (sortBy === 'length') return a.length - b.length;
      if (sortBy === 'numeric') return a.localeCompare(b, undefined, { numeric: true, sensitivity: caseSensitive ? 'case' : 'base' });
      return a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'case' : 'base' });
    };
    const sorted = [...lines].sort(compare);
    return (direction === 'desc' ? sorted.reverse() : sorted).join('\n');
  }, [text, sortBy, direction, caseSensitive]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-auto" aria-label="Sort by">
          <option value="alpha">Alphabetical</option>
          <option value="numeric">Natural / numeric</option>
          <option value="length">Line length</option>
          <option value="shuffle">Shuffle randomly</option>
        </Select>
        {sortBy !== 'shuffle' && (
          <Segmented ariaLabel="Sort direction" value={direction} onChange={setDirection}
            options={[{ value: 'asc', label: 'Ascending' }, { value: 'desc', label: 'Descending' }]} />
        )}
        <Toggle checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} label="Case sensitive" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="sort-in">Input</Label>
          <TextArea id="sort-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" />
        </div>
        <div>
          <Label htmlFor="sort-out">Sorted</Label>
          <TextArea id="sort-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* -------------------------------------------------------- Find & replace */
export function FindAndReplace() {
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
      const pattern = wholeWord && !useRegex ? `\\b${escaped}\\b` : escaped;
      const regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
      const count = (text.match(regex) || []).length;
      return { output: text.replace(regex, replace), count, error: '' };
    } catch (err) { return { output: text, count: 0, error: err.message }; }
  }, [text, find, replace, caseSensitive, wholeWord, useRegex]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label="Find" id="fr-find" value={find} onChange={(e) => setFind(e.target.value)} placeholder={useRegex ? '\\d{4}-\\d{2}-\\d{2}' : 'text to find'} className="font-mono" />
        <LabelledField label="Replace with" id="fr-replace" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder={useRegex ? '$1' : 'replacement'} className="font-mono" />
      </Grid>
      <div className="mt-4 flex flex-wrap gap-3">
        <Toggle checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} label="Case sensitive" />
        <Toggle checked={wholeWord} onChange={() => setWholeWord(!wholeWord)} label="Whole word only" />
        <Toggle checked={useRegex} onChange={() => setUseRegex(!useRegex)} label="Regular expression" />
      </div>
      <ErrorNote>{result.error}</ErrorNote>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="fr-in">Original text</Label>
          <TextArea id="fr-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="fr-out">Result <span className="text-emerald-300">({result.count} replaced)</span></Label>
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
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const diff = useMemo(() => diffLines(original, modified), [original, modified]);
  const added = diff.filter((line) => line.type === 'added').length;
  const removed = diff.filter((line) => line.type === 'removed').length;

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="diff-a">Original</Label>
          <TextArea id="diff-a" className="mt-2" value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="Paste the original version…" />
        </div>
        <div>
          <Label htmlFor="diff-b">Modified</Label>
          <TextArea id="diff-b" className="mt-2" value={modified} onChange={(e) => setModified(e.target.value)} placeholder="Paste the changed version…" />
        </div>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Lines added" value={added} accent="emerald" />
        <Stat label="Lines removed" value={removed} />
        <Stat label="Lines unchanged" value={diff.length - added - removed} accent="cyan" />
      </StatGrid>
      <div className="mt-5 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm">
        {diff.length ? diff.map((line, index) => (
          <div key={index} className={line.type === 'added' ? 'bg-emerald-400/10 text-emerald-300' : line.type === 'removed' ? 'bg-rose-400/10 text-rose-300' : 'text-slate-400'}>
            <span className="mr-3 select-none text-slate-600">{line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}</span>
            {line.text || ' '}
          </div>
        )) : <p className="text-slate-500">Paste two versions to compare them.</p>}
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
          <Label htmlFor="li-unit">Generate</Label>
          <Select id="li-unit" className="mt-2" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </Select>
        </div>
        <LabelledField label="How many" id="li-count" type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} />
        <div className="flex items-end"><Button onClick={generate} className="w-full md:w-auto">Generate</Button></div>
      </Grid>
      <div className="mt-4 flex flex-wrap gap-3">
        <Toggle checked={classic} onChange={() => setClassic(!classic)} label='Start with "Lorem ipsum dolor sit amet"' />
        <Toggle checked={wrapHtml} onChange={() => setWrapHtml(!wrapHtml)} label="Wrap in <p> tags" />
      </div>
      <TextArea className="mt-5 min-h-64" value={output} readOnly placeholder="Your placeholder text will appear here." />
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* --------------------------------------------------------- Slug generator */
export function SlugGenerator() {
  const [title, setTitle] = useState('');
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxWords, setMaxWords] = useState('0');

  const slug = useMemo(() => {
    let words = title
      // Decompose accents into base letter + combining mark, then drop the
      // marks, so "café" transliterates to "cafe" rather than "caf".
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      // Apostrophes vanish rather than becoming separators: "don't" -> "dont".
      .replace(/['‘’`]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim().split(/\s+/).filter(Boolean);
    if (removeStopWords) {
      const kept = words.filter((word) => !STOP_WORDS.has(word));
      if (kept.length) words = kept;
    }
    const limit = Math.floor(Number(maxWords) || 0);
    if (limit > 0) words = words.slice(0, limit);
    return words.join('-');
  }, [title, removeStopWords, maxWords]);

  return (
    <>
      <Label htmlFor="slug-title">Page or article title</Label>
      <Field id="slug-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="How to Calculate Profit Margin in 2026" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Toggle checked={removeStopWords} onChange={() => setRemoveStopWords(!removeStopWords)} label="Remove stop words" />
        <div className="w-40">
          <Field type="number" min="0" max="20" value={maxWords} onChange={(e) => setMaxWords(e.target.value)} aria-label="Maximum words (0 for no limit)" placeholder="Max words" />
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
        <span className="text-sm text-slate-400">URL slug</span>
        <p className="mt-2 break-all font-mono text-xl text-emerald-300">{slug || 'your-slug-appears-here'}</p>
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Characters" value={slug.length} accent={slug.length > 60 ? 'indigo' : 'emerald'} />
        <Stat label="Words" value={slug ? slug.split('-').length : 0} accent="cyan" />
        <Stat label="Length check" value={slug.length > 60 ? 'A bit long' : slug.length ? 'Good' : '—'} />
      </StatGrid>
      <div className="mt-4"><CopyButton value={slug} /></div>
    </>
  );
}

/* ------------------------------------------------------- Word frequency */
export function WordFrequencyCounter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('1');
  const [filterStopWords, setFilterStopWords] = useState(true);

  const analysis = useMemo(() => {
    const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, ' ').split(/\s+/).filter(Boolean);
    const size = Number(mode);
    const grams = [];
    for (let i = 0; i <= words.length - size; i += 1) {
      const gram = words.slice(i, i + size);
      if (size === 1 && filterStopWords && STOP_WORDS.has(gram[0])) continue;
      if (size > 1 && filterStopWords && gram.every((word) => STOP_WORDS.has(word))) continue;
      grams.push(gram.join(' '));
    }
    const counts = grams.reduce((map, gram) => map.set(gram, (map.get(gram) || 0) + 1), new Map());
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
    return { entries, total: words.length };
  }, [text, mode, filterStopWords]);

  return (
    <>
      <Label htmlFor="wf-text">Text to analyse</Label>
      <TextArea id="wf-text" className="mt-2 min-h-48" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste an article, page copy, or draft…" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Segmented ariaLabel="Phrase length" value={mode} onChange={setMode}
          options={[{ value: '1', label: 'Single words' }, { value: '2', label: 'Two-word phrases' }, { value: '3', label: 'Three-word phrases' }]} />
        <Toggle checked={filterStopWords} onChange={() => setFilterStopWords(!filterStopWords)} label="Filter common words" />
      </div>
      {analysis.entries.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr><th className="p-3">#</th><th className="p-3">Term</th><th className="p-3">Count</th><th className="p-3">Density</th></tr>
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
      <p className="mt-4 text-sm text-slate-500">Total words analysed: {analysis.total.toLocaleString()}. There is no density target to hit — anything above roughly 3% for one term tends to read as repetitive.</p>
    </>
  );
}

/* --------------------------------------------------- Remove line breaks */
export function RemoveLineBreaks() {
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
        <Toggle checked={keepParagraphs} onChange={() => setKeepParagraphs(!keepParagraphs)} label="Keep paragraph breaks" />
        <Toggle checked={collapseSpaces} onChange={() => setCollapseSpaces(!collapseSpaces)} label="Collapse extra spaces" />
        <Toggle checked={joinHyphens} onChange={() => setJoinHyphens(!joinHyphens)} label="Rejoin hyphenated words" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="rlb-in">Text with broken lines</Label>
          <TextArea id="rlb-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text copied from a PDF or email…" />
        </div>
        <div>
          <Label htmlFor="rlb-out">Cleaned text</Label>
          <TextArea id="rlb-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}

/* ---------------------------------------------------------- Reverse text */
export function ReverseText() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('characters');

  const output = useMemo(() => {
    if (mode === 'characters') return Array.from(text).reverse().join('');
    if (mode === 'words') return text.split(/(\s+)/).reverse().join('');
    return text.split('\n').reverse().join('\n');
  }, [text, mode]);

  const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isPalindrome = text.trim() && normalise(text) === normalise(text).split('').reverse().join('');

  return (
    <>
      <Segmented ariaLabel="Reverse mode" value={mode} onChange={setMode}
        options={[{ value: 'characters', label: 'Reverse characters' }, { value: 'words', label: 'Reverse word order' }, { value: 'lines', label: 'Reverse line order' }]} />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="rev-in">Input</Label>
          <TextArea id="rev-in" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rev-out">Reversed</Label>
          <TextArea id="rev-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      {isPalindrome && <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">That text is a palindrome — it reads the same in both directions.</p>}
      <div className="mt-4"><CopyButton value={output} /></div>
    </>
  );
}
