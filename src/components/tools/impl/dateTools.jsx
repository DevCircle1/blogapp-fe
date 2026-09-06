import { useEffect, useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel,
  Result, Segmented, Select, Stat, StatGrid, Toggle,
} from './uiKit.jsx';
import { num, toNumber } from './toolFormat.js';

const today = () => new Date().toISOString().slice(0, 10);
const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const countWeekdays = (start, end) => {
  let days = 0;
  const cursor = new Date(start);
  while (cursor < end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) days += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

/* -------------------------------------------------------- Date difference */
export function DateDifferenceCalculator() {
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(today());
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);

  const result = useMemo(() => {
    const a = parseDate(start);
    const b = parseDate(end);
    if (!a || !b) return null;
    const negative = b < a;
    const [from, to] = negative ? [b, a] : [a, b];
    const totalDays = Math.round((to - from) / 86400000);

    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    if (days < 0) { months -= 1; days += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
    if (months < 0) { years -= 1; months += 12; }

    return {
      totalDays: negative ? -totalDays : totalDays,
      weekdays: weekdaysOnly ? countWeekdays(from, to) : null,
      years, months, days, negative,
      weeks: Math.floor(totalDays / 7),
      hours: totalDays * 24,
    };
  }, [start, end, weekdaysOnly]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label="Start date" id="dd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <LabelledField label="End date" id="dd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      </Grid>
      <div className="mt-4"><Toggle checked={weekdaysOnly} onChange={() => setWeekdaysOnly(!weekdaysOnly)} label="Also count weekdays only (excludes weekends)" /></div>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
            <p className="text-4xl font-black text-emerald-300">{Math.abs(result.totalDays).toLocaleString()} days</p>
            <p className="mt-2 text-slate-300">{result.years} years, {result.months} months, {result.days} days{result.negative ? ' (end date is earlier)' : ''}</p>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Weeks" value={result.weeks.toLocaleString()} accent="cyan" />
            <Stat label="Hours" value={Math.abs(result.hours).toLocaleString()} />
            <Stat label="Months (approx)" value={num(Math.abs(result.totalDays) / 30.44, 1)} accent="cyan" />
            <Stat label="Weekdays" value={result.weekdays === null ? '—' : result.weekdays.toLocaleString()} accent="emerald" />
          </StatGrid>
          <p className="mt-4 text-sm text-slate-500">The count excludes the end date. Add one day if you need an inclusive total, as for a holiday booking.</p>
        </>
      ) : <ErrorNote>Choose two valid dates.</ErrorNote>}
    </>
  );
}

/* ------------------------------------------------------ Add/subtract days */
export function DateAddSubtract() {
  const [start, setStart] = useState(today());
  const [operation, setOperation] = useState('add');
  const [amount, setAmount] = useState('30');
  const [unit, setUnit] = useState('days');

  const result = useMemo(() => {
    const base = parseDate(start);
    if (!base) return null;
    const value = Math.floor(toNumber(amount)) * (operation === 'add' ? 1 : -1);
    const date = new Date(base);
    if (unit === 'days') date.setDate(date.getDate() + value);
    else if (unit === 'weeks') date.setDate(date.getDate() + value * 7);
    else if (unit === 'months') {
      const targetDay = date.getDate();
      date.setDate(1);
      date.setMonth(date.getMonth() + value);
      date.setDate(Math.min(targetDay, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
    } else {
      const targetDay = date.getDate();
      const targetMonth = date.getMonth();
      date.setFullYear(date.getFullYear() + value);
      date.setDate(Math.min(targetDay, new Date(date.getFullYear(), targetMonth + 1, 0).getDate()));
    }
    return date;
  }, [start, operation, amount, unit]);

  const iso = result ? `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, '0')}-${String(result.getDate()).padStart(2, '0')}` : '';

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Start date" id="das-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <LabelledSelect label="Operation" id="das-op" value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
        </LabelledSelect>
        <LabelledField label="Amount" id="das-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledSelect label="Unit" id="das-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </LabelledSelect>
      </Grid>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
            <p className="text-3xl font-black text-emerald-300">{result.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <StatGrid columns="md:grid-cols-3">
            <Stat label="ISO 8601" value={iso} accent="cyan" />
            <Stat label="Day of week" value={result.toLocaleDateString(undefined, { weekday: 'long' })} />
            <Stat label="Weekend?" value={[0, 6].includes(result.getDay()) ? 'Yes — may roll to Monday' : 'No'} accent="cyan" />
          </StatGrid>
          <div className="mt-4"><CopyButton value={iso} label="Copy ISO date" /></div>
        </>
      ) : <ErrorNote>Choose a valid start date.</ErrorNote>}
    </>
  );
}

