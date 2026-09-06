import { useMemo, useState } from 'react';
import {
  ErrorNote, Grid, Label, LabelledField, LabelledSelect, Panel, Result, Segmented, Stat,
  StatGrid,
} from './uiKit.jsx';
import { num, toNumber } from './toolFormat.js';

/** Metric/imperial switch shared by the body-measurement tools. */
const useMeasurements = (defaults = { cm: '170', kg: '70' }) => {
  const [units, setUnits] = useState('metric');
  const [cm, setCm] = useState(defaults.cm);
  const [kg, setKg] = useState(defaults.kg);
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [pounds, setPounds] = useState('154');

  const heightCm = units === 'metric' ? toNumber(cm) : (toNumber(feet) * 12 + toNumber(inches)) * 2.54;
  const weightKg = units === 'metric' ? toNumber(kg) : toNumber(pounds) * 0.45359237;

  const inputs = (
    <>
      <Segmented ariaLabel="Unit system" value={units} onChange={setUnits}
        options={[{ value: 'metric', label: 'Metric (cm / kg)' }, { value: 'imperial', label: 'Imperial (ft / lb)' }]} />
      {units === 'metric' ? (
        <Grid className="mt-5 md:grid-cols-2">
          <LabelledField label="Height (cm)" id="h-cm" type="number" min="50" max="272" value={cm} onChange={(e) => setCm(e.target.value)} />
          <LabelledField label="Weight (kg)" id="h-kg" type="number" min="1" value={kg} onChange={(e) => setKg(e.target.value)} />
        </Grid>
      ) : (
        <Grid className="mt-5 md:grid-cols-3">
          <LabelledField label="Height (feet)" id="h-ft" type="number" min="1" max="8" value={feet} onChange={(e) => setFeet(e.target.value)} />
          <LabelledField label="Height (inches)" id="h-in" type="number" min="0" max="11" value={inches} onChange={(e) => setInches(e.target.value)} />
          <LabelledField label="Weight (pounds)" id="h-lb" type="number" min="1" value={pounds} onChange={(e) => setPounds(e.target.value)} />
        </Grid>
      )}
    </>
  );

  return { units, heightCm, weightKg, inputs };
};

const Disclaimer = ({ children }) => (
  <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-400">{children}</p>
);

/* ------------------------------------------------------------------- BMI */
export function BmiCalculator() {
  const { heightCm, weightKg, inputs } = useMeasurements();
  const metres = heightCm / 100;
  const bmi = metres > 0 ? weightKg / metres ** 2 : 0;
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obesity range';
  const healthyLow = 18.5 * metres ** 2;
  const healthyHigh = 24.9 * metres ** 2;

  return (
    <>
      {inputs}
      {Number.isFinite(bmi) && bmi > 0 ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
            <span className="text-sm text-slate-400">Your BMI</span>
            <strong className="mt-2 block text-5xl font-black text-emerald-300">{num(bmi, 1)}</strong>
            <span className="mt-2 block text-lg text-white">{category}</span>
          </div>
          <StatGrid columns="md:grid-cols-3">
            <Stat label="Healthy weight range" value={`${num(healthyLow, 1)}–${num(healthyHigh, 1)} kg`} accent="cyan" />
            <Stat label="In pounds" value={`${num(healthyLow / 0.45359237, 0)}–${num(healthyHigh / 0.45359237, 0)} lb`} />
            <Stat label="Category threshold" value={bmi < 25 ? `${num(healthyHigh - weightKg, 1)} kg to overweight` : `${num(weightKg - healthyHigh, 1)} kg above range`} accent="cyan" />
          </StatGrid>
          <Panel title="BMI categories">
            <ul className="space-y-2 text-sm text-slate-400">
              <li><strong className="text-white">Under 18.5</strong> — underweight</li>
              <li><strong className="text-white">18.5 to 24.9</strong> — healthy range</li>
              <li><strong className="text-white">25.0 to 29.9</strong> — overweight</li>
              <li><strong className="text-white">30.0 and above</strong> — obesity range</li>
            </ul>
          </Panel>
        </>
      ) : <ErrorNote>Enter a valid height and weight.</ErrorNote>}
      <Disclaimer>BMI is a general screening measure for adults, not a diagnosis. It does not account for muscle mass, bone density, or fat distribution, and thresholds differ for children and for some ethnic groups. Speak to a qualified health professional about your individual health.</Disclaimer>
    </>
  );
}

