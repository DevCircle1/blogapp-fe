import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  AlertTriangle, Download, Eye, FileSpreadsheet, Plus, ShieldCheck, Trash2, Upload, X,
} from 'lucide-react';
import VirtualTable from './VirtualTable.jsx';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const XLSX_MAX_ROWS = 1048576;
const DELIMITERS = { ',': 'comma', ';': 'semicolon', '\t': 'tab', '|': 'pipe' };

const fmtBytes = (n) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : n >= 1e3 ? `${(n / 1e3).toFixed(0)} KB` : `${n} B`);
const int = (n) => Math.round(n).toLocaleString('en-US');
const sizeBucket = (n) => (n < 1e7 ? '<10MB' : n < 1e8 ? '10-100MB' : n < 5e8 ? '100-500MB' : n < 1e9 ? '500MB-1GB' : '1GB+');
const rowBucket = (n) => (n < 1e5 ? '<100k' : n < 1e6 ? '100k-1M' : n < 1e7 ? '1M-10M' : '10M+');

const inputClass = 'rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400';

function Button({ children, variant = 'ghost', icon: Icon, ...props }) {
  return (
    <button type="button" {...props} className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40', variant === 'primary' ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white/10 text-slate-100 hover:bg-white/20')}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}

function Dropzone({ multiple, onFiles, label, hint }) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(event) => { event.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => { event.preventDefault(); setOver(false); onFiles([...event.dataTransfer.files]); }}
      className={cx('flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition', over ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
    >
      <Upload size={28} className="text-indigo-300" aria-hidden="true" />
      <span className="text-lg font-semibold text-white">{label}</span>
      <span className="text-sm text-slate-400">{hint}</span>
      <input type="file" multiple={multiple} accept=".csv,.tsv,.txt,text/csv,text/plain" className="sr-only" onChange={(event) => { onFiles([...event.target.files]); event.target.value = ''; }} />
    </label>
  );
}

/* ------------------------------------------------------------------ panels */

