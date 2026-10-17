import { useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Grid, Label, LabelledField, LabelledSelect, Panel, Result, Segmented,
  Stat, StatGrid, TextArea,
} from '../impl/uiKit.jsx';
import { toNumber } from '../impl/toolFormat.js';
import { useFormat } from '../../../i18n/i18n.js';
import {
  KM_PER_MILE, RACES, SQ_M_PER, areaConversions, cardPayoff, cmToFeetInches, codesToText, feetInchesToCm,
  formatClock, formatHours, letterGrade, morseToText, neededOnFinal, ovulationCycle, parseDuration,
  parseISODate, paymentForMonths, shapeArea, shiftMinutes, textToCodes, textToMorse, toPlain,
  toScientific, weightedGrade,
} from '../../../lib/extra/engines.js';

/* ------------------------------------------------------ Grade calculator */
export function GradeCalculator() {
  const { num } = useFormat();
  const [mode, setMode] = useState('final');
  const [rows, setRows] = useState([
    { name: 'Homework', grade: '92', weight: '20' },
    { name: 'Midterm', grade: '84', weight: '30' },
    { name: 'Project', grade: '88', weight: '20' },
  ]);
  const [finalWeight, setFinalWeight] = useState('30');
  const [target, setTarget] = useState('90');

  const update = (index, key, value) => setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const parsed = rows.map((r) => ({ grade: toNumber(r.grade, NaN), weight: toNumber(r.weight, NaN) }));
  const { average, weight } = weightedGrade(parsed);
  const fw = toNumber(finalWeight);
  const needed = average === null ? null : neededOnFinal(average, fw, toNumber(target));

  let verdict = null;
  if (needed !== null) {
    if (needed > 100) verdict = `You would need ${num(needed, 1)}% — above 100%, so ${num(toNumber(target), 0)}% is out of reach without extra credit.`;
    else if (needed <= 0) verdict = `You already have ${num(toNumber(target), 0)}% locked in, whatever you score on the final.`;
    else verdict = `Score ${num(needed, 1)}% or higher on the final to finish with ${num(toNumber(target), 0)}%.`;
  }

  return (
    <>
      <Segmented ariaLabel="Calculator mode" value={mode} onChange={setMode}
        options={[{ value: 'final', label: 'What do I need on the final?' }, { value: 'average', label: 'Weighted average only' }]} />
      <div className="mt-5 space-y-3">
        {rows.map((row, i) => (
          <Grid key={i} className="md:grid-cols-[1.4fr_1fr_1fr_auto] items-end">
            <LabelledField label={i === 0 ? 'Assignment / category' : undefined} id={`gc-n-${i}`} value={row.name} onChange={(e) => update(i, 'name', e.target.value)} aria-label="Assignment name" />
            <LabelledField label={i === 0 ? 'Grade (%)' : undefined} id={`gc-g-${i}`} type="number" min="0" value={row.grade} onChange={(e) => update(i, 'grade', e.target.value)} aria-label="Grade percent" />
            <LabelledField label={i === 0 ? 'Weight (%)' : undefined} id={`gc-w-${i}`} type="number" min="0" value={row.weight} onChange={(e) => update(i, 'weight', e.target.value)} aria-label="Weight percent" />
            <Button variant="ghost" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))} disabled={rows.length < 2} aria-label="Remove row">✕</Button>
          </Grid>
        ))}
      </div>
      <div className="mt-4"><Button variant="ghost" onClick={() => setRows((prev) => [...prev, { name: '', grade: '', weight: '' }])}>+ Add row</Button></div>
      {mode === 'final' && (
        <Grid className="mt-6 md:grid-cols-2">
          <LabelledField label="Final exam weight (%)" id="gc-fw" type="number" min="1" max="100" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} />
          <LabelledField label="Grade you want in the course (%)" id="gc-t" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        </Grid>
      )}
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Current weighted grade" value={average === null ? '—' : `${num(average, 2)}%`} accent="emerald" hint={average === null ? undefined : letterGrade(average)} />
        <Stat label="Weight counted so far" value={`${num(weight, 1)}%`} />
        {mode === 'final' && <Stat label="Needed on final" value={needed === null ? '—' : `${num(Math.max(needed, 0), 1)}%`} accent="cyan" />}
      </StatGrid>
      {mode === 'final' && verdict && <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-slate-200">{verdict}</p>}
      {mode === 'final' && weight + fw > 100.01 && <ErrorNote>Your category weights plus the final add up to {num(weight + fw, 1)}% — they should total 100%.</ErrorNote>}
    </>
  );
}

