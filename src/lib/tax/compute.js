/**
 * Salaried-individual income tax from a tax year's slab table. Pure and
 * deterministic; all rules come from the year object, so nothing here changes
 * when the law does.
 */

const rupee = (value) => Math.round(value);

/**
 * annualIncome: taxable salary for the year (rupees).
 * → {
 *   tax, surcharge, totalTax, effectiveRate, marginalRate,
 *   monthlyTax, monthlyTakeHome, annualTakeHome,
 *   breakdown: [{ slab, taxableInSlab, contribution }]   // contributions sum to `tax`
 * }
 */
export function computeTax(annualIncome, year) {
  const income = Math.max(0, Number(annualIncome) || 0);
  const breakdown = [];
  let tax = 0;
  let marginalRate = 0;
  for (const slab of year.slabs) {
    if (income <= slab.min) break;
    const upper = slab.max == null ? income : Math.min(income, slab.max);
    const taxableInSlab = upper - slab.min;
    const contribution = taxableInSlab * slab.rate;
    breakdown.push({ slab, taxableInSlab, contribution });
    tax += contribution;
    marginalRate = slab.rate;
  }
  tax = rupee(tax);
  const surchargeRule = year.rules?.surcharge;
  const surcharge = surchargeRule && income > surchargeRule.threshold ? rupee(tax * surchargeRule.rate) : 0;
  const totalTax = tax + surcharge;
  return {
    income,
    tax,
    surcharge,
    totalTax,
    effectiveRate: income ? totalTax / income : 0,
    marginalRate,
    monthlyTax: totalTax / 12,
    monthlyTakeHome: (income - totalTax) / 12,
    annualTakeHome: income - totalTax,
    breakdown,
  };
}

/** The gross annual salary that leaves `annualNet` after tax (bisection; take-home rises with income). */
export function grossForNet(annualNet, year) {
  const target = Math.max(0, Number(annualNet) || 0);
  let low = target;
  let high = Math.max(target * 3, target + 1_000_000);
  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    if (computeTax(mid, year).annualTakeHome < target) low = mid; else high = mid;
  }
  return Math.ceil(high);
}

/** Same salary under two tax years: positive difference means the newer year takes home more. */
export function compareYears(annualIncome, year, previous) {
  const now = computeTax(annualIncome, year);
  const before = computeTax(annualIncome, previous);
  return {
    now,
    before,
    monthlyDifference: now.monthlyTakeHome - before.monthlyTakeHome,
    annualDifference: now.annualTakeHome - before.annualTakeHome,
  };
}

/** 1234567 → "12,34,567": lakh grouping, formatted by hand so server and browser always agree. */
export const groupLakh = (value) => {
  const digits = String(Math.round(Math.abs(value)));
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${value < 0 ? '-' : ''}${rest ? `${rest},` : ''}${last3}`;
};

export const pkr = (value) => `Rs ${groupLakh(value)}`;
export const pctText = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;
