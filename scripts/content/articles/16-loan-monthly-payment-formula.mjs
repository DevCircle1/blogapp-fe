export default {
  slug: 'loan-monthly-payment-formula',
  title: 'Loan Monthly Payment Formula: How to Calculate EMI by Hand',
  category: 'finance',
  theme: 'finance',
  tags: ['loan payment formula', 'emi formula', 'monthly payment calculator', 'amortization', 'mortgage payment', 'excel pmt'],
  description: 'The monthly loan payment (EMI) formula is M = P × r(1+r)^n ÷ ((1+r)^n − 1). See each step worked through, the Excel PMT version, and how term and rate change the total.',
  cover: {
    kicker: 'EMI, step by step, with Excel’s PMT',
    visual: { type: 'formula', title: 'MONTHLY PAYMENT', lines: ['M = P·r(1+r)^n', '    ÷ ((1+r)^n − 1)', '25,000 · 9% · 60 mo', '= 518.96 / month'] },
  },
  infographic: {
    type: 'steps',
    title: 'Calculating a loan payment by hand',
    subtitle: 'Loan of 25,000 at 9% a year, repaid monthly over 5 years.',
    items: [
      ['Monthly rate r = 0.0075', 'Divide the annual rate by 12: 9% ÷ 12 = 0.75% = 0.0075.'],
      ['Number of payments n = 60', '5 years × 12 months.'],
      ['Growth factor (1 + r)^n ≈ 1.5657', '1.0075 raised to the 60th power. Use a calculator’s x^y key.'],
      ['Plug into the formula', '25,000 × 0.0075 × 1.5657 ÷ (1.5657 − 1) ≈ 518.96 per month.'],
      ['Total cost = 31,137.53', '518.96 × 60, so 6,137.53 of it is interest.'],
    ],
    alt: 'Five-step worked example of the loan EMI formula for 25,000 at 9% over 5 years, giving a monthly payment of 518.96',
    caption: 'In Excel or Google Sheets: =PMT(9%/12, 60, -25000) returns 518.96.',
    footer: 'Skip the maths: talkandtool.com/tools/loan-calculator',
  },
  html: `
<p>The standard formula for a loan's monthly payment (often called EMI, equated monthly instalment) is <strong>M = P × r(1+r)^n ÷ ((1+r)^n − 1)</strong>, where P is the amount borrowed, r is the monthly interest rate, and n is the number of monthly payments. A 25,000 loan at 9% over five years comes to 518.96 a month. Here is how to work it out by hand and in a spreadsheet.</p>

<h2>The formula, explained</h2>
<p><strong>M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)</strong></p>
<ul>
<li><strong>M</strong>: the monthly payment.</li>
<li><strong>P</strong>: the principal, meaning the amount borrowed.</li>
<li><strong>r</strong>: the monthly interest rate as a decimal, which is the annual rate ÷ 12. So 9% a year is 0.09 ÷ 12 = 0.0075.</li>
<li><strong>n</strong>: the number of monthly payments. Five years is 60, and 30 years is 360.</li>
</ul>
<p>The formula comes from requiring that the present value of all n equal payments, discounted at rate r, equals the amount borrowed. That is why every payment is the same, even though the interest inside it shrinks each month.</p>

<h2>Worked example</h2>

{{infographic}}

<p>The two most common mistakes are using the annual rate instead of the monthly rate, and using years instead of months for n. Either one produces a wildly wrong answer, so if your result looks strange, check those first.</p>

<h2>The same thing in Excel or Google Sheets</h2>
<p><code>=PMT(rate, nper, pv)</code> does the formula for you:</p>
<ul>
<li><code>=PMT(9%/12, 60, -25000)</code> returns <strong>518.96</strong></li>
<li><code>=PMT(6%/12, 360, -200000)</code> returns <strong>1,199.10</strong> for a 200,000 mortgage at 6% over 30 years</li>
</ul>
<p>The loan amount is entered as a negative number because, from your point of view, money comes in and payments go out. Leave out the minus sign and the result comes back negative, with the same size. Related functions: <code>IPMT</code> gives the interest part of a specific payment, <code>PPMT</code> the principal part, and <code>NPER</code> how many payments a given budget needs.</p>

<h2>Where each payment goes: amortization</h2>
<p>Early payments are mostly interest. Take the 200,000 mortgage at 6% over 30 years:</p>
<ul>
<li>Month 1 interest: 200,000 × 0.005 = <strong>1,000.00</strong></li>
<li>Month 1 principal: 1,199.10 − 1,000.00 = <strong>199.10</strong></li>
</ul>
<p>Each month the balance falls a little, so the interest falls and more of the same payment goes to principal. The balance falls slowly at first and faster toward the end. The <a href="/tools/loan-calculator">loan calculator</a> and the <a href="/tools/mortgage-calculator">mortgage calculator</a> show the full schedule month by month.</p>

<h2>How rate and term change the total</h2>
<p>Using the 200,000 mortgage:</p>
<ul>
<li><strong>6% over 30 years:</strong> 1,199.10 a month, <strong>431,676</strong> in total.</li>
<li><strong>6% over 15 years:</strong> 1,687.71 a month, <strong>303,788</strong> in total.</li>
<li><strong>6.5% over 30 years:</strong> 1,264.14 a month, 65 more every month for half a percentage point.</li>
</ul>
<p>Halving the term raises the payment by about 41% but cuts total interest from about 231,700 to about 103,800. A longer term makes the monthly payment affordable at the cost of paying far more in total. Whether to overpay a mortgage or invest the difference is its own question. We ran the numbers in <a href="/blogs/article/overpay-mortgage-or-invest">overpay your mortgage or invest?</a></p>

<h2>Special cases</h2>
<ul>
<li><strong>0% interest:</strong> the formula divides by zero, and the payment is simply P ÷ n.</li>
<li><strong>Interest-only loans:</strong> the payment is just P × r, and the principal is due at the end.</li>
<li><strong>Flat-rate loans:</strong> these do not use this formula at all. Interest is charged on the original amount for the whole term, which makes them much more expensive than they look. See <a href="/blogs/article/flat-rate-vs-apr">flat rate vs APR</a>.</li>
<li><strong>Fees:</strong> the formula uses the interest rate only. Arrangement fees raise the real cost, which is what APR captures. See <a href="/blogs/article/apr-vs-interest-rate-true-cost-of-a-loan">APR vs interest rate</a>.</li>
<li><strong>Weekly or fortnightly payments:</strong> use the rate and count per period, such as annual rate ÷ 26 and years × 26 for fortnightly.</li>
</ul>

<h2>Checking a lender's quote</h2>
<p>If a quote's monthly payment is higher than the formula gives for the stated rate, something else is in the payment: insurance, fees rolled into the loan, or a rate that is really a flat rate. Ask for the APR and the total amount repayable, and check that monthly payment × number of payments + upfront fees matches it.</p>

<h2>Frequently asked questions</h2>
<h3>What is EMI?</h3>
<p>Equated monthly instalment: the fixed monthly payment on an amortizing loan, covering both interest and principal. The term is common in India and South Asia. Elsewhere it is simply the monthly payment.</p>
<h3>How do I calculate the monthly payment without a calculator?</h3>
<p>The (1 + r)^n term is hard to do mentally. Use a phone calculator's power key, a spreadsheet's PMT function, or an online loan calculator.</p>
<h3>Why does my payment barely reduce the balance at first?</h3>
<p>Because interest is charged on the full balance, which is largest at the start. As the balance falls, a growing share of each payment goes to principal.</p>
`,
};