/* ------------------------------------------- Credit card payoff calculator */
export function CreditCardPayoffCalculator() {
  const { money, num } = useFormat();
  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('22.9');
  const [mode, setMode] = useState('payment');
  const [payment, setPayment] = useState('200');
  const [months, setMonths] = useState('24');

  const bal = toNumber(balance);
  const rate = toNumber(apr);
  const result = useMemo(() => {
    if (mode === 'payment') {
      const p = toNumber(payment);
      const r = cardPayoff(bal, rate, p);
      return r ? { ...r, payment: p } : { stuck: bal > 0 && p > 0, minimum: (bal * rate) / 1200 };
    }
    const m = Math.round(toNumber(months));
    const p = paymentForMonths(bal, rate, m);
    if (!p) return null;
    const r = cardPayoff(bal, rate, p);
    return r ? { ...r, payment: p } : null;
  }, [bal, rate, mode, payment, months]);

  // The 2% / $25 minimum is a common issuer formula, shown as a comparison, not a promise.
  const minimumPay = Math.max(25, bal * 0.02 + (bal * rate) / 1200);
  const minimumPlan = useMemo(() => {
    let left = bal; let total = 0; let n = 0;
    while (left > 0.5 && n < 1200) {
      const interest = (left * rate) / 1200;
      const pay = Math.min(left + interest, Math.max(25, left * 0.01 + interest));
      total += interest; left = left + interest - pay; n += 1;
    }
    return n < 1200 ? { months: n, interest: total } : null;
  }, [bal, rate]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label="Card balance ($)" id="cc-b" type="number" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} />
        <LabelledField label="Interest rate (APR %)" id="cc-r" type="number" min="0" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} />
      </Grid>
      <div className="mt-5"><Segmented ariaLabel="Payoff mode" value={mode} onChange={setMode}
        options={[{ value: 'payment', label: 'I know my monthly payment' }, { value: 'months', label: 'I want to be debt-free by…' }]} /></div>
      <div className="mt-5 max-w-sm">
        {mode === 'payment'
          ? <LabelledField label="Monthly payment ($)" id="cc-p" type="number" min="0" value={payment} onChange={(e) => setPayment(e.target.value)} />
          : <LabelledField label="Months to pay off" id="cc-m" type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} />}
      </div>
      {result?.stuck && <ErrorNote>A {money(toNumber(payment))} payment does not even cover the {money(result.minimum)} of interest added each month, so the balance never shrinks. Pay more than {money(result.minimum)}.</ErrorNote>}
      {result && !result.stuck && (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Debt-free in" value={`${result.months} mo`} hint={`${num(result.months / 12, 1)} years`} accent="emerald" />
            <Stat label="Monthly payment" value={money(result.payment)} />
            <Stat label="Total interest" value={money(result.interest)} accent="cyan" />
            <Stat label="Total repaid" value={money(result.total)} />
          </StatGrid>
          {minimumPlan && (
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              For comparison, paying only a typical minimum (1% of balance plus interest, at least $25; about {money(minimumPay)} to start) would take {num(minimumPlan.months / 12, 1)} years and cost {money(minimumPlan.interest)} in interest.
              {minimumPlan.interest > result.interest && ` Your plan saves ${money(minimumPlan.interest - result.interest)}.`}
            </p>
          )}
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------- Height converter */
export function HeightConverter() {
  const { num } = useFormat();
  const [cm, setCm] = useState('175');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('9');
  const [source, setSource] = useState('cm');

  const fromCm = cmToFeetInches(toNumber(cm));
  const fromImperial = feetInchesToCm(toNumber(feet), toNumber(inches));

  return (
    <>
      <Segmented ariaLabel="Convert from" value={source} onChange={setSource}
        options={[{ value: 'cm', label: 'Centimetres → feet & inches' }, { value: 'ft', label: 'Feet & inches → centimetres' }]} />
      {source === 'cm' ? (
        <>
          <div className="mt-5 max-w-sm"><LabelledField label="Height (cm)" id="hc-cm" type="number" min="0" value={cm} onChange={(e) => setCm(e.target.value)} /></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label="Feet and inches" value={`${fromCm.feet}′ ${num(fromCm.inches, 1)}″`} />
            <Result label="Total inches" value={`${num(fromCm.totalIn, 2)} in`} accent="cyan" note={`${num(toNumber(cm) / 100, 2)} metres`} />
          </div>
        </>
      ) : (
        <>
          <Grid className="mt-5 max-w-lg md:grid-cols-2">
            <LabelledField label="Feet" id="hc-ft" type="number" min="0" value={feet} onChange={(e) => setFeet(e.target.value)} />
            <LabelledField label="Inches" id="hc-in" type="number" min="0" step="0.1" value={inches} onChange={(e) => setInches(e.target.value)} />
          </Grid>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label="Centimetres" value={`${num(fromImperial, 1)} cm`} />
            <Result label="Metres" value={`${num(fromImperial / 100, 3)} m`} accent="cyan" />
          </div>
        </>
      )}
    </>
  );
}

/* ----------------------------------------------- Text to binary converter */
export function TextBinaryConverter() {
  const [direction, setDirection] = useState('encode');
  const [base, setBase] = useState('binary');
  const [input, setInput] = useState('Hello, world!');

  const result = useMemo(() => (
    direction === 'encode' ? { text: textToCodes(input, base) } : codesToText(input, base)
  ), [direction, base, input]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Segmented ariaLabel="Direction" value={direction} onChange={setDirection}
          options={[{ value: 'encode', label: 'Text → code' }, { value: 'decode', label: 'Code → text' }]} />
        <Segmented ariaLabel="Number system" value={base} onChange={setBase}
          options={[{ value: 'binary', label: 'Binary' }, { value: 'hex', label: 'Hex' }, { value: 'decimal', label: 'Decimal' }, { value: 'octal', label: 'Octal' }]} />
      </div>
      <Grid className="mt-5">
        <div>
          <Label htmlFor="tb-in">{direction === 'encode' ? 'Your text' : `Your ${base} bytes`}</Label>
          <TextArea id="tb-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tb-out">{direction === 'encode' ? `Result (${base})` : 'Decoded text'}</Label>
          <TextArea id="tb-out" className="mt-2" readOnly value={result.text || ''} />
          <div className="mt-3"><CopyButton value={result.text} /></div>
        </div>
      </Grid>
      <ErrorNote>{result.error}</ErrorNote>
      <p className="mt-4 text-sm text-slate-500">Text is encoded as UTF-8, so accented letters, symbols and emoji become two to four bytes each. Plain English letters are one byte.</p>
    </>
  );
}

/* ------------------------------------------------------- Morse translator */
const playMorse = (morse, wpm = 15) => {
  if (typeof window === 'undefined') return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const unit = 1.2 / wpm;
  let t = ctx.currentTime + 0.05;
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  gain.connect(ctx.destination);
  for (const ch of morse) {
    if (ch === '.' || ch === '-') {
      const osc = ctx.createOscillator();
      osc.frequency.value = 600;
      osc.connect(gain);
      const len = ch === '.' ? unit : unit * 3;
      osc.start(t); osc.stop(t + len);
      t += len + unit;
    } else if (ch === ' ') t += unit * 2;
    else if (ch === '/') t += unit * 4;
  }
  setTimeout(() => ctx.close(), (t - ctx.currentTime + 0.5) * 1000);
};

export function MorseCodeTranslator() {
  const [direction, setDirection] = useState('encode');
  const [input, setInput] = useState('SOS HELP');
  const result = useMemo(() => {
    if (direction === 'encode') { const r = textToMorse(input); return { text: r.morse, notes: r.skipped.length ? `Skipped characters with no Morse code: ${r.skipped.join(' ')}` : '' }; }
    const r = morseToText(input);
    return { text: r.text, notes: r.unknown.length ? `Unrecognised sequences shown as “?”: ${r.unknown.join(' ')}` : '' };
  }, [direction, input]);

  return (
    <>
      <Segmented ariaLabel="Direction" value={direction} onChange={(d) => { setDirection(d); setInput(d === 'encode' ? 'SOS HELP' : '... --- ... / .... . .-.. .--.'); }}
        options={[{ value: 'encode', label: 'Text → Morse' }, { value: 'decode', label: 'Morse → text' }]} />
      <Grid className="mt-5">
        <div>
          <Label htmlFor="mc-in">{direction === 'encode' ? 'Your text' : 'Morse code'}</Label>
          <TextArea id="mc-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mc-out">{direction === 'encode' ? 'Morse code' : 'Decoded text'}</Label>
          <TextArea id="mc-out" className="mt-2" readOnly value={result.text} />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={result.text} />
            {direction === 'encode' && <Button variant="ghost" onClick={() => playMorse(result.text)} disabled={!result.text}>▶ Play sound</Button>}
          </div>
        </div>
      </Grid>
      {result.notes && <p className="mt-3 text-sm text-amber-200">{result.notes}</p>}
      <p className="mt-4 text-sm text-slate-500">Separate letters with a space and words with “/”. Dots and dashes are written as . and -</p>
    </>
  );
}

/* ----------------------------------------------- Timesheet hours calculator */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export function TimesheetHoursCalculator() {
  const { money, num } = useFormat();
  const [rows, setRows] = useState(DAYS.map((day, i) => ({ day, start: i < 5 ? '09:00' : '', end: i < 5 ? '17:30' : '', brk: i < 5 ? '30' : '0' })));
  const [rate, setRate] = useState('');
  const update = (i, key, value) => setRows((prev) => prev.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  const minutes = rows.map((r) => shiftMinutes(r.start, r.end, toNumber(r.brk)));
  const total = minutes.reduce((s, m) => s + (m || 0), 0);
  const decimal = total / 60;

  return (
    <>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <Grid key={row.day} className="md:grid-cols-[3rem_1fr_1fr_1fr_8rem] items-end">
            <span className="pb-3 font-semibold text-slate-300">{row.day}</span>
            <LabelledField label={i === 0 ? 'Start' : undefined} id={`ts-s-${i}`} type="time" value={row.start} onChange={(e) => update(i, 'start', e.target.value)} aria-label={`${row.day} start`} />
            <LabelledField label={i === 0 ? 'End' : undefined} id={`ts-e-${i}`} type="time" value={row.end} onChange={(e) => update(i, 'end', e.target.value)} aria-label={`${row.day} end`} />
            <LabelledField label={i === 0 ? 'Break (min)' : undefined} id={`ts-b-${i}`} type="number" min="0" value={row.brk} onChange={(e) => update(i, 'brk', e.target.value)} aria-label={`${row.day} break minutes`} />
            <strong className="pb-3 text-emerald-300">{minutes[i] === null ? '—' : formatHours(minutes[i])}</strong>
          </Grid>
        ))}
      </div>
      <div className="mt-5 max-w-xs"><LabelledField label="Hourly rate (optional)" id="ts-rate" type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Total hours" value={formatHours(total)} accent="emerald" />
        <Stat label="Decimal hours" value={num(decimal, 2)} hint="for payroll systems" />
        <Stat label="Gross pay" value={toNumber(rate) > 0 ? money(decimal * toNumber(rate)) : '—'} accent="cyan" />
      </StatGrid>
      <p className="mt-4 text-sm text-slate-500">An end time earlier than the start is treated as a shift that finishes after midnight.</p>
    </>
  );
}

