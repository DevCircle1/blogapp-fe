import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel,
  Result, Segmented, Select, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { getFormatLocale, num, toNumber } from './toolFormat.js';
import { msg, useT } from '../../../i18n/i18n.js';

/* ------------------------------------------------------------ Percentage */
export function PercentageCalculator() {
  const t = useT();
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
      <Panel title={t('What is X% of Y?')}>
        <div className="flex items-center gap-2">
          <Field aria-label={t('Percentage')} type="number" value={percent} onChange={(e) => setPercent(e.target.value)} />
          <span className="text-slate-400">{t('% of')}</span>
          <Field aria-label={t('Number')} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-emerald-300">{num(ofResult, 6)}</p>
        <p className="mt-2 text-sm text-slate-500">({percent || 0} ÷ 100) × {value || 0}</p>
      </Panel>

      <Panel title={t('Percentage change')}>
        <div className="flex items-center gap-2">
          <Field aria-label={t('Original value')} type="number" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span className="text-slate-400">{t('to')}</span>
          <Field aria-label={t('New value')} type="number" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-cyan-300">
          {change === null || !Number.isFinite(change) ? '—' : `${change > 0 ? '+' : ''}${num(change, 4)}%`}
        </p>
        <p className="mt-2 text-sm text-slate-500">{change === null ? t('The original value cannot be zero.') : t('(new − original) ÷ |original| × 100')}</p>
      </Panel>

      <Panel title={t('X is what percent of Y?')}>
        <div className="flex items-center gap-2">
          <Field aria-label={t('Part')} type="number" value={partA} onChange={(e) => setPartA(e.target.value)} />
          <span className="text-slate-400">{t('of')}</span>
          <Field aria-label={t('Whole')} type="number" value={partB} onChange={(e) => setPartB(e.target.value)} />
        </div>
        <p className="mt-5 text-3xl font-black text-indigo-300">{share === null || !Number.isFinite(share) ? '—' : `${num(share, 4)}%`}</p>
        <p className="mt-2 text-sm text-slate-500">{t('part ÷ whole × 100')}</p>
      </Panel>
    </div>
  );
}

/* --------------------------------------------------------------- Average */
export function AverageCalculator() {
  const t = useT();
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
      <Label htmlFor="avg-input" hint={t('separated by commas, spaces, or new lines')}>{t('Your numbers')}</Label>
      <TextArea id="avg-input" className="mt-2 min-h-40" value={input} onChange={(e) => setInput(e.target.value)} />
      {stats ? (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Mean (average)')} value={num(stats.mean, 4)} accent="emerald" />
            <Stat label={t('Median')} value={num(stats.median, 4)} accent="cyan" />
            <Stat label={t('Mode')} value={stats.modes.length ? stats.modes.map((mode) => num(mode, 4)).join(' · ') : t('None')} />
            <Stat label={t('Count')} value={stats.count} />
            <Stat label={t('Sum')} value={num(stats.sum, 4)} />
            <Stat label={t('Minimum')} value={num(stats.min, 4)} />
            <Stat label={t('Maximum')} value={num(stats.max, 4)} />
            <Stat label={t('Std deviation')} value={num(stats.stdDev, 4)} accent="cyan" />
          </StatGrid>
          {Math.abs(stats.mean - stats.median) > Math.abs(stats.mean) * 0.15 && (
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
              {t('The mean and median differ noticeably, which means the data is skewed. The median is usually the more honest summary here.')}
            </p>
          )}
        </>
      ) : <p className="mt-5 text-slate-500">{t('Enter some numbers to see the statistics.')}</p>}
    </>
  );
}

/* -------------------------------------------------------------- Fraction */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

