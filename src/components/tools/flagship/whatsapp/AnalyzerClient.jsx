import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AlertTriangle, Download, ShieldCheck, Upload } from 'lucide-react';
import { dayLabel } from '../../../../lib/whatsapp/stats.js';
import { drawShareCard } from '../../../../lib/whatsapp/shareCard.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const int = (n) => Math.round(n).toLocaleString('en-US');

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <strong className="mt-1 block break-words text-2xl font-black text-white">{value}</strong>
      {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

function Card({ title, children, className }) {
  return (
    <section className={cx('rounded-2xl border border-white/10 bg-slate-950/50 p-5', className)}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const duration = (seconds) => {
  if (seconds == null) return '—';
  if (seconds < 90) return `${Math.round(seconds)}s`;
  if (seconds < 5400) return `${Math.round(seconds / 60)} min`;
  return `${(seconds / 3600).toFixed(1)} h`;
};

function Heatmap({ summary }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]" role="img" aria-label="Messages by weekday and hour">
        <div className="grid" style={{ gridTemplateColumns: '2.5rem repeat(24, minmax(0, 1fr))', gap: 3 }}>
          {summary.heatmap.map((row, day) => (
            <div key={WEEKDAYS[day]} className="contents">
              <span className="self-center text-xs text-slate-500">{WEEKDAYS[day]}</span>
              {row.map((count, hour) => (
                <span
                  key={hour}
                  title={`${WEEKDAYS[day]} ${hour}:00 — ${int(count)} messages`}
                  className="aspect-square rounded-[3px]"
                  style={{ background: count ? `rgba(52,211,153,${0.15 + 0.85 * (count / summary.heatmapMax)})` : 'rgba(255,255,255,0.05)' }}
                />
              ))}
            </div>
          ))}
          <span />
          {Array.from({ length: 24 }, (_, hour) => <span key={hour} className="text-center text-[10px] text-slate-500">{hour % 6 === 0 ? hour : ''}</span>)}
        </div>
      </div>
    </div>
  );
}

function Timeline({ summary }) {
  const buckets = useMemo(() => {
    const points = summary.timeline;
    if (!points.length) return [];
    const span = points[points.length - 1][0] - points[0][0] + 1;
    const size = span > 400 ? 30 : span > 100 ? 7 : 1;
    const map = new Map();
    points.forEach(([key, count]) => { const bucket = Math.floor(key / size) * size; map.set(bucket, (map.get(bucket) || 0) + count); });
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([key, count]) => ({ key, count, size }));
  }, [summary]);
  if (!buckets.length) return <p className="text-sm text-slate-500">No messages in this range.</p>;
  const max = Math.max(...buckets.map((bucket) => bucket.count));
  const width = 720; const height = 160; const barW = Math.max(1, width / buckets.length - 1);
  const unit = buckets[0].size === 1 ? 'day' : buckets[0].size === 7 ? 'week' : 'month';
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full" role="img" aria-label={`Messages per ${unit}`}>
        {buckets.map((bucket, i) => {
          const h = (bucket.count / max) * height;
          return <rect key={bucket.key} x={i * (width / buckets.length)} y={height - h} width={barW} height={h} rx="1.5" fill="#34d399" opacity="0.85"><title>{`${dayLabel(bucket.key)}: ${int(bucket.count)} messages`}</title></rect>;
        })}
        <text x="0" y={height + 15} className="fill-slate-500 text-[10px]">{dayLabel(buckets[0].key)}</text>
        <text x={width} y={height + 15} textAnchor="end" className="fill-slate-500 text-[10px]">{dayLabel(buckets[buckets.length - 1].key)}</text>
      </svg>
      <p className="mt-1 text-xs text-slate-500">Messages per {unit}. Peak: {int(max)}.</p>
    </div>
  );
}

function TopList({ items, empty = 'Nothing yet.' }) {
  if (!items.length) return <p className="text-sm text-slate-500">{empty}</p>;
  const max = items[0][1];
  return (
    <ol className="space-y-1.5">
      {items.map(([label, count]) => (
        <li key={label} className="flex items-center gap-3 text-sm">
          <span className="w-32 shrink-0 truncate text-slate-200" title={label}>{label}</span>
          <span className="h-2 grow rounded-full bg-white/5"><span className="block h-2 rounded-full bg-emerald-400/80" style={{ width: `${(count / max) * 100}%` }} /></span>
          <span className="w-14 shrink-0 text-right tabular-nums text-slate-400">{int(count)}</span>
        </li>
      ))}
    </ol>
  );
}