/* ------------------------------------------------------- Pace calculator */
export function PaceCalculator() {
  const { num } = useFormat();
  const [unit, setUnit] = useState('km');
  const [distance, setDistance] = useState('5');
  const [h, setH] = useState('0');
  const [m, setM] = useState('25');
  const [s, setS] = useState('0');

  const km = toNumber(distance) * (unit === 'km' ? 1 : KM_PER_MILE);
  const seconds = parseDuration(h, m, s);
  const valid = km > 0 && seconds > 0;
  const perKm = valid ? seconds / km : 0;
  const perMile = perKm * KM_PER_MILE;

  return (
    <>
      <Grid className="md:grid-cols-[1fr_auto]">
        <LabelledField label="Distance" id="pc-d" type="number" min="0" step="0.01" value={distance} onChange={(e) => setDistance(e.target.value)} />
        <div className="self-end"><Segmented ariaLabel="Distance unit" value={unit} onChange={setUnit} options={[{ value: 'km', label: 'km' }, { value: 'mi', label: 'miles' }]} /></div>
      </Grid>
      <Grid className="mt-4 md:grid-cols-3">
        <LabelledField label="Hours" id="pc-h" type="number" min="0" value={h} onChange={(e) => setH(e.target.value)} />
        <LabelledField label="Minutes" id="pc-m" type="number" min="0" value={m} onChange={(e) => setM(e.target.value)} />
        <LabelledField label="Seconds" id="pc-s" type="number" min="0" value={s} onChange={(e) => setS(e.target.value)} />
      </Grid>
      {valid ? (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Pace per km" value={formatClock(perKm)} accent="emerald" />
            <Stat label="Pace per mile" value={formatClock(perMile)} accent="emerald" />
            <Stat label="Speed (km/h)" value={num(3600 / perKm, 2)} accent="cyan" />
            <Stat label="Speed (mph)" value={num(3600 / perMile, 2)} accent="cyan" />
          </StatGrid>
          <Panel title="Finish times at this pace">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Race</th><th>Distance</th><th>Time</th></tr></thead>
              <tbody>
                {RACES.map(([name, d]) => (
                  <tr key={name} className="border-t border-white/10"><td className="py-2 text-slate-200">{name}</td><td className="text-slate-400">{num(d, 2)} km</td><td className="font-semibold text-emerald-300">{formatClock(perKm * d)}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-500">Assumes you hold the same pace the whole way. Most runners slow down over longer distances.</p>
          </Panel>
        </>
      ) : <p className="mt-6 text-slate-400">Enter a distance and a time to see your pace.</p>}
    </>
  );
}

/* ------------------------------------------------ Ovulation calculator */
const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export function OvulationCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [lmp, setLmp] = useState(today);
  const [cycle, setCycle] = useState('28');
  const [luteal, setLuteal] = useState('14');

  const start = parseISODate(lmp);
  const len = Math.round(toNumber(cycle));
  const lut = Math.round(toNumber(luteal));
  const valid = start && len >= 21 && len <= 45 && lut >= 8 && lut <= 18 && len - lut >= 6;
  const r = valid ? ovulationCycle(start, len, lut) : null;

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="First day of your last period" id="ov-d" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
        <LabelledField label="Average cycle length (days)" id="ov-c" type="number" min="21" max="45" value={cycle} onChange={(e) => setCycle(e.target.value)} />
        <LabelledField label="Luteal phase (days)" id="ov-l" type="number" min="8" max="18" value={luteal} onChange={(e) => setLuteal(e.target.value)} hint="usually 12–14" />
      </Grid>
      {r ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Result label="Estimated ovulation day" value={fmtDate(r.ovulation)} />
          <Result label="Fertile window" value={`${fmtDate(r.fertileStart)} – ${fmtDate(r.fertileEnd)}`} accent="cyan" note="The five days before ovulation, the day itself, and the day after." />
          <Result label="Next period expected" value={fmtDate(r.nextPeriod)} accent="indigo" />
        </div>
      ) : <ErrorNote>Enter a date and a cycle length between 21 and 45 days with a luteal phase of 8–18 days.</ErrorNote>}
    </>
  );
}

