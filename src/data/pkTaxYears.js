/**
 * Pakistan salaried-individual income tax, by tax year. Build-time copy of the
 * `tax_years` table (supabase/tax_years.sql): the prerendered pages use this, and
 * the calculator switches to Supabase rows when they load, so a correction goes
 * live without a deploy.
 *
 * Slab shape: { min, max, rate, fixed } — tax on income in the slab is
 * `fixed + rate × (income − min)`. `fixed` is exactly the tax on all lower slabs;
 * scripts/checks/tax.mjs asserts that, so a typo in a slab cannot pass unnoticed.
 *
 * Every figure below was read from the text of the law on FBR's own site on
 * TAX_VERIFIED_ON:
 *  - 2024-25 and 2025-26: Income Tax Ordinance 2001, First Schedule Part I Division I clause (2),
 *    and section 4AB (surcharge), in FBR's consolidated editions.
 *  - 2026-27: Finance Bill 2026 as published by FBR (First Schedule amendment; section 4AB
 *    proviso). Replace this source with the Finance Act 2026 text once confirmed.
 */
export const TAX_VERIFIED_ON = '2026-09-24';
export const CURRENT_TAX_YEAR = '2026-27';

export const TAX_YEARS = [
  {
    id: 'pk-2026-27',
    slug: '2026-27',
    country: 'Pakistan',
    taxYearName: 'Tax Year 2027',
    label: 'Tax Year 2026-27',
    effectiveFrom: '2026-07-01',
    effectiveTo: '2027-06-30',
    isCurrent: true,
    sourceName: 'Finance Bill 2026 (published by FBR), First Schedule Part I Division I clause (2) and section 4AB',
    sourceUrl: 'https://fbr.gov.pk/Budget2026-27/FinanceBill/Finance-Bill-2026.pdf',
    verifiedOn: TAX_VERIFIED_ON,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0 },
      { min: 600000, max: 1200000, rate: 0.01, fixed: 0 },
      { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000 },
      { min: 2200000, max: 3200000, rate: 0.2, fixed: 116000 },
      { min: 3200000, max: 4100000, rate: 0.25, fixed: 316000 },
      { min: 4100000, max: 5600000, rate: 0.29, fixed: 541000 },
      { min: 5600000, max: 7000000, rate: 0.32, fixed: 976000 },
      { min: 7000000, max: null, rate: 0.35, fixed: 1424000 },
    ],
    rules: { surcharge: null, notes: 'The 9% surcharge on income above Rs 10 million is removed for this tax year.' },
  },
  {
    id: 'pk-2025-26',
    slug: '2025-26',
    country: 'Pakistan',
    taxYearName: 'Tax Year 2026',
    label: 'Tax Year 2025-26',
    effectiveFrom: '2025-07-01',
    effectiveTo: '2026-06-30',
    isCurrent: false,
    sourceName: 'Income Tax Ordinance 2001 (FBR edition amended up to 31 July 2025), First Schedule Part I Division I clause (2) and section 4AB',
    sourceUrl: 'https://download1.fbr.gov.pk/Docs/2025881983148210Income-Tax-Ordinance,-2001-Amended-upto-31.07.2025.pdf',
    verifiedOn: TAX_VERIFIED_ON,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0 },
      { min: 600000, max: 1200000, rate: 0.01, fixed: 0 },
      { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000 },
      { min: 2200000, max: 3200000, rate: 0.23, fixed: 116000 },
      { min: 3200000, max: 4100000, rate: 0.3, fixed: 346000 },
      { min: 4100000, max: null, rate: 0.35, fixed: 616000 },
    ],
    rules: { surcharge: { rate: 0.09, threshold: 10000000 }, notes: 'A 9% surcharge on the income tax applies where taxable income exceeds Rs 10 million (salaried individuals).' },
  },
  {
    id: 'pk-2024-25',
    slug: '2024-25',
    country: 'Pakistan',
    taxYearName: 'Tax Year 2025',
    label: 'Tax Year 2024-25',
    effectiveFrom: '2024-07-01',
    effectiveTo: '2025-06-30',
    isCurrent: false,
    sourceName: 'Income Tax Ordinance 2001 (FBR edition amended up to 30 June 2024), First Schedule Part I Division I clause (2) and section 4AB',
    sourceUrl: 'https://download1.fbr.gov.pk/Docs/2024751675120641IncomeTaxOrdinance,2001-amended-upto30.06.2024.pdf',
    verifiedOn: TAX_VERIFIED_ON,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0 },
      { min: 600000, max: 1200000, rate: 0.05, fixed: 0 },
      { min: 1200000, max: 2200000, rate: 0.15, fixed: 30000 },
      { min: 2200000, max: 3200000, rate: 0.25, fixed: 180000 },
      { min: 3200000, max: 4100000, rate: 0.3, fixed: 430000 },
      { min: 4100000, max: null, rate: 0.35, fixed: 700000 },
    ],
    rules: { surcharge: { rate: 0.1, threshold: 10000000 }, notes: 'A 10% surcharge on the income tax applies where taxable income exceeds Rs 10 million.' },
  },
];

export const yearBySlug = (years, slug) => years.find((year) => year.slug === slug);
export const currentYear = (years) => years.find((year) => year.isCurrent) || years[0];
/** The tax year before `year` in the list, for the year-over-year comparison. */
export const previousYear = (years, year) => {
  const sorted = [...years].sort((a, b) => b.slug.localeCompare(a.slug));
  const index = sorted.findIndex((item) => item.slug === year.slug);
  return index >= 0 ? sorted[index + 1] || null : null;
};
