export default {
  slug: 'how-credit-card-interest-is-calculated',
  title: 'How Credit Card Interest Is Calculated (Daily Rate Explained)',
  category: 'finance',
  theme: 'finance',
  tags: ['how credit card interest is calculated', 'average daily balance', 'apr to daily rate', 'credit card grace period', 'credit card interest formula', 'apr vs apy'],
  description: 'Credit card interest is the average daily balance times the daily rate times the days in the cycle. See the formula, a worked example and how a grace period lets you pay none.',
  cover: {
    kicker: 'APR ÷ 365 × your balance, every day',
    visual: { type: 'formula', title: 'ONE BILLING CYCLE', lines: ['APR 22.9% ÷ 365', '= 0.0627% a day', '$2,000 × 0.000627 × 30', '= $37.62 interest'] },
  },
  infographic: {
    type: 'steps',
    title: 'Credit card interest in four steps',
    subtitle: 'Example: $2,000 average daily balance, 22.9% APR, 30-day billing cycle.',
    items: [
      ['Daily rate = APR ÷ 365', '22.9% ÷ 365 = 0.0627% per day, or 0.000627 as a decimal.'],
      ['Average daily balance', 'Add each day’s closing balance, then divide by the days in the cycle. Here: $2,000.'],
      ['Interest = balance × daily rate × days', '2,000 × 0.000627 × 30 = $37.62 for the cycle.'],
      ['Grace period', 'Pay the whole statement balance by the due date and new purchases cost $0 interest.'],
    ],
    alt: 'Four steps showing how credit card interest is calculated from the APR, the average daily balance, the days in the cycle and the grace period',
    caption: 'Check your statement for the exact method; some issuers use 360 days or compound daily.',
    footer: 'See the payoff impact: talkandtool.com/tools/credit-card-payoff-calculator',
  },
  html: `
<p>Credit card interest is calculated by dividing your APR by 365 to get a daily rate, then applying that rate to your balance each day of the billing cycle. For a $2,000 average daily balance at 22.9% APR over 30 days, the interest is 2,000 × (0.229 ÷ 365) × 30 = about $37.60. If you pay your statement balance in full by the due date, you usually pay no interest on purchases at all.</p>

<h2>APR, daily rate and what they mean</h2>
<p>APR is the annual percentage rate your issuer quotes. Most issuers convert it into a daily periodic rate by dividing by 365 (a few use 360). A card with a 22.9% APR charges roughly 0.0627% per day. That looks tiny, but it is applied every day and the unpaid interest can be added to the balance, which is why the true cost grows faster than the headline number suggests.</p>
<p>The APR on a card is not the same as the effective yearly cost. If interest is charged on previous interest, which happens when a balance carries over from month to month, the effective annual rate is higher. A 22.9% APR compounded daily is about 25.7% over a full year. Our guide to <a href="/blogs/article/flat-rate-vs-apr">flat rate vs APR</a> explains why quoted and effective rates diverge.</p>

<h2>The average daily balance method</h2>
<p>Most cards use the average daily balance. The issuer records your balance at the end of each day of the cycle, adds those figures, and divides by the number of days. Purchases raise the balance from the day they post; payments lower it from the day they are credited.</p>
<p><strong>Example.</strong> A 30-day cycle starts with a $1,500 balance. On day 11 you make a $500 purchase, and on day 21 you pay $400.</p>
<ul>
<li>Days 1–10: $1,500 for 10 days = 15,000</li>
<li>Days 11–20: $2,000 for 10 days = 20,000</li>
<li>Days 21–30: $1,600 for 10 days = 16,000</li>
<li>Average daily balance = 51,000 ÷ 30 = <strong>$1,700</strong></li>
</ul>
<p>Interest for the cycle at 22.9% APR is 1,700 × 0.000627 × 30 = $31.98. Paying early in the cycle lowers the average, so it saves a little interest compared with paying on the due date.</p>

{{infographic}}

<h2>The grace period</h2>
<p>A grace period is the time between the end of the billing cycle and the due date, usually at least 21 days, during which new purchases do not accrue interest. You get it only if you paid the previous statement balance in full. If you carry any balance over, interest generally starts on new purchases from the day they post, and you lose the grace period until you have paid the full balance for a cycle or two.</p>
<p>This is the most useful single fact about credit cards: if you pay the entire statement balance every month, the APR does not affect you. If you carry a balance, even a small one, the interest is charged on the whole average daily balance, not just the leftover amount.</p>

<h2>Cash advances and balance transfers</h2>
<p>Cash advances have no grace period, so interest begins on the day of the transaction, often at a higher rate than purchases and with a fee of around 3–5%. Promotional balance transfer rates are separate balances with their own terms. Payments are typically applied first to the minimum due and, above the minimum, to the balance with the highest rate, which is helpful when you hold several balances at different rates.</p>

<h2>How minimum payments are built</h2>
<p>Many issuers set the minimum as the larger of a flat amount (commonly $25–$35) or about 1% of the balance plus that month's interest and fees. Because the minimum falls with the balance, paying only the minimum extends the payoff for many years. A $5,000 balance at 22.9% takes 164 months at a fixed $100 payment and costs more than $11,000 in interest; at $200 it takes 35 months and about $1,860. We walk through those numbers in <a href="/blogs/article/how-to-pay-off-credit-card-debt-fast">how to pay off credit card debt fast</a>.</p>
<p>The <a href="/tools/credit-card-payoff-calculator">credit card payoff calculator</a> models this month by month with the same method, and also shows the payment you need to be debt-free by a chosen date. For a general loan rather than a card, use the <a href="/tools/loan-calculator">loan calculator</a>, and for the maths of interest on interest, see the <a href="/tools/compound-interest-calculator">compound interest calculator</a>.</p>

<h2>How to reduce what you pay</h2>
<ul>
<li>Pay the statement balance in full whenever you can, to keep the grace period.</li>
<li>Pay before the due date, and make mid-cycle payments if you carry a balance, to lower the average daily balance.</li>
<li>Negotiate your APR or move the balance to a lower-rate option.</li>
<li>Avoid cash advances.</li>
<li>Check each statement's "interest charge calculation" box; it lists your APR, balance subject to interest and the dollar amount.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How do I convert APR to a daily rate?</h3>
<p>Divide the APR by 365. A 19.99% APR is 0.0548% a day, or 0.000548 as a decimal.</p>
<h3>Do I pay interest if I pay in full each month?</h3>
<p>Not on purchases, as long as you pay the full statement balance by the due date. Cash advances and some balance transfers still accrue interest.</p>
<h3>Is APR the same as the interest I actually pay?</h3>
<p>Not exactly. The interest you pay depends on your average daily balance and how often it compounds. The APR is a yearly rate that is converted into a daily charge.</p>
<h3>Why is my interest charge different from my calculation?</h3>
<p>Differences come from day-count (360 vs 365), the exact day payments post, fees, and whether interest compounds daily. Compare with the figures in your statement's interest charge calculation.</p>
`,
};
