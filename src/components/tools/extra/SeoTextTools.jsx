import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, Panel, Segmented, Stat, StatGrid, TextArea,
} from '../impl/uiKit.jsx';
import { useFormat } from '../../../i18n/i18n.js';
import { analyzeReadability, buildHreflang } from '../../../lib/extra/seoText.js';

/* ------------------------------------------------- Readability checker */
const SAMPLE = 'Good writing is easy to read. Short sentences help. So do plain words. '
  + 'When a sentence grows long, because the writer keeps adding clauses, qualifications and asides that the reader must hold in mind until the verb finally arrives, the reader tires and leaves. '
  + 'Cut it in two. Then check the score again.';

const gradeHint = (n) => (n < 1 ? 'Kindergarten' : `US grade ${Math.round(n)}`);

export function ReadabilityChecker() {
  const { num } = useFormat();
  const [text, setText] = useState(SAMPLE);
  const r = useMemo(() => analyzeReadability(text), [text]);

  return (
    <>
      <Label htmlFor="rc-in">Paste your text (English)</Label>
      <TextArea id="rc-in" className="mt-2 min-h-[200px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a paragraph, an article or a page of copy…" />
      {!r && <p className="mt-4 text-sm text-slate-400">Paste some text to see its readability score.</p>}
      {r && (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Flesch Reading Ease" value={num(r.fleschReadingEase, 1)} accent="emerald" hint={`${r.band.label} · ${r.band.grade}`} />
            <Stat label="Flesch-Kincaid grade" value={num(r.fleschKincaid, 1)} accent="cyan" hint={gradeHint(r.fleschKincaid)} />
            <Stat label="Words" value={num(r.words, 0)} hint={`${num(r.sentences, 0)} sentences`} />
            <Stat label="Avg sentence" value={`${num(r.avgSentenceLength, 1)} words`} hint={r.avgSentenceLength > 20 ? 'Aim for under 20' : 'Good length'} />
          </StatGrid>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Gunning Fog" value={num(r.gunningFog, 1)} />
            <Stat label="Coleman-Liau" value={num(r.colemanLiau, 1)} />
            <Stat label="Automated Readability" value={num(r.ari, 1)} />
            <Stat label="SMOG" value={r.smog === null ? 'n/a' : num(r.smog, 1)} hint={r.smog === null ? 'Needs 30+ sentences' : undefined} />
          </StatGrid>
          <p className="mt-4 text-sm text-slate-400">
            Reading time about {num(Math.max(r.readingMinutes, 0.1), 1)} min at 238 words a minute; speaking time about {num(Math.max(r.speakingMinutes, 0.1), 1)} min at 150.
            {' '}{num(r.complexWords, 0)} words have three or more syllables ({num((r.complexWords / r.words) * 100, 0)}%).
          </p>
          <div className="mt-6">
            <Panel title={r.longSentences.length ? `Sentences over 25 words (${r.longSentences.length})` : 'No sentences over 25 words'}>
              {r.longSentences.length === 0 && <p className="text-sm text-slate-400">Nothing to split. Long sentences are the fastest way to lose points, and you have none.</p>}
              <ul className="space-y-3">
                {r.longSentences.slice(0, 8).map((s) => (
                  <li key={s.text} className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-slate-200">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-300">{s.words} words</span>{s.text}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </>
      )}
      <p className="mt-4 text-sm text-slate-500">The formulas are designed for English. Syllables are counted by a rule-of-thumb, so scores can differ by a point or two from other tools. Nothing you paste leaves your browser.</p>
    </>
  );
}

/* --------------------------------------------------- Hreflang generator */
const STARTER = [
  { code: 'en', url: 'https://example.com/' },
  { code: 'de', url: 'https://example.com/de/' },
  { code: 'es', url: 'https://example.com/es/' },
];

const FORMATS = [
  { value: 'html', label: 'HTML <head>' },
  { value: 'header', label: 'HTTP header' },
  { value: 'sitemap', label: 'XML sitemap' },
];

export function HreflangGenerator() {
  const [rows, setRows] = useState(STARTER);
  const [xDefault, setXDefault] = useState('https://example.com/');
  const [format, setFormat] = useState('html');

  const result = useMemo(() => buildHreflang(rows, xDefault), [rows, xDefault]);
  const update = (index, key, value) => setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const output = result[format];

  return (
    <>
      <p className="mb-3 text-sm text-slate-400">List every language version of one page, including the page itself. Each version needs the same full set of tags.</p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[110px_1fr_auto] items-end gap-3">
            <div>
              {i === 0 && <Label htmlFor={`hl-c-${i}`}>Language</Label>}
              <Field id={`hl-c-${i}`} className={i === 0 ? 'mt-2' : ''} value={row.code} placeholder="en-GB" aria-label={`Language code, row ${i + 1}`} onChange={(e) => update(i, 'code', e.target.value)} />
            </div>
            <div>
              {i === 0 && <Label htmlFor={`hl-u-${i}`}>Absolute URL</Label>}
              <Field id={`hl-u-${i}`} className={i === 0 ? 'mt-2' : ''} value={row.url} placeholder="https://example.com/de/" aria-label={`URL, row ${i + 1}`} onChange={(e) => update(i, 'url', e.target.value)} />
            </div>
            <Button variant="ghost" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))} disabled={rows.length < 2} aria-label={`Remove row ${i + 1}`}>✕</Button>
          </div>
        ))}
      </div>
      <div className="mt-4"><Button variant="ghost" onClick={() => setRows((prev) => [...prev, { code: '', url: '' }])}>+ Add language</Button></div>
      <div className="mt-5 max-w-xl">
        <Label htmlFor="hl-x" hint="Optional. The page for visitors whose language you do not list: a language selector or your main version.">x-default URL</Label>
        <Field id="hl-x" className="mt-2" value={xDefault} placeholder="https://example.com/" onChange={(e) => setXDefault(e.target.value)} />
      </div>

      {result.problems.length > 0 && <ErrorNote>{result.problems.map((p) => <span key={p} className="block">{p}</span>)}</ErrorNote>}
      {result.warnings.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          {result.warnings.map((w) => <span key={w} className="block">{w}</span>)}
        </div>
      )}

      <div className="mt-6">
        <Segmented ariaLabel="Output format" value={format} onChange={setFormat} options={FORMATS} />
        <Label htmlFor="hl-out">{format === 'sitemap' ? 'Paste into your XML sitemap' : format === 'header' ? 'Send as an HTTP response header' : 'Paste inside <head> on every version'}</Label>
        <TextArea id="hl-out" className="mt-2 min-h-[180px] font-mono text-sm" readOnly value={result.ok ? output : ''} placeholder="Fix the problems above to generate the tags." />
        <div className="mt-3"><CopyButton value={result.ok ? output : ''} /></div>
      </div>
      <p className="mt-4 text-sm text-slate-500">Each page must carry the complete set, pointing back at every other version and at itself. Pages that do not link back are ignored by Google.</p>
    </>
  );
}
