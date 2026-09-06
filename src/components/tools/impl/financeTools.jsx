import { useMemo, useState } from 'react';
import {
  Button, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel, Result,
  Segmented, Select, Stat, StatGrid, Toggle,
} from './uiKit.jsx';
import { money, num, toNumber } from './toolFormat.js';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'PKR', 'AUD', 'CAD', 'AED', 'NGN', 'ZAR'];

const useCurrency = () => {
  const [currency, setCurrency] = useState('USD');
  const picker = (
    <LabelledSelect label="Currency" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
      {CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
    </LabelledSelect>
  );
  return [currency, picker];
};

/** Standard amortising payment; falls back to a straight-line split at a 0% rate. */
const amortise = (principal, annualRate, months) => {
  if (principal <= 0 || months <= 0) return null;
  const monthlyRate = annualRate / 1200;
  const payment = monthlyRate === 0
    ? principal / months
    : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  return { payment, total: payment * months, interest: payment * months - principal };
};

/* ------------------------------------------------------------------ Loan */
export function LoanCalculator() {
  const [currency, picker] = useCurrency();
  const [amount, setAmount] = useState('15000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('5');
  const result = amortise(toNumber(amount), toNumber(rate), toNumber(years) * 12);

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Loan amount" id="loan-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label="Annual interest rate (%)" id="loan-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label="Term (years)" id="loan-years" type="number" min="0.1" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      {result ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label="Monthly payment" value={money(result.payment, currency)} />
            <Result label="Total interest" value={money(result.interest, currency)} accent="cyan" />
            <Result label="Total repaid" value={money(result.total, currency)} accent="indigo" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Over {num(toNumber(years) * 12, 0)} payments, interest adds {num((result.interest / toNumber(amount)) * 100, 1)}% to the amount borrowed.
          </p>
        </>
      ) : <ErrorNote>Enter a loan amount and a term greater than zero.</ErrorNote>}
    </>
  );
}

/* -------------------------------------------------------------- Mortgage */
export function MortgageCalculator() {
  const [currency, picker] = useCurrency();
  const [price, setPrice] = useState('350000');
  const [deposit, setDeposit] = useState('70000');
  const [rate, setRate] = useState('5.5');
  const [years, setYears] = useState('30');
  const [tax, setTax] = useState('3000');
  const [insurance, setInsurance] = useState('1200');

  const principal = Math.max(0, toNumber(price) - toNumber(deposit));
  const result = amortise(principal, toNumber(rate), toNumber(years) * 12);
  const monthlyExtras = (toNumber(tax) + toNumber(insurance)) / 12;
  const depositPercent = toNumber(price) ? (toNumber(deposit) / toNumber(price)) * 100 : 0;

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Property price" id="mg-price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label="Deposit" hint={`${num(depositPercent, 1)}%`} id="mg-deposit" type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
        {picker}
        <LabelledField label="Interest rate (%)" id="mg-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label="Term (years)" id="mg-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        <LabelledField label="Annual property tax" id="mg-tax" type="number" min="0" value={tax} onChange={(e) => setTax(e.target.value)} />
        <LabelledField label="Annual home insurance" id="mg-ins" type="number" min="0" value={insurance} onChange={(e) => setInsurance(e.target.value)} />
      </Grid>
      {result ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label="Total monthly payment" value={money(result.payment + monthlyExtras, currency)} note="Principal, interest, tax and insurance" />
            <Result label="Principal and interest only" value={money(result.payment, currency)} accent="cyan" />
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label="Loan amount" value={money(principal, currency)} />
            <Stat label="Total interest" value={money(result.interest, currency)} accent="cyan" />
            <Stat label="Total repaid" value={money(result.total, currency)} />
            <Stat label="Tax + insurance monthly" value={money(monthlyExtras, currency)} accent="cyan" />
          </StatGrid>
          {depositPercent < 20 && <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">A deposit under 20% usually triggers mortgage insurance, which is not included above.</p>}
        </>
      ) : <ErrorNote>Enter a property price higher than the deposit, and a term of at least one year.</ErrorNote>}
    </>
  );
}

