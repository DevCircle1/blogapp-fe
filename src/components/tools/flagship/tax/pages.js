import {
  CURRENT_TAX_YEAR, TAX_VERIFIED_ON, TAX_YEARS, currentYear, previousYear,
} from '../../../../data/pkTaxYears.js';
import { compareYears, computeTax, pkr } from '../../../../lib/tax/compute.js';

export const TAX_PATH = '/tools/salary-tax-calculator-pakistan';
export const SLABS_PATH = '/tools/income-tax-slabs-pakistan';
export const NET_PATH = '/tools/gross-to-net-salary-pakistan';

const CURRENT = currentYear(TAX_YEARS);
const PREVIOUS = previousYear(TAX_YEARS, CURRENT);
const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const verified = longDate(TAX_VERIFIED_ON);

const RELATED = [
  { to: '/tools/percentage-calculator', label: 'Percentage Calculator', description: 'Work out how a pay rise or cut changes take-home pay.' },
  { to: '/tools/loan-calculator', label: 'Loan & EMI Calculator', description: 'See what a loan repayment takes out of your monthly salary.' },
  { to: '/tools/compound-interest-calculator', label: 'Compound Interest Calculator', description: 'Project what saving part of your take-home pay grows to.' },
];

const SIBLINGS = [
  { to: TAX_PATH, label: `Salary tax calculator ${CURRENT.slug}` },
  ...TAX_YEARS.filter((year) => !year.isCurrent).map((year) => ({ to: `${TAX_PATH}/${year.slug}`, label: `Tax calculator ${year.slug}` })),
  { to: SLABS_PATH, label: 'Income tax slabs Pakistan' },
  { to: NET_PATH, label: 'Gross to net salary calculator' },
];

/** Worked examples computed from the data itself, so they can never disagree with the calculator. */
const examples = (year, previous) => [100000, 200000, 300000, 500000, 1000000].map((monthly) => {
  const result = computeTax(monthly * 12, year);
  const cmp = previous ? compareYears(monthly * 12, year, previous) : null;
  const versus = cmp ? `, ${Math.round(cmp.monthlyDifference) >= 0 ? `${pkr(cmp.monthlyDifference)} more` : `${pkr(-cmp.monthlyDifference)} less`} per month than in ${previous.slug}` : '';
  return `A gross salary of ${pkr(monthly)} a month: ${pkr(result.monthlyTax)} monthly tax (${pkr(result.totalTax)} a year), ${pkr(result.monthlyTakeHome)} take-home${versus}.`;
});

const faqs = (year) => [
  { q: `What is the tax-free salary limit in Pakistan for ${year.slug}?`, a: `The first Rs 600,000 of annual taxable income is taxed at 0%, which is Rs 50,000 a month. That threshold is the same in ${year.slug} as in the two tax years before it, and above it tax starts at ${Math.round(year.slabs[1].rate * 100)}%.` },
  { q: 'How is salary tax calculated in Pakistan?', a: 'Tax is charged on annual taxable income in slabs. Each slab has a fixed amount, which is the tax on all lower slabs, plus a percentage of the income above the slab’s lower limit. Your employer deducts it monthly based on your estimated annual salary. This calculator adds the slabs up one by one and shows each step so you can check it.' },
  { q: `Is there a surcharge in ${year.slug}?`, a: year.rules?.surcharge ? `Yes. A surcharge of ${Math.round(year.rules.surcharge.rate * 100)}% of the income tax applies where taxable income exceeds Rs ${year.rules.surcharge.threshold.toLocaleString('en-US')}.` : 'No. For this tax year no surcharge is payable on salaried income; earlier years had a surcharge on income above Rs 10 million.' },
  { q: 'Does this calculator include allowances, provident fund or EOBI?', a: 'No. It treats the whole gross salary as taxable and covers salaried income only. Exempt allowances, provident fund and EOBI contributions, tax credits and rebates, and other income such as rent or business profit are not modelled, so your payslip can differ. It is not tax advice.' },
  { q: 'Where do the slabs come from?', a: `They are read from the law itself as published by the Federal Board of Revenue: ${year.sourceName}. The verification date and a link to the source are shown next to the slab table (last verified ${verified}).` },
  { q: 'How do I calculate take-home salary from gross?', a: 'Enter your gross monthly salary. Take-home pay is gross salary minus income tax (and any surcharge), divided over twelve months. The gross-to-net page also works backwards, from the take-home you want to the gross salary you would need.' },
];