/* --------------------------------------------------------------- Calories */
const ACTIVITY = [
  { value: '1.2', label: 'Sedentary — desk job, little exercise' },
  { value: '1.375', label: 'Lightly active — 1 to 3 sessions a week' },
  { value: '1.55', label: 'Moderately active — 3 to 5 sessions a week' },
  { value: '1.725', label: 'Very active — 6 to 7 sessions a week' },
  { value: '1.9', label: 'Extremely active — physical job or twice-daily training' },
];

export function CalorieCalculator() {
  const { heightCm, weightKg, inputs } = useMeasurements();
  const [age, setAge] = useState('30');
  const [sex, setSex] = useState('male');
  const [activity, setActivity] = useState('1.375');

  const bmr = weightKg > 0 && heightCm > 0
    ? 10 * weightKg + 6.25 * heightCm - 5 * toNumber(age) + (sex === 'male' ? 5 : -161)
    : 0;
  const tdee = bmr * Number(activity);

  return (
    <>
      {inputs}
      <Grid className="mt-4 md:grid-cols-3">
        <LabelledField label="Age" id="cal-age" type="number" min="15" max="100" value={age} onChange={(e) => setAge(e.target.value)} />
        <LabelledSelect label="Sex" id="cal-sex" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </LabelledSelect>
        <LabelledSelect label="Activity level" id="cal-activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
          {ACTIVITY.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </LabelledSelect>
      </Grid>
      {bmr > 0 && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label="Basal metabolic rate (BMR)" value={`${num(bmr, 0)} kcal`} accent="cyan" note="What your body burns at complete rest" />
            <Result label="Maintenance calories (TDEE)" value={`${num(tdee, 0)} kcal`} note="Total daily energy expenditure at this activity level" />
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Steady loss (−20%)" value={`${num(tdee * 0.8, 0)} kcal`} />
            <Stat label="Mild loss (−10%)" value={`${num(tdee * 0.9, 0)} kcal`} accent="cyan" />
            <Stat label="Mild gain (+10%)" value={`${num(tdee * 1.1, 0)} kcal`} accent="cyan" />
            <Stat label="Steady gain (+20%)" value={`${num(tdee * 1.2, 0)} kcal`} />
          </StatGrid>
          <p className="mt-4 text-sm text-slate-500">Calculated with the Mifflin-St Jeor equation. Treat the figure as a starting hypothesis and adjust it based on how your weight actually moves over two to three weeks.</p>
        </>
      )}
      <Disclaimer>These are statistical estimates for healthy adults and can be 10–15% out for any individual. They are not medical or dietary advice. Anyone who is pregnant, managing a health condition, or working with a clinical team should follow professional guidance.</Disclaimer>
    </>
  );
}

