'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Grid, LabelledField, LabelledSelect, Panel, Result, Segmented,
  Stat, StatGrid, TextArea,
} from '../impl/uiKit.jsx';
import { toNumber } from '../impl/toolFormat.js';
import { useFormat } from '../../../i18n/i18n.js';
import {
  TYPING_PASSAGES, VAT_PRESETS, ZONES, average, bedtimesFor, cps, cpsBand, dayOfYear, euclidSteps,
  factorString, fancyText, formatInZone, gcfLcm, isLeap, isoDate, isoWeek, isoWeekRange, isoWeeksInYear,
  numberToWords, parseIntegerList, primeFactors, reactionBand, typingBand, typingStats,
  usWeek, vat, wakeTimesFrom, zonedToUtc,
} from '../../../lib/quick/engines.js';

const pad = (n) => String(n).padStart(2, '0');
const todayParts = () => {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
};
const parseDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  return m ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } : null;
};
const longDate = (date) => date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/* ------------------------------------------------------------ VAT / GST */
export function VatCalculator() {
  const { num } = useFormat();
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('100');
  const [rate, setRate] = useState('20');
  const [symbol, setSymbol] = useState('');
  const result = vat(toNumber(amount, NaN), toNumber(rate, NaN), mode);
  const show = (value) => `${symbol}${num(value, 2)}`;

  return (
    <>
      <Segmented ariaLabel="VAT mode" value={mode} onChange={setMode}
        options={[{ value: 'add', label: 'Add VAT (price is before tax)' }, { value: 'remove', label: 'Remove VAT (price includes tax)' }]} />
      <Grid className="mt-5 md:grid-cols-3">
        <LabelledField label={mode === 'add' ? 'Net amount (excluding VAT)' : 'Gross amount (including VAT)'} id="vat-amount" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label="VAT / GST rate (%)" id="vat-rate" type="number" min="0" step="any" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledSelect label="Currency symbol" id="vat-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="">None</option>
          {['$', '£', '€', 'Rs ', '₹', 'AED ', 'A$', 'C$'].map((s) => <option key={s} value={s}>{s.trim()}</option>)}
        </LabelledSelect>
      </Grid>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Common rates">
        {VAT_PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => setRate(String(p.rate))}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${Number(rate) === p.rate ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
            {p.label}
          </button>
        ))}
      </div>
      {result ? (
        <>
          <div className="mt-6"><Result label={mode === 'add' ? 'Total including VAT' : 'Price excluding VAT'} value={show(mode === 'add' ? result.gross : result.net)} /></div>
          <StatGrid>
            <Stat label="Net (before VAT)" value={show(result.net)} />
            <Stat label={`VAT at ${num(toNumber(rate), 2)}%`} value={show(result.vat)} accent="cyan" />
            <Stat label="Gross (with VAT)" value={show(result.gross)} />
          </StatGrid>
        </>
      ) : <ErrorNote>Enter an amount and a rate of 0 or more.</ErrorNote>}
    </>
  );
}

/* --------------------------------------------------------- Time zones */
const DEFAULT_TARGETS = ['America/New_York', 'Europe/London', 'Asia/Karachi', 'Asia/Tokyo'];