/* ------------------------------------- Scientific notation converter */
export function ScientificNotationConverter() {
  const [input, setInput] = useState('123456789');
  const [digits, setDigits] = useState('');

  const isE = /[eE]/.test(input);
  const sci = toScientific(input, digits === '' ? undefined : Math.max(0, Math.min(20, Math.round(toNumber(digits)))));
  const plain = isE ? toPlain(input.trim().replace(/,/g, '')) : null;

  return (
    <>
      <Grid className="md:grid-cols-[2fr_1fr]">
        <LabelledField label="Number or e-notation" id="sn-in" value={input} onChange={(e) => setInput(e.target.value)} hint="e.g. 0.00045, 1234567 or 6.02e23" />
        <LabelledField label="Significant decimals (optional)" id="sn-d" type="number" min="0" max="20" value={digits} onChange={(e) => setDigits(e.target.value)} />
      </Grid>
      {sci ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Result label="Scientific notation" value={<>{sci.sign}{sci.mantissa.replace('-', '')} × 10<sup>{sci.exponent}</sup></>} />
          <Result label="E-notation (calculators, code)" value={sci.e} accent="cyan" />
          <Result label="Engineering notation" value={sci.eng} accent="indigo" note="Exponent is always a multiple of 3." />
          {plain && <Result label="Standard form" value={plain} accent="emerald" />}
        </div>
      ) : <ErrorNote>Enter a number such as 12500, 0.00042 or 3.2e-5.</ErrorNote>}
    </>
  );
}