/* ----------------------------------------------------- Compound interest */
export function CompoundInterestCalculator() {
  const [currency, picker] = useCurrency();
  const [principal, setPrincipal] = useState('5000');
  const [monthly, setMonthly] = useState('300');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [frequency, setFrequency] = useState('12');

  const result = useMemo(() => {
    const p = toNumber(principal);
    const r = toNumber(rate) / 100;
    const t = toNumber(years);
    const n = toNumber(frequency, 12);
    if (t <= 0 || n <= 0) return null;
    const lump = p * (1 + r / n) ** (n * t);
    const monthlyRate = (1 + r / n) ** (n / 12) - 1;
    const months = t * 12;
    const contributions = toNumber(monthly);
    const annuity = monthlyRate === 0 ? contributions * months : contributions * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    const final = lump + annuity;
    const paidIn = p + contributions * months;
    return { final, paidIn, growth: final - paidIn };
  }, [principal, monthly, rate, years, frequency]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Starting balance" id="ci-principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <LabelledField label="Monthly contribution" id="ci-monthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        {picker}
        <LabelledField label="Annual return (%)" id="ci-rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label="Years" id="ci-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        <LabelledSelect label="Compounding" id="ci-freq" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="1">Annually</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
          <option value="365">Daily</option>
        </LabelledSelect>
      </Grid>
      {result && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label="Final balance" value={money(result.final, currency)} />
            <Result label="Total contributed" value={money(result.paidIn, currency)} accent="indigo" />
            <Result label="Growth from interest" value={money(result.growth, currency)} accent="cyan" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Interest accounts for {num((result.growth / (result.final || 1)) * 100, 1)}% of the final balance. Figures are nominal and ignore inflation, fees, and tax.
          </p>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------- Simple interest */
export function SimpleInterestCalculator() {
  const [currency, picker] = useCurrency();
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('6');
  const [years, setYears] = useState('3');

  const interest = (toNumber(principal) * toNumber(rate) * toNumber(years)) / 100;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Principal" id="si-principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <LabelledField label="Annual rate (%)" id="si-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label="Time (years)" hint="6 months = 0.5" id="si-years" type="number" step="0.25" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Result label="Simple interest" value={money(interest, currency)} />
        <Result label="Total amount" value={money(toNumber(principal) + interest, currency)} accent="cyan" />
      </div>
      <p className="mt-4 text-sm text-slate-500">I = P × R × T ÷ 100 = {num(toNumber(principal), 2)} × {rate} × {years} ÷ 100</p>
    </>
  );
}

/* ------------------------------------------------------------------- Tip */
export function TipCalculator() {
  const [currency, picker] = useCurrency();
  const [bill, setBill] = useState('84.50');
  const [percent, setPercent] = useState(18);
  const [people, setPeople] = useState('2');

  const tip = (toNumber(bill) * percent) / 100;
  const total = toNumber(bill) + tip;
  const split = Math.max(1, Math.floor(toNumber(people, 1)));

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Bill total" id="tip-bill" type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} />
        <LabelledField label="Number of people" id="tip-people" type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-5">
        <Label>Tip percentage: <strong className="text-white">{percent}%</strong></Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Segmented ariaLabel="Common tip percentages" value={percent} onChange={setPercent} options={[10, 12, 15, 18, 20, 25].map((value) => ({ value, label: `${value}%` }))} />
        </div>
        <input type="range" min="0" max="40" value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="mt-4 w-full accent-indigo-500" aria-label="Tip percentage" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label="Tip amount" value={money(tip, currency)} accent="cyan" />
        <Result label="Total with tip" value={money(total, currency)} />
        <Result label={`Each person pays (${split})`} value={money(total / split, currency)} accent="indigo" />
      </div>
    </>
  );
}

/* -------------------------------------------------------------- Discount */
export function DiscountCalculator() {
  const [currency, picker] = useCurrency();
  const [price, setPrice] = useState('120');
  const [first, setFirst] = useState('30');
  const [second, setSecond] = useState('0');

  const original = toNumber(price);
  const afterFirst = original * (1 - toNumber(first) / 100);
  const final = afterFirst * (1 - toNumber(second) / 100);
  const saved = original - final;
  const effective = original ? (saved / original) * 100 : 0;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Original price" id="disc-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label="First discount (%)" id="disc-1" type="number" min="0" max="100" value={first} onChange={(e) => setFirst(e.target.value)} />
        <LabelledField label="Second discount (%)" hint="optional" id="disc-2" type="number" min="0" max="100" value={second} onChange={(e) => setSecond(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label="Final price" value={money(final, currency)} />
        <Result label="You save" value={money(saved, currency)} accent="cyan" />
        <Result label="True total discount" value={`${num(effective, 2)}%`} accent="indigo" />
      </div>
      {toNumber(second) > 0 && (
        <p className="mt-4 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-3 text-sm text-indigo-200">
          {first}% then {second}% is <strong>{num(effective, 1)}% off</strong>, not {num(toNumber(first) + toNumber(second), 0)}% — stacked discounts multiply rather than add.
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------- Sales tax */
export function SalesTaxCalculator() {
  const [currency, picker] = useCurrency();
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('100');
  const [rate, setRate] = useState('20');

  const value = toNumber(amount);
  const percent = toNumber(rate);
  const net = mode === 'add' ? value : value / (1 + percent / 100);
  const tax = mode === 'add' ? (value * percent) / 100 : value - net;
  const gross = net + tax;

  return (
    <>
      <Segmented ariaLabel="Tax mode" value={mode} onChange={setMode}
        options={[{ value: 'add', label: 'Add tax to a net price' }, { value: 'remove', label: 'Remove tax from a gross price' }]} />
      <Grid className="mt-5 md:grid-cols-3">
        <LabelledField label={mode === 'add' ? 'Net amount (before tax)' : 'Gross amount (including tax)'} id="tax-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label="Tax rate (%)" id="tax-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label="Net (excluding tax)" value={money(net, currency)} accent="cyan" />
        <Result label="Tax amount" value={money(tax, currency)} accent="indigo" />
        <Result label="Gross (including tax)" value={money(gross, currency)} />
      </div>
      {mode === 'remove' && (
        <p className="mt-4 text-sm text-slate-500">
          Removing {percent}% tax means dividing by {num(1 + percent / 100, 4)} — a reduction of {num((1 - 1 / (1 + percent / 100)) * 100, 2)}%, not {percent}%.
        </p>
      )}
    </>
  );
}

/* -------------------------------------------------------- Margin & markup */
export function MarginMarkupCalculator() {
  const [currency, picker] = useCurrency();
  const [cost, setCost] = useState('30');
  const [price, setPrice] = useState('50');
  const [targetMargin, setTargetMargin] = useState('40');

  const c = toNumber(cost);
  const p = toNumber(price);
  const profit = p - c;
  const margin = p ? (profit / p) * 100 : 0;
  const markup = c ? (profit / c) * 100 : 0;
  const target = toNumber(targetMargin);
  const requiredPrice = target < 100 ? c / (1 - target / 100) : null;

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Unit cost" id="mm-cost" type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
        <LabelledField label="Selling price" id="mm-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label="Gross profit" value={money(profit, currency)} />
        <Result label="Profit margin" value={`${num(margin, 2)}%`} accent="cyan" />
        <Result label="Markup" value={`${num(markup, 2)}%`} accent="indigo" />
      </div>
      <Panel title="Price for a target margin">
        <Grid className="md:grid-cols-2">
          <LabelledField label="Target margin (%)" id="mm-target" type="number" min="0" max="99" step="0.1" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} />
          <div>
            <Label>Required selling price</Label>
            <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xl font-bold text-emerald-300">
              {requiredPrice === null ? 'Margin must be under 100%' : money(requiredPrice, currency)}
            </div>
          </div>
        </Grid>
        <p className="mt-4 text-sm text-slate-500">cost ÷ (1 − margin ÷ 100). Adding the margin percentage to cost gives a markup, not a margin — a common and expensive mix-up.</p>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------- ROI */
export function RoiCalculator() {
  const [currency, picker] = useCurrency();
  const [invested, setInvested] = useState('10000');
  const [returned, setReturned] = useState('16000');
  const [years, setYears] = useState('4');

  const i = toNumber(invested);
  const r = toNumber(returned);
  const gain = r - i;
  const roi = i ? (gain / i) * 100 : 0;
  const t = toNumber(years);
  const annualised = i > 0 && r > 0 && t > 0 ? ((r / i) ** (1 / t) - 1) * 100 : null;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Amount invested" hint="include fees" id="roi-in" type="number" min="0" value={invested} onChange={(e) => setInvested(e.target.value)} />
        <LabelledField label="Amount returned" id="roi-out" type="number" min="0" value={returned} onChange={(e) => setReturned(e.target.value)} />
        <LabelledField label="Holding period (years)" id="roi-years" type="number" min="0.1" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label="Net gain" value={money(gain, currency)} accent={gain >= 0 ? 'emerald' : 'indigo'} />
        <Result label="Total ROI" value={`${num(roi, 2)}%`} accent="cyan" />
        <Result label="Annualised ROI" value={annualised === null ? '—' : `${num(annualised, 2)}%`} accent="indigo" />
      </div>
      <p className="mt-4 text-sm text-slate-500">Annualised ROI is what makes investments of different lengths comparable. ROI says nothing about risk.</p>
    </>
  );
}

/* ------------------------------------------------------------ Break-even */
export function BreakEvenCalculator() {
  const [currency, picker] = useCurrency();
  const [fixed, setFixed] = useState('12000');
  const [price, setPrice] = useState('49');
  const [variable, setVariable] = useState('19');

  const contribution = toNumber(price) - toNumber(variable);
  const units = contribution > 0 ? toNumber(fixed) / contribution : null;
  const marginRatio = toNumber(price) ? (contribution / toNumber(price)) * 100 : 0;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Fixed costs per period" id="be-fixed" type="number" min="0" value={fixed} onChange={(e) => setFixed(e.target.value)} />
        <LabelledField label="Price per unit" id="be-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label="Variable cost per unit" id="be-var" type="number" min="0" step="0.01" value={variable} onChange={(e) => setVariable(e.target.value)} />
        {picker}
      </Grid>
      {contribution > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label="Break-even units" value={Math.ceil(units).toLocaleString()} />
            <Result label="Break-even revenue" value={money(Math.ceil(units) * toNumber(price), currency)} accent="cyan" />
            <Result label="Contribution per unit" value={money(contribution, currency)} accent="indigo" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Each sale contributes {num(marginRatio, 1)}% of its price toward fixed costs. Selling {Math.ceil(units).toLocaleString()} units per period covers them exactly.
          </p>
        </>
      ) : (
        <ErrorNote>The price must exceed the variable cost, otherwise every extra unit sold increases the loss and there is no break-even point.</ErrorNote>
      )}
    </>
  );
}

/* ---------------------------------------------------------- Savings goal */
export function SavingsGoalCalculator() {
  const [currency, picker] = useCurrency();
  const [goal, setGoal] = useState('20000');
  const [saved, setSaved] = useState('2500');
  const [months, setMonths] = useState('36');
  const [rate, setRate] = useState('4');

  const result = useMemo(() => {
    const target = toNumber(goal);
    const start = toNumber(saved);
    const n = Math.floor(toNumber(months));
    const monthlyRate = toNumber(rate) / 1200;
    if (n <= 0 || target <= start) return null;
    const grownStart = start * (1 + monthlyRate) ** n;
    const needed = target - grownStart;
    if (needed <= 0) return { monthly: 0, grownStart, interest: grownStart - start };
    const monthly = monthlyRate === 0 ? needed / n : needed / (((1 + monthlyRate) ** n - 1) / monthlyRate);
    const contributed = monthly * n;
    return { monthly, grownStart, interest: target - start - contributed };
  }, [goal, saved, months, rate]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label="Savings goal" id="sg-goal" type="number" min="0" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <LabelledField label="Already saved" id="sg-saved" type="number" min="0" value={saved} onChange={(e) => setSaved(e.target.value)} />
        {picker}
        <LabelledField label="Months to save" id="sg-months" type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} />
        <LabelledField label="Annual interest rate (%)" id="sg-rate" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      </Grid>
      {result ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Result label="Save each month" value={money(result.monthly, currency)} />
          <Result label="Interest earned" value={money(Math.max(0, result.interest), currency)} accent="cyan" />
          <Result label="Weekly equivalent" value={money((result.monthly * 12) / 52, currency)} accent="indigo" />
        </div>
      ) : <ErrorNote>Set a goal larger than the amount already saved, over at least one month.</ErrorNote>}
    </>
  );
}

/* -------------------------------------------------------- Salary ↔ hourly */
export function SalaryToHourlyCalculator() {
  const [currency, picker] = useCurrency();
  const [mode, setMode] = useState('annual');
  const [amount, setAmount] = useState('60000');
  const [hours, setHours] = useState('40');
  const [weeks, setWeeks] = useState('52');

  const totalHours = toNumber(hours) * toNumber(weeks);
  const annual = mode === 'annual' ? toNumber(amount) : toNumber(amount) * totalHours;
  const hourly = totalHours ? annual / totalHours : 0;

  return (
    <>
      <Segmented ariaLabel="Conversion direction" value={mode} onChange={setMode}
        options={[{ value: 'annual', label: 'From annual salary' }, { value: 'hourly', label: 'From hourly rate' }]} />
      <Grid className="mt-5 md:grid-cols-4">
        <LabelledField label={mode === 'annual' ? 'Annual salary' : 'Hourly rate'} id="s2h-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label="Hours per week" id="s2h-hours" type="number" min="1" max="168" value={hours} onChange={(e) => setHours(e.target.value)} />
        <LabelledField label="Paid weeks per year" hint="52 salaried, ~46 contract" id="s2h-weeks" type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
        {picker}
      </Grid>
      <StatGrid columns="md:grid-cols-5">
        <Stat label="Hourly" value={money(hourly, currency)} accent="emerald" />
        <Stat label="Daily" value={money(hourly * (toNumber(hours) / 5), currency)} />
        <Stat label="Weekly" value={money(hourly * toNumber(hours), currency)} accent="cyan" />
        <Stat label="Monthly" value={money(annual / 12, currency)} />
        <Stat label="Annual" value={money(annual, currency)} accent="emerald" />
      </StatGrid>
      <p className="mt-4 text-sm text-slate-500">All figures are gross, before income tax and deductions.</p>
    </>
  );
}

/* ------------------------------------------------------------- Inflation */
export function InflationCalculator() {
  const [currency, picker] = useCurrency();
  const [amount, setAmount] = useState('50000');
  const [rate, setRate] = useState('3');
  const [years, setYears] = useState('20');

  const factor = (1 + toNumber(rate) / 100) ** toNumber(years);
  const erodedValue = toNumber(amount) / factor;
  const futureNeeded = toNumber(amount) * factor;
  const halvingYears = toNumber(rate) > 0 ? 70 / toNumber(rate) : null;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label="Amount today" id="inf-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label="Annual inflation (%)" id="inf-rate" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label="Years ahead" id="inf-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Result label={`Buying power in ${years} years`} value={money(erodedValue, currency)} note={`Today's ${money(toNumber(amount), currency)} will buy this much`} accent="cyan" />
        <Result label="Equivalent future amount needed" value={money(futureNeeded, currency)} note="To match today's purchasing power" />
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label="Purchasing power lost" value={`${num((1 - 1 / factor) * 100, 1)}%`} />
        <Stat label="Prices multiply by" value={`${num(factor, 2)}×`} accent="cyan" />
        <Stat label="Value halves in" value={halvingYears ? `${num(halvingYears, 0)} years` : '—'} accent="indigo" />
      </StatGrid>
    </>
  );
}