/* ----------------------------------------------------------- Time duration */
export function TimeDurationCalculator() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState('30');

  const result = useMemo(() => {
    const toMinutes = (value) => {
      const [h, m] = value.split(':').map(Number);
      return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
    };
    const from = toMinutes(start);
    const to = toMinutes(end);
    if (from === null || to === null) return null;
    let total = to - from;
    const overnight = total < 0;
    if (overnight) total += 1440;
    const worked = Math.max(0, total - Math.max(0, toNumber(breakMinutes)));
    return { worked, overnight, hours: Math.floor(worked / 60), minutes: worked % 60, decimal: worked / 60 };
  }, [start, end, breakMinutes]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Start time" id="td-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        <LabelledField label="End time" id="td-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        <LabelledField label="Unpaid break (minutes)" id="td-break" type="number" min="0" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} />
      </Grid>
      {result ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label="Duration" value={`${result.hours}h ${result.minutes}m`} />
            <Result label="Decimal hours (for timesheets)" value={num(result.decimal, 2)} accent="cyan" note="Use this figure for payroll, not the hours-and-minutes form" />
          </div>
          {result.overnight && <p className="mt-4 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-3 text-sm text-indigo-200">The end time is earlier than the start time, so this is treated as an overnight shift.</p>}
          <StatGrid columns="md:grid-cols-3">
            <Stat label="Total minutes" value={result.worked.toLocaleString()} />
            <Stat label="Five-day week" value={`${num(result.decimal * 5, 2)} hours`} accent="cyan" />
            <Stat label="Monthly (21 days)" value={`${num(result.decimal * 21, 1)} hours`} />
          </StatGrid>
        </>
      ) : <ErrorNote>Enter valid start and end times.</ErrorNote>}
    </>
  );
}

/* ------------------------------------------------------------ Working days */
export function WorkingDaysCalculator() {
  const [mode, setMode] = useState('between');
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(today());
  const [days, setDays] = useState('10');

  const between = useMemo(() => {
    const a = parseDate(start);
    const b = parseDate(end);
    if (!a || !b || b < a) return null;
    return { weekdays: countWeekdays(a, b), calendar: Math.round((b - a) / 86400000) };
  }, [start, end]);

  const projected = useMemo(() => {
    const base = parseDate(start);
    if (!base) return null;
    const target = Math.max(0, Math.floor(toNumber(days)));
    const cursor = new Date(base);
    let counted = 0;
    while (counted < target) {
      cursor.setDate(cursor.getDate() + 1);
      if (![0, 6].includes(cursor.getDay())) counted += 1;
    }
    return cursor;
  }, [start, days]);

  return (
    <>
      <Segmented ariaLabel="Mode" value={mode} onChange={setMode}
        options={[{ value: 'between', label: 'Between two dates' }, { value: 'add', label: 'Add business days' }]} />
      {mode === 'between' ? (
        <>
          <Grid className="mt-5 md:grid-cols-2">
            <LabelledField label="Start date" id="wd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <LabelledField label="End date" id="wd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Grid>
          {between ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Result label="Business days" value={between.weekdays.toLocaleString()} />
              <Result label="Calendar days" value={between.calendar.toLocaleString()} accent="cyan" />
            </div>
          ) : <ErrorNote>The end date must be on or after the start date.</ErrorNote>}
        </>
      ) : (
        <>
          <Grid className="mt-5 md:grid-cols-2">
            <LabelledField label="Start date" id="wd-astart" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <LabelledField label="Business days to add" id="wd-days" type="number" min="0" value={days} onChange={(e) => setDays(e.target.value)} />
          </Grid>
          {projected && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
              <p className="text-3xl font-black text-emerald-300">{projected.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          )}
        </>
      )}
      <p className="mt-5 text-sm text-slate-500">Weekends are excluded; public holidays are not, because they differ by country and region. Subtract any that fall inside your range.</p>
    </>
  );
}

