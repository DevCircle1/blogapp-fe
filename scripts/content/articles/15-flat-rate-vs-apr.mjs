export default {
  slug: 'flat-rate-vs-apr',
  title: 'Flat Rate vs APR: Why a Low Flat Rate Can Cost Almost Double',
  category: 'finance',
  theme: 'finance',
  tags: ['flat rate vs apr', 'flat interest rate', 'apr', 'car finance', 'personal loan interest', 'loan comparison'],
  description: 'A 10% flat rate loan over three years is really about 17.9% APR. See how flat rates work, why they mislead, and how to convert a flat rate to APR before you sign.',
  cover: {
    kicker: 'Same loan, two very different numbers',
    visual: {
      type: 'bars',
      title: '10,000 over 3 years',
      items: [
        { label: 'Flat rate', value: 10, display: '10%' },
        { label: 'True APR', value: 17.9, display: '17.9%', highlight: true },
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Flat rate vs the APR you actually pay',
    subtitle: 'Loan of 10,000 repaid in equal monthly instalments. APR shown as the nominal annual rate on the reducing balance.',
    columns: ['Flat rate', 'Term', 'Monthly payment', 'Total interest', 'Equivalent APR'],
    widths: [180, 150, 250, 230, 246],
    rows: [
      ['5%', '2 years', '458.33', '1,000', '≈ 9.3%'],
      ['6%', '5 years', '216.67', '3,000', '≈ 10.9%'],
      ['8%', '5 years', '233.33', '4,000', '≈ 14.1%'],
      ['10%', '3 years', '361.11', '3,000', '≈ 17.9%'],
    ],
    alt: 'Table converting flat interest rates on a 10,000 loan into the equivalent APR, with monthly payments and total interest',
    caption: 'The longer the term, the further the true rate climbs above the flat rate, approaching double.',
    footer: 'Compare loans: talkandtool.com/tools/loan-calculator',
  },
  html: `
<p>A flat rate charges interest on the original loan amount for the whole term, even as you repay it. APR charges interest only on what you still owe. That makes a flat rate look roughly half as expensive as it really is: a 10% flat rate over three years works out to about 17.9% APR. Here is how the two differ and how to compare them.</p>

<h2>How a flat rate works</h2>
<p>With a flat rate, interest is calculated once, up front, on the full amount borrowed:</p>
<p><strong>Total interest = loan amount × flat rate × years</strong></p>
<p>Borrow 10,000 at a 10% flat rate for 3 years: 10,000 × 10% × 3 = <strong>3,000 interest</strong>. Add it to the loan and split the total evenly: 13,000 ÷ 36 = <strong>361.11 a month</strong>.</p>
<p>The catch: by the last year you owe only about a third of the original amount, but you are still paying interest as if you owed the full 10,000.</p>

<h2>How APR works</h2>
<p>APR (annual percentage rate) is based on the reducing balance. Each month, interest is charged only on what is still outstanding, so the interest part of each payment falls over time as the balance shrinks. APR also has to include compulsory fees, which is why it is the number regulators make lenders show.</p>
<p>To find the APR of a flat-rate loan, you ask what reducing-balance rate would produce the same 361.11 monthly payment on 10,000 over 36 months. The answer is about <strong>17.9%</strong>, almost double the advertised 10%.</p>

{{infographic}}

<h2>Why the gap grows with the term</h2>
<p>On a reducing-balance loan, your average balance over the term is a bit more than half the original amount. A flat rate charges interest on the full amount throughout, so you pay interest on roughly twice the money you actually have on average. The longer the loan runs, the closer the true rate gets to double the flat rate.</p>
<p>A rough rule of thumb: <strong>APR ≈ flat rate × 2n ÷ (n + 1)</strong>, where n is the number of monthly payments. For 10% over 36 months, that gives 10 × 72 ÷ 37 ≈ 19.5%. It slightly overstates the exact figure of 17.9%, but it is enough to see instantly that a flat rate is not comparable to an APR.</p>

<h2>Where flat rates still appear</h2>
<ul>
<li>Car and motorbike finance, including hire purchase deals in several countries.</li>
<li>Personal and consumer loans in many Asian and Middle Eastern markets.</li>
<li>Store finance for furniture, electronics and appliances.</li>
<li>Some microfinance and informal lending.</li>
</ul>
<p>In many jurisdictions, lenders must show the APR too, but the flat rate is often the bigger number in the advert. If a quote shows only a flat rate, ask for the APR, or work it out yourself.</p>

<h2>How to compare two loan offers properly</h2>
<ol>
<li><strong>Get the APR for each.</strong> This is the only rate that is comparable across lenders and loan types.</li>
<li><strong>Compare the total amount repayable.</strong> Monthly payment × number of payments, plus any upfront fees. This is the real cost in money.</li>
<li><strong>Check early repayment terms.</strong> On a flat-rate loan, the interest is fixed at the start, and some lenders keep much of it even if you repay early. With a reducing-balance loan, paying early cuts interest directly.</li>
<li><strong>Run both through a calculator.</strong> The <a href="/tools/loan-calculator">loan calculator</a> shows the monthly payment, total interest and schedule for a reducing-balance loan at any APR, so you can check a lender's numbers.</li>
</ol>
<p>Example: Lender A offers 10,000 at 7% flat over 3 years. Lender B offers 12.5% APR over 3 years. The flat rate looks far cheaper, but 7% flat over 36 months is about 12.8% APR. Lender B is slightly cheaper.</p>

<h2>APR vs interest rate vs flat rate</h2>
<p>These three get mixed up constantly:</p>
<ul>
<li><strong>Flat rate:</strong> interest on the original amount for the whole term. It understates the cost.</li>
<li><strong>Interest rate (nominal):</strong> interest on the reducing balance, before fees.</li>
<li><strong>APR:</strong> interest on the reducing balance, including compulsory fees. It is the best single comparison figure.</li>
</ul>
<p>We explain the difference between the last two, including how APR can end up lower than the headline rate, in <a href="/blogs/article/apr-vs-interest-rate-true-cost-of-a-loan">APR vs interest rate: how to tell which loan is cheaper</a>. For simple interest on savings or short-term debts, the <a href="/tools/simple-interest-calculator">simple interest calculator</a> covers the flat calculation.</p>

<h2>Frequently asked questions</h2>
<h3>Is a flat rate or APR better for the borrower?</h3>
<p>Neither is better in itself. They are two ways of describing cost. But a flat rate always looks lower than the equivalent APR, so for comparisons, always use APR.</p>
<h3>How do I convert a flat rate to APR?</h3>
<p>Exactly: find the reducing-balance rate that produces the same monthly payment, which calculators and spreadsheets do with the RATE function. As an estimate: flat rate × 2n ÷ (n + 1), where n is the number of monthly payments.</p>
<h3>Why is the APR on my car loan so much higher than the rate I was quoted?</h3>
<p>You were probably quoted a flat rate. It may also include fees such as documentation or option-to-purchase charges, which APR must count.</p>
`,
};
