import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, Copy, FileText } from 'lucide-react';
import { useModels } from '../../../../lib/llm/useModels.js';
import {
  callCost, compactTokens, markdownTable, monthlyCost, usd,
} from '../../../../lib/llm/cost.js';
import { SITE_URL } from '../../../../seo/siteMeta.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const SAMPLE = 'You are a helpful assistant for a customer-support team. Summarise the ticket below in two sentences, classify its urgency as low, medium or high, and suggest the next action.\n\nTicket: My invoice for March shows two charges for the same subscription. Please refund one of them.';

const NumberField = ({ label, value, onChange, min = 0, step = 1, hint }) => (
  <label className="block text-sm font-medium text-slate-300">
    {label}
    <input
      type="number"
      inputMode="numeric"
      min={min}
      step={step}
      value={value}
      onChange={(event) => onChange(event.target.value === '' ? '' : Math.max(min, Number(event.target.value)))}
      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-100 outline-none transition focus:border-indigo-400"
    />
    {hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
  </label>
);

const num = (value) => (value === '' || Number.isNaN(Number(value)) ? 0 : Number(value));

/**
 * Token counter + cost comparison. `mode="counter"` measures a pasted prompt;
 * `mode="cost"` lets you type the token volume directly (for budgeting a feature
 * before any prompt exists). `focusSlug` pins one model's row on top.
 */
export default function CounterClient({ mode = 'counter', focusSlug = null }) {
  const { models, verifiedOn } = useModels();
  const [text, setText] = useState('');
  const [counted, setCounted] = useState({ o200k_base: 0 });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [manualInput, setManualInput] = useState(2000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [callsPerDay, setCallsPerDay] = useState(1000);
  const [cached, setCached] = useState(false);
  const [copied, setCopied] = useState(false);
  const workerRef = useRef(null);
  const requestRef = useRef(0);
  const trackedRef = useRef(false);

  useEffect(() => () => workerRef.current?.terminate(), []);

  // Debounced tokenization off the main thread.
  useEffect(() => {
    // Nothing to count: skip loading the multi-megabyte tokenizer altogether.
    if (!text) { setCounted({ o200k_base: 0 }); setBusy(false); return undefined; }
    const timer = setTimeout(() => {
      try {
        if (!workerRef.current) {
          workerRef.current = new Worker(new URL('../../../../lib/llm/tokenize.worker.js', import.meta.url), { type: 'module' });
          workerRef.current.onmessage = (event) => {
            if (event.data.id !== requestRef.current) return;
            setBusy(false);
            if (event.data.error) { setFailed(true); return; }
            setFailed(false);
            setCounted(event.data.counts);
          };
          workerRef.current.onerror = () => { setBusy(false); setFailed(true); };
        }
        requestRef.current += 1;
        setBusy(true);
        workerRef.current.postMessage({ id: requestRef.current, text, tokenizers: ['o200k_base'] });
      } catch {
        setFailed(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [text, mode]);

  const measured = mode === 'counter' || text.length > 0;
  const inputTokens = measured ? counted.o200k_base : num(manualInput);
  const out = num(outputTokens);
  const calls = num(callsPerDay);

  const rows = useMemo(() => {
    const list = models.map((model) => {
      const cost = callCost(model, { inputTokens, outputTokens: out, cached });
      return {
        model,
        tokens: inputTokens,
        approx: !model.exact,
        perCall: cost.total,
        input: cost.input,
        output: cost.output,
        perMonth: monthlyCost(cost.total, calls),
        over: model.context != null && inputTokens > model.context,
      };
    }).sort((a, b) => a.perCall - b.perCall);
    if (!focusSlug) return list;
    const focus = list.find((row) => row.model.slug === focusSlug);
    return focus ? [focus, ...list.filter((row) => row !== focus)] : list;
  }, [models, inputTokens, out, calls, cached, focusSlug]);

  const cheapest = rows.reduce((best, row) => (row.perCall < best ? row.perCall : best), Infinity);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const onFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setFailed(true); return; }
    setText(await file.text());
  };

  const copyMarkdown = async () => {
    const md = markdownTable(rows.map((row) => ({ ...row })), {
      inputTokens, outputTokens: out, cached, callsPerDay: calls, verifiedOn, url: `${SITE_URL}/tools/llm-token-counter`,
    });
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  // One anonymous counter per visit, the first time a comparison is actually used.
  useEffect(() => {
    if (trackedRef.current || inputTokens === 0) return;
    trackedRef.current = true;
    trackToolEvent('llm-token-counter', 'calculate', { models_compared: models.length, mode });
  }, [inputTokens, models.length, mode]);

  return (
    <div data-clarity-mask="true">
      {(
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="llm-prompt" className="text-sm font-medium text-slate-300">
              {mode === 'counter' ? 'Paste your prompt' : 'Optional: paste a prompt to measure its real token count'}
            </label>
            <div className="flex items-center gap-3 text-xs">
              <button type="button" onClick={() => setText(SAMPLE)} className="text-indigo-300 hover:text-white">Use a sample</button>
              <label className="cursor-pointer text-indigo-300 hover:text-white">
                <FileText size={12} className="mr-1 inline" aria-hidden="true" />Load .txt / .md
                <input type="file" accept=".txt,.md,text/plain,text/markdown" className="sr-only" onChange={(event) => { onFile(event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              {text && <button type="button" onClick={() => setText('')} className="text-slate-400 hover:text-white">Clear</button>}
            </div>
          </div>
          <textarea
            id="llm-prompt"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); onFile(event.dataTransfer.files?.[0]); }}
            spellCheck="false"
            placeholder="Paste or drop text here. It is tokenized in your browser and never sent anywhere."
            className={cx('mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-indigo-400', mode === 'counter' ? 'min-h-52' : 'min-h-24')}
          />
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-400" aria-live="polite">
            <span><strong className="text-white">{measured ? counted.o200k_base.toLocaleString('en-US') : '—'}</strong> tokens{busy && ' …'}</span>
            <span><strong className="text-slate-200">{text.length.toLocaleString('en-US')}</strong> characters</span>
            <span><strong className="text-slate-200">{words.toLocaleString('en-US')}</strong> words</span>
          </div>
          {failed && <p role="alert" className="mt-2 text-sm text-rose-300">The tokenizer could not run in this browser (or the file was over 5 MB).</p>}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mode === 'cost' && !text && (
          <NumberField label="Input tokens per call" value={manualInput} onChange={setManualInput} hint="Prompt + context you send each time" />
        )}
        <NumberField label="Output tokens per call" value={outputTokens} onChange={setOutputTokens} hint="Expected length of the reply" />
        <NumberField label="Calls per day" value={callsPerDay} onChange={setCallsPerDay} hint="Used for the monthly column (30 days)" />
        <label className="flex cursor-pointer items-center gap-2 self-start rounded-xl bg-white/5 px-3 py-2.5 text-sm text-slate-200 sm:mt-7">
          <input type="checkbox" checked={cached} onChange={(event) => setCached(event.target.checked)} className="h-4 w-4 accent-indigo-500" />
          Prompt is served from cache
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-3 py-2.5">Model</th>
              <th className="px-3 py-2.5 text-right">Input tokens</th>
              <th className="px-3 py-2.5 text-right">Input cost</th>
              <th className="px-3 py-2.5 text-right">Output cost</th>
              <th className="px-3 py-2.5 text-right">Per call</th>
              <th className="px-3 py-2.5 text-right">Per month</th>
              <th className="px-3 py-2.5 text-right">Context</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isCheapest = row.perCall === cheapest;
              const isFocus = row.model.slug === focusSlug;
              return (
                <tr key={row.model.slug} className={cx('border-t border-white/5', isFocus && 'bg-indigo-500/10', isCheapest && 'bg-emerald-500/10')}>
                  <th scope="row" className="px-3 py-2 text-left font-semibold text-white">
                    {row.model.name}
                    <span className="ml-2 text-xs font-normal text-slate-500">{row.model.provider}</span>
                    {isCheapest && <span className="ml-2 rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">cheapest</span>}
                  </th>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-200" title={row.approx ? 'Estimated with o200k_base — this model’s own tokenizer is not available in the browser' : 'Exact: this model uses o200k_base'}>
                    {row.approx ? '≈' : ''}{row.tokens.toLocaleString('en-US')}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{usd(row.input)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{usd(row.output)}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-white">{usd(row.perCall)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-200">{usd(row.perMonth)}</td>
                  <td className={cx('px-3 py-2 text-right tabular-nums', row.over ? 'font-semibold text-rose-300' : 'text-slate-400')}>
                    {row.over && <AlertTriangle size={12} className="mr-1 inline" aria-label="Prompt exceeds this model’s context window" />}
                    {compactTokens(row.model.context)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-xs leading-5 text-slate-500">
          ≈ marks a count estimated with OpenAI’s o200k_base encoding, because that model’s own tokenizer cannot run in a browser — the real figure can differ, and Anthropic notes its newer models produce roughly 30% more tokens than earlier ones. Exact counts are shown without ≈. Prices verified {verifiedOn}.
        </p>
        <button type="button" onClick={copyMarkdown} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/20">
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy as markdown table'}
        </button>
      </div>
    </div>
  );
}