export function TimeZoneConverter() {
  const [from, setFrom] = useState('America/New_York');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [add, setAdd] = useState('');

  useEffect(() => {
    const now = todayParts();
    setDate(now.date);
    try { setFrom(Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'); } catch { /* keep default */ }
  }, []);

  const zoneList = useMemo(() => (ZONES.some((z) => z.id === from) ? ZONES : [{ id: from, label: from.replace(/_/g, ' ') }, ...ZONES]), [from]);
  const parsed = parseDate(date);
  const [h, mi] = time.split(':').map(Number);
  const instant = parsed && Number.isFinite(h) ? zonedToUtc({ ...parsed, hour: h, minute: mi || 0 }, from) : null;
  const label = (id) => zoneList.find((z) => z.id === id)?.label || id;
  const base = instant ? formatInZone(instant, from) : null;

  const useNow = () => {
    const now = new Date();
    const p = todayParts();
    setDate(p.date);
    setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    try { setFrom(Intl.DateTimeFormat().resolvedOptions().timeZone || from); } catch { /* ignore */ }
  };

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledSelect label="Convert from" id="tz-from" value={from} onChange={(e) => setFrom(e.target.value)}>
          {zoneList.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
        </LabelledSelect>
        <LabelledField label="Date" id="tz-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <LabelledField label="Time" id="tz-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </Grid>
      <div className="mt-3"><Button variant="ghost" onClick={useNow}>Use my current time</Button></div>

      {instant ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
              <tr><th className="p-3">Place</th><th className="p-3">Time</th><th className="p-3">Date</th><th className="p-3">Offset</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {[from, ...targets.filter((t) => t !== from)].map((id) => {
                const r = formatInZone(instant, id);
                const working = r.hour >= 9 && r.hour < 17;
                const dayShift = r.dayKey === base.dayKey ? '' : r.dayKey > base.dayKey ? '+1 day' : '−1 day';
                return (
                  <tr key={id} className="border-t border-white/10">
                    <td className="p-3 font-semibold text-white">{label(id)}{id === from && <span className="ml-2 text-xs text-slate-500">(your source)</span>}</td>
                    <td className="p-3 text-lg font-black text-emerald-300">{r.time} {dayShift && <span className="text-xs font-semibold text-amber-300">{dayShift}</span>}</td>
                    <td className="p-3 text-slate-300">{r.date}</td>
                    <td className="p-3 text-slate-400">{r.offset}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${working ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>{working ? 'Work hours' : 'Off hours'}</span>
                      {id !== from && <button type="button" aria-label={`Remove ${label(id)}`} onClick={() => setTargets((prev) => prev.filter((t) => t !== id))} className="ml-2 text-slate-500 hover:text-white">✕</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (date ? <ErrorNote>Pick a valid date and time to convert.</ErrorNote> : null)}

      <div className="mt-4 max-w-sm">
        <LabelledSelect label="Add a place" id="tz-add" value={add} onChange={(e) => { const v = e.target.value; if (v && !targets.includes(v)) setTargets((prev) => [...prev, v]); setAdd(''); }}>
          <option value="">Choose a city or zone…</option>
          {ZONES.filter((z) => z.id !== from && !targets.includes(z.id)).map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
        </LabelledSelect>
      </div>
      <p className="mt-3 text-xs text-slate-500">Daylight saving is applied for the date you choose, so the same clock time can map to a different offset in summer and winter.</p>
    </>
  );
}

/* -------------------------------------------------------- Typing test */
const DURATIONS = [15, 30, 60, 120];
const buildPassage = (start) => [0, 1, 2, 3].map((i) => TYPING_PASSAGES[(start + i) % TYPING_PASSAGES.length]).join(' ');

export function TypingSpeedTest() {
  const [duration, setDuration] = useState(60);
  const [start, setStart] = useState(0);
  const [typed, setTyped] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const startedAt = useRef(null);
  const inputRef = useRef(null);
  const target = useMemo(() => buildPassage(start), [start]);

  const finish = (seconds) => { setElapsed(seconds); setDone(true); };

  useEffect(() => {
    if (done || startedAt.current === null) return undefined;
    const id = setInterval(() => {
      const seconds = (performance.now() - startedAt.current) / 1000;
      if (seconds >= duration) { clearInterval(id); finish(duration); } else setElapsed(seconds);
    }, 100);
    return () => clearInterval(id);
  }, [typed.length > 0, done, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (event) => {
    if (done) return;
    const value = event.target.value.slice(0, target.length);
    if (startedAt.current === null && value.length) startedAt.current = performance.now();
    setTyped(value);
    if (value.length >= target.length) finish(Math.min(duration, (performance.now() - startedAt.current) / 1000));
  };

  const reset = (newPassage) => {
    startedAt.current = null;
    setTyped(''); setElapsed(0); setDone(false);
    if (newPassage) setStart((s) => (s + 1) % TYPING_PASSAGES.length);
    inputRef.current?.focus();
  };

  const stats = typingStats(target, typed, Math.max(elapsed, 1));
  const left = Math.max(0, duration - elapsed);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented ariaLabel="Test length" value={String(duration)} onChange={(v) => { setDuration(Number(v)); reset(false); }}
          options={DURATIONS.map((d) => ({ value: String(d), label: d >= 60 ? `${d / 60} min` : `${d} sec` }))} />
        <div className="text-2xl font-black tabular-nums text-indigo-300" aria-live="off">{Math.ceil(left)}s</div>
      </div>
      <p className="mt-4 select-none rounded-2xl border border-white/10 bg-slate-950/60 p-4 font-mono text-base leading-8" aria-label="Text to type">
        {[...target].map((char, i) => {
          let cls = 'text-slate-500';
          if (i < typed.length) cls = typed[i] === char ? 'text-emerald-300' : 'rounded bg-rose-500/30 text-rose-200';
          else if (i === typed.length && !done) cls = 'border-b-2 border-indigo-400 text-white';
          return <span key={i} className={cls}>{char}</span>;
        })}
      </p>
      <TextArea ref={inputRef} className="mt-3 min-h-24" placeholder="Click here and start typing. The timer starts on your first key." value={typed} onChange={onChange} disabled={done}
        aria-label="Type the text above" autoCapitalize="off" autoCorrect="off" onPaste={(e) => e.preventDefault()} />
      <StatGrid columns="md:grid-cols-4">
        <Stat label="Words per minute" value={Math.round(stats.wpm)} accent="emerald" />
        <Stat label="Accuracy" value={`${stats.accuracy.toFixed(0)}%`} />
        <Stat label="Raw speed (WPM)" value={Math.round(stats.raw)} accent="cyan" />
        <Stat label="Mistakes" value={stats.errors} />
      </StatGrid>
      {done && <div className="mt-4"><Result label="Your result" value={`${Math.round(stats.wpm)} WPM at ${stats.accuracy.toFixed(0)}% accuracy`} note={typingBand(stats.wpm)} /></div>}
      <div className="mt-4 flex gap-2">
        <Button onClick={() => reset(false)}>Restart</Button>
        <Button variant="ghost" onClick={() => reset(true)}>New text</Button>
      </div>
    </>
  );
}

/* --------------------------------------------------------- CPS test */
const CPS_TIMES = [1, 5, 10, 30, 60];

export function ClickSpeedTest() {
  const [seconds, setSeconds] = useState(5);
  const [clicks, setClicks] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [left, setLeft] = useState(5);
  const [best, setBest] = useState(null);
  const startedAt = useRef(0);

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const id = setInterval(() => {
      const remaining = seconds - (performance.now() - startedAt.current) / 1000;
      if (remaining <= 0) { setLeft(0); setPhase('done'); clearInterval(id); } else setLeft(remaining);
    }, 50);
    return () => clearInterval(id);
  }, [phase, seconds]);

  const final = cps(clicks, seconds);
  useEffect(() => { if (phase === 'done') setBest((b) => (b === null || final > b ? final : b)); }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = () => {
    if (phase === 'done') return;
    if (phase === 'idle') { startedAt.current = performance.now(); setPhase('running'); }
    setClicks((c) => c + 1);
  };
  const reset = () => { setClicks(0); setPhase('idle'); setLeft(seconds); };
  const live = phase === 'running' ? cps(clicks, Math.max(0.2, seconds - left)) : final;

  return (
    <>
      <Segmented ariaLabel="Test length" value={String(seconds)} onChange={(v) => { setSeconds(Number(v)); setLeft(Number(v)); setClicks(0); setPhase('idle'); }}
        options={CPS_TIMES.map((s) => ({ value: String(s), label: `${s}s` }))} />
      <button type="button" onPointerDown={click} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); click(); } }}
        className="mt-5 flex h-56 w-full select-none touch-manipulation flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-400/60 bg-indigo-500/10 text-center transition active:scale-[0.99] active:bg-indigo-500/20">
        <span className="text-3xl font-black text-white">{phase === 'idle' ? 'Click here to start' : phase === 'running' ? 'Keep clicking!' : 'Time’s up'}</span>
        <span className="mt-2 text-sm text-slate-400">{phase === 'idle' ? `The ${seconds}-second timer begins on your first click` : `${left.toFixed(1)}s left`}</span>
      </button>
      <StatGrid columns="md:grid-cols-4">
        <Stat label="Clicks" value={clicks} />
        <Stat label="Clicks per second" value={live.toFixed(2)} accent="emerald" />
        <Stat label="Time left" value={`${left.toFixed(1)}s`} accent="cyan" />
        <Stat label="Session best" value={best === null ? '—' : best.toFixed(2)} />
      </StatGrid>
      {phase === 'done' && <div className="mt-4"><Result label="Your CPS" value={`${final.toFixed(2)} clicks per second`} note={`${cpsBand(final)}. ${clicks} clicks in ${seconds} seconds.`} /></div>}
      <div className="mt-4"><Button onClick={reset}>Try again</Button></div>
    </>
  );
}

/* ----------------------------------------------------- Reaction time */
export function ReactionTimeTest() {
  const [phase, setPhase] = useState('idle'); // idle | waiting | go | early | result
  const [last, setLast] = useState(null);
  const [times, setTimes] = useState([]);
  const timer = useRef(null);
  const goAt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const arm = () => {
    setPhase('waiting');
    timer.current = setTimeout(() => { goAt.current = performance.now(); setPhase('go'); }, 1500 + Math.random() * 3500);
  };

  const press = () => {
    if (phase === 'idle' || phase === 'early' || phase === 'result') arm();
    else if (phase === 'waiting') { clearTimeout(timer.current); setPhase('early'); }
    else if (phase === 'go') {
      const ms = Math.round(performance.now() - goAt.current);
      setLast(ms); setTimes((prev) => [...prev, ms].slice(-5)); setPhase('result');
    }
  };

  const copy = {
    idle: ['Click to start', 'When the box turns green, click as fast as you can', 'bg-indigo-500/15 border-indigo-400/60'],
    waiting: ['Wait for green…', 'Do not click yet', 'bg-rose-500/20 border-rose-400/60'],
    go: ['CLICK NOW!', '', 'bg-emerald-500/30 border-emerald-400'],
    early: ['Too soon!', 'You clicked before it turned green. Click to try again.', 'bg-amber-500/20 border-amber-400/60'],
    result: [`${last} ms`, 'Click to try again', 'bg-indigo-500/15 border-indigo-400/60'],
  }[phase];
  const avg = average(times);

  return (
    <>
      <button type="button" onPointerDown={press} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); } }}
        className={`flex h-64 w-full select-none touch-manipulation flex-col items-center justify-center rounded-3xl border-2 text-center transition ${copy[2]}`}>
        <span className="text-4xl font-black text-white">{copy[0]}</span>
        {copy[1] && <span className="mt-2 px-4 text-sm text-slate-300">{copy[1]}</span>}
      </button>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Last attempt" value={last === null ? '—' : `${last} ms`} accent="emerald" />
        <Stat label={`Average of ${times.length || 0}`} value={avg === null ? '—' : `${Math.round(avg)} ms`} />
        <Stat label="Best of the last 5" value={times.length ? `${Math.min(...times)} ms` : '—'} accent="cyan" />
      </StatGrid>
      {last !== null && phase === 'result' && <div className="mt-4"><Result label="How you compare" value={reactionBand(last)} note="The average adult reaction to a visual cue is about 250 milliseconds." /></div>}
      {times.length > 0 && <div className="mt-4"><Button variant="ghost" onClick={() => { setTimes([]); setLast(null); setPhase('idle'); }}>Clear results</Button></div>}
    </>
  );
}

/* ------------------------------------------------------ Number to words */
export function NumberToWords() {
  const [value, setValue] = useState('1234.56');
  const [british, setBritish] = useState(false);
  const words = numberToWords(value, { british });
  const rows = words ? [
    ['In words', words.cardinal],
    ...(words.ordinal ? [['As an ordinal', words.ordinal]] : []),
    ['For a cheque (dollars)', `${words.cheque} dollars`],
    ['For a cheque (pounds)', `${words.cheque} pounds`],
  ] : [];

  return (
    <>
      <Grid className="md:grid-cols-[2fr_1fr] items-end">
        <LabelledField label="Number" id="ntw-value" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} hint="up to 27 digits, decimals and negatives allowed" />
        <Segmented ariaLabel="English style" value={british ? 'uk' : 'us'} onChange={(v) => setBritish(v === 'uk')} options={[{ value: 'us', label: 'US: one hundred five' }, { value: 'uk', label: 'UK: one hundred and five' }]} />
      </Grid>
      {words ? (
        <div className="mt-6 space-y-3">
          {rows.map(([label, text]) => (
            <Panel key={label}>
              <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
              <p className="mt-1 break-words text-xl font-bold text-emerald-300">{text.charAt(0).toUpperCase() + text.slice(1)}</p>
              <div className="mt-3"><CopyButton value={text.charAt(0).toUpperCase() + text.slice(1)} /></div>
            </Panel>
          ))}
        </div>
      ) : <ErrorNote>Enter a number with digits only: for example 1250, 3.14 or −42. The limit is 27 digits.</ErrorNote>}
    </>
  );
}

