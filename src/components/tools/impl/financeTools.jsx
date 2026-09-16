import { useMemo, useState } from 'react';
import {
  Button, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel, Result,
  Segmented, Select, Stat, StatGrid, Toggle,
} from './uiKit.jsx';
import { money, num, toNumber } from './toolFormat.js';
import { useExtras, useI18n, useT } from '../../../i18n/i18n.js';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'PKR', 'AUD', 'CAD', 'AED', 'NGN', 'ZAR', 'BRL', 'MXN', 'ARS', 'COP', 'CLP', 'PEN', 'CHF'];

/** Starts on the currency of the visitor's market: USD on the English pages, EUR/BRL/MXN… on the others. */
const useCurrency = () => {
  const t = useT();
  const { currency: preferred } = useI18n();
  const [currency, setCurrency] = useState(CURRENCIES.includes(preferred) ? preferred : 'USD');
  const picker = (
    <LabelledSelect label={t('Currency')} id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
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
  const t = useT();
  const [currency, picker] = useCurrency();
  const [amount, setAmount] = useState('15000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('5');
  const result = amortise(toNumber(amount), toNumber(rate), toNumber(years) * 12);

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label={t('Loan amount')} id="loan-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label={t('Annual interest rate (%)')} id="loan-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label={t('Term (years)')} id="loan-years" type="number" min="0.1" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      {result ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label={t('Monthly payment')} value={money(result.payment, currency)} />
            <Result label={t('Total interest')} value={money(result.interest, currency)} accent="cyan" />
            <Result label={t('Total repaid')} value={money(result.total, currency)} accent="indigo" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {t('Over {count} payments, interest adds {pct}% to the amount borrowed.', { count: num(toNumber(years) * 12, 0), pct: num((result.interest / toNumber(amount)) * 100, 1) })}
          </p>
        </>
      ) : <ErrorNote>{t('Enter a loan amount and a term greater than zero.')}</ErrorNote>}
    </>
  );
}

/* -------------------------------------------------------------- Mortgage */
export function MortgageCalculator() {
  const t = useT();
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
        <LabelledField label={t('Property price')} id="mg-price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label={t('Deposit')} hint={`${num(depositPercent, 1)}%`} id="mg-deposit" type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
        {picker}
        <LabelledField label={t('Interest rate (%)')} id="mg-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label={t('Term (years)')} id="mg-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        <LabelledField label={t('Annual property tax')} id="mg-tax" type="number" min="0" value={tax} onChange={(e) => setTax(e.target.value)} />
        <LabelledField label={t('Annual home insurance')} id="mg-ins" type="number" min="0" value={insurance} onChange={(e) => setInsurance(e.target.value)} />
      </Grid>
      {result ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Result label={t('Total monthly payment')} value={money(result.payment + monthlyExtras, currency)} note={t('Principal, interest, tax and insurance')} />
            <Result label={t('Principal and interest only')} value={money(result.payment, currency)} accent="cyan" />
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Loan amount')} value={money(principal, currency)} />
            <Stat label={t('Total interest')} value={money(result.interest, currency)} accent="cyan" />
            <Stat label={t('Total repaid')} value={money(result.total, currency)} />
            <Stat label={t('Tax + insurance monthly')} value={money(monthlyExtras, currency)} accent="cyan" />
          </StatGrid>
          {depositPercent < 20 && <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{t('A deposit under 20% usually triggers mortgage insurance, which is not included above.')}</p>}
        </>
      ) : <ErrorNote>{t('Enter a property price higher than the deposit, and a term of at least one year.')}</ErrorNote>}
    </>
  );
}