function SharePanel({ summary }) {
  const [format, setFormat] = useState('story');
  const [showNames, setShowNames] = useState(true);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current && summary.participants.length) drawShareCard(canvasRef.current, summary, { format, showNames });
  }, [summary, format, showNames]);
  const download = () => {
    const canvas = document.createElement('canvas');
    drawShareCard(canvas, summary, { format, showNames });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `chat-wrapped-${format}.png`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackToolEvent('whatsapp-chat-analyzer', 'download_card', { format });
    }, 'image/png');
  };
  return (
    <Card title="Your share card">
      <div className="flex flex-wrap items-start gap-6">
        <canvas ref={canvasRef} className={cx('rounded-2xl border border-white/10', format === 'story' ? 'h-[26rem]' : 'h-72')} style={{ aspectRatio: format === 'story' ? '1080 / 1920' : '1 / 1' }} aria-label="Share card preview" />
        <div className="space-y-4">
          <div role="group" aria-label="Card size" className="inline-flex rounded-xl bg-white/5 p-1">
            {[['story', 'Story 1080×1920'], ['square', 'Square 1080×1080']].map(([key, label]) => (
              <button key={key} type="button" aria-pressed={format === key} onClick={() => setFormat(key)} className={cx('rounded-lg px-3 py-2 text-sm font-semibold', format === key ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white')}>{label}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={showNames} onChange={(event) => setShowNames(event.target.checked)} className="accent-emerald-500" /> Show participant names</label>
          <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"><Download size={16} /> Download image</button>
          <p className="max-w-xs text-xs leading-5 text-slate-500">The image is drawn on your device. It contains only the numbers and, if you leave it on, the names — never any message text.</p>
        </div>
      </div>
    </Card>
  );
}

export default function AnalyzerClient({ sampleLabel = 'a sample chat' }) {
  const [phase, setPhase] = useState('idle'); // idle | parsing | done | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(null);
  const [summary, setSummary] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [range, setRange] = useState({ from: 0, to: 0 });
  const [people, setPeople] = useState(null); // null = everyone
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const workerRef = useRef(null);
  const idRef = useRef(0);
  const fileRef = useRef(null);
  const debounceRef = useRef(null);
  const allPeople = useRef([]);

  useEffect(() => () => { workerRef.current?.terminate(); clearTimeout(debounceRef.current); }, []);

  const handleMessage = useCallback((event) => {
    const message = event.data;
    if (message.id !== idRef.current) return;
    if (message.type === 'progress') setProgress(message.fraction);
    else if (message.type === 'done') {
      setInfo(message.info);
      setSummary(message.summary);
      setBounds(message.summary.bounds);
      setRange({ from: message.summary.bounds.first, to: message.summary.bounds.last });
      allPeople.current = message.summary.participants.map((p) => p.name);
      setPeople(null);
      setPhase('done');
      trackToolEvent('whatsapp-chat-analyzer', 'analyze', {
        message_bucket: message.info.bucket, participant_count: message.summary.participants.length, format_detected: `${message.info.formatId}-${message.info.dateOrder}`,
      });
    } else if (message.type === 'summary') setSummary(message.summary);
    else if (message.type === 'error') {
      setPhase('error');
      setError(message.code === 'NOT_WHATSAPP'
        ? 'This does not look like a WhatsApp chat export. Export the chat as a text file (see the guide below) and drop that file here.'
        : message.code === 'NO_TXT' ? 'That zip file does not contain a chat .txt file.' : 'This file could not be read.');
    }
  }, []);

  const start = useCallback((file, order) => {
    if (!file) return;
    fileRef.current = file;
    setFileName(file.name);
    setPhase('parsing'); setProgress(0); setError('');
    try {
      workerRef.current ??= new Worker(new URL('../../../../lib/whatsapp/parse.worker.js', import.meta.url), { type: 'module' });
      workerRef.current.onmessage = handleMessage;
      workerRef.current.onerror = () => { setPhase('error'); setError('The analyzer could not start in this browser.'); };
      idRef.current += 1;
      workerRef.current.postMessage({ type: 'parse', id: idRef.current, file, order });
    } catch {
      setPhase('error'); setError('This browser cannot run the analyzer (Web Workers are required).');
    }
  }, [handleMessage]);

  const requestSummary = useCallback((next, chosen) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      idRef.current += 1;
      workerRef.current?.postMessage({ type: 'range', id: idRef.current, from: next.from, to: next.to, people: chosen });
    }, 120);
  }, []);

  const changeRange = (patch) => {
    const next = { ...range, ...patch };
    if (next.from > next.to) { if ('from' in patch) next.to = next.from; else next.from = next.to; }
    setRange(next);
    requestSummary(next, people);
  };

  const toggleParticipant = (name) => {
    const current = people || allPeople.current;
    const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
    const chosen = next.length === 0 || next.length === allPeople.current.length ? null : next;
    setPeople(chosen);
    requestSummary(range, chosen);
  };

  const years = useMemo(() => {
    if (!bounds) return [];
    const first = new Date(bounds.first * 86400000).getUTCFullYear();
    const last = new Date(bounds.last * 86400000).getUTCFullYear();
    return Array.from({ length: last - first + 1 }, (_, i) => first + i).slice(-6);
  }, [bounds]);

  const useSample = async () => {
    const { buildSampleChat } = await import('../../../../lib/whatsapp/sample.js');
    start(new File([buildSampleChat()], 'sample-chat.txt', { type: 'text/plain' }));
  };

  return (
    <div data-clarity-mask="true">
      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); start(event.dataTransfer.files[0]); }}
        className={cx('flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition', dragging ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/15 bg-slate-950/40 hover:border-emerald-400/60')}
      >
        <Upload size={30} className="text-emerald-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-white">Drop your exported WhatsApp chat here</span>
        <span className="text-sm text-slate-400">the .txt file (or the .zip on iPhone) — it is read on your device and never uploaded</span>
        <input type="file" accept=".txt,.zip,text/plain,application/zip" className="sr-only" onChange={(event) => { start(event.target.files[0]); event.target.value = ''; }} />
      </label>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 text-center text-sm text-slate-400">
        <span className="inline-flex items-center gap-1.5 text-emerald-300"><ShieldCheck size={14} /> Nothing leaves your browser — no message is uploaded or stored.</span>
        <span>No chat handy? Try <button type="button" onClick={useSample} className="font-semibold text-emerald-300 underline decoration-dotted underline-offset-4 hover:text-white">{sampleLabel}</button>.</span>
      </p>

      {phase === 'parsing' && (
        <div className="mt-6" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Reading chat">
          <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(4, progress * 100)}%` }} /></div>
          <p className="mt-2 text-xs text-slate-400">Reading {fileName} on your device…</p>
        </div>
      )}
      {phase === 'error' && <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</p>}

      {phase === 'done' && summary && bounds && (
        <div className="mt-8 space-y-6">
          {info.ambiguousOrder && (
            <p className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
              <AlertTriangle size={16} /> Dates were read as day/month. If 03/04 should be 4 March rather than 3 April, switch:
              <button type="button" onClick={() => start(fileRef.current, 'mdy')} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20">Read as month/day</button>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Participants">
            <span className="text-xs uppercase tracking-wider text-slate-500">Show</span>
            {allPeople.current.slice(0, 12).map((name) => {
              const on = !people || people.includes(name);
              return <button key={name} type="button" aria-pressed={on} onClick={() => toggleParticipant(name)} className={cx('rounded-full px-3 py-1.5 text-sm font-semibold transition', on ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-slate-500 hover:text-slate-300')}>{name}</button>;
            })}
            {allPeople.current.length > 12 && <span className="text-xs text-slate-500">+{allPeople.current.length - 12} more in the totals</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="uppercase tracking-wider text-slate-500">Period</span>
            <button type="button" onClick={() => changeRange({ from: bounds.first, to: bounds.last })} className="rounded-full bg-white/5 px-3 py-1.5 font-semibold text-slate-300 hover:bg-white/10">Whole chat</button>
            {years.map((year) => (
              <button key={year} type="button" onClick={() => changeRange({ from: Math.max(bounds.first, Math.floor(Date.UTC(year, 0, 1) / 86400000)), to: Math.min(bounds.last, Math.floor(Date.UTC(year, 11, 31) / 86400000)) })} className="rounded-full bg-white/5 px-3 py-1.5 font-semibold text-slate-300 hover:bg-white/10">{year}</button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-400">From <strong className="text-slate-200">{dayLabel(range.from)}</strong>
              <input type="range" min={bounds.first} max={bounds.last} value={range.from} onChange={(event) => changeRange({ from: Number(event.target.value) })} className="mt-1 w-full accent-emerald-500" />
            </label>
            <label className="text-xs text-slate-400">To <strong className="text-slate-200">{dayLabel(range.to)}</strong>
              <input type="range" min={bounds.first} max={bounds.last} value={range.to} onChange={(event) => changeRange({ to: Number(event.target.value) })} className="mt-1 w-full accent-emerald-500" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Messages" value={int(summary.totals.messages)} hint={`${int(summary.totals.words)} words`} />
            <Stat label="Active days" value={int(summary.totals.activeDays)} hint={summary.totals.activeDays ? `${(summary.totals.messages / summary.totals.activeDays).toFixed(1)} messages a day` : ''} />
            <Stat label="Longest streak" value={`${summary.streak.days} days`} hint={summary.streak.start != null ? `${dayLabel(summary.streak.start)} → ${dayLabel(summary.streak.end)}` : ''} />
            <Stat label="Longest silence" value={summary.longestSilence ? (summary.longestSilence.hours >= 48 ? `${(summary.longestSilence.hours / 24).toFixed(1)} days` : `${summary.longestSilence.hours.toFixed(1)} h`) : '—'} hint={summary.longestSilence ? `until ${dayLabel(Math.floor(summary.longestSilence.to / 86400000))}` : ''} />
            <Stat label="Busiest day" value={summary.busiestDay ? `${int(summary.busiestDay.count)} msgs` : '—'} hint={summary.busiestDay ? dayLabel(summary.busiestDay.day) : ''} />
            <Stat label="Media" value={int(summary.totals.media)} hint="photos, videos, stickers…" />
            <Stat label="Deleted" value={int(summary.totals.deleted)} hint={`${int(summary.totals.edited)} edited`} />
            <Stat label="Longest message" value={`${int(summary.longestMessage.chars)} chars`} hint={summary.longestMessage.name || ''} />
          </div>

          <Card title="Messages by person">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500"><th className="py-2">Person</th><th className="py-2 text-right">Messages</th><th className="py-2 text-right">Words</th><th className="py-2 text-right">Words / msg</th><th className="py-2 text-right">Starts chats</th><th className="py-2 text-right">Median reply</th><th className="py-2 pl-4">Top emoji</th></tr></thead>
                <tbody>
                  {summary.participants.map((p) => (
                    <tr key={p.name} className="border-t border-white/5">
                      <th scope="row" className="py-2 text-left font-semibold text-white">{p.name}</th>
                      <td className="py-2 text-right tabular-nums text-slate-200">{int(p.messages)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-300">{int(p.words)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-300">{p.avgWords.toFixed(1)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-300">{int(p.starters)}</td>
                      <td className="py-2 text-right tabular-nums text-slate-300">{duration(p.medianResponseSeconds)}</td>
                      <td className="py-2 pl-4 text-lg">{p.emoji.map(([e]) => e).join(' ') || <span className="text-sm text-slate-600">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">“Starts chats” counts the first message after a gap of more than four hours. “Median reply” is the middle response time to the other person, ignoring gaps over twelve hours.</p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="When you chat"><Heatmap summary={summary} /></Card>
            <Card title="Over time"><Timeline summary={summary} /></Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card title="Top words"><TopList items={summary.topWords} /></Card>
            <Card title="Top phrases"><TopList items={summary.topBigrams} empty="No repeated phrases." /></Card>
            <Card title="Top emoji"><TopList items={summary.topEmoji} empty="No emoji found." /></Card>
          </div>

          <SharePanel summary={summary} />
        </div>
      )}
    </div>
  );
}
