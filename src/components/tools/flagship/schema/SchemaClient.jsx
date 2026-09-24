import { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Check, Copy, Download, ExternalLink, Info, XCircle,
} from 'lucide-react';
import SchemaForm from './SchemaForm.jsx';
import SchemaPreview from './SchemaPreview.jsx';
import { SCHEMA_TYPES } from '../../../../lib/schema/registry.js';
import {
  highlight, toJson, toNextSnippet, toScriptBlock, validate,
} from '../../../../lib/schema/core.js';
import { useSchemaStatus } from '../../../../lib/schema/useSchemaStatus.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const TONE = { key: 'text-sky-300', string: 'text-emerald-300', number: 'text-amber-300', literal: 'text-fuchsia-300', punct: 'text-slate-400' };
const TABS = [['json', 'JSON-LD'], ['html', 'HTML script tag'], ['next', 'Next.js App Router']];

const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function Eligibility({ status, type }) {
  const tone = status.richResult === 'eligible' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
    : 'border-amber-400/30 bg-amber-400/10 text-amber-100';
  const label = status.richResult === 'eligible' ? 'Eligible for a Google rich result' : status.richResult === 'limited' ? 'Rich result limited by Google' : 'Rich result no longer shown by Google';
  return (
    <div className={cx('rounded-2xl border p-4 text-sm leading-6', tone)}>
      <p className="flex items-center gap-2 font-bold">{status.richResult === 'eligible' ? <Info size={16} /> : <AlertTriangle size={16} />}{label}</p>
      <p className="mt-1 opacity-90">{status.googleNotes}</p>
      <p className="mt-2 text-xs opacity-80">
        Status verified on {longDate(status.verifiedOn)} ·{' '}
        <a href={status.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">Google’s {type.name} documentation <ExternalLink size={11} /></a>
      </p>
    </div>
  );
}

function IssueList({ issues, level, docsUrl }) {
  if (!issues.length) return null;
  const Icon = level === 'error' ? XCircle : AlertTriangle;
  return (
    <ul className="space-y-2">
      {issues.map((issue, i) => (
        <li key={`${issue.path}-${i}`} className={cx('flex items-start gap-2 rounded-xl border p-3 text-sm', level === 'error' ? 'border-rose-400/25 bg-rose-500/10 text-rose-100' : 'border-amber-400/20 bg-amber-400/10 text-amber-100')}>
          <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{issue.message} <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-xs underline opacity-80">Docs</a></span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The generator: a form built from a type definition, live JSON-LD, validation
 * and an illustrative preview. `picker` (hub page) adds a type selector.
 */
export default function SchemaClient({ typeSlug, picker = false }) {
  const [slug, setSlug] = useState(typeSlug || SCHEMA_TYPES[0].slug);
  const type = SCHEMA_TYPES.find((item) => item.slug === slug);
  const [valuesByType, setValuesByType] = useState({});
  const values = valuesByType[type.slug] ?? type.example;
  const [tab, setTab] = useState('json');
  const [copied, setCopied] = useState('');
  const tracked = useRef(false);
  const status = useSchemaStatus(type);

  const setValues = (next) => {
    setValuesByType((current) => ({ ...current, [type.slug]: next }));
    if (!tracked.current) { tracked.current = true; trackToolEvent('schema-generator', 'edit', { type: type.slug }); }
  };

  const built = useMemo(() => type.build(values), [type, values]);
  const { errors, warnings } = useMemo(() => validate(type, values, status), [type, values, status]);
  const json = useMemo(() => toJson(built), [built]);
  const outputs = useMemo(() => ({ json, html: toScriptBlock(built), next: toNextSnippet(built) }), [json, built]);
  const issues = useMemo(() => [...errors, ...warnings.filter((w) => !w.eligibility)], [errors, warnings]);

  const copy = async (key) => {
    try {
      await navigator.clipboard.writeText(outputs[key]);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* clipboard unavailable */ }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/ld+json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `${type.slug}-schema.json`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div>
      {picker && (
        <div className="mb-6">
          <label htmlFor="schema-type" className="block text-sm font-medium text-slate-300">Schema type</label>
          <select id="schema-type" value={slug} onChange={(event) => { setSlug(event.target.value); setTab('json'); }} className="mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400">
            {SCHEMA_TYPES.map((item) => <option key={item.slug} value={item.slug}>{item.label} ({item.name})</option>)}
          </select>
        </div>
      )}

      <Eligibility status={status} type={type} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Fill in your details</h2>
            <button type="button" onClick={() => setValues({})} className="text-xs text-slate-400 underline decoration-dotted underline-offset-4 hover:text-white">Clear</button>
          </div>
          <SchemaForm fields={type.fields} values={values} onChange={setValues} issues={issues} />
        </div>

        <div className="min-w-0 space-y-5 lg:sticky lg:top-4 lg:self-start">
          <section aria-label="Generated markup">
            <div role="tablist" aria-label="Output format" className="flex flex-wrap items-center gap-2">
              {TABS.map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={cx('rounded-full px-3 py-1.5 text-xs font-semibold', tab === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white')}>{label}</button>
              ))}
              <span className="ml-auto flex gap-2">
                <button type="button" onClick={() => copy(tab)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/20">{copied === tab ? <Check size={14} /> : <Copy size={14} />}{copied === tab ? 'Copied' : 'Copy'}</button>
                <button type="button" onClick={download} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/20"><Download size={14} /> .json</button>
              </span>
            </div>
            <pre className="mt-3 max-h-[26rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs leading-5" aria-live="polite">
              <code>{tab === 'json' ? highlight(outputs.json).map((token, i) => <span key={i} className={TONE[token.kind]}>{token.text}</span>) : outputs[tab]}</code>
            </pre>
          </section>

          <section aria-label="Validation">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Validation — <span className={errors.length ? 'text-rose-300' : 'text-emerald-300'}>{errors.length ? `${errors.length} error${errors.length === 1 ? '' : 's'}` : 'no errors'}</span>
              {warnings.filter((w) => !w.eligibility).length > 0 && <span className="text-amber-200">, {warnings.filter((w) => !w.eligibility).length} warning{warnings.filter((w) => !w.eligibility).length === 1 ? '' : 's'}</span>}
            </h3>
            <div className="mt-3 space-y-2">
              <IssueList issues={errors} level="error" docsUrl={status.docsUrl} />
              <IssueList issues={warnings.filter((w) => !w.eligibility)} level="warning" docsUrl={status.docsUrl} />
              {!errors.length && !warnings.some((w) => !w.eligibility) && <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">All required and recommended fields are present and correctly formatted.</p>}
            </div>
          </section>

          <section aria-label="Rich result preview">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Rich result preview (illustration)</h3>
            <div className="mt-3"><SchemaPreview kind={type.previewKind} json={built} status={status} /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