/* ----------------------------------------------------- Compound interest */
export function CompoundInterestCalculator() {
  const t = useT();
  const [currency, picker] = useCurrency();
  const [principal, setPrincipal] = useState('5000');
  const [monthly, setMonthly] = useState('300');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [frequency, setFrequency] = useState('12');

  const result = useMemo(() => {
    const p = toNumber(principal);
    const r = toNumber(rate) / 100;
    const years_ = toNumber(years);
    const n = toNumber(frequency, 12);
    if (years_ <= 0 || n <= 0) return null;
    const lump = p * (1 + r / n) ** (n * years_);
    const monthlyRate = (1 + r / n) ** (n / 12) - 1;
    const months = years_ * 12;
    const contributions = toNumber(monthly);
    const annuity = monthlyRate === 0 ? contributions * months : contributions * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    const final = lump + annuity;
    const paidIn = p + contributions * months;
    return { final, paidIn, growth: final - paidIn };
  }, [principal, monthly, rate, years, frequency]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label={t('Starting balance')} id="ci-principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <LabelledField label={t('Monthly contribution')} id="ci-monthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        {picker}
        <LabelledField label={t('Annual return (%)')} id="ci-rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label={t('Years')} id="ci-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        <LabelledSelect label={t('Compounding')} id="ci-freq" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="1">{t('Annually')}</option>
          <option value="4">{t('Quarterly')}</option>
          <option value="12">{t('Monthly')}</option>
          <option value="365">{t('Daily')}</option>
        </LabelledSelect>
      </Grid>
      {result && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label={t('Final balance')} value={money(result.final, currency)} />
            <Result label={t('Total contributed')} value={money(result.paidIn, currency)} accent="indigo" />
            <Result label={t('Growth from interest')} value={money(result.growth, currency)} accent="cyan" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {t('Interest accounts for {pct}% of the final balance. Figures are nominal and ignore inflation, fees, and tax.', { pct: num((result.growth / (result.final || 1)) * 100, 1) })}
          </p>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------- Simple interest */
export function SimpleInterestCalculator() {
  const t = useT();
  const [currency, picker] = useCurrency();
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('6');
  const [years, setYears] = useState('3');

  const interest = (toNumber(principal) * toNumber(rate) * toNumber(years)) / 100;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label={t('Principal')} id="si-principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <LabelledField label={t('Annual rate (%)')} id="si-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label={t('Time (years)')} hint={t('6 months = 0.5')} id="si-years" type="number" step="0.25" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Result label={t('Simple interest')} value={money(interest, currency)} />
        <Result label={t('Total amount')} value={money(toNumber(principal) + interest, currency)} accent="cyan" />
      </div>
      <p className="mt-4 text-sm text-slate-500">I = P × R × T ÷ 100 = {num(toNumber(principal), 2)} × {rate} × {years} ÷ 100</p>
    </>
  );
}

/* ------------------------------------------------------------------- Tip */
const TIP_PRESETS = [10, 12, 15, 18, 20, 25];

export function TipCalculator() {
  const t = useT();
  const extras = useExtras();
  const presets = extras.tip?.presets || TIP_PRESETS;
  const [currency, picker] = useCurrency();
  const [bill, setBill] = useState('84.50');
  const [percent, setPercent] = useState(extras.tip?.percent ?? 18);
  const [people, setPeople] = useState('2');

  const tip = (toNumber(bill) * percent) / 100;
  const total = toNumber(bill) + tip;
  const split = Math.max(1, Math.floor(toNumber(people, 1)));

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField label={t('Bill total')} id="tip-bill" type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} />
        <LabelledField label={t('Number of people')} id="tip-people" type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-5">
        <Label>{t('Tip percentage: {value}', { value: <strong className="text-white">{percent}%</strong> })}</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Segmented ariaLabel={t('Common tip percentages')} value={percent} onChange={setPercent} options={presets.map((value) => ({ value, label: `${value}%` }))} />
        </div>
        <input type="range" min="0" max="40" value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="mt-4 w-full accent-indigo-500" aria-label={t('Tip percentage')} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label={t('Tip amount')} value={money(tip, currency)} accent="cyan" />
        <Result label={t('Total with tip')} value={money(total, currency)} />
        <Result label={t('Each person pays ({n})', { n: split })} value={money(total / split, currency)} accent="indigo" />
      </div>
    </>
  );
}

