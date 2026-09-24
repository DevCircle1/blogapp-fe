import { useMemo, useRef, useState } from 'react';
import {
  AlertOctagon, AlertTriangle, CheckCircle2, Download, FileText, Info, Lock, Upload, XCircle,
} from 'lucide-react';
import { matchTerms, analyseJobDescription } from '../../../../lib/resume/jd.js';
import { checkFileType } from '../../../../lib/resume/checks.js';
import { allRows } from '../../../../lib/resume/model.js';
import { submitRow, trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const MAX_BYTES = 15 * 1024 * 1024;
const SEVERITY = {
  critical: { icon: AlertOctagon, tone: 'border-rose-400/30 bg-rose-500/10 text-rose-100', badge: 'bg-rose-400/20 text-rose-200', label: 'Blocking' },
  warning: { icon: AlertTriangle, tone: 'border-amber-400/25 bg-amber-400/10 text-amber-100', badge: 'bg-amber-400/20 text-amber-200', label: 'Fix' },
  info: { icon: Info, tone: 'border-sky-400/20 bg-sky-400/10 text-sky-100', badge: 'bg-sky-400/20 text-sky-200', label: 'Note' },
};

const Missing = () => <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-xs font-semibold text-rose-200">not found — an ATS may not find this</span>;

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-white">{value || <Missing />}</dd>
    </div>
  );
}

function Verdict({ result }) {
  const critical = result.issues.filter((item) => item.severity === 'critical').length;
  const fixes = result.issues.filter((item) => item.severity === 'warning').length;
  const [Icon, tone, text] = critical
    ? [XCircle, 'text-rose-300', `Not ATS-friendly yet — ${critical} blocking problem${critical === 1 ? '' : 's'}`]
    : fixes ? [AlertTriangle, 'text-amber-300', `Mostly ATS-friendly — ${fixes} thing${fixes === 1 ? '' : 's'} to fix`]
      : [CheckCircle2, 'text-emerald-300', 'ATS-friendly — no structural problems found'];
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <p className={cx('flex items-center gap-3 text-xl font-bold', tone)}><Icon size={26} aria-hidden="true" />{text}</p>
      <div className="text-right">
        <span className="text-4xl font-black text-white">{result.score}</span><span className="text-slate-500"> / 100</span>
      </div>
    </div>
  );
}