const HOW_STEPS = [
  'Choose monthly or annual salary and enter your gross figure.',
  'Read your monthly take-home pay, monthly tax, annual tax and effective rate.',
  'Open the slab-by-slab breakdown to see exactly what each slab contributed.',
  'Check the comparison with the previous tax year and download the summary card if you want to share it.',
];

const common = {
  category: 'Finance · Pakistan',
  applicationCategory: 'FinanceApplication',
  related: RELATED,
  siblingsHeading: 'Pakistan tax tools',
};

const mainCopy = (year, previous) => [
  {
    heading: `How the Pakistan salary tax calculator works`,
    paragraphs: [
      `This salary tax calculator for Pakistan applies the ${year.label} income tax slabs for salaried individuals to your gross salary. Salary is taxed on your annual income in slabs: the first Rs 600,000 is tax-free, and above that each band is taxed at a higher rate, with a fixed amount that already covers the tax on all lower bands. The calculator finds the slab your income reaches, adds the tax from each band below it, and shows the result as monthly and annual tax, take-home pay and your effective rate.`,
      'Your employer normally deducts this tax from each month’s pay based on your expected annual salary, so the monthly figure here is the annual tax divided by twelve. Only the rates that apply where salary makes up most of your income are used — that is, salaried individuals rather than business owners.',
    ],
  },
  {
    heading: `What changed for ${year.slug}`,
    paragraphs: [year.rules?.notes || '', previous ? `The table below compares your tax with ${previous.label}: the calculator shows, for any salary, how much more or less you take home each month.` : ''].filter(Boolean),
  },
  { heading: `Examples for ${year.slug}`, paragraphs: ['These figures come straight from the calculator using the slabs on this page:'], list: examples(year, previous) },
  {
    heading: 'What this calculator does not cover',
    list: [
      'Income other than salary, such as rent, business profit, dividends or capital gains.',
      'Exempt allowances and other salary components that are not fully taxable.',
      'Tax credits and rebates, for example for charitable donations or approved pension contributions.',
      'Provident fund, EOBI, social security and other payroll deductions.',
      'Provincial taxes and withholding rates that apply outside salary.',
    ],
  },
];

const salaryPage = () => ({
  ...common,
  path: TAX_PATH,
  toolId: 'salary-tax-calculator-pakistan',
  slug: 'salary-tax-calculator-pakistan',
  yearSlug: CURRENT.slug,
  title: `Salary Tax Calculator Pakistan ${CURRENT_TAX_YEAR} — Take-Home Pay`,
  description: `Calculate monthly take-home pay and income tax under Pakistan’s ${CURRENT_TAX_YEAR} slabs. Slab-by-slab breakdown, verified against FBR law on ${verified}.`,
  h1: `Pakistan Salary Tax Calculator ${CURRENT_TAX_YEAR}`,
  crumb: 'Salary Tax Calculator Pakistan',
  appName: `Pakistan Salary Tax Calculator ${CURRENT_TAX_YEAR}`,
  lead: `This Pakistan salary tax calculator works out your monthly take-home pay and income tax for ${CURRENT.label}, slab by slab, so you can check every rupee. Enter your gross salary; nothing is uploaded, and the slabs are verified against the law published by the Federal Board of Revenue.`,
  sections: mainCopy(CURRENT, PREVIOUS),
  steps: HOW_STEPS,
  faqs: faqs(CURRENT),
  siblings: SIBLINGS.filter((item) => item.to !== TAX_PATH),
  disclaimer: `Covers salaried income only and is not tax advice. Slabs verified on ${verified} against ${CURRENT.sourceName}.`,
});