/* -------------------------------------------------------------- Discount */
export function DiscountCalculator() {
  const t = useT();
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
        <LabelledField label={t('Original price')} id="disc-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label={t('First discount (%)')} id="disc-1" type="number" min="0" max="100" value={first} onChange={(e) => setFirst(e.target.value)} />
        <LabelledField label={t('Second discount (%)')} hint={t('optional')} id="disc-2" type="number" min="0" max="100" value={second} onChange={(e) => setSecond(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label={t('Final price')} value={money(final, currency)} />
        <Result label={t('You save')} value={money(saved, currency)} accent="cyan" />
        <Result label={t('True total discount')} value={`${num(effective, 2)}%`} accent="indigo" />
      </div>
      {toNumber(second) > 0 && (
        <p className="mt-4 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-3 text-sm text-indigo-200">
          {t('{first}% then {second}% is {effective}, not {sum}% — stacked discounts multiply rather than add.', {
            first,
            second,
            effective: <strong>{t('{pct}% off', { pct: num(effective, 1) })}</strong>,
            sum: num(toNumber(first) + toNumber(second), 0),
          })}
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------- Sales tax */
export function SalesTaxCalculator() {
  const t = useT();
  const extras = useExtras();
  const [currency, picker] = useCurrency();
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('100');
  const [rate, setRate] = useState(extras.salesTax?.rate ?? '20');

  const value = toNumber(amount);
  const percent = toNumber(rate);
  const net = mode === 'add' ? value : value / (1 + percent / 100);
  const tax = mode === 'add' ? (value * percent) / 100 : value - net;
  const gross = net + tax;

  return (
    <>
      <Segmented ariaLabel={t('Tax mode')} value={mode} onChange={setMode}
        options={[{ value: 'add', label: t('Add tax to a net price') }, { value: 'remove', label: t('Remove tax from a gross price') }]} />
      <Grid className="mt-5 md:grid-cols-3">
        <LabelledField label={mode === 'add' ? t('Net amount (before tax)') : t('Gross amount (including tax)')} id="tax-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label={t('Tax rate (%)')} id="tax-rate" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        {picker}
      </Grid>
      {extras.salesTax?.presets && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">{t('Common rates')}</span>
          <Segmented ariaLabel={t('Common rates')} value={String(rate)} onChange={setRate}
            options={extras.salesTax.presets.map((preset) => ({ value: String(preset), label: `${num(preset, 1)}%` }))} />
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label={t('Net (excluding tax)')} value={money(net, currency)} accent="cyan" />
        <Result label={t('Tax amount')} value={money(tax, currency)} accent="indigo" />
        <Result label={t('Gross (including tax)')} value={money(gross, currency)} />
      </div>
      {mode === 'remove' && (
        <p className="mt-4 text-sm text-slate-500">
          {t('Removing {percent}% tax means dividing by {divisor} — a reduction of {reduction}%, not {percent}%.', {
            percent: num(percent, 2),
            divisor: num(1 + percent / 100, 4),
            reduction: num((1 - 1 / (1 + percent / 100)) * 100, 2),
          })}
        </p>
      )}
    </>
  );
}

/* -------------------------------------------------------- Margin & markup */
export function MarginMarkupCalculator() {
  const t = useT();
  const extras = useExtras();
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
        <LabelledField label={t('Unit cost')} id="mm-cost" type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
        <LabelledField label={t('Selling price')} id="mm-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        {picker}
      </Grid>
      <div className={`mt-6 grid gap-4 ${extras.marginCoefficient ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <Result label={t('Gross profit')} value={money(profit, currency)} />
        <Result label={t('Profit margin')} value={`${num(margin, 2)}%`} accent="cyan" />
        <Result label={t('Markup')} value={`${num(markup, 2)}%`} accent="indigo" />
        {extras.marginCoefficient && <Result label={t('Multiplier coefficient')} value={c ? `× ${num(p / c, 3)}` : '—'} accent="cyan" />}
      </div>
      <Panel title={t('Price for a target margin')}>
        <Grid className="md:grid-cols-2">
          <LabelledField label={t('Target margin (%)')} id="mm-target" type="number" min="0" max="99" step="0.1" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} />
          <div>
            <Label>{t('Required selling price')}</Label>
            <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xl font-bold text-emerald-300">
              {requiredPrice === null ? t('Margin must be under 100%') : money(requiredPrice, currency)}
            </div>
          </div>
        </Grid>
        <p className="mt-4 text-sm text-slate-500">{t('cost ÷ (1 − margin ÷ 100). Adding the margin percentage to cost gives a markup, not a margin — a common and expensive mix-up.')}</p>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------- ROI */
export function RoiCalculator() {
  const t = useT();
  const [currency, picker] = useCurrency();
  const [invested, setInvested] = useState('10000');
  const [returned, setReturned] = useState('16000');
  const [years, setYears] = useState('4');

  const i = toNumber(invested);
  const r = toNumber(returned);
  const gain = r - i;
  const roi = i ? (gain / i) * 100 : 0;
  const period = toNumber(years);
  const annualised = i > 0 && r > 0 && period > 0 ? ((r / i) ** (1 / period) - 1) * 100 : null;

  return (
    <>
      <Grid className="md:grid-cols-4">
        <LabelledField label={t('Amount invested')} hint={t('include fees')} id="roi-in" type="number" min="0" value={invested} onChange={(e) => setInvested(e.target.value)} />
        <LabelledField label={t('Amount returned')} id="roi-out" type="number" min="0" value={returned} onChange={(e) => setReturned(e.target.value)} />
        <LabelledField label={t('Holding period (years)')} id="roi-years" type="number" min="0.1" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Result label={t('Net gain')} value={money(gain, currency)} accent={gain >= 0 ? 'emerald' : 'indigo'} />
        <Result label={t('Total ROI')} value={`${num(roi, 2)}%`} accent="cyan" />
        <Result label={t('Annualised ROI')} value={annualised === null ? '—' : `${num(annualised, 2)}%`} accent="indigo" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{t('Annualised ROI is what makes investments of different lengths comparable. ROI says nothing about risk.')}</p>
    </>
  );
}

/* ------------------------------------------------------------ Break-even */
export function BreakEvenCalculator() {
  const t = useT();
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
        <LabelledField label={t('Fixed costs per period')} id="be-fixed" type="number" min="0" value={fixed} onChange={(e) => setFixed(e.target.value)} />
        <LabelledField label={t('Price per unit')} id="be-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        <LabelledField label={t('Variable cost per unit')} id="be-var" type="number" min="0" step="0.01" value={variable} onChange={(e) => setVariable(e.target.value)} />
        {picker}
      </Grid>
      {contribution > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Result label={t('Break-even units')} value={num(Math.ceil(units), 0)} />
            <Result label={t('Break-even revenue')} value={money(Math.ceil(units) * toNumber(price), currency)} accent="cyan" />
            <Result label={t('Contribution per unit')} value={money(contribution, currency)} accent="indigo" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {t('Each sale contributes {pct}% of its price toward fixed costs. Selling {units} units per period covers them exactly.', { pct: num(marginRatio, 1), units: num(Math.ceil(units), 0) })}
          </p>
        </>
      ) : (
        <ErrorNote>{t('The price must exceed the variable cost, otherwise every extra unit sold increases the loss and there is no break-even point.')}</ErrorNote>
      )}
    </>
  );
}

/* ---------------------------------------------------------- Savings goal */
export function SavingsGoalCalculator() {
  const t = useT();
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
        <LabelledField label={t('Savings goal')} id="sg-goal" type="number" min="0" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <LabelledField label={t('Already saved')} id="sg-saved" type="number" min="0" value={saved} onChange={(e) => setSaved(e.target.value)} />
        {picker}
        <LabelledField label={t('Months to save')} id="sg-months" type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} />
        <LabelledField label={t('Annual interest rate (%)')} id="sg-rate" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      </Grid>
      {result ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Result label={t('Save each month')} value={money(result.monthly, currency)} />
          <Result label={t('Interest earned')} value={money(Math.max(0, result.interest), currency)} accent="cyan" />
          <Result label={t('Weekly equivalent')} value={money((result.monthly * 12) / 52, currency)} accent="indigo" />
        </div>
      ) : <ErrorNote>{t('Set a goal larger than the amount already saved, over at least one month.')}</ErrorNote>}
    </>
  );
}

/* -------------------------------------------------------- Salary ↔ hourly */
export function SalaryToHourlyCalculator() {
  const t = useT();
  const extras = useExtras();
  const [currency, picker] = useCurrency();
  // Markets that quote pay monthly (Brazil, France, Germany) start in that
  // mode, with their statutory week: 44 h under the CLT, 35 h in France.
  const [mode, setMode] = useState(extras.salary?.mode ?? 'annual');
  const [amount, setAmount] = useState(extras.salary?.amount ?? '60000');
  const [hours, setHours] = useState(extras.salary?.hours ?? '40');
  const [weeks, setWeeks] = useState('52');

  const totalHours = toNumber(hours) * toNumber(weeks);
  const annual = mode === 'annual' ? toNumber(amount) : mode === 'monthly' ? toNumber(amount) * 12 : toNumber(amount) * totalHours;
  const hourly = totalHours ? annual / totalHours : 0;
  const amountLabel = mode === 'annual' ? t('Annual salary') : mode === 'monthly' ? t('Monthly salary') : t('Hourly rate');

  return (
    <>
      <Segmented ariaLabel={t('Conversion direction')} value={mode} onChange={setMode}
        options={[
          { value: 'annual', label: t('From annual salary') },
          { value: 'monthly', label: t('From monthly salary') },
          { value: 'hourly', label: t('From hourly rate') },
        ]} />
      <Grid className="mt-5 md:grid-cols-4">
        <LabelledField label={amountLabel} id="s2h-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label={t('Hours per week')} id="s2h-hours" type="number" min="1" max="168" value={hours} onChange={(e) => setHours(e.target.value)} />
        <LabelledField label={t('Paid weeks per year')} hint={t('52 salaried, ~46 contract')} id="s2h-weeks" type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
        {picker}
      </Grid>
      <StatGrid columns="md:grid-cols-5">
        <Stat label={t('Hourly')} value={money(hourly, currency)} accent="emerald" />
        <Stat label={t('Daily')} value={money(hourly * (toNumber(hours) / 5), currency)} />
        <Stat label={t('Weekly')} value={money(hourly * toNumber(hours), currency)} accent="cyan" />
        <Stat label={t('Monthly')} value={money(annual / 12, currency)} />
        <Stat label={t('Annual')} value={money(annual, currency)} accent="emerald" />
      </StatGrid>
      <p className="mt-4 text-sm text-slate-500">{t('All figures are gross, before income tax and deductions.')}</p>
    </>
  );
}

/* ------------------------------------------------------------- Inflation */
export function InflationCalculator() {
  const t = useT();
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
        <LabelledField label={t('Amount today')} id="inf-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <LabelledField label={t('Annual inflation (%)')} id="inf-rate" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <LabelledField label={t('Years ahead')} id="inf-years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
        {picker}
      </Grid>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Result label={t('Buying power in {years} years', { years })} value={money(erodedValue, currency)} note={t("Today's {amount} will buy this much", { amount: money(toNumber(amount), currency) })} accent="cyan" />
        <Result label={t('Equivalent future amount needed')} value={money(futureNeeded, currency)} note={t("To match today's purchasing power")} />
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Purchasing power lost')} value={`${num((1 - 1 / factor) * 100, 1)}%`} />
        <Stat label={t('Prices multiply by')} value={`${num(factor, 2)}×`} accent="cyan" />
        <Stat label={t('Value halves in')} value={halvingYears ? t('{n} years', { n: num(halvingYears, 0) }) : '—'} accent="indigo" />
      </StatGrid>
    </>
  );
}