/* ----------------------------------------------------------- Ideal weight */
export function IdealWeightCalculator() {
  const { heightCm, inputs } = useMeasurements();
  const [sex, setSex] = useState('male');

  const inchesOver5ft = Math.max(0, heightCm / 2.54 - 60);
  const male = sex === 'male';
  const metres = heightCm / 100;

  const formulas = [
    ['Devine (1974)', (male ? 50 : 45.5) + 2.3 * inchesOver5ft],
    ['Robinson (1983)', (male ? 52 : 49) + (male ? 1.9 : 1.7) * inchesOver5ft],
    ['Miller (1983)', (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * inchesOver5ft],
    ['Hamwi (1964)', (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * inchesOver5ft],
  ];
  const bmiLow = 18.5 * metres ** 2;
  const bmiHigh = 24.9 * metres ** 2;

  return (
    <>
      {inputs}
      <div className="mt-4">
        <LabelledSelect label="Sex" id="iw-sex" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </LabelledSelect>
      </div>
      {heightCm > 100 ? (
        <>
          <div className="mt-6">
            <Result label="Healthy BMI weight range" value={`${num(bmiLow, 1)} – ${num(bmiHigh, 1)} kg`} note={`${num(bmiLow / 0.45359237, 0)} – ${num(bmiHigh / 0.45359237, 0)} lb — the range most used in modern clinical practice`} />
          </div>
          <StatGrid columns="md:grid-cols-4">
            {formulas.map(([name, value]) => (
              <Stat key={name} label={name} value={`${num(value, 1)} kg`} hint={`${num(value / 0.45359237, 0)} lb`} accent="cyan" />
            ))}
          </StatGrid>
          <p className="mt-4 text-sm text-slate-500">The spread between these formulas is the point: several were derived for drug dosing rather than health guidance, and none accounts for frame size or muscle mass.</p>
        </>
      ) : <ErrorNote>Enter a height above 100 cm.</ErrorNote>}
      <Disclaimer>Ideal weight formulas are rough statistical guides that ignore body composition, frame size, age, and medical history. They are not a substitute for advice from a qualified health professional.</Disclaimer>
    </>
  );
}

/* -------------------------------------------------------------- Body fat */
export function BodyFatCalculator() {
  const [sex, setSex] = useState('male');
  const [height, setHeight] = useState('178');
  const [neck, setNeck] = useState('38');
  const [waist, setWaist] = useState('86');
  const [hip, setHip] = useState('95');
  const [weight, setWeight] = useState('80');

  const result = useMemo(() => {
    const h = toNumber(height);
    const n = toNumber(neck);
    const w = toNumber(waist);
    const hp = toNumber(hip);
    if (h <= 0 || n <= 0 || w <= 0) return null;
    const log10 = Math.log10;
    const percentage = sex === 'male'
      ? 495 / (1.0324 - 0.19077 * log10(w - n) + 0.15456 * log10(h)) - 450
      : 495 / (1.29579 - 0.35004 * log10(w + hp - n) + 0.221 * log10(h)) - 450;
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 70) return null;
    const mass = toNumber(weight);
    return { percentage, fatMass: (mass * percentage) / 100, leanMass: mass - (mass * percentage) / 100 };
  }, [sex, height, neck, waist, hip, weight]);

  const category = (value) => {
    const bands = sex === 'male'
      ? [[6, 'Essential / athlete'], [14, 'Athletic'], [18, 'Fitness'], [25, 'Average'], [100, 'Above average']]
      : [[14, 'Essential / athlete'], [21, 'Athletic'], [25, 'Fitness'], [32, 'Average'], [100, 'Above average']];
    return bands.find(([limit]) => value < limit)?.[1] || '—';
  };

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledSelect label="Sex" id="bf-sex" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </LabelledSelect>
        <LabelledField label="Height (cm)" id="bf-height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        <LabelledField label="Weight (kg)" hint="for fat and lean mass" id="bf-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <LabelledField label="Neck (cm)" hint="below the larynx" id="bf-neck" type="number" value={neck} onChange={(e) => setNeck(e.target.value)} />
        <LabelledField label="Waist (cm)" hint={sex === 'male' ? 'at the navel' : 'at the narrowest point'} id="bf-waist" type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
        {sex === 'female' && <LabelledField label="Hips (cm)" hint="at the widest point" id="bf-hip" type="number" value={hip} onChange={(e) => setHip(e.target.value)} />}
      </Grid>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
            <span className="text-sm text-slate-400">Estimated body fat</span>
            <strong className="mt-2 block text-5xl font-black text-emerald-300">{num(result.percentage, 1)}%</strong>
            <span className="mt-2 block text-lg text-white">{category(result.percentage)}</span>
          </div>
          <StatGrid columns="md:grid-cols-2">
            <Stat label="Fat mass" value={`${num(result.fatMass, 1)} kg`} accent="cyan" />
            <Stat label="Lean body mass" value={`${num(result.leanMass, 1)} kg`} />
          </StatGrid>
        </>
      ) : <ErrorNote>Check your measurements — the waist must be larger than the neck for the formula to resolve.</ErrorNote>}
      <Disclaimer>This is the US Navy circumference estimate, typically within three to four percentage points of a DEXA scan. It is not a clinical body composition assessment. Consult a qualified health professional for individual guidance.</Disclaimer>
    </>
  );
}