/* -------------------------------------------------------- Area calculator */
const SHAPES = {
  rectangle: { label: 'Rectangle / square', fields: [['a', 'Length'], ['b', 'Width']] },
  triangle: { label: 'Triangle', fields: [['a', 'Base'], ['b', 'Height']] },
  circle: { label: 'Circle', fields: [['a', 'Radius']] },
  trapezoid: { label: 'Trapezoid', fields: [['a', 'Base 1'], ['b', 'Base 2'], ['c', 'Height']] },
  ellipse: { label: 'Ellipse', fields: [['a', 'Semi-axis a'], ['b', 'Semi-axis b']] },
  parallelogram: { label: 'Parallelogram', fields: [['a', 'Base'], ['b', 'Height']] },
};
const UNIT_LABELS = { ft: 'feet', in: 'inches', yd: 'yards', m: 'metres', cm: 'centimetres', mm: 'millimetres', km: 'kilometres', mi: 'miles' };

export function AreaCalculator() {
  const { num, money } = useFormat();
  const [shape, setShape] = useState('rectangle');
  const [unit, setUnit] = useState('ft');
  const [vals, setVals] = useState({ a: '12', b: '10', c: '4' });
  const [cost, setCost] = useState('');

  const spec = SHAPES[shape];
  const v = Object.fromEntries(['a', 'b', 'c'].map((k) => [k, toNumber(vals[k])]));
  const areaUnits = shapeArea(shape, v);
  const valid = Number.isFinite(areaUnits) && areaUnits > 0;
  const sqm = valid ? areaUnits * SQ_M_PER[unit] : 0;
  const conv = valid ? areaConversions(sqm) : null;

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledSelect label="Shape" id="ar-s" value={shape} onChange={(e) => setShape(e.target.value)}>
          {Object.entries(SHAPES).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
        </LabelledSelect>
        <LabelledSelect label="Measured in" id="ar-u" value={unit} onChange={(e) => setUnit(e.target.value)}>
          {Object.entries(UNIT_LABELS).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
        </LabelledSelect>
      </Grid>
      <Grid className="mt-4 md:grid-cols-3">
        {spec.fields.map(([key, label]) => (
          <LabelledField key={key} label={`${label} (${unit})`} id={`ar-${key}`} type="number" min="0" step="any" value={vals[key]} onChange={(e) => setVals((prev) => ({ ...prev, [key]: e.target.value }))} />
        ))}
      </Grid>
      {conv ? (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Square feet" value={num(conv['square feet'], 2)} accent="emerald" />
            <Stat label="Square metres" value={num(conv['square metres'], 2)} accent="emerald" />
            <Stat label="Square yards" value={num(conv['square yards'], 2)} />
            <Stat label="Acres" value={num(conv.acres, 4)} accent="cyan" />
          </StatGrid>
          <div className="mt-6 grid max-w-2xl gap-4 md:grid-cols-2">
            <LabelledField label="Price per square foot (optional)" id="ar-c" type="number" min="0" step="any" value={cost} onChange={(e) => setCost(e.target.value)} />
            <Stat label="Estimated cost" value={toNumber(cost) > 0 ? money(conv['square feet'] * toNumber(cost)) : '—'} />
          </div>
        </>
      ) : <p className="mt-6 text-slate-400">Enter positive dimensions to see the area.</p>}
    </>
  );
}