const yearPage = (year) => {
  const previous = previousYear(TAX_YEARS, year);
  return {
    ...common,
    path: `${TAX_PATH}/${year.slug}`,
    toolId: 'salary-tax-calculator-pakistan',
    slug: `salary-tax-calculator-pakistan/${year.slug}`,
    yearSlug: year.slug,
    pastYear: true,
    title: `Pakistan Tax Calculator ${year.slug} — Salary & Slabs`,
    description: `Calculate salary tax and take-home pay under Pakistan’s ${year.slug} slabs, with a slab-by-slab breakdown. Verified against FBR law on ${verified}.`,
    h1: `Pakistan Salary Tax Calculator ${year.slug}`,
    crumb: `Tax calculator ${year.slug}`,
    parent: { name: 'Salary Tax Calculator Pakistan', path: TAX_PATH },
    appName: `Pakistan Salary Tax Calculator ${year.slug}`,
    lead: `This Pakistan salary tax calculator for ${year.slug} uses the ${year.label} slabs, so you can check what a salary was taxed in that year, or compare it with the current one. For today’s figures use the ${CURRENT_TAX_YEAR} calculator.`,
    sections: mainCopy(year, previous),
    steps: HOW_STEPS,
    faqs: faqs(year),
    siblings: SIBLINGS.filter((item) => item.to !== `${TAX_PATH}/${year.slug}`),
    disclaimer: `Covers salaried income only and is not tax advice. Slabs verified on ${verified} against ${year.sourceName}.`,
  };
};

const slabsPage = () => ({
  ...common,
  path: SLABS_PATH,
  toolId: 'income-tax-slabs-pakistan',
  slug: 'income-tax-slabs-pakistan',
  title: `Income Tax Slabs Pakistan ${CURRENT_TAX_YEAR} — Full Rate Table`,
  description: `Income tax slabs in Pakistan for salaried individuals: ${CURRENT_TAX_YEAR} with 2025-26 and 2024-25 side by side. Sourced from FBR law, verified ${verified}.`,
  h1: `Income Tax Slabs Pakistan ${CURRENT_TAX_YEAR}`,
  crumb: 'Income Tax Slabs Pakistan',
  appName: 'Income Tax Slabs Pakistan',
  lead: `These are the income tax slabs in Pakistan for salaried individuals: the full ${CURRENT_TAX_YEAR} rate table, with 2025-26 and 2024-25 for comparison, each taken from the law as published by the Federal Board of Revenue and dated with when it was checked.`,
  sections: [
    {
      heading: 'How to read the income tax slabs in Pakistan',
      paragraphs: [
        'Each row is a band of annual taxable income. The tax for a band is a fixed amount plus a percentage of the income above the band’s lower limit. The fixed amount is not an extra charge: it is exactly the tax due on all the bands below, which is why you only ever use one row to compute your tax.',
        'The same Rs 600,000 tax-free threshold applies in all three tax years shown. The main differences are how quickly the rates climb and where the top 35% rate begins, and whether a surcharge applies to incomes above Rs 10 million.',
      ],
    },
    {
      heading: 'Where these tax slabs come from',
      paragraphs: ['Every table is read from the wording of the Income Tax Ordinance 2001, First Schedule, Part I, Division I, as amended by that year’s Finance Act, on the Federal Board of Revenue’s own website. The source link and the date it was checked are printed under each table.'],
    },
    { heading: 'Use the slabs', paragraphs: ['To turn a table into a payslip figure, use the salary tax calculator, which shows every slab’s contribution to your tax.'] },
  ],
  steps: ['Find your tax year.', 'Find the row that contains your annual taxable income.', 'Add the fixed amount to the percentage of the income above the row’s lower limit.'],
  faqs: [
    faqs(CURRENT)[0],
    faqs(CURRENT)[2],
    faqs(CURRENT)[4],
    { q: 'What is the highest income tax rate in Pakistan for salaried people?', a: `35%, in every tax year shown. For ${CURRENT_TAX_YEAR} it applies to income above Rs 7,000,000, compared with Rs 4,100,000 in 2025-26.` },
    { q: 'Are these slabs for filers only?', a: 'These are the annual slabs for salaried individuals. Different withholding rates apply to some payments for people who are not on the active taxpayer list, which are outside this table.' },
  ],
  related: [{ to: TAX_PATH, label: 'Salary Tax Calculator', description: 'Apply these slabs to your own salary.' }, ...RELATED.slice(0, 2)],
  siblings: SIBLINGS.filter((item) => item.to !== SLABS_PATH),
  disclaimer: `Slabs verified on ${verified}. Check the linked source before relying on them for a filing.`,
});