/* ---------------------------------------------------------- GCF / LCM */
export function GcfLcmCalculator() {
  const [text, setText] = useState('24, 36, 60');
  const values = parseIntegerList(text);
  const out = values ? gcfLcm(values) : null;
  const factors = values ? values.map((v) => ({ v, f: factorString(primeFactors(v)) })) : [];
  const steps = values && values.length === 2 ? euclidSteps(values[0], values[1]) : null;

  return (
    <>
      <LabelledField label="Numbers" id="gcf-input" value={text} onChange={(e) => setText(e.target.value)} hint="2 to 10 positive whole numbers, separated by commas or spaces" />
      {out && values.length > 1 ? (
        <>
          <StatGrid columns="md:grid-cols-2">
            <Stat label="Greatest common factor (GCF / HCF / GCD)" value={out.gcf.toString()} accent="emerald" />
            <Stat label="Least common multiple (LCM)" value={out.lcm.toString()} accent="cyan" />
          </StatGrid>
          <div className="mt-6 space-y-3">
            <Panel title="Prime factorisation">
              <ul className="space-y-1 text-slate-300">{factors.map(({ v, f }) => <li key={v.toString()}><strong className="text-white">{v.toString()}</strong> = {f}</li>)}</ul>
              <p className="mt-3 text-sm text-slate-500">The GCF takes the lowest power of each shared prime; the LCM takes the highest power of every prime that appears.</p>
            </Panel>
            {steps && (
              <Panel title="Euclidean algorithm">
                <ol className="space-y-1 font-mono text-sm text-slate-300">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <p className="mt-3 text-sm text-slate-500">The last non-zero remainder, {out.gcf.toString()}, is the GCF. LCM = (a × b) ÷ GCF.</p>
              </Panel>
            )}
          </div>
        </>
      ) : <ErrorNote>{values && values.length < 2 ? 'Enter at least two numbers.' : 'Use two to ten positive whole numbers of up to 15 digits, such as 12, 18, 30.'}</ErrorNote>}
    </>
  );
}