/* ------------------------------------------------------------ Water intake */
export function WaterIntakeCalculator() {
  const { weightKg, inputs } = useMeasurements({ cm: '170', kg: '70' });
  const [exercise, setExercise] = useState('30');
  const [climate, setClimate] = useState('temperate');

  const base = weightKg * 33;
  const exerciseBonus = (toNumber(exercise) / 30) * 400;
  const climateMultiplier = climate === 'hot' ? 1.15 : climate === 'cold' ? 0.95 : 1;
  const total = (base + exerciseBonus) * climateMultiplier;

  return (
    <>
      {inputs}
      <Grid className="mt-4 md:grid-cols-2">
        <LabelledField label="Daily exercise (minutes)" id="wi-exercise" type="number" min="0" max="360" value={exercise} onChange={(e) => setExercise(e.target.value)} />
        <LabelledSelect label="Climate" id="wi-climate" value={climate} onChange={(e) => setClimate(e.target.value)}>
          <option value="temperate">Temperate</option>
          <option value="hot">Hot or humid</option>
          <option value="cold">Cold</option>
        </LabelledSelect>
      </Grid>
      {weightKg > 0 && (
        <>
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
            <span className="text-sm text-slate-400">Suggested daily fluid intake</span>
            <strong className="mt-2 block text-5xl font-black text-cyan-300">{num(total / 1000, 1)} litres</strong>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Millilitres" value={num(total, 0)} />
            <Stat label="US cups (240 ml)" value={num(total / 240, 1)} accent="cyan" />
            <Stat label="500 ml bottles" value={num(total / 500, 1)} />
            <Stat label="From exercise" value={`${num(exerciseBonus, 0)} ml`} accent="cyan" />
          </StatGrid>
          <p className="mt-4 text-sm text-slate-500">Food, tea, and coffee all count toward this total — fruit, vegetables, and soup can supply around 20% of daily intake.</p>
        </>
      )}
      <Disclaimer>General estimates for healthy adults. People with kidney, heart, or liver conditions, and anyone on a fluid restriction, should follow their clinician’s instructions instead.</Disclaimer>
    </>
  );
}

/* ----------------------------------------------------------------- Macros */
const SPLITS = {
  Balanced: { protein: 30, carbs: 40, fat: 30 },
  'High protein': { protein: 40, carbs: 35, fat: 25 },
  'Low carb': { protein: 35, carbs: 20, fat: 45 },
  'Endurance training': { protein: 25, carbs: 55, fat: 20 },
};

export function MacroCalculator() {
  const [calories, setCalories] = useState('2200');
  const [preset, setPreset] = useState('Balanced');
  const [weight, setWeight] = useState('75');
  const split = SPLITS[preset];

  const kcal = toNumber(calories);
  const grams = {
    protein: (kcal * split.protein) / 100 / 4,
    carbs: (kcal * split.carbs) / 100 / 4,
    fat: (kcal * split.fat) / 100 / 9,
  };
  const proteinPerKg = toNumber(weight) > 0 ? grams.protein / toNumber(weight) : 0;

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField label="Daily calorie target" id="mc-cal" type="number" min="800" max="6000" value={calories} onChange={(e) => setCalories(e.target.value)} />
        <LabelledField label="Body weight (kg)" hint="to check protein per kg" id="mc-weight" type="number" min="30" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </Grid>
      <div className="mt-5">
        <Label>Macro split</Label>
        <div className="mt-2"><Segmented ariaLabel="Macro split" value={preset} onChange={setPreset} options={Object.keys(SPLITS)} /></div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label={`Protein (${split.protein}%)`} value={`${num(grams.protein, 0)} g`} note={`${num((kcal * split.protein) / 100, 0)} kcal`} />
        <Result label={`Carbohydrate (${split.carbs}%)`} value={`${num(grams.carbs, 0)} g`} accent="cyan" note={`${num((kcal * split.carbs) / 100, 0)} kcal`} />
        <Result label={`Fat (${split.fat}%)`} value={`${num(grams.fat, 0)} g`} accent="indigo" note={`${num((kcal * split.fat) / 100, 0)} kcal`} />
      </div>
      <StatGrid columns="md:grid-cols-2">
        <Stat label="Protein per kg body weight" value={`${num(proteinPerKg, 2)} g/kg`} accent={proteinPerKg >= 1.6 ? 'emerald' : 'indigo'} />
        <Stat label="Guidance" value={proteinPerKg >= 1.6 ? 'Supports training and a deficit' : proteinPerKg >= 0.8 ? 'Meets the basic requirement' : 'Below the general minimum'} accent="cyan" />
      </StatGrid>
      <p className="mt-4 text-sm text-slate-500">Protein and carbohydrate provide 4 kcal per gram; fat provides 9. Hitting within about ten grams a day is close enough — weekly averages drive results.</p>
      <Disclaimer>General nutrition information, not personalised dietary advice. Anyone with a medical condition or specific dietary needs should consult a registered dietitian or doctor.</Disclaimer>
    </>
  );
}