const netPage = () => ({
  ...common,
  path: NET_PATH,
  toolId: 'gross-to-net-salary-pakistan',
  slug: 'gross-to-net-salary-pakistan',
  yearSlug: CURRENT.slug,
  title: 'Take-Home Salary Calculator Pakistan — Gross to Net',
  description: `Convert gross salary to take-home pay in Pakistan, or work back from the net you want. ${CURRENT_TAX_YEAR} slabs, verified against FBR law on ${verified}.`,
  h1: 'Gross to Net Salary Calculator Pakistan',
  crumb: 'Gross to Net Salary Pakistan',
  appName: 'Gross to Net Salary Calculator Pakistan',
  lead: `This gross to net salary calculator for Pakistan, also a take-home salary calculator, converts your gross salary to net pay after income tax using the ${CURRENT_TAX_YEAR} slabs, and can also work backwards: enter the take-home you want and it finds the gross salary you would need.`,
  sections: [
    {
      heading: 'How gross to net salary works in Pakistan',
      paragraphs: [
        'Your gross salary is what your contract states before deductions. Your net, or in-hand, salary is what reaches your bank account after income tax, and after other deductions such as provident fund or EOBI if you have them. This calculator handles the income tax step: net = gross − income tax − any surcharge.',
        `Because tax rises with income, going from net to gross is not a simple percentage. The calculator solves it by finding the gross salary whose take-home equals your target under the ${CURRENT_TAX_YEAR} slabs. That answers the question negotiators ask most: what gross salary do I need to ask for to take home a given amount?`,
      ],
    },
    { heading: `Examples for ${CURRENT.slug}`, paragraphs: ['Computed from the slabs used by the calculator:'], list: examples(CURRENT, PREVIOUS) },
    {
      heading: 'What in-hand salary excludes',
      list: ['Provident fund, EOBI and other payroll deductions.', 'Allowances that are exempt or taxed differently.', 'Tax credits and rebates you may claim on your return.', 'Any income other than salary.'],
    },
  ],
  steps: ['Pick Gross → net, or Net → gross.', 'Choose monthly or annual and enter the amount.', 'Read the take-home or the gross salary you need, and open the breakdown to verify it.'],
  faqs: [faqs(CURRENT)[5], faqs(CURRENT)[3], faqs(CURRENT)[1], faqs(CURRENT)[0], faqs(CURRENT)[4]],
  related: [{ to: TAX_PATH, label: 'Salary Tax Calculator', description: 'The full calculator with year comparison.' }, ...RELATED.slice(0, 2)],
  siblings: SIBLINGS.filter((item) => item.to !== NET_PATH),
  disclaimer: `Covers salaried income tax only, not other deductions. Slabs verified on ${verified}. Not tax advice.`,
});

export const TAX_PAGES = [salaryPage(), ...TAX_YEARS.filter((year) => !year.isCurrent).map(yearPage), slabsPage(), netPage()];