/* --------------------------------------------------------- Week number */
export function WeekNumberCalculator() {
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [week, setWeek] = useState('1');

  useEffect(() => { const t = todayParts(); setDate(t.date); setYear(String(new Date().getFullYear())); }, []);

  const p = parseDate(date);
  const iso = p ? isoWeek(p.year, p.month, p.day) : null;
  const us = p ? usWeek(p.year, p.month, p.day) : null;
  const doy = p ? dayOfYear(p.year, p.month, p.day) : null;
  const total = p ? (isLeap(p.year) ? 366 : 365) : null;
  const y = Number(year);
  const maxWeek = Number.isInteger(y) && y > 0 ? isoWeeksInYear(y) : 52;
  const w = Math.min(Math.max(Number(week) || 1, 1), maxWeek);
  const range = Number.isInteger(y) && y > 0 && y < 9000 ? isoWeekRange(y, w) : null;

  return (
    <>
      <Panel title="What week number is a date?">
        <div className="max-w-xs"><LabelledField label="Date" id="wk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        {iso ? (
          <>
            <StatGrid columns="md:grid-cols-4">
              <Stat label="ISO week number" value={iso.week} accent="emerald" hint={iso.year !== p.year ? `belongs to ${iso.year}` : undefined} />
              <Stat label="US week number" value={us.week} accent="cyan" />
              <Stat label="Day of the year" value={`${doy} of ${total}`} />
              <Stat label={`Weeks in ${iso.year} (ISO)`} value={isoWeeksInYear(iso.year)} />
            </StatGrid>
            <p className="mt-4 text-sm text-slate-400">{longDate(new Date(Date.UTC(p.year, p.month - 1, p.day)))} is day {iso.weekday} of ISO week {iso.week}, {iso.year}. {total - doy} days remain in the year.</p>
          </>
        ) : (date ? <ErrorNote>Pick a valid date.</ErrorNote> : null)}
      </Panel>
      <div className="mt-4">
        <Panel title="What are the dates of a week?">
          <Grid className="md:grid-cols-3">
            <LabelledField label="Year" id="wk-year" type="number" min="1" max="9000" value={year} onChange={(e) => setYear(e.target.value)} />
            <LabelledField label={`ISO week (1 to ${maxWeek})`} id="wk-week" type="number" min="1" max={maxWeek} value={week} onChange={(e) => setWeek(e.target.value)} />
          </Grid>
          {range && <div className="mt-4"><Result label={`ISO week ${w} of ${year} runs`} value={`${isoDate(range.start)} to ${isoDate(range.end)}`} note={`${longDate(range.start)} to ${longDate(range.end)}`} /></div>}
        </Panel>
      </div>
      <p className="mt-3 text-xs text-slate-500">ISO weeks start on Monday and week 1 is the week with the year’s first Thursday. The US system starts weeks on Sunday and week 1 is the one containing 1 January.</p>
    </>
  );
}

