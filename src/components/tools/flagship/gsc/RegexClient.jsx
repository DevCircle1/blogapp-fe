import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import {
  GSC_REGEX_MAX_LENGTH, RECIPES, buildPattern, checkPattern, previewMatches,
} from '../../../../lib/seo/gscRegex.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const SAMPLE_LINES = [
  'how to count words in google docs',
  'word counter',
  'what is a good keyword density',
  'talkandtool word counter',
  'keyword density checker free online tool',
  'why is my ctr low in search console',
  'unit converter',
].join('\n');

const field = 'w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none';

/** /tools/search-console-regex-generator — build, check and test a regex for the Performance report filter. */
export default function RegexClient() {
  const [recipeId, setRecipeId] = useState('questions');
  const [terms, setTerms] = useState('');
  const [minWords, setMinWords] = useState(5);
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [custom, setCustom] = useState(null);
  const [negate, setNegate] = useState(false);
  const [testText, setTestText] = useState(SAMPLE_LINES);
  const [copied, setCopied] = useState(false);

  const recipe = RECIPES[recipeId];
  const generated = buildPattern(recipeId, { terms, minWords }, { caseInsensitive });
  // Editing the output switches to a hand-written pattern until a recipe input changes.
  const pattern = custom ?? generated;
  const { problems, regex } = useMemo(() => checkPattern(pattern), [pattern]);
  const preview = useMemo(() => previewMatches(regex, testText, { negate }), [regex, testText, negate]);

  const resetCustom = (setter) => (event) => { setCustom(null); setter(event.target.value); };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pattern);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      trackToolEvent('gsc-regex', 'copy', { recipe: custom === null ? recipeId : 'custom', length: pattern.length });
    } catch { /* Clipboard blocked: the pattern is still selectable in the box. */ }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label htmlFor="regex-recipe" className="mb-2 block text-sm font-semibold text-slate-200">What do you want to filter?</label>
          <select id="regex-recipe" value={recipeId} onChange={resetCustom(setRecipeId)} className={field}>
            {Object.entries(RECIPES).map(([id, item]) => <option key={id} value={id}>{item.label} — {item.target}</option>)}
          </select>
          <p className="mt-2 text-sm leading-6 text-slate-400">{recipe.help}</p>
        </div>

        {recipe.termsLabel && (
          <div>
            <label htmlFor="regex-terms" className="mb-2 block text-sm font-semibold text-slate-200">{recipe.termsLabel}</label>
            <textarea id="regex-terms" rows={3} value={terms} onChange={resetCustom(setTerms)} placeholder="Separate with commas or new lines" className={field} />
          </div>
        )}

        {recipeId === 'longTail' && (
          <div>
            <label htmlFor="regex-words" className="mb-2 block text-sm font-semibold text-slate-200">Minimum words in the query</label>
            <input id="regex-words" type="number" min={2} max={20} value={minWords} onChange={resetCustom(setMinWords)} className={field} />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={caseInsensitive} onChange={(event) => { setCustom(null); setCaseInsensitive(event.target.checked); }} />
          Ignore upper/lower case (adds <code className="text-indigo-200">(?i)</code>)
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="regex-output" className="text-sm font-semibold text-slate-200">Your regex — paste into Custom (regex)</label>
            <span className={cx('text-xs', pattern.length > GSC_REGEX_MAX_LENGTH ? 'text-red-300' : 'text-slate-500')}>
              {pattern.length.toLocaleString('en-US')} / {GSC_REGEX_MAX_LENGTH.toLocaleString('en-US')}
            </span>
          </div>
          <textarea
            id="regex-output"
            rows={3}
            value={pattern}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="Fill in the fields above, or type your own pattern"
            spellCheck={false}
            className={cx(field, 'font-mono')}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copy} disabled={!pattern} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-40">
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy regex'}
            </button>
            {custom !== null && (
              <button type="button" onClick={() => setCustom(null)} className="text-sm font-semibold text-indigo-300 hover:text-white">Back to generated pattern</button>
            )}
          </div>
          {problems.length > 0 && (
            <ul className="mt-3 space-y-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
              {problems.map((problem) => (
                <li key={problem} className="flex gap-2"><AlertTriangle size={16} className="mt-0.5 shrink-0" /> {problem}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="regex-test" className="mb-2 block text-sm font-semibold text-slate-200">Test it on your queries or URLs (one per line)</label>
          <textarea id="regex-test" rows={8} value={testText} onChange={(event) => setTestText(event.target.value)} spellCheck={false} className={cx(field, 'font-mono')} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={negate} onChange={(event) => setNegate(event.target.checked)} />
          Preview as &ldquo;Doesn&rsquo;t match regex&rdquo;
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
            <h3 className="text-sm font-bold text-emerald-200">Kept by the filter ({preview.matched.length})</h3>
            <ul className="mt-2 space-y-1 break-words font-mono text-xs text-slate-300">
              {preview.matched.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <h3 className="text-sm font-bold text-slate-300">Filtered out ({preview.unmatched.length})</h3>
            <ul className="mt-2 space-y-1 break-words font-mono text-xs text-slate-500">
              {preview.unmatched.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
