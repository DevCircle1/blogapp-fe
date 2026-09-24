import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  AlertTriangle, CheckCircle2, Download, FileSpreadsheet, FileText, FlipVertical2, Lock, Trash2, Upload, X,
} from 'lucide-react';
import { validateBalances } from '../../../../lib/statement/validate.js';
import { parseAmount, parseDate } from '../../../../lib/statement/values.js';
import { toCsv, toXlsxBuffer } from '../../../../lib/statement/export.js';
import { submitRow, trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const TOOL_SLUG = 'bank-statement-converter';
const MAX_BYTES = 60 * 1024 * 1024;

const fmt = (value) => (value == null ? '' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const cents = (n) => Math.round((n || 0) * 100);

let nextId = 1;

/** One editable table cell. Commits on blur/Enter; an unreadable edit snaps back. */
function Cell({ value, format, parse, onCommit, align = 'left', label, className }) {
  const [text, setText] = useState(format(value));
  useEffect(() => setText(format(value)), [value, format]);
  const commit = () => {
    const parsed = parse(text);
    if (parsed === undefined) { setText(format(value)); return; }
    if (parsed !== value) onCommit(parsed);
  };
  return (
    <input
      aria-label={label}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); if (event.key === 'Escape') { setText(format(value)); event.currentTarget.blur(); } }}
      className={cx('w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-slate-100 outline-none transition hover:border-white/10 focus:border-indigo-400 focus:bg-slate-950', align === 'right' && 'text-right tabular-nums', className)}
    />
  );
}

const moneyFormat = (value) => (value == null ? '' : value.toFixed(2));
const moneyParse = (text) => {
  if (!text.trim()) return null;
  const parsed = parseAmount(text);
  return parsed ? parsed.value : undefined;
};

