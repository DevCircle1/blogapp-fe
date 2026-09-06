import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel,
  Result, Segmented, Select, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { num, toNumber } from './toolFormat.js';

/* ------------------------------------------------------------ Percentage */
export function PercentageCalculator() {
  const [percent, setPercent] = useState('15');
  const [value, setValue] = useState('240');
  const [from, setFrom] = useState('240');
  const [to, setTo] = useState('276');
  const [partA, setPartA] = useState('36');
  const [partB, setPartB] = useState('240');

  const ofResult = (toNumber(value) * toNumber(percent)) / 100;
  const change = toNumber(from) === 0 ? null : ((toNumber(to) - toNumber(from)) / Math.abs(toNumber(from))) * 100;
  const share = toNumber(partB) === 0 ? null : (toNumber(partA) / toNumber(partB)) * 100;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel title="What is X% of Y?">
        <div className="flex items-center gap-2">
          <Field aria-label="Percentage" type="number" value={percent} onChange={(e) => setPercent(e.target.value)} />
          <span className="text-slate-400">% of</span>
          <Field aria-label="Number" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-emerald-300">{num(ofResult, 6)}</p>
        <p className="mt-2 text-sm text-slate-500">({percent || 0} ÷ 100) × {value || 0}</p>
      </Panel>

      <Panel title="Percentage change">
        <div className="flex items-center gap-2">
          <Field aria-label="Original value" type="number" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="text-slate-400">to</span>
          <Field aria-label="New value" type="number" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-cyan-300">
          {change === null || !Number.isFinite(change) ? '—' : `${change > 0 ? '+' : ''}${num(change, 4)}%`}
        </p>
        <p className="mt-2 text-sm text-slate-500">{change === null ? 'The original value cannot be zero.' : '(new − original) ÷ |original| × 100'}</p>
      </Panel>

      <Panel title="X is what percent of Y?">
        <div className="flex items-center gap-2">
          <Field aria-label="Part" type="number" value={partA} onChange={(e) => setPartA(e.target.value)} />
          <span className="text-slate-400">of</span>
          <Field aria-label="Whole" type="number" value={partB} onChange={(e) => setPartB(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-indigo-300">{share === null || !Number.isFinite(share) ? '—' : `${num(share, 4)}%`}</p>
        <p className="mt-2 text-sm text-slate-500">part ÷ whole × 100</p>
      </Panel>
    </div>
  );
}

/* --------------------------------------------------------------- Average */
export function AverageCalculator() {
  const [input, setInput] = useState('12, 7, 3, 19, 7, 22, 15');

  const stats = useMemo(() => {
    const numbers = input.split(/[\s,;]+/).map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
    if (!numbers.length) return null;
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((total, entry) => total + entry, 0);
    const mean = sum / numbers.length;
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    const counts = numbers.reduce((map, entry) => map.set(entry, (map.get(entry) || 0) + 1), new Map());
    const top = Math.max(...counts.values());
    const modes = top > 1 ? [...counts.entries()].filter(([, count]) => count === top).map(([entry]) => entry) : [];
    const variance = numbers.reduce((total, entry) => total + (entry - mean) ** 2, 0) / numbers.length;
    return { count: numbers.length, sum, mean, median, modes, min: sorted[0], max: sorted[sorted.length - 1], stdDev: Math.sqrt(variance) };
  }, [input]);

  return (
    <>
      <Label htmlFor="avg-input" hint="separated by commas, spaces, or new lines">Your numbers</Label>
      <TextArea id="avg-input" className="mt-2 min-h-40" value={input} onChange={(e) => setInput(e.target.value)} />
      {stats ? (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Mean (average)" value={num(stats.mean, 4)} accent="emerald" />
            <Stat label="Median" value={num(stats.median, 4)} accent="cyan" />
            <Stat label="Mode" value={stats.modes.length ? stats.modes.join(', ') : 'None'} />
            <Stat label="Count" value={stats.count} />
            <Stat label="Sum" value={num(stats.sum, 4)} />
            <Stat label="Minimum" value={num(stats.min, 4)} />
            <Stat label="Maximum" value={num(stats.max, 4)} />
            <Stat label="Std deviation" value={num(stats.stdDev, 4)} accent="cyan" />
          </StatGrid>
          {Math.abs(stats.mean - stats.median) > Math.abs(stats.mean) * 0.15 && (
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
              The mean and median differ noticeably, which means the data is skewed. The median is usually the more honest summary here.
            </p>
          )}
        </>
      ) : <p className="mt-5 text-slate-500">Enter some numbers to see the statistics.</p>}
    </>
  );
}

/* -------------------------------------------------------------- Fraction */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

export function FractionCalculator() {
  const [a, setA] = useState({ n: '1', d: '2' });
  const [b, setB] = useState({ n: '1', d: '3' });
  const [operation, setOperation] = useState('+');

  const result = useMemo(() => {
    const an = toNumber(a.n); const ad = toNumber(a.d);
    const bn = toNumber(b.n); const bd = toNumber(b.d);
    if (!ad || !bd) return { error: 'A denominator cannot be zero.' };
    let n; let d;
    if (operation === '+') { n = an * bd + bn * ad; d = ad * bd; }
    else if (operation === '−') { n = an * bd - bn * ad; d = ad * bd; }
    else if (operation === '×') { n = an * bn; d = ad * bd; }
    else { if (!bn) return { error: 'Cannot divide by a fraction with a zero numerator.' }; n = an * bd; d = ad * bn; }
    if (!d) return { error: 'The result is undefined.' };
    if (d < 0) { n = -n; d = -d; }
    const divisor = gcd(n, d) || 1;
    const sn = n / divisor; const sd = d / divisor;
    const whole = Math.trunc(sn / sd);
    const remainder = Math.abs(sn % sd);
    return { sn, sd, decimal: sn / sd, whole, remainder };
  }, [a, b, operation]);

  const FractionInput = ({ value, onChange, label }) => (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <Label>{label}</Label>
      <Field className="mt-2 text-center" type="number" value={value.n} onChange={(e) => onChange({ ...value, n: e.target.value })} aria-label={`${label} numerator`} />
      <div className="my-2 h-px bg-white/20" />
      <Field className="text-center" type="number" value={value.d} onChange={(e) => onChange({ ...value, d: e.target.value })} aria-label={`${label} denominator`} />
    </div>
  );

  return (
    <>
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <FractionInput value={a} onChange={setA} label="First fraction" />
        <Select value={operation} onChange={(e) => setOperation(e.target.value)} className="w-auto text-center text-xl">
          {['+', '−', '×', '÷'].map((symbol) => <option key={symbol}>{symbol}</option>)}
        </Select>
        <FractionInput value={b} onChange={setB} label="Second fraction" />
      </div>
      <ErrorNote>{result.error}</ErrorNote>
      {!result.error && (
        <StatGrid columns="md:grid-cols-3">
          <Stat label="Simplified" value={`${result.sn}/${result.sd}`} accent="emerald" />
          <Stat label="Mixed number" value={result.remainder ? `${result.whole || ''} ${result.remainder}/${result.sd}`.trim() : String(result.whole)} accent="cyan" />
          <Stat label="Decimal" value={num(result.decimal, 8)} />
        </StatGrid>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- Ratio */
export function RatioCalculator() {
  const [mode, setMode] = useState('simplify');
  const [a, setA] = useState('1920');
  const [b, setB] = useState('1080');
  const [c, setC] = useState('1280');

  const divisor = gcd(toNumber(a), toNumber(b)) || 1;
  const missing = toNumber(a) === 0 ? null : (toNumber(b) * toNumber(c)) / toNumber(a);

  return (
    <>
      <Segmented ariaLabel="Ratio mode" value={mode} onChange={setMode}
        options={[{ value: 'simplify', label: 'Simplify a ratio' }, { value: 'proportion', label: 'Solve a proportion' }]} />
      {mode === 'simplify' ? (
        <>
          <Grid className="mt-5 md:grid-cols-2">
            <LabelledField label="First value" id="ratio-a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
            <LabelledField label="Second value" id="ratio-b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </Grid>
          <StatGrid columns="md:grid-cols-3">
            <Stat label="Simplified ratio" value={`${toNumber(a) / divisor} : ${toNumber(b) / divisor}`} accent="emerald" />
            <Stat label="As a decimal" value={toNumber(b) ? num(toNumber(a) / toNumber(b), 6) : '—'} accent="cyan" />
            <Stat label="First as a share" value={toNumber(a) + toNumber(b) ? `${num((toNumber(a) / (toNumber(a) + toNumber(b))) * 100, 2)}%` : '—'} />
          </StatGrid>
        </>
      ) : (
        <>
          <div className="mt-5 grid items-end gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
            <LabelledField label="A" id="prop-a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
            <span className="pb-3 text-center text-slate-400">:</span>
            <LabelledField label="B" id="prop-b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
            <span className="pb-3 text-center text-slate-400">=</span>
            <LabelledField label="C" id="prop-c" type="number" value={c} onChange={(e) => setC(e.target.value)} />
            <span className="pb-3 text-center text-slate-400">:</span>
            <div>
              <Label>D (solved)</Label>
              <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center font-bold text-emerald-300">
                {missing === null ? '—' : num(missing, 6)}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Solved from A × D = B × C.</p>
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------- Base convert */
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function NumberBaseConverter() {
  const [base, setBase] = useState(10);
  const [value, setValue] = useState('255');

  const decimal = useMemo(() => {
    const clean = value.trim().toLowerCase();
    if (!clean) return null;
    const allowed = DIGITS.slice(0, base);
    if (![...clean].every((char) => allowed.includes(char))) return NaN;
    return parseInt(clean, base);
  }, [value, base]);

  const valid = Number.isFinite(decimal);
  const outputs = [['Binary (base 2)', 2], ['Octal (base 8)', 8], ['Decimal (base 10)', 10], ['Hexadecimal (base 16)', 16], ['Base 36', 36]];

  return (
    <>
      <Grid className="md:grid-cols-[200px_1fr]">
        <LabelledSelect label="Input base" id="base-select" value={base} onChange={(e) => setBase(Number(e.target.value))}>
          {Array.from({ length: 35 }, (_, i) => i + 2).map((option) => (
            <option key={option} value={option}>Base {option}{option === 2 ? ' (binary)' : option === 8 ? ' (octal)' : option === 10 ? ' (decimal)' : option === 16 ? ' (hex)' : ''}</option>
          ))}
        </LabelledSelect>
        <LabelledField label="Value" id="base-value" value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
      </Grid>
      {decimal === null ? null : !valid
        ? <ErrorNote>{`Those characters are not valid digits in base ${base}. Allowed: ${DIGITS.slice(0, base)}`}</ErrorNote>
        : (
          <div className="mt-5 space-y-3">
            {outputs.map(([label, target]) => (
              <div key={target} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="break-all font-mono text-sm text-emerald-300">{decimal.toString(target).toUpperCase()}</span>
                <CopyButton value={decimal.toString(target)} />
              </div>
            ))}
          </div>
        )}
    </>
  );
}

/* ----------------------------------------------------------- Roman numerals */
const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];

const toRoman = (input) => {
  let remaining = input;
  return ROMAN.reduce((acc, [value, symbol]) => {
    while (remaining >= value) { remaining -= value; acc += symbol; }
    return acc;
  }, '');
};

const fromRoman = (text) => {
  const clean = text.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(clean)) return null;
  const values = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let total = 0;
  for (let i = 0; i < clean.length; i += 1) {
    const current = values[clean[i]];
    const next = values[clean[i + 1]] || 0;
    total += current < next ? -current : current;
  }
  return toRoman(total) === clean ? total : null;
};

export function RomanNumeralConverter() {
  const [number, setNumber] = useState('2026');
  const [roman, setRoman] = useState('');

  const numberValue = Math.floor(toNumber(number));
  const numberValid = numberValue >= 1 && numberValue <= 3999;
  const romanValue = roman.trim() ? fromRoman(roman) : null;

  return (
    <Grid className="lg:grid-cols-2">
      <Panel title="Number to Roman numeral">
        <LabelledField label="Number (1–3999)" id="rn-number" type="number" min="1" max="3999" value={number} onChange={(e) => setNumber(e.target.value)} />
        {numberValid
          ? <><p className="mt-5 break-all text-3xl font-black text-emerald-300">{toRoman(numberValue)}</p><div className="mt-4"><CopyButton value={toRoman(numberValue)} /></div></>
          : <ErrorNote>Enter a whole number between 1 and 3999.</ErrorNote>}
      </Panel>
      <Panel title="Roman numeral to number">
        <LabelledField label="Roman numeral" id="rn-roman" value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="MMXXVI" className="font-mono uppercase" />
        {roman.trim()
          ? (romanValue !== null
            ? <p className="mt-5 text-3xl font-black text-cyan-300">{romanValue.toLocaleString()}</p>
            : <ErrorNote>That is not a valid Roman numeral. Check the subtractive pairs — 49 is XLIX, not IL.</ErrorNote>)
          : <p className="mt-5 text-slate-500">Type a numeral to convert it.</p>}
      </Panel>
    </Grid>
  );
}

/* ------------------------------------------------------------------- GPA */
const GRADE_POINTS = { 'A+': 4, A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, 'D+': 1.3, D: 1, 'D-': 0.7, F: 0 };

export function GpaCalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', grade: 'A', credits: '3' },
    { id: 2, name: 'Course 2', grade: 'B+', credits: '4' },
    { id: 3, name: 'Course 3', grade: 'B', credits: '3' },
  ]);

  const update = (id, key, value) => setCourses(courses.map((course) => (course.id === id ? { ...course, [key]: value } : course)));
  const totals = courses.reduce((acc, course) => {
    const credits = toNumber(course.credits);
    if (credits <= 0) return acc;
    return { credits: acc.credits + credits, points: acc.points + credits * GRADE_POINTS[course.grade] };
  }, { credits: 0, points: 0 });
  const gpa = totals.credits ? totals.points / totals.credits : 0;

  return (
    <>
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 md:grid-cols-[1fr_140px_120px_auto]">
            <Field value={course.name} onChange={(e) => update(course.id, 'name', e.target.value)} aria-label="Course name" placeholder="Course name" />
            <Select value={course.grade} onChange={(e) => update(course.id, 'grade', e.target.value)} aria-label="Grade">
              {Object.keys(GRADE_POINTS).map((grade) => <option key={grade} value={grade}>{grade} ({GRADE_POINTS[grade].toFixed(1)})</option>)}
            </Select>
            <Field type="number" min="0" step="0.5" value={course.credits} onChange={(e) => update(course.id, 'credits', e.target.value)} aria-label="Credit hours" placeholder="Credits" />
            <Button variant="ghost" onClick={() => setCourses(courses.filter((item) => item.id !== course.id))} disabled={courses.length <= 1}>Remove</Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={() => setCourses([...courses, { id: Date.now(), name: `Course ${courses.length + 1}`, grade: 'A', credits: '3' }])}>Add course</Button>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Weighted GPA" value={num(gpa, 2)} accent="emerald" />
        <Stat label="Total credits" value={num(totals.credits, 1)} accent="cyan" />
        <Stat label="Total grade points" value={num(totals.points, 2)} />
      </StatGrid>
    </>
  );
}

/* --------------------------------------------------------- Random numbers */
export function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('6');
  const [unique, setUnique] = useState(true);
  const [numbers, setNumbers] = useState([]);
  const [error, setError] = useState('');

  const generate = () => {
    const low = Math.ceil(toNumber(min));
    const high = Math.floor(toNumber(max));
    const howMany = Math.max(1, Math.min(1000, Math.floor(toNumber(count, 1))));
    if (high < low) { setError('The maximum must be greater than or equal to the minimum.'); return; }
    const range = high - low + 1;
    if (unique && howMany > range) { setError(`Only ${range} unique values exist in that range, so ${howMany} cannot all be different.`); return; }
    const pick = () => {
      const limit = Math.floor(0xffffffff / range) * range;
      const buffer = new Uint32Array(1);
      let value;
      do { crypto.getRandomValues(buffer); [value] = buffer; } while (value >= limit);
      return low + (value % range);
    };
    const results = [];
    const seen = new Set();
    while (results.length < howMany) {
      const value = pick();
      if (unique && seen.has(value)) continue;
      seen.add(value);
      results.push(value);
    }
    setNumbers(results);
    setError('');
  };

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Minimum" id="rn-min" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        <LabelledField label="Maximum" id="rn-max" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        <LabelledField label="How many" id="rn-count" type="number" min="1" max="1000" value={count} onChange={(e) => setCount(e.target.value)} />
      </Grid>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Toggle checked={unique} onChange={() => setUnique(!unique)} label="Unique values (no repeats)" />
        <Button onClick={generate}>Generate</Button>
        <CopyButton value={numbers.join(', ')} />
      </div>
      <ErrorNote>{error}</ErrorNote>
      <div className="mt-5 flex min-h-24 flex-wrap items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        {numbers.length
          ? numbers.map((value, index) => <span key={`${value}-${index}`} className="rounded-lg bg-emerald-400/10 px-3 py-1.5 font-mono text-emerald-300">{value}</span>)
          : <span className="text-slate-500">Your random numbers will appear here.</span>}
      </div>
    </>
  );
}

/* --------------------------------------------------------- Unit converter */
const UNIT_GROUPS = {
  Length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254, 'Nautical mile': 1852 },
  Weight: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, 'Metric tonne': 1000, Pound: 0.45359237, Ounce: 0.028349523125, Stone: 6.35029318 },
  Area: { 'Square meter': 1, 'Square kilometer': 1e6, 'Square foot': 0.09290304, 'Square yard': 0.83612736, Acre: 4046.8564224, Hectare: 10000 },
  Volume: { Liter: 1, Milliliter: 0.001, 'Cubic meter': 1000, 'US gallon': 3.785411784, 'Imperial gallon': 4.54609, 'US cup': 0.2365882365, 'US fluid ounce': 0.0295735295625, 'US pint': 0.473176473 },
  Speed: { 'Meters per second': 1, 'Kilometers per hour': 0.277777778, 'Miles per hour': 0.44704, Knot: 0.514444444, 'Feet per second': 0.3048 },
  Time: { Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Year: 31557600 },
  Data: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824, Terabyte: 1099511627776, Bit: 0.125 },
};