export function FractionCalculator() {
  const t = useT();
  const [a, setA] = useState({ n: '1', d: '2' });
  const [b, setB] = useState({ n: '1', d: '3' });
  const [operation, setOperation] = useState('+');

  const result = useMemo(() => {
    const an = toNumber(a.n); const ad = toNumber(a.d);
    const bn = toNumber(b.n); const bd = toNumber(b.d);
    if (!ad || !bd) return { error: msg('A denominator cannot be zero.') };
    let n; let d;
    if (operation === '+') { n = an * bd + bn * ad; d = ad * bd; }
    else if (operation === '−') { n = an * bd - bn * ad; d = ad * bd; }
    else if (operation === '×') { n = an * bn; d = ad * bd; }
    else { if (!bn) return { error: msg('Cannot divide by a fraction with a zero numerator.') }; n = an * bd; d = ad * bn; }
    if (!d) return { error: msg('The result is undefined.') };
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
      <Field className="mt-2 text-center" type="number" value={value.n} onChange={(e) => onChange({ ...value, n: e.target.value })} aria-label={t('{label} numerator', { label })} />
      <div className="my-2 h-px bg-white/20" />
      <Field className="text-center" type="number" value={value.d} onChange={(e) => onChange({ ...value, d: e.target.value })} aria-label={t('{label} denominator', { label })} />
    </div>
  );

  return (
    <>
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <FractionInput value={a} onChange={setA} label={t('First fraction')} />
        <Select value={operation} onChange={(e) => setOperation(e.target.value)} className="w-auto text-center text-xl" aria-label={t('Operation')}>
          {['+', '−', '×', '÷'].map((symbol) => <option key={symbol}>{symbol}</option>)}
        </Select>
        <FractionInput value={b} onChange={setB} label={t('Second fraction')} />
      </div>
      <ErrorNote>{result.error && t(result.error)}</ErrorNote>
      {!result.error && (
        <StatGrid columns="md:grid-cols-3">
          <Stat label={t('Simplified')} value={`${result.sn}/${result.sd}`} accent="emerald" />
          <Stat label={t('Mixed number')} value={result.remainder ? `${result.whole || ''} ${result.remainder}/${result.sd}`.trim() : String(result.whole)} accent="cyan" />
          <Stat label={t('Decimal')} value={num(result.decimal, 8)} />
        </StatGrid>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- Ratio */
export function RatioCalculator() {
  const t = useT();
  const [mode, setMode] = useState('simplify');
  const [a, setA] = useState('1920');
  const [b, setB] = useState('1080');
  const [c, setC] = useState('1280');

  const divisor = gcd(toNumber(a), toNumber(b)) || 1;
  const missing = toNumber(a) === 0 ? null : (toNumber(b) * toNumber(c)) / toNumber(a);

  return (
    <>
      <Segmented ariaLabel={t('Ratio mode')} value={mode} onChange={setMode}
        options={[{ value: 'simplify', label: t('Simplify a ratio') }, { value: 'proportion', label: t('Solve a proportion') }]} />
      {mode === 'simplify' ? (
        <>
          <Grid className="mt-5 md:grid-cols-2">
            <LabelledField label={t('First value')} id="ratio-a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
            <LabelledField label={t('Second value')} id="ratio-b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </Grid>
          <StatGrid columns="md:grid-cols-3">
            <Stat label={t('Simplified ratio')} value={`${toNumber(a) / divisor} : ${toNumber(b) / divisor}`} accent="emerald" />
            <Stat label={t('As a decimal')} value={toNumber(b) ? num(toNumber(a) / toNumber(b), 6) : '—'} accent="cyan" />
            <Stat label={t('First as a share')} value={toNumber(a) + toNumber(b) ? `${num((toNumber(a) / (toNumber(a) + toNumber(b))) * 100, 2)}%` : '—'} />
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
              <Label>{t('D (solved)')}</Label>
              <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center font-bold text-emerald-300">
                {missing === null ? '—' : num(missing, 6)}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t('Solved from A × D = B × C.')}</p>
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------- Base convert */
const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
const BASE_NAMES = { 2: msg('binary'), 8: msg('octal'), 10: msg('decimal'), 16: msg('hex') };
const BASE_OUTPUTS = [
  [msg('Binary (base 2)'), 2], [msg('Octal (base 8)'), 8], [msg('Decimal (base 10)'), 10],
  [msg('Hexadecimal (base 16)'), 16], [msg('Base 36'), 36],
];

export function NumberBaseConverter() {
  const t = useT();
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

  return (
    <>
      <Grid className="md:grid-cols-[200px_1fr]">
        <LabelledSelect label={t('Input base')} id="base-select" value={base} onChange={(e) => setBase(Number(e.target.value))}>
          {Array.from({ length: 35 }, (_, i) => i + 2).map((option) => (
            <option key={option} value={option}>{t('Base {n}', { n: option })}{BASE_NAMES[option] ? ` (${t(BASE_NAMES[option])})` : ''}</option>
          ))}
        </LabelledSelect>
        <LabelledField label={t('Value')} id="base-value" value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
      </Grid>
      {decimal === null ? null : !valid
        ? <ErrorNote>{t('Those characters are not valid digits in base {base}. Allowed: {allowed}', { base, allowed: DIGITS.slice(0, base) })}</ErrorNote>
        : (
          <div className="mt-5 space-y-3">
            {BASE_OUTPUTS.map(([label, target]) => (
              <div key={target} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-sm text-slate-400">{t(label)}</span>
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
  const t = useT();
  const [number, setNumber] = useState('2026');
  const [roman, setRoman] = useState('');

  const numberValue = Math.floor(toNumber(number));
  const numberValid = numberValue >= 1 && numberValue <= 3999;
  const romanValue = roman.trim() ? fromRoman(roman) : null;

  return (
    <Grid className="lg:grid-cols-2">
      <Panel title={t('Number to Roman numeral')}>
        <LabelledField label={t('Number (1–3999)')} id="rn-number" type="number" min="1" max="3999" value={number} onChange={(e) => setNumber(e.target.value)} />
        {numberValid
          ? <><p className="mt-5 break-all text-3xl font-black text-emerald-300">{toRoman(numberValue)}</p><div className="mt-4"><CopyButton value={toRoman(numberValue)} /></div></>
          : <ErrorNote>{t('Enter a whole number between 1 and 3999.')}</ErrorNote>}
      </Panel>
      <Panel title={t('Roman numeral to number')}>
        <LabelledField label={t('Roman numeral')} id="rn-roman" value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="MMXXVI" className="font-mono uppercase" />
        {roman.trim()
          ? (romanValue !== null
            ? <p className="mt-5 text-3xl font-black text-cyan-300">{num(romanValue, 0)}</p>
            : <ErrorNote>{t('That is not a valid Roman numeral. Check the subtractive pairs — 49 is XLIX, not IL.')}</ErrorNote>)
          : <p className="mt-5 text-slate-500">{t('Type a numeral to convert it.')}</p>}
      </Panel>
    </Grid>
  );
}

/* ------------------------------------------------------------------- GPA */
const GRADE_POINTS = { 'A+': 4, A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, 'D+': 1.3, D: 1, 'D-': 0.7, F: 0 };

export function GpaCalculator() {
  const t = useT();
  const [courses, setCourses] = useState(() => [
    { id: 1, name: t('Course {n}', { n: 1 }), grade: 'A', credits: '3' },
    { id: 2, name: t('Course {n}', { n: 2 }), grade: 'B+', credits: '4' },
    { id: 3, name: t('Course {n}', { n: 3 }), grade: 'B', credits: '3' },
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
            <Field value={course.name} onChange={(e) => update(course.id, 'name', e.target.value)} aria-label={t('Course name')} placeholder={t('Course name')} />
            <Select value={course.grade} onChange={(e) => update(course.id, 'grade', e.target.value)} aria-label={t('Grade')}>
              {Object.keys(GRADE_POINTS).map((grade) => <option key={grade} value={grade}>{grade} ({num(GRADE_POINTS[grade], 1)})</option>)}
            </Select>
            <Field type="number" min="0" step="0.5" value={course.credits} onChange={(e) => update(course.id, 'credits', e.target.value)} aria-label={t('Credit hours')} placeholder={t('Credits')} />
            <Button variant="ghost" onClick={() => setCourses(courses.filter((item) => item.id !== course.id))} disabled={courses.length <= 1}>{t('Remove')}</Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={() => setCourses([...courses, { id: Date.now(), name: t('Course {n}', { n: courses.length + 1 }), grade: 'A', credits: '3' }])}>{t('Add course')}</Button>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Weighted GPA')} value={num(gpa, 2)} accent="emerald" />
        <Stat label={t('Total credits')} value={num(totals.credits, 1)} accent="cyan" />
        <Stat label={t('Total grade points')} value={num(totals.points, 2)} />
      </StatGrid>
    </>
  );
}

/* --------------------------------------------------------- Random numbers */
export function RandomNumberGenerator() {
  const t = useT();
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
    if (high < low) { setError(t('The maximum must be greater than or equal to the minimum.')); return; }
    const range = high - low + 1;
    if (unique && howMany > range) { setError(t('Only {range} unique values exist in that range, so {count} cannot all be different.', { range, count: howMany })); return; }
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
        <LabelledField label={t('Minimum')} id="rn-min" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        <LabelledField label={t('Maximum')} id="rn-max" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        <LabelledField label={t('How many')} id="rn-count" type="number" min="1" max="1000" value={count} onChange={(e) => setCount(e.target.value)} />
      </Grid>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Toggle checked={unique} onChange={() => setUnique(!unique)} label={t('Unique values (no repeats)')} />
        <Button onClick={generate}>{t('Generate')}</Button>
        <CopyButton value={numbers.join(', ')} />
      </div>
      <ErrorNote>{error}</ErrorNote>
      <div className="mt-5 flex min-h-24 flex-wrap items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        {numbers.length
          ? numbers.map((value, index) => <span key={`${value}-${index}`} className="rounded-lg bg-emerald-400/10 px-3 py-1.5 font-mono text-emerald-300">{value}</span>)
          : <span className="text-slate-500">{t('Your random numbers will appear here.')}</span>}
      </div>
    </>
  );
}

/* --------------------------------------------------------- Unit converter */
// Keys double as the English labels; msg() marks them for the translation checker.
const UNIT_GROUPS = {
  [msg('Length')]: { [msg('Meter')]: 1, [msg('Kilometer')]: 1000, [msg('Centimeter')]: 0.01, [msg('Millimeter')]: 0.001, [msg('Mile')]: 1609.344, [msg('Yard')]: 0.9144, [msg('Foot')]: 0.3048, [msg('Inch')]: 0.0254, [msg('Nautical mile')]: 1852 },
  [msg('Weight')]: { [msg('Kilogram')]: 1, [msg('Gram')]: 0.001, [msg('Milligram')]: 0.000001, [msg('Metric tonne')]: 1000, [msg('Pound')]: 0.45359237, [msg('Ounce')]: 0.028349523125, [msg('Stone')]: 6.35029318 },
  [msg('Area')]: { [msg('Square meter')]: 1, [msg('Square kilometer')]: 1e6, [msg('Square foot')]: 0.09290304, [msg('Square yard')]: 0.83612736, [msg('Acre')]: 4046.8564224, [msg('Hectare')]: 10000 },
  [msg('Volume')]: { [msg('Liter')]: 1, [msg('Milliliter')]: 0.001, [msg('Cubic meter')]: 1000, [msg('US gallon')]: 3.785411784, [msg('Imperial gallon')]: 4.54609, [msg('US cup')]: 0.2365882365, [msg('US fluid ounce')]: 0.0295735295625, [msg('US pint')]: 0.473176473 },
  [msg('Speed')]: { [msg('Meters per second')]: 1, [msg('Kilometers per hour')]: 0.277777778, [msg('Miles per hour')]: 0.44704, [msg('Knot')]: 0.514444444, [msg('Feet per second')]: 0.3048 },
  [msg('Time')]: { [msg('Second')]: 1, [msg('Minute')]: 60, [msg('Hour')]: 3600, [msg('Day')]: 86400, [msg('Week')]: 604800, [msg('Year')]: 31557600 },
  [msg('Data')]: { [msg('Byte')]: 1, [msg('Kilobyte')]: 1024, [msg('Megabyte')]: 1048576, [msg('Gigabyte')]: 1073741824, [msg('Terabyte')]: 1099511627776, [msg('Bit')]: 0.125 },
};

const TEMPERATURE = msg('Temperature');
const TEMPERATURES = [msg('Celsius'), msg('Fahrenheit'), msg('Kelvin')];
const toCelsius = { Celsius: (v) => v, Fahrenheit: (v) => (v - 32) * (5 / 9), Kelvin: (v) => v - 273.15 };
const fromCelsius = { Celsius: (v) => v, Fahrenheit: (v) => v * (9 / 5) + 32, Kelvin: (v) => v + 273.15 };

export function UnitConverter() {
  const t = useT();
  const [group, setGroup] = useState('Length');
  const [from, setFrom] = useState('Meter');
  const [to, setTo] = useState('Foot');
  const [value, setValue] = useState('1');

  const isTemperature = group === TEMPERATURE;
  const units = isTemperature ? TEMPERATURES : Object.keys(UNIT_GROUPS[group]);

  const result = useMemo(() => {
    if (value === '' || !Number.isFinite(toNumber(value, NaN))) return '';
    const input = toNumber(value);
    if (isTemperature) return fromCelsius[to](toCelsius[from](input));
    return (input * UNIT_GROUPS[group][from]) / UNIT_GROUPS[group][to];
  }, [value, group, from, to, isTemperature]);

  const changeGroup = (next) => {
    const keys = next === TEMPERATURE ? TEMPERATURES : Object.keys(UNIT_GROUPS[next]);
    setGroup(next);
    setFrom(keys[0]);
    setTo(keys[1]);
  };

  return (
    <>
      <Segmented ariaLabel={t('Measurement type')} value={group} onChange={changeGroup}
        options={[...Object.keys(UNIT_GROUPS), TEMPERATURE].map((key) => ({ value: key, label: t(key) }))} />
      <div className="mt-6 grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <Label htmlFor="uc-value">{t('From')}</Label>
          <Field id="uc-value" className="mt-2" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          <Select className="mt-2" value={from} onChange={(e) => setFrom(e.target.value)} aria-label={t('Convert from unit')}>
            {units.map((unit) => <option key={unit} value={unit}>{t(unit)}</option>)}
          </Select>
        </div>
        <Button variant="ghost" onClick={() => { setFrom(to); setTo(from); }} aria-label={t('Swap units')} className="h-12">⇄</Button>
        <div>
          <Label>{t('To')}</Label>
          <div className="mt-2 min-h-[50px] break-all rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xl font-bold text-emerald-300">
            {result === '' ? '—' : num(result, 10)}
          </div>
          <Select className="mt-2" value={to} onChange={(e) => setTo(e.target.value)} aria-label={t('Convert to unit')}>
            {units.map((unit) => <option key={unit} value={unit}>{t(unit)}</option>)}
          </Select>
        </div>
      </div>
      <p className="mt-5 text-sm text-slate-500">
        {isTemperature
          ? t('Temperature conversions apply an offset as well as a scale, because the scales do not share a zero point.')
          : `1 ${t(from)} = ${num(UNIT_GROUPS[group][from] / UNIT_GROUPS[group][to], 10)} ${t(to)}`}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------- Age */
export function AgeCalculator() {
  const t = useT();
  const today = new Date().toISOString().slice(0, 10);
  const [birthDate, setBirthDate] = useState('');
  const [asOf, setAsOf] = useState(today);
  const locale = getFormatLocale();

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

    return { years, months, days, totalDays, untilBirthday, weekday: birth.toLocaleDateString(locale, { weekday: 'long' }) };
  }, [birthDate, asOf, today, locale]);

  return (
    <>
      <Grid>
        <LabelledField label={t('Date of birth')} id="age-birth" type="date" max={asOf || today} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        <LabelledField label={t('Age as of')} hint={t('defaults to today')} id="age-asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
      </Grid>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
            <p className="text-4xl font-black text-emerald-300">{t('{y} years, {m} months, {d} days', { y: result.years, m: result.months, d: result.days })}</p>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Total days lived')} value={num(result.totalDays, 0)} />
            <Stat label={t('Total weeks')} value={num(Math.floor(result.totalDays / 7), 0)} accent="cyan" />
            <Stat label={t('Born on a')} value={result.weekday} />
            <Stat label={t('Days to next birthday')} value={result.untilBirthday} accent="cyan" />
          </StatGrid>
        </>
      ) : <p className="mt-5 text-slate-500">{t('Choose a date of birth that is on or before the comparison date.')}</p>}
    </>
  );
}