function Issues({ result }) {
  return (
    <div className="space-y-3">
      {result.issues.length === 0 && <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">No structural problems found. Check the “What an ATS extracts” tab to confirm the details were read correctly.</p>}
      {result.issues.map((item) => {
        const { icon: Icon, tone, badge, label } = SEVERITY[item.severity];
        return (
          <article key={item.code + item.title} className={cx('rounded-2xl border p-4', tone)}>
            <h3 className="flex flex-wrap items-center gap-2 font-semibold text-white">
              <Icon size={16} aria-hidden="true" /> {item.title}
              <span className={cx('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase', badge)}>{label}</span>
              {item.location && <span className="text-xs font-normal text-slate-400">{item.location}</span>}
              {item.penalty > 0 && <span className="ml-auto text-xs font-normal text-slate-400">−{item.penalty} points</span>}
            </h3>
            <p className="mt-2 text-sm leading-6 opacity-90">{item.explanation}</p>
            <p className="mt-2 text-sm leading-6"><strong className="text-white">How to fix: </strong>{item.howToFix}</p>
          </article>
        );
      })}
      <details className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <summary className="cursor-pointer font-semibold text-white">How this score is made</summary>
        <p className="mt-3 leading-6 text-slate-400">The score starts at 100 and loses the points listed here, for each issue found. There are no hidden weights.</p>
        <table className="mt-3 w-full text-left">
          <tbody>
            {result.breakdown.length === 0 && <tr><td className="py-1 text-slate-500">No deductions.</td></tr>}
            {result.breakdown.map((row) => <tr key={row.code + row.title} className="border-t border-white/5"><td className="py-1.5 pr-3">{row.title}</td><td className="py-1.5 text-right tabular-nums text-rose-300">−{row.penalty}</td></tr>)}
            <tr className="border-t border-white/10 font-semibold text-white"><td className="py-1.5">Score</td><td className="py-1.5 text-right tabular-nums">{result.score}</td></tr>
          </tbody>
        </table>
      </details>
    </div>
  );
}

function Extraction({ model, result }) {
  const e = result.entities;
  const rows = allRows(model);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Your resume, as text in reading order</h3>
        <p className="mt-1 text-xs text-slate-500">Lines from top to bottom, left to right — the order a simple parser reads them. If this looks scrambled, so will the parse.</p>
        <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-5 text-slate-300">{rows.map((row) => row.text).join('\n')}</pre>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">What an ATS-style parser extracted</h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={e.name} />
          <Field label="Email" value={e.email} />
          <Field label="Phone" value={e.phone} />
          <Field label="LinkedIn" value={e.linkedin} />
        </dl>
        <h4 className="mt-5 text-xs uppercase tracking-wider text-slate-500">Jobs ({e.jobs.length})</h4>
        {e.jobs.length === 0 ? <p className="mt-2"><Missing /></p> : (
          <ul className="mt-2 space-y-2">
            {e.jobs.map((job) => (
              <li key={job.raw} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <p className="text-white">{job.title || <Missing />} <span className="text-slate-500">at</span> {job.company || <Missing />}</p>
                <p className="text-xs text-slate-400">{job.start} – {job.end}</p>
              </li>
            ))}
          </ul>
        )}
        <h4 className="mt-5 text-xs uppercase tracking-wider text-slate-500">Education ({e.education.length})</h4>
        {e.education.length === 0 ? <p className="mt-2"><Missing /></p> : (
          <ul className="mt-2 space-y-2">
            {e.education.map((item) => <li key={item.degree + item.school} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">{item.degree || <Missing />}{item.school && <span className="text-slate-400"> — {item.school}</span>}{item.year && <span className="text-slate-500"> ({item.year})</span>}</li>)}
          </ul>
        )}
        <h4 className="mt-5 text-xs uppercase tracking-wider text-slate-500">Skills matched ({e.skills.length})</h4>
        {e.skills.length === 0 ? <p className="mt-2"><Missing /></p> : (
          <p className="mt-2 flex flex-wrap gap-1.5">{e.skills.map((skill) => <span key={skill} className="rounded-full bg-indigo-400/15 px-2.5 py-1 text-xs text-indigo-200">{skill}</span>)}</p>
        )}
        <p className="mt-5 text-xs leading-5 text-slate-500">This is an approximation of how a typical parser reads a resume. Real systems differ from one another; it does not simulate any specific ATS.</p>
      </div>
    </div>
  );
}

function TermList({ title, tone, items, empty }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <h4 className={cx('text-sm font-bold', tone)}>{title} ({items.length})</h4>
      {items.length === 0 ? <p className="mt-2 text-xs text-slate-500">{empty}</p> : (
        <p className="mt-3 flex flex-wrap gap-1.5">{items.map((item) => <span key={item.term} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">{item.term}{item.count > 1 && <span className="ml-1 text-slate-500">×{item.count}</span>}</span>)}</p>
      )}
    </div>
  );
}

function JobMatch({ model, result, roleKeywords, initialText = '' }) {
  const [jd, setJd] = useState(initialText);
  const analysis = useMemo(() => (jd.trim().length > 40 ? analyseJobDescription(jd, model, result.found) : null), [jd, model, result]);
  const role = useMemo(() => (roleKeywords?.length ? matchTerms(roleKeywords.map((term) => ({ term, count: 1, skill: true })), model, result.found) : null), [roleKeywords, model, result]);
  return (
    <div>
      <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
        Use this to decide which of your <strong className="text-white">real experience</strong> to surface — not to add skills you do not have. Keyword stuffing, including hidden white text, is dishonest, is detected by many systems and reads badly to the recruiter who sees the resume next.
      </p>
      {role && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Core keywords for this role</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <TermList title="In your resume" tone="text-emerald-300" items={role.matched} empty="None found." />
            <TermList title="Only mentioned once, deep in the text" tone="text-amber-300" items={role.buried} empty="None." />
            <TermList title="Not found" tone="text-rose-300" items={role.missing} empty="All present." />
          </div>
        </div>
      )}
      <label htmlFor="jd-input" className="mt-6 block text-sm font-medium text-slate-300">Paste a job description to compare</label>
      <textarea id="jd-input" value={jd} onChange={(event) => setJd(event.target.value)} spellCheck="false" placeholder="Paste the job posting here. It is compared in your browser and never sent anywhere." className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none focus:border-indigo-400" />
      {analysis && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <TermList title="Matched" tone="text-emerald-300" items={analysis.matched} empty="Nothing matched yet." />
          <TermList title="Present but buried" tone="text-amber-300" items={analysis.buried} empty="None." />
          <TermList title="Missing" tone="text-rose-300" items={analysis.missing} empty="Everything in the posting is covered." />
        </div>
      )}
      {analysis && <p className="mt-3 text-xs text-slate-500">“Buried” means the term appears once, in the body, and not in your skills section or opening lines. If you genuinely have that experience, say so in a place a recruiter’s search will look.</p>}
    </div>
  );
}

export default function ResumeClient({ view = 'checker', roleKeywords = null }) {
  const [state, setState] = useState(null); // { status, name, file, model, result, error, needsPassword }
  const [tab, setTab] = useState(view === 'keywords' ? 'match' : view === 'parser' ? 'extract' : 'issues');
  const [dragging, setDragging] = useState(false);
  const [busyReport, setBusyReport] = useState(false);
  const workerRef = useRef(null);
  const idRef = useRef(0);

  const parse = async (file, password) => {
    const early = checkFileType(file.name);
    if (early) { setState({ status: 'unsupported', name: file.name, result: { issues: [early], score: 0, breakdown: [], entities: {}, found: {} } }); return; }
    if (file.size > MAX_BYTES) { setState({ status: 'error', name: file.name, error: 'That file is larger than 15 MB.' }); return; }
    setState({ status: 'parsing', name: file.name, file });
    try {
      workerRef.current ??= new Worker(new URL('../../../../lib/resume/resume.worker.js', import.meta.url), { type: 'module' });
      const worker = workerRef.current;
      const id = (idRef.current += 1);
      const buffer = await file.arrayBuffer();
      worker.onmessage = (event) => {
        const message = event.data;
        if (message.id !== id) return;
        if (message.type === 'done') {
          setState({ status: 'done', name: file.name, file, model: message.model, result: message.result });
          const ext = file.name.split('.').pop().toLowerCase();
          trackToolEvent('ats-resume-checker', 'check', { file_type: ext });
          submitRow('resume_checks', {
            file_type: ext, page_count: message.model.pageCount, issues: message.result.issues.map((item) => item.code), score: message.result.score,
          });
        } else if (message.code === 'PASSWORD') {
          setState({ status: 'error', name: file.name, file, needsPassword: true, error: password ? 'That password did not unlock the PDF.' : 'This PDF is password-protected.' });
        } else {
          setState({ status: 'error', name: file.name, error: 'This file could not be read. Make sure it is a valid PDF or DOCX.' });
        }
      };
      worker.onerror = () => setState({ status: 'error', name: file.name, error: 'The resume reader could not start in this browser.' });
      worker.postMessage({ id, buffer, name: file.name, password }, [buffer]);
    } catch {
      setState({ status: 'error', name: file.name, error: 'This browser cannot run the checker (Web Workers are required).' });
    }
  };

  const sample = async (kind) => {
    const { buildGoodResume, buildBadResume } = await import('../../../../lib/resume/samples.js');
    const bytes = kind === 'good' ? buildGoodResume() : buildBadResume();
    parse(new File([bytes], kind === 'good' ? 'sample-clean-resume.pdf' : 'sample-problem-resume.pdf', { type: 'application/pdf' }));
  };

  const done = state?.status === 'done' ? state : null;
  const shown = done || (state?.status === 'unsupported' ? state : null);
  const report = async () => {
    setBusyReport(true);
    try {
      const { downloadReport } = await import('../../../../lib/resume/reportPdf.js');
      await downloadReport({ fileName: state.name, result: state.result });
    } finally { setBusyReport(false); }
  };

  const tabs = [['issues', `Issues${shown ? ` (${shown.result.issues.length})` : ''}`], ['extract', 'What an ATS extracts'], ['match', 'Job description match']];

  return (
    <div data-clarity-mask="true">
      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files[0]) parse(event.dataTransfer.files[0]); }}
        className={cx('flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition', dragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
      >
        <Upload size={30} className="text-indigo-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-white">Drop your resume here (PDF or DOCX)</span>
        <span className="text-sm text-slate-400">or click to choose a file — it is read in your browser and never uploaded</span>
        <input type="file" accept=".pdf,.docx,.doc,.pages,.odt,.rtf,application/pdf" className="sr-only" onChange={(event) => { if (event.target.files[0]) parse(event.target.files[0]); event.target.value = ''; }} />
      </label>
      <p className="mt-3 text-center text-sm text-slate-400">
        No resume handy? Try a{' '}
        <button type="button" onClick={() => sample('good')} className="font-semibold text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">clean sample</button>
        {' '}or a{' '}
        <button type="button" onClick={() => sample('bad')} className="font-semibold text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">sample with problems</button>.
      </p>

      {state?.status === 'parsing' && <p className="mt-6 text-center text-sm text-slate-300" role="status">Reading {state.name} on your device…</p>}
      {state?.status === 'error' && (
        <div role="alert" className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
          <p className="flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{state.error}</p>
          {state.needsPassword && (
            <form className="mt-3 flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); parse(state.file, String(new FormData(event.currentTarget).get('password'))); }}>
              <Lock size={14} aria-hidden="true" />
              <input name="password" type="password" required autoComplete="off" aria-label="PDF password" placeholder="PDF password" className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400" />
              <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">Unlock</button>
            </form>
          )}
        </div>
      )}

      {shown && (
        <div className="mt-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400"><FileText size={16} aria-hidden="true" /> <span className="truncate">{state.name}</span>
            {done && <span className="text-xs text-slate-500">· {done.model.pageCount}{done.model.pageCountEstimated ? ' (est.)' : ''} page{done.model.pageCount === 1 ? '' : 's'}</span>}
          </div>
          <Verdict result={shown.result} />
          {done && (
            <>
              <div role="tablist" aria-label="Results" className="mt-6 flex flex-wrap gap-2">
                {tabs.map(([key, label]) => (
                  <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={cx('rounded-full px-4 py-2 text-sm font-semibold transition', tab === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white')}>{label}</button>
                ))}
                <button type="button" onClick={report} disabled={busyReport} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/20 disabled:opacity-40"><Download size={16} /> {busyReport ? 'Preparing…' : 'Download report (PDF)'}</button>
              </div>
              <div className="mt-5" role="tabpanel">
                {tab === 'issues' && <Issues result={done.result} />}
                {tab === 'extract' && <Extraction model={done.model} result={done.result} />}
                {tab === 'match' && <JobMatch model={done.model} result={done.result} roleKeywords={roleKeywords} />}
              </div>
              <p className="mt-6 text-xs text-slate-500">Fixed something? Drop the new version above to re-check it — the score updates straight away.</p>
            </>
          )}
          {state.status === 'unsupported' && <div className="mt-6"><Issues result={state.result} /></div>}
        </div>
      )}
    </div>
  );
}

