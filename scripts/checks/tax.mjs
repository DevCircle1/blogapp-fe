/** Run: node scripts/checks/tax.mjs — checks the slab data and the calculation. */
import { TAX_YEARS } from '../../src/data/pkTaxYears.js';
import { compareYears, computeTax, grossForNet } from '../../src/lib/tax/compute.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};

// Data integrity: each slab's fixed amount must equal the tax on all lower slabs,
// slabs must be contiguous, and the last must be open-ended.
for (const year of TAX_YEARS) {
  let cumulative = 0;
  year.slabs.forEach((slab, i) => {
    eq(`${year.slug} slab ${i} fixed`, slab.fixed, Math.round(cumulative));
    if (i > 0) eq(`${year.slug} slab ${i} contiguous`, slab.min, year.slabs[i - 1].max);
    if (slab.max != null) cumulative += (slab.max - slab.min) * slab.rate;
  });
  eq(`${year.slug} open ended`, year.slabs.at(-1).max, null);
}
eq('one current year', TAX_YEARS.filter((y) => y.isCurrent).length, 1);

const y27 = TAX_YEARS.find((y) => y.slug === '2026-27');
const y26 = TAX_YEARS.find((y) => y.slug === '2025-26');
const y25 = TAX_YEARS.find((y) => y.slug === '2024-25');

// Hand-computed reference values from the slab tables.
eq('600k is tax free', computeTax(600000, y27).totalTax, 0);
eq('1.2M', computeTax(1200000, y27).totalTax, 6000);
eq('2.2M', computeTax(2200000, y27).totalTax, 116000);
eq('1M salary 26-27', computeTax(1000000, y27).totalTax, 4000);
eq('3M 26-27', computeTax(3000000, y27).totalTax, 116000 + 0.2 * 800000);
eq('1M salary 25-26', computeTax(1000000, y26).totalTax, 4000);
eq('3M 25-26', computeTax(3000000, y26).totalTax, 116000 + 0.23 * 800000);
eq('3M 24-25', computeTax(3000000, y25).totalTax, 180000 + 0.25 * 800000);
eq('8M 26-27', computeTax(8000000, y27).totalTax, 1424000 + 0.35 * 1000000);
eq('12M 25-26 with 9% surcharge', computeTax(12000000, y26).totalTax, Math.round((616000 + 0.35 * 7900000) * 1.09));
eq('12M 24-25 with 10% surcharge', computeTax(12000000, y25).totalTax, Math.round((700000 + 0.35 * 7900000) * 1.1));
eq('12M 26-27 no surcharge', computeTax(12000000, y27).surcharge, 0);
eq('exactly 10M no surcharge', computeTax(10000000, y26).surcharge, 0);

// Breakdown contributions add up to the tax.
for (const income of [500000, 900000, 2500000, 6000000, 9000000, 15000000]) {
  for (const year of TAX_YEARS) {
    const result = computeTax(income, year);
    eq(`breakdown sums ${year.slug} ${income}`, Math.round(result.breakdown.reduce((n, l) => n + l.contribution, 0)), result.tax);
  }
}

// Reverse calculation round-trips.
for (const gross of [800000, 1500000, 4000000, 9000000]) {
  const net = computeTax(gross, y27).annualTakeHome;
  const found = grossForNet(net, y27);
  eq(`gross for net ${gross}`, Math.abs(computeTax(found, y27).annualTakeHome - net) <= 1, true);
}

// Year comparison: at Rs 3M, 2026-27 takes home more than 2025-26.
const cmp = compareYears(3000000, y27, y26);
console.log('3M monthly difference vs 2025-26:', Math.round(cmp.monthlyDifference));
eq('3M better in 26-27', cmp.monthlyDifference > 0, true);

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