/* --------------------------------------------------------------- Due date */
export function PregnancyDueDateCalculator() {
  const [method, setMethod] = useState('lmp');
  const [date, setDate] = useState('');
  const [cycle, setCycle] = useState('28');

  const result = useMemo(() => {
    if (!date) return null;
    const base = new Date(`${date}T00:00:00`);
    if (Number.isNaN(base.getTime())) return null;
    const adjustment = method === 'lmp' ? toNumber(cycle, 28) - 28 : 0;
    const due = new Date(base);
    due.setDate(due.getDate() + (method === 'lmp' ? 280 + adjustment : 266));

    const conceptionStart = new Date(due);
    conceptionStart.setDate(conceptionStart.getDate() - 280);
    const daysPregnant = Math.floor((Date.now() - conceptionStart.getTime()) / 86400000);
    const weeks = Math.floor(daysPregnant / 7);

    const trimester2 = new Date(conceptionStart); trimester2.setDate(trimester2.getDate() + 14 * 7);
    const trimester3 = new Date(conceptionStart); trimester3.setDate(trimester3.getDate() + 28 * 7);

    return {
      due,
      weeks: Math.max(0, weeks),
      days: Math.max(0, daysPregnant % 7),
      remaining: Math.max(0, Math.ceil((due.getTime() - Date.now()) / 86400000)),
      trimester2, trimester3,
      trimester: weeks < 14 ? 'First' : weeks < 28 ? 'Second' : 'Third',
    };
  }, [date, method, cycle]);

  const fmt = (value) => value.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Segmented ariaLabel="Calculation method" value={method} onChange={setMethod}
        options={[{ value: 'lmp', label: 'From last menstrual period' }, { value: 'conception', label: 'From conception date' }]} />
      <Grid className="mt-5 md:grid-cols-2">
        <LabelledField label={method === 'lmp' ? 'First day of last period' : 'Conception date'} id="dd-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        {method === 'lmp' && <LabelledField label="Average cycle length (days)" id="dd-cycle" type="number" min="20" max="45" value={cycle} onChange={(e) => setCycle(e.target.value)} />}
      </Grid>
      {result ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
            <span className="text-sm text-slate-400">Estimated due date</span>
            <strong className="mt-2 block text-4xl font-black text-emerald-300">{fmt(result.due)}</strong>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Currently" value={`${result.weeks}w ${result.days}d`} accent="cyan" />
            <Stat label="Trimester" value={result.trimester} />
            <Stat label="Days remaining" value={result.remaining} accent="cyan" />
            <Stat label="Second trimester from" value={fmt(result.trimester2)} />
          </StatGrid>
          <p className="mt-4 text-sm text-slate-500">Only about 4% of babies arrive on the exact due date; around 90% are born within two weeks either side of it.</p>
        </>
      ) : <p className="mt-5 text-slate-500">Choose a date to calculate the estimated due date.</p>}
      <Disclaimer>This is an estimate and is not a substitute for antenatal care. Always follow the dating given by your midwife, obstetrician, or ultrasound scan.</Disclaimer>
    </>
  );
}