/* ----------------------------------------------------- Sleep calculator */
export function SleepCalculator() {
  const [mode, setMode] = useState('wake');
  const [wake, setWake] = useState('07:00');
  const [bed, setBed] = useState('23:00');
  const [fall, setFall] = useState('15');
  const minutes = (value) => { const [h, m] = value.split(':').map(Number); return h * 60 + (m || 0); };
  const fallAsleep = Math.min(60, Math.max(0, toNumber(fall, 15)));
  const rows = mode === 'wake' ? bedtimesFor(minutes(wake), fallAsleep) : wakeTimesFrom(minutes(bed), fallAsleep);

  return (
    <>
      <Segmented ariaLabel="Sleep calculator mode" value={mode} onChange={setMode}
        options={[{ value: 'wake', label: 'I need to wake up at…' }, { value: 'bed', label: 'I’m going to bed at…' }]} />
      <Grid className="mt-5 md:grid-cols-3 items-end">
        {mode === 'wake'
          ? <LabelledField label="Wake-up time" id="sl-wake" type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
          : <LabelledField label="Bedtime" id="sl-bed" type="time" value={bed} onChange={(e) => setBed(e.target.value)} />}
        <LabelledField label="Minutes to fall asleep" id="sl-fall" type="number" min="0" max="60" value={fall} onChange={(e) => setFall(e.target.value)} />
        {mode === 'bed' && <div><Button variant="ghost" onClick={() => { const d = new Date(); const v = `${pad(d.getHours())}:${pad(d.getMinutes())}`; setBed(v); }}>Use the current time</Button></div>}
      </Grid>
      <h3 className="mt-6 text-lg font-bold text-white">{mode === 'wake' ? 'Go to bed at one of these times' : 'Set your alarm for one of these times'}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map((r) => (
          <div key={r.cycles} className={`rounded-2xl border p-5 text-center ${r.cycles >= 5 ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
            <strong className="block text-2xl font-black text-white">{r.clock}</strong>
            <span className="mt-1 block text-xs text-slate-400">{r.cycles} cycles · {r.hours} hours of sleep</span>
            {r.cycles >= 5 && <span className="mt-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">Recommended</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">Based on 90-minute sleep cycles plus the time it takes you to fall asleep. This is a guide, not medical advice: cycle length varies between people and through the night.</p>
    </>
  );
}

/* ---------------------------------------------------------- Fancy text */
export function FancyTextGenerator() {
  const [text, setText] = useState('Talk and Tool');
  const rows = useMemo(() => fancyText(text || ' '), [text]);
  return (
    <>
      <LabelledField label="Your text" id="fancy-text" value={text} onChange={(e) => setText(e.target.value)} maxLength={500} />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-wider text-slate-500">{row.name}</span>
              <p className="mt-1 break-words text-lg text-white">{row.text}</p>
            </div>
            <CopyButton value={row.text} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">These are Unicode characters, not fonts, so they paste into Instagram, TikTok, X, Discord and most chat apps. Some platforms and screen readers handle them poorly: avoid them for anything that must stay accessible.</p>
    </>
  );
}