/* --------------------------------------------------------- Countdown timer */
export function CountdownTimer() {
  const nextNewYear = `${new Date().getFullYear() + 1}-01-01T00:00`;
  const [target, setTarget] = useState(nextNewYear);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const targetTime = new Date(target).getTime();
  const valid = Number.isFinite(targetTime);
  const diff = valid ? targetTime - now : 0;
  const past = diff < 0;
  const absolute = Math.abs(diff);

  const parts = {
    days: Math.floor(absolute / 86400000),
    hours: Math.floor((absolute % 86400000) / 3600000),
    minutes: Math.floor((absolute % 3600000) / 60000),
    seconds: Math.floor((absolute % 60000) / 1000),
  };

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label="Target date and time" id="cd-target" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
        <div>
          <Label>Quick presets</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setTarget(nextNewYear)}>New Year</Button>
            <Button variant="ghost" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); setTarget(d.toISOString().slice(0, 16)); }}>In 7 days</Button>
            <Button variant="ghost" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 30); setTarget(d.toISOString().slice(0, 16)); }}>In 30 days</Button>
          </div>
        </div>
      </Grid>
      {valid ? (
        <>
          <p className="mt-6 text-center text-sm uppercase tracking-widest text-slate-500">{past ? 'Time since' : 'Time remaining'}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {Object.entries(parts).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center">
                <strong className="block text-4xl font-black text-emerald-300 tabular-nums">{String(value).padStart(2, '0')}</strong>
                <span className="mt-1 block text-xs uppercase tracking-wider text-slate-500">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-slate-500">
            Target: {new Date(target).toLocaleString()} in your local time zone.
          </p>
        </>
      ) : <ErrorNote>Choose a valid target date and time.</ErrorNote>}
    </>
  );
}

/* ------------------------------------------------------ Timestamp converter */
export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 16));

  const asMilliseconds = timestamp.length > 11 ? Number(timestamp) : Number(timestamp) * 1000;
  const date = new Date(asMilliseconds);
  const valid = timestamp !== '' && !Number.isNaN(date.getTime());
  const reverse = new Date(dateInput);
  const reverseValid = !Number.isNaN(reverse.getTime());

  return (
    <>
      <Panel title="Timestamp to date">
        <Label htmlFor="ts-input" hint={timestamp.length > 11 ? 'read as milliseconds' : 'read as seconds'}>Unix timestamp</Label>
        <Field id="ts-input" className="mt-2 font-mono" value={timestamp} onChange={(e) => setTimestamp(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}>Use current time</Button>
          <Button variant="ghost" onClick={() => setTimestamp(Date.now().toString())}>Current time (ms)</Button>
        </div>
        {valid && (
          <StatGrid columns="md:grid-cols-3">
            <Stat label="Local time" value={date.toLocaleString()} accent="emerald" />
            <Stat label="UTC" value={date.toUTCString()} accent="cyan" />
            <Stat label="ISO 8601" value={date.toISOString()} />
          </StatGrid>
        )}
      </Panel>

      <Panel title="Date to timestamp">
        <LabelledField label="Date and time" id="ts-date" type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
        {reverseValid && (
          <div className="mt-4 space-y-3">
            {[['Seconds', Math.floor(reverse.getTime() / 1000)], ['Milliseconds', reverse.getTime()]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="font-mono text-emerald-300">{value}</span>
                <CopyButton value={String(value)} />
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