const TEMPERATURES = ['Celsius', 'Fahrenheit', 'Kelvin'];
const toCelsius = { Celsius: (v) => v, Fahrenheit: (v) => (v - 32) * (5 / 9), Kelvin: (v) => v - 273.15 };
const fromCelsius = { Celsius: (v) => v, Fahrenheit: (v) => v * (9 / 5) + 32, Kelvin: (v) => v + 273.15 };

export function UnitConverter() {
  const [group, setGroup] = useState('Length');
  const [from, setFrom] = useState('Meter');
  const [to, setTo] = useState('Foot');
  const [value, setValue] = useState('1');

  const isTemperature = group === 'Temperature';
  const units = isTemperature ? TEMPERATURES : Object.keys(UNIT_GROUPS[group]);

  const result = useMemo(() => {
    if (value === '' || !Number.isFinite(toNumber(value, NaN))) return '';
    const input = toNumber(value);
    if (isTemperature) return fromCelsius[to](toCelsius[from](input));
    return (input * UNIT_GROUPS[group][from]) / UNIT_GROUPS[group][to];
  }, [value, group, from, to, isTemperature]);

  const changeGroup = (next) => {
    const keys = next === 'Temperature' ? TEMPERATURES : Object.keys(UNIT_GROUPS[next]);
    setGroup(next);
    setFrom(keys[0]);
    setTo(keys[1]);
  };

  return (
    <>
      <Segmented ariaLabel="Measurement type" value={group} onChange={changeGroup} options={[...Object.keys(UNIT_GROUPS), 'Temperature']} />
      <div className="mt-6 grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <Label htmlFor="uc-value">From</Label>
          <Field id="uc-value" className="mt-2" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          <Select className="mt-2" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Convert from unit">
            {units.map((unit) => <option key={unit}>{unit}</option>)}
          </Select>
        </div>
        <Button variant="ghost" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap units" className="h-12">⇄</Button>
        <div>
          <Label>To</Label>
          <div className="mt-2 min-h-[50px] break-all rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xl font-bold text-emerald-300">
            {result === '' ? '—' : num(result, 10)}
          </div>
          <Select className="mt-2" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Convert to unit">
            {units.map((unit) => <option key={unit}>{unit}</option>)}
          </Select>
        </div>
      </div>
      <p className="mt-5 text-sm text-slate-500">
        {isTemperature
          ? 'Temperature conversions apply an offset as well as a scale, because the scales do not share a zero point.'
          : `1 ${from} = ${num(UNIT_GROUPS[group][from] / UNIT_GROUPS[group][to], 10)} ${to}`}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------- Age */
export function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [birthDate, setBirthDate] = useState('');
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`);
    const target = new Date(`${asOf || today}T00:00:00`);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime()) || birth > target) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    if (days < 0) { months -= 1; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate(); }
    if (months < 0) { years -= 1; months += 12; }

    const totalDays = Math.round((target - birth) / 86400000);
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) nextBirthday.setFullYear(target.getFullYear() + 1);
    const untilBirthday = Math.round((nextBirthday - target) / 86400000);

    return { years, months, days, totalDays, untilBirthday, weekday: birth.toLocaleDateString(undefined, { weekday: 'long' }) };
  }, [birthDate, asOf, today]);

  return (
    <>
      <Grid>
        <LabelledField label="Date of birth" id="age-birth" type="date" max={asOf || today} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        <LabelledField label="Age as of" hint="defaults to today" id="age-asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
      </Grid>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
            <p className="text-4xl font-black text-emerald-300">{result.years} years, {result.months} months, {result.days} days</p>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Total days lived" value={result.totalDays.toLocaleString()} />
            <Stat label="Total weeks" value={Math.floor(result.totalDays / 7).toLocaleString()} accent="cyan" />
            <Stat label="Born on a" value={result.weekday} />
            <Stat label="Days to next birthday" value={result.untilBirthday} accent="cyan" />
          </StatGrid>
        </>
      ) : <p className="mt-5 text-slate-500">Choose a date of birth that is on or before the comparison date.</p>}
    </>
  );
}