function FilterPanel({ info, run, busy }) {
  const names = (info.header.length ? info.header : Array.from({ length: info.fields }, (_, i) => `Column ${i + 1}`));
  const [rules, setRules] = useState([{ col: 0, op: 'contains', value: '' }]);
  const [matchAll, setMatchAll] = useState(true);
  const update = (i, patch) => setRules((current) => current.map((rule, j) => (j === i ? { ...rule, ...patch } : rule)));
  const needsValue = (op) => !['empty', 'notEmpty'].includes(op);
  return (
    <div>
      <div className="space-y-2">
        {rules.map((rule, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select aria-label="Column" value={rule.col} onChange={(event) => update(i, { col: Number(event.target.value) })} className={inputClass}>{names.map((name, c) => <option key={c} value={c}>{name || `Column ${c + 1}`}</option>)}</select>
            <select aria-label="Condition" value={rule.op} onChange={(event) => update(i, { op: event.target.value })} className={inputClass}>
              {[['contains', 'contains'], ['notContains', 'does not contain'], ['equals', 'equals'], ['notEquals', 'does not equal'], ['gt', 'is greater than'], ['lt', 'is less than'], ['regex', 'matches regex'], ['empty', 'is empty'], ['notEmpty', 'is not empty']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {needsValue(rule.op) && <input aria-label="Value" value={rule.value} onChange={(event) => update(i, { value: event.target.value })} className={cx(inputClass, 'min-w-[10rem] grow')} />}
            {rules.length > 1 && <button type="button" aria-label="Remove condition" onClick={() => setRules((current) => current.filter((_, j) => j !== i))} className="rounded p-2 text-slate-500 hover:text-rose-300"><Trash2 size={16} /></button>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button icon={Plus} onClick={() => setRules((current) => [...current, { col: 0, op: 'contains', value: '' }])}>Add condition</Button>
        {rules.length > 1 && (
          <select aria-label="Match" value={matchAll ? 'all' : 'any'} onChange={(event) => setMatchAll(event.target.value === 'all')} className={inputClass}><option value="all">Match all conditions</option><option value="any">Match any condition</option></select>
        )}
        <Button variant="primary" disabled={busy} onClick={() => run('filter', { predicates: rules, matchAll })}>Filter rows</Button>
      </div>
    </div>
  );
}

function SortPanel({ info, run, busy }) {
  const names = (info.header.length ? info.header : Array.from({ length: info.fields }, (_, i) => `Column ${i + 1}`));
  const [col, setCol] = useState(0);
  const [numeric, setNumeric] = useState(info.types[0] === 'integer' || info.types[0] === 'decimal');
  const [desc, setDesc] = useState(false);
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-xs text-slate-400">Column<select value={col} onChange={(event) => { const c = Number(event.target.value); setCol(c); setNumeric(['integer', 'decimal'].includes(info.types[c])); }} className={cx(inputClass, 'mt-1 block')}>{names.map((name, c) => <option key={c} value={c}>{name || `Column ${c + 1}`}</option>)}</select></label>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={numeric} onChange={(event) => setNumeric(event.target.checked)} className="accent-indigo-500" /> Numeric</label>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={desc} onChange={(event) => setDesc(event.target.checked)} className="accent-indigo-500" /> Descending</label>
      <Button variant="primary" disabled={busy} onClick={() => run('sort', { col, numeric, desc })}>Sort file</Button>
      <p className="w-full text-xs text-slate-500">Sorting uses an external merge sort, so it works on files larger than memory. Blank and non-numeric values go last.</p>
    </div>
  );
}

function DedupePanel({ info, run, busy }) {
  const names = (info.header.length ? info.header : Array.from({ length: info.fields }, (_, i) => `Column ${i + 1}`));
  const [selected, setSelected] = useState([]);
  const [trim, setTrim] = useState(true);
  const toggle = (c) => setSelected((current) => (current.includes(c) ? current.filter((x) => x !== c) : [...current, c]));
  return (
    <div>
      <p className="text-sm text-slate-300">Compare rows by: <strong className="text-white">{selected.length ? 'the selected columns' : 'the whole row'}</strong>. The first occurrence is kept.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {names.slice(0, 60).map((name, c) => <button key={c} type="button" aria-pressed={selected.includes(c)} onClick={() => toggle(c)} className={cx('rounded-full px-3 py-1.5 text-xs font-semibold', selected.includes(c) ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white')}>{name || `Column ${c + 1}`}</button>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {selected.length > 0 && <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} className="accent-indigo-500" /> Ignore leading and trailing spaces</label>}
        <Button variant="primary" disabled={busy} onClick={() => run('dedupe', { columns: selected, trim })}>Remove duplicate rows</Button>
      </div>
    </div>
  );
}

function SplitPanel({ info, run, busy }) {
  const names = (info.header.length ? info.header : Array.from({ length: info.fields }, (_, i) => `Column ${i + 1}`));
  const [mode, setMode] = useState('rows');
  const [rows, setRows] = useState(100000);
  const [megabytes, setMegabytes] = useState(50);
  const [col, setCol] = useState(0);
  const dataRows = info.rows - (info.hasHeader ? 1 : 0);
  return (
    <div>
      <div role="group" aria-label="Split by" className="inline-flex rounded-xl bg-white/5 p-1">
        {[['rows', 'Number of rows'], ['size', 'File size'], ['column', 'Column value']].map(([key, label]) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={cx('rounded-lg px-4 py-2 text-sm font-semibold', mode === key ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white')}>{label}</button>)}
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        {mode === 'rows' && <label className="text-xs text-slate-400">Rows per file<input type="number" min={1} value={rows} onChange={(event) => setRows(Math.max(1, Number(event.target.value)))} className={cx(inputClass, 'mt-1 block')} /></label>}
        {mode === 'size' && <label className="text-xs text-slate-400">Target size per file (MB)<input type="number" min={1} value={megabytes} onChange={(event) => setMegabytes(Math.max(1, Number(event.target.value)))} className={cx(inputClass, 'mt-1 block')} /></label>}
        {mode === 'column' && <label className="text-xs text-slate-400">Column<select value={col} onChange={(event) => setCol(Number(event.target.value))} className={cx(inputClass, 'mt-1 block')}>{names.map((name, c) => <option key={c} value={c}>{name || `Column ${c + 1}`}</option>)}</select></label>}
        <Button variant="primary" disabled={busy} onClick={() => run('split', { mode, rows, bytes: megabytes * 1024 * 1024, col })}>Split file</Button>
      </div>
      {mode === 'rows' && <p className="mt-3 text-xs text-slate-500">About {int(Math.ceil(dataRows / Math.max(1, rows)))} files. The header row is repeated in each. You get a .zip.</p>}
      {mode === 'column' && <p className="mt-3 text-xs text-slate-500">One file per distinct value (up to 500 values).</p>}
    </div>
  );
}

function ConvertPanel({ info, run, busy }) {
  const dataRows = info.rows - (info.hasHeader ? 1 : 0);
  const sheets = Math.ceil(dataRows / (XLSX_MAX_ROWS - (info.hasHeader ? 1 : 0)));
  return (
    <div className="space-y-4">
      {sheets > 1 && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />An Excel sheet holds at most 1,048,576 rows and this file has {int(dataRows)}. It will be written as {sheets} sheets in one workbook (Sheet1, Sheet2, …), with the header repeated on each. Excel itself will be slow with a workbook this size — consider splitting the file instead.</p>
      )}
      {info.maxFields > 16384 && <p className="text-sm text-rose-300">Excel allows at most 16,384 columns; this file has {int(info.maxFields)}.</p>}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" icon={FileSpreadsheet} disabled={busy || info.maxFields > 16384} onClick={() => run('xlsx', {})}>Convert to Excel (.xlsx)</Button>
        <Button disabled={busy} onClick={() => run('jsonl', {})}>Convert to JSON Lines</Button>
      </div>
      <p className="text-xs text-slate-500">Numbers become numeric cells; values with leading zeros, dates and everything else stay as text so nothing is silently changed.</p>
    </div>
  );
}

/* -------------------------------------------------------------------- main */

const TOOLS = {
  viewer: [['filter', 'Filter'], ['sort', 'Sort'], ['dedupe', 'Remove duplicates'], ['split', 'Split'], ['convert', 'Convert']],
  split: [['split', 'Split']],
  dedupe: [['dedupe', 'Remove duplicates']],
  excel: [['convert', 'Convert']],
};
const PANELS = { filter: FilterPanel, sort: SortPanel, dedupe: DedupePanel, split: SplitPanel, convert: ConvertPanel };

export default function CsvClient({ mode = 'viewer' }) {
  const [info, setInfo] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | indexing | ready
  const [progress, setProgress] = useState({ fraction: 0, rows: 0 });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [tool, setTool] = useState(TOOLS[mode]?.[0]?.[0] || 'filter');
  const [hasHeader, setHasHeader] = useState(true);
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergeMode, setMergeMode] = useState('union');
  const workerRef = useRef(null);
  const idRef = useRef(0);
  const pending = useRef(new Map());
  const gotoRef = useRef(null);
  const fileName = useRef('');
  const startedAt = useRef(0);

  const worker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../../../../lib/csv/csv.worker.js', import.meta.url), { type: 'module' });
      workerRef.current.onmessage = (event) => {
        const message = event.data;
        const handler = pending.current.get(message.id);
        if (handler) handler(message);
      };
    }
    return workerRef.current;
  }, []);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const call = useCallback((payload, onMessage, transfer) => {
    idRef.current += 1;
    const id = idRef.current;
    pending.current.set(id, (message) => { if (onMessage(message)) pending.current.delete(id); });
    worker().postMessage({ ...payload, id }, transfer || []);
    return id;
  }, [worker]);

  const open = useCallback((file, name) => {
    setError(''); setResult(null); setPhase('indexing'); setProgress({ fraction: 0, rows: 0 }); setInfo(null);
    fileName.current = name || file.name;
    startedAt.current = Date.now();
    call({ type: 'index', file, name: fileName.current }, (message) => {
      if (message.type === 'progress') { setProgress({ fraction: message.fraction, rows: message.rows }); return false; }
      if (message.type === 'indexed') {
        setInfo(message.info); setHasHeader(message.info.hasHeader); setPhase('ready');
        trackToolEvent('csv-toolkit', 'open', { operation: mode, size_bucket: sizeBucket(message.info.size), row_bucket: rowBucket(message.info.rows) });
        return true;
      }
      if (message.type === 'cancelled') { setPhase('idle'); return true; }
      setPhase('idle');
      setError(message.code === 'UTF16' ? 'This file is UTF-16 encoded. Save it as UTF-8 CSV and open it again.' : message.code === 'EMPTY' ? 'This file has no rows.' : 'This file could not be read.');
      return true;
    });
  }, [call, mode]);

  const cancel = () => workerRef.current?.postMessage({ type: 'cancel' });

  const run = useCallback((name, params) => {
    setBusy(true); setResult(null); setError(''); setProgress({ fraction: 0, rows: 0 });
    call({ type: 'op', name, params }, (message) => {
      if (message.type === 'progress') { setProgress({ fraction: message.fraction, rows: message.rows ?? 0 }); return false; }
      setBusy(false);
      if (message.type === 'result') {
        setResult({ blob: message.blob, filename: message.filename, meta: message.meta, size: message.size, name: message.name });
        trackToolEvent('csv-toolkit', name, { operation: name, size_bucket: sizeBucket(info?.size || 0), row_bucket: rowBucket(info?.rows || 0) });
      } else if (message.type === 'error') {
        setError(message.code === 'TOO_MANY_VALUES' ? 'That column has more than 500 distinct values. Choose another column, or split by rows.' : message.code === 'TOO_MANY_COLUMNS' ? 'Excel cannot hold this many columns.' : 'That operation failed. Try again, or use a smaller file.');
      }
      return true;
    });
  }, [call, info]);

  const runMerge = () => {
    setBusy(true); setResult(null); setError(''); setProgress({ fraction: 0, rows: 0 });
    call({ type: 'merge', files: mergeFiles, mode: mergeMode }, (message) => {
      if (message.type === 'progress') { setProgress({ fraction: message.fraction, rows: message.rows ?? 0 }); return false; }
      setBusy(false);
      if (message.type === 'result') { setResult({ blob: message.blob, filename: message.filename, meta: message.meta, size: message.size, name: 'merge' }); trackToolEvent('csv-toolkit', 'merge', { operation: 'merge', size_bucket: sizeBucket(mergeFiles.reduce((n, f) => n + f.size, 0)), row_bucket: rowBucket(message.meta.rows) }); }
      else if (message.type === 'error') setError(message.code === 'HEADERS_DIFFER' ? 'The files have different columns. Choose “Union” to combine them by column name.' : 'The merge failed. Try again.');
      return true;
    });
  };

  const fetchRows = useCallback((from, count) => new Promise((resolve) => {
    const offset = hasHeader ? 1 : 0;
    call({ type: 'rows', from: from + offset, count }, (message) => { resolve(message.rows); return true; });
  }), [call, hasHeader]);

  const changeHeader = (value) => { setHasHeader(value); workerRef.current?.postMessage({ type: 'header', hasHeader: value }); };

  const download = () => {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url; link.download = result.filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  const reopen = () => { const blob = result.blob; open(new File([blob], result.filename, { type: 'text/csv' }), result.filename); };

  const dataRows = info ? info.rows - (hasHeader ? 1 : 0) : 0;
  const view = useMemo(() => (info ? { header: hasHeader ? info.header : [], types: info.types } : null), [info, hasHeader]);
  const Panel = PANELS[tool];
  const infoForPanels = info && { ...info, hasHeader };

  const progressBar = (label) => (
    <div className="mt-6" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.fraction * 100)} aria-label={label}>
      <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${Math.max(3, progress.fraction * 100)}%` }} /></div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400"><span>{label} {int(progress.rows)} rows so far…</span><button type="button" onClick={cancel} className="inline-flex items-center gap-1 text-slate-300 hover:text-white"><X size={12} /> Cancel</button></div>
    </div>
  );

  return (
    <div data-clarity-mask="true">
      <p className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-center text-sm text-emerald-200"><ShieldCheck size={16} /> Your file never leaves your browser. It is read in pieces on your device; nothing is uploaded.</p>

      {mode === 'merge' ? (
        <div>
          <Dropzone multiple label="Drop the CSV files to merge" hint="two or more files — they are combined in the order you add them" onFiles={(files) => { setMergeFiles((current) => [...current, ...files]); setResult(null); }} />
          {mergeFiles.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <ul className="divide-y divide-white/5 text-sm">
                {mergeFiles.map((file, i) => (
                  <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-3 py-2"><span className="truncate text-slate-200">{i + 1}. {file.name}</span><span className="flex items-center gap-3 text-xs text-slate-500">{fmtBytes(file.size)}<button type="button" aria-label={`Remove ${file.name}`} onClick={() => setMergeFiles((current) => current.filter((_, j) => j !== i))} className="hover:text-rose-300"><Trash2 size={14} /></button></span></li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div role="group" aria-label="Merge mode" className="inline-flex rounded-xl bg-white/5 p-1">
                  {[['union', 'Union (all columns)'], ['strict', 'Strict (same columns only)']].map(([key, label]) => <button key={key} type="button" aria-pressed={mergeMode === key} onClick={() => setMergeMode(key)} className={cx('rounded-lg px-3 py-2 text-sm font-semibold', mergeMode === key ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white')}>{label}</button>)}
                </div>
                <Button variant="primary" disabled={busy || mergeFiles.length < 2} onClick={runMerge}>Merge {mergeFiles.length} files</Button>
              </div>
              <p className="mt-3 text-xs text-slate-500">Files with identical columns are joined byte for byte, which is fast. Otherwise Union lines columns up by name and leaves missing cells blank; Strict refuses to merge different headers.</p>
            </div>
          )}
          {busy && progressBar('Merging')}
        </div>
      ) : (
        <>
          {phase !== 'ready' && <Dropzone label={mode === 'viewer' ? 'Drop a CSV file to open it' : 'Drop your CSV file here'} hint="any size — the file is streamed, never loaded whole" onFiles={(files) => files[0] && open(files[0])} />}
          {phase === 'indexing' && progressBar('Indexing')}
        </>
      )}

      {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</p>}

      {mode !== 'merge' && phase === 'ready' && info && (
        <div className="mt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-300">
              <span className="max-w-[16rem] truncate font-semibold text-white" title={info.name}>{info.name}</span>
              <span><strong className="text-white">{int(dataRows)}</strong> rows</span>
              <span><strong className="text-white">{int(Math.max(info.fields, info.maxFields))}</strong> columns</span>
              <span>{fmtBytes(info.size)}</span>
              <span>{DELIMITERS[info.delimiter] || info.delimiter}-separated{info.bom ? ', BOM' : ''}</span>
              {info.ragged > 0 && <span className="text-amber-200">{int(info.ragged)} rows have a different number of fields</span>}
              <span className="text-slate-500">indexed in {((Date.now() - startedAt.current) / 1000).toFixed(1)} s</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={hasHeader} onChange={(event) => changeHeader(event.target.checked)} className="accent-indigo-500" /> First row is a header</label>
              <Button onClick={() => { setPhase('idle'); setInfo(null); setResult(null); }}>Open another file</Button>
            </div>
          </div>

          <div className="mt-4">
            <VirtualTable total={dataRows} header={view.header} types={view.types} fetchRows={fetchRows} height={mode === 'viewer' ? 460 : 260} gotoRef={gotoRef} />
            {mode === 'viewer' && (
              <form className="mt-2 flex items-center gap-2 text-xs text-slate-400" onSubmit={(event) => { event.preventDefault(); const value = Number(new FormData(event.currentTarget).get('row')); if (value) gotoRef.current?.(value - 1); }}>
                <Eye size={14} aria-hidden="true" /> Go to row <input name="row" type="number" min={1} max={dataRows} placeholder="1" className={cx(inputClass, 'w-32 py-1')} /> <Button type="submit">Go</Button>
              </form>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            {TOOLS[mode].length > 1 && (
              <div role="tablist" aria-label="Tools" className="mb-4 flex flex-wrap gap-2">
                {TOOLS[mode].map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={tool === key} onClick={() => { setTool(key); setResult(null); }} className={cx('rounded-full px-4 py-2 text-sm font-semibold', tool === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white')}>{label}</button>)}
              </div>
            )}
            <Panel key={`${tool}-${info.name}-${hasHeader}`} info={infoForPanels} run={run} busy={busy} />
            {busy && progressBar('Working —')}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5" role="status">
          <p className="font-semibold text-emerald-100">Done — {result.filename} ({fmtBytes(result.size)})</p>
          <p className="mt-1 text-sm text-emerald-100/80">
            {result.name === 'filter' && `${int(result.meta.rowsOut)} of ${int(result.meta.rowsIn)} rows kept.`}
            {result.name === 'dedupe' && `${int(result.meta.removed)} duplicate rows removed; ${int(result.meta.rowsOut)} of ${int(result.meta.rowsIn)} rows kept.`}
            {result.name === 'sort' && `${int(result.meta.rowsIn)} rows sorted${result.meta.runs > 1 ? ` (merged from ${result.meta.runs} sorted runs)` : ''}.`}
            {result.name === 'split' && `${int(result.meta.rowsIn)} rows split into ${int(result.meta.parts)} files.`}
            {result.name === 'merge' && `${int(result.meta.rows)} rows from ${mergeFiles.length} files, ${int(result.meta.columns)} columns${result.meta.sameHeaders ? '' : ' (union of all headers)'}.${result.meta.widened ? ` ${int(result.meta.widened)} rows had extra fields, kept at the end of the row.` : ''}`}
            {result.name === 'xlsx' && `${int(result.meta.rows)} rows in ${result.meta.sheets} sheet${result.meta.sheets === 1 ? '' : 's'}.${result.meta.truncated ? ` ${int(result.meta.truncated)} cells over 32,767 characters were cut to Excel’s limit.` : ''}`}
            {result.name === 'jsonl' && `${int(result.meta.rows)} rows written as JSON Lines.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" icon={Download} onClick={download}>Download</Button>
            {['filter', 'dedupe', 'sort'].includes(result.name) && mode === 'viewer' && <Button icon={Eye} onClick={reopen}>Open the result in the viewer</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