function StatementTable({ file, check, onRows }) {
  const hasRef = file.rows.some((row) => row.ref);
  const edit = (id, patch) => onRows(file.id, (rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  const remove = (id) => onRows(file.id, (rows) => rows.filter((row) => row.id !== id));
  const dateFormat = useCallback((value) => value, []);
  const textFormat = useCallback((value) => value ?? '', []);

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="px-3 py-2.5">Date</th>
            <th className="px-3 py-2.5">Description</th>
            {hasRef && <th className="px-3 py-2.5">Reference</th>}
            <th className="px-3 py-2.5 text-right">Debit</th>
            <th className="px-3 py-2.5 text-right">Credit</th>
            <th className="px-3 py-2.5 text-right">Balance</th>
            <th className="w-10 px-2 py-2.5"><span className="sr-only">Remove</span></th>
          </tr>
        </thead>
        <tbody>
          {file.rows.map((row, index) => {
            const status = check.status[index];
            return (
              <tr
                key={row.id}
                data-status={status}
                className={cx('border-t border-white/5 border-l-4', status === 'bad' ? 'border-l-rose-500 bg-rose-500/10' : 'border-l-transparent', status === 'ok' && 'hover:bg-white/[0.03]')}
              >
                <td className="w-32 px-1 py-0.5">
                  <Cell
                    label={`Date, row ${index + 1}`}
                    value={row.date}
                    format={dateFormat}
                    parse={(text) => parseDate(text.trim(), { order: file.dateOrder }) || undefined}
                    onCommit={(date) => edit(row.id, { date })}
                  />
                </td>
                <td className="px-1 py-0.5">
                  <Cell label={`Description, row ${index + 1}`} value={row.description} format={textFormat} parse={(text) => text} onCommit={(description) => edit(row.id, { description })} />
                </td>
                {hasRef && (
                  <td className="w-32 px-1 py-0.5">
                    <Cell label={`Reference, row ${index + 1}`} value={row.ref} format={textFormat} parse={(text) => text} onCommit={(ref) => edit(row.id, { ref })} />
                  </td>
                )}
                <td className="w-32 px-1 py-0.5"><Cell align="right" label={`Debit, row ${index + 1}`} value={row.debit} format={moneyFormat} parse={moneyParse} onCommit={(debit) => edit(row.id, { debit })} /></td>
                <td className="w-32 px-1 py-0.5"><Cell align="right" label={`Credit, row ${index + 1}`} value={row.credit} format={moneyFormat} parse={moneyParse} onCommit={(credit) => edit(row.id, { credit })} /></td>
                <td className="w-36 px-1 py-0.5"><Cell align="right" label={`Balance, row ${index + 1}`} value={row.balance} format={moneyFormat} parse={moneyParse} onCommit={(balance) => edit(row.id, { balance })} /></td>
                <td className="px-2 py-0.5 text-center">
                  <button type="button" onClick={() => remove(row.id)} aria-label={`Remove row ${index + 1}`} className="rounded p-1 text-slate-500 transition hover:bg-white/10 hover:text-rose-300"><Trash2 size={14} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ToolButton({ children, icon: Icon, variant = 'ghost', ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white/10 text-slate-100 hover:bg-white/20',
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function RequestBank() {
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('idle');

  const submit = async (event) => {
    event.preventDefault();
    if (!bank.trim()) return;
    setState('sending');
    const result = await submitRow('bank_requests', { bank_name: bank.trim().slice(0, 120), country: country.trim().slice(0, 80) || null });
    setState(result.ok ? 'sent' : 'failed');
  };

  if (state === 'sent') return <p className="mt-6 text-sm text-emerald-300">Thanks — your request is logged. Banks are added in order of demand.</p>;
  return (
    <div className="mt-6 text-sm text-slate-400">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="underline decoration-dotted underline-offset-4 hover:text-white">My bank isn’t supported →</button>
      ) : (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <label className="grow text-xs text-slate-400">
            Bank name
            <input value={bank} onChange={(event) => setBank(event.target.value)} required maxLength={120} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
          </label>
          <label className="grow text-xs text-slate-400">
            Country
            <input value={country} onChange={(event) => setCountry(event.target.value)} maxLength={80} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
          </label>
          <ToolButton variant="primary" type="submit" disabled={state === 'sending'}>Request bank</ToolButton>
          <p className="w-full text-xs text-slate-500">Only the bank name and country are sent — nothing from your statement.</p>
          {state === 'failed' && <p role="alert" className="w-full text-xs text-rose-300">Couldn’t send the request right now. Please try again later.</p>}
        </form>
      )}
    </div>
  );
}

export default function ConverterClient() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [exporting, setExporting] = useState('');
  const workerRef = useRef(null);
  const queueRef = useRef(Promise.resolve());
  const inputRef = useRef(null);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const patch = useCallback((id, changes) => {
    setFiles((current) => current.map((file) => (file.id === id ? { ...file, ...changes } : file)));
  }, []);

  const onRows = useCallback((id, transform) => {
    setFiles((current) => current.map((file) => (file.id === id ? { ...file, rows: transform(file.rows) } : file)));
  }, []);

  const getWorker = () => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../../../../lib/statement/parse.worker.js', import.meta.url), { type: 'module' });
    }
    return workerRef.current;
  };

  const runParse = useCallback((id, file, password) => {
    patch(id, { status: 'parsing', progress: 0, error: '', needsPassword: false });
    const job = async () => {
      let worker;
      try {
        worker = getWorker();
        const buffer = await file.arrayBuffer();
        await new Promise((resolve) => {
          const finish = () => { worker.removeEventListener('message', onMessage); worker.removeEventListener('error', onError); resolve(); };
          const onError = () => { patch(id, { status: 'error', error: 'The PDF reader could not start in this browser.' }); finish(); };
          const onMessage = (event) => {
            const message = event.data;
            if (message.id !== id) return;
            if (message.type === 'progress') { patch(id, { progress: message.page / message.total }); return; }
            if (message.type === 'done') {
              const { result } = message;
              patch(id, {
                status: 'done',
                progress: 1,
                bank: result.bank,
                bankName: result.bankName,
                mode: result.mode,
                dateOrder: result.dateOrder,
                opening: result.opening,
                order: result.order,
                warnings: result.warnings,
                skipped: result.skipped,
                pages: result.stats.pages,
                rows: result.rows.map((row, index) => ({ ...row, id: `${id}-${index}` })),
              });
              trackToolEvent(TOOL_SLUG, 'convert', { bank: result.bank || 'generic', row_count: result.rows.length, pages: result.stats.pages });
              if (!result.rows.length) submitRow('parse_failures', { bank_slug: result.bank, page_count: result.stats.pages, column_count: result.columns.length, reason: 'no-rows' });
            } else if (message.code === 'PASSWORD') {
              patch(id, { status: 'error', needsPassword: true, error: password ? 'That password did not unlock the PDF.' : 'This PDF is password-protected.' });
            } else if (message.code === 'NO_TEXT') {
              patch(id, { status: 'error', error: 'This PDF has no readable text — it looks like a scan or a photo. Download a text-based statement from online banking instead.' });
              submitRow('parse_failures', { bank_slug: null, page_count: message.pageCount, column_count: 0, reason: 'no-text' });
            } else {
              patch(id, { status: 'error', error: 'This file could not be read as a PDF.' });
              submitRow('parse_failures', { bank_slug: null, page_count: null, column_count: null, reason: 'unreadable' });
            }
            finish();
          };
          worker.addEventListener('message', onMessage);
          worker.addEventListener('error', onError);
          worker.postMessage({ id, buffer, password }, [buffer]);
        });
      } catch {
        patch(id, { status: 'error', error: 'This browser cannot run the converter (Web Workers are required).' });
      }
    };
    queueRef.current = queueRef.current.then(job, job);
  }, [patch]);

  const addFiles = useCallback((list) => {
    const incoming = [...list].filter((file) => file);
    const entries = incoming.map((file) => {
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
      const id = `f${nextId++}`;
      if (!isPdf) return { id, name: file.name, file, status: 'error', error: 'Only PDF statements are supported.', rows: [] };
      if (file.size > MAX_BYTES) return { id, name: file.name, file, status: 'error', error: 'That file is larger than 60 MB.', rows: [] };
      return { id, name: file.name, file, status: 'parsing', progress: 0, rows: [] };
    });
    setFiles((current) => [...current, ...entries]);
    entries.filter((entry) => entry.status === 'parsing').forEach((entry) => runParse(entry.id, entry.file));
  }, [runParse]);

  const trySample = async () => {
    const { buildSamplePdf } = await import('../../../../lib/statement/sample.js');
    addFiles([new File([buildSamplePdf()], 'sample-statement.pdf', { type: 'application/pdf' })]);
  };

  const checks = useMemo(() => Object.fromEntries(files.map((file) => [
    file.id,
    file.status === 'done' ? validateBalances(file.rows, { opening: file.opening, order: file.order }) : null,
  ])), [files]);

  const done = files.filter((file) => file.status === 'done');
  const allRows = done.flatMap((file) => file.rows);
  const checked = done.reduce((n, file) => n + checks[file.id].checked, 0);
  const bad = done.reduce((n, file) => n + checks[file.id].bad, 0);
  const dates = allRows.map((row) => row.date).filter(Boolean).sort();
  const totalIn = allRows.reduce((n, row) => n + cents(row.credit), 0) / 100;
  const totalOut = allRows.reduce((n, row) => n + cents(row.debit), 0) / 100;

  const flip = (id) => onRows(id, (rows) => rows.map((row) => ({ ...row, debit: row.credit, credit: row.debit })));
  const reverse = (id) => setFiles((current) => current.map((file) => (file.id === id
    ? { ...file, rows: [...file.rows].reverse(), order: file.order === 'asc' ? 'desc' : 'asc' }
    : file)));

  const download = async (format) => {
    const payload = done.map((file) => ({ name: file.name, rows: file.rows }));
    if (!payload.some((file) => file.rows.length)) return;
    setExporting(format);
    try {
      const stem = (done[0].name || 'statement').replace(/\.pdf$/i, '');
      const blob = format === 'csv'
        ? new Blob([toCsv(payload)], { type: 'text/csv;charset=utf-8' })
        : new Blob([await toXlsxBuffer(payload)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${stem}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackToolEvent(TOOL_SLUG, 'download', { bank: done[0].bank || 'generic', row_count: allRows.length, format });
    } finally {
      setExporting('');
    }
  };

  return (
    // data-clarity-mask: the site runs Microsoft Clarity session replay; this keeps
    // statement rows out of recordings, which the "nothing leaves your device" claim needs.
    <div data-clarity-mask="true">
      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
        className={cx('flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition', dragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
      >
        <Upload size={30} className="text-indigo-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-white">Drop your bank statement PDF here</span>
        <span className="text-sm text-slate-400">or click to choose one or more files — nothing is uploaded, it is read on your device</span>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = ''; }} />
      </label>
      <p className="mt-3 text-center text-sm text-slate-400">
        No statement handy?{' '}
        <button type="button" onClick={trySample} className="font-semibold text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">Try a sample statement</button>
      </p>

      {files.map((file) => (
        <section key={file.id} className="mt-8" aria-label={file.name}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <FileText size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
              <h2 className="truncate text-base font-bold text-white">{file.name}</h2>
              {file.status === 'done' && (
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                  {file.bankName || 'Generic layout'} · {file.pages} page{file.pages === 1 ? '' : 's'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {file.status === 'done' && (
                <>
                  <ToolButton icon={FlipVertical2} onClick={() => flip(file.id)} title="Swap the debit and credit columns (credit-card statements use the opposite sign)">Flip debit/credit</ToolButton>
                  <ToolButton onClick={() => reverse(file.id)} title="Reverse the order of the rows">Reverse order</ToolButton>
                </>
              )}
              <button type="button" onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))} aria-label={`Remove ${file.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X size={16} /></button>
            </div>
          </div>

          {file.status === 'parsing' && (
            <div className="mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((file.progress || 0) * 100)} aria-label="Reading PDF">
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${Math.max(6, (file.progress || 0) * 100)}%` }} /></div>
              <p className="mt-2 text-xs text-slate-400">Reading the PDF on your device…</p>
            </div>
          )}

          {file.status === 'error' && (
            <div role="alert" className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              <p className="flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{file.error}</p>
              {file.needsPassword && (
                <form
                  className="mt-3 flex flex-wrap items-center gap-2"
                  onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get('password'); runParse(file.id, file.file, String(value)); }}
                >
                  <Lock size={14} aria-hidden="true" />
                  <input name="password" type="password" required autoComplete="off" aria-label="PDF password" placeholder="PDF password" className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
                  <ToolButton variant="primary" type="submit">Unlock</ToolButton>
                  <span className="w-full text-xs text-rose-200/70">Used only to open the file in your browser. It is not stored or sent anywhere.</span>
                </form>
              )}
            </div>
          )}

          {file.status === 'done' && (
            <>
              {file.warnings.map((warning) => (
                <p key={warning} className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{warning}</p>
              ))}
              {file.rows.length === 0 ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">No transactions were found in this PDF. If it is a bank statement, please use “My bank isn’t supported” below so the layout can be looked at.</p>
              ) : (
                <StatementTable file={file} check={checks[file.id]} onRows={onRows} />
              )}
              {file.skipped.length > 0 && (
                <details className="mt-3 text-sm text-slate-400">
                  <summary className="cursor-pointer text-slate-300">{file.skipped.length} line{file.skipped.length === 1 ? '' : 's'} with an amount but no date were left out</summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {file.skipped.slice(0, 20).map((line, index) => <li key={`${line.page}-${index}`} className="list-disc">p.{line.page}: {line.text}</li>)}
                  </ul>
                </details>
              )}
            </>
          )}
        </section>
      ))}

      {done.length > 0 && allRows.length > 0 && (
        <div className="sticky bottom-3 z-10 mt-8 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur" role="status" aria-live="polite">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span><strong className="text-white">{allRows.length}</strong> <span className="text-slate-400">transactions</span></span>
            <span className="text-slate-300">{dates[0]} → {dates[dates.length - 1]}</span>
            <span><span className="text-slate-400">In</span> <strong className="text-emerald-300">{fmt(totalIn)}</strong></span>
            <span><span className="text-slate-400">Out</span> <strong className="text-rose-300">{fmt(totalOut)}</strong></span>
            {checked === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-amber-200"><AlertTriangle size={16} /> No balance column to check — review by eye</span>
            ) : bad === 0 ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300"><CheckCircle2 size={16} /> Balance reconciles ({checked} rows checked)</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-rose-300"><AlertTriangle size={16} /> {bad} row{bad === 1 ? '' : 's'} need review</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <ToolButton variant="primary" icon={FileSpreadsheet} onClick={() => download('xlsx')} disabled={Boolean(exporting)}>{exporting === 'xlsx' ? 'Preparing…' : 'Download Excel (.xlsx)'}</ToolButton>
            <ToolButton icon={Download} onClick={() => download('csv')} disabled={Boolean(exporting)}>Download CSV</ToolButton>
          </div>
        </div>
      )}

      <RequestBank />
    </div>
  );
}
