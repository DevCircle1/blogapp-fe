export default {
  slug: 'how-to-calculate-percentage-increase-decrease',
  title: 'How to Calculate Percentage Increase and Decrease (With Examples)',
  category: 'math',
  theme: 'math',
  tags: ['percentage increase', 'percentage decrease', 'percent change formula', 'how to calculate percentage change', 'percentage difference', 'reverse percentage'],
  description: 'The percentage change formula with worked examples for increases and decreases, why +50% then −50% does not return to the start, and how to reverse a percentage.',
  cover: {
    kicker: 'New minus old, over old',
    visual: { type: 'formula', title: 'PERCENT CHANGE', lines: ['(new − old) ÷ old × 100', '(120 − 80) ÷ 80 × 100', '= +50%', '(80 − 120) ÷ 120 × 100', '= −33.3%'] },
  },
  infographic: {
    type: 'steps',
    title: 'Calculating a percentage change',
    subtitle: 'The same four steps work for increases and decreases.',
    items: [
      ['Subtract the old value from the new', 'New − old. A positive result is an increase and a negative result is a decrease.'],
      ['Divide by the OLD value', 'The original is always the base. Dividing by the new value is the most common mistake.'],
      ['Multiply by 100', 'This turns the decimal into a percentage.'],
      ['Read the sign', 'Positive means it went up, negative means it went down. Say which in words.'],
    ],
    alt: 'Four steps for calculating a percentage increase or decrease: subtract, divide by the old value, multiply by 100, read the sign',
    caption: 'Going from 80 to 120 is +50%; going back from 120 to 80 is only −33.3%.',
    footer: 'Check your sums: talkandtool.com/tools/percentage-calculator',
  },
  html: `
<p>A percentage change compares a new value with an old one and expresses the difference as a share of the old value. The formula is the same whether the number went up or down: subtract the old value from the new, divide by the old value, and multiply by 100. A positive answer is an increase and a negative answer is a decrease. Below are the formula, worked examples and the traps that catch people out.</p>

<h2>The formula</h2>
<p><strong>Percentage change = (new − old) ÷ old × 100</strong></p>
<p>Always divide by the <em>old</em> value, the one you are starting from. The old value is the baseline that the change is measured against.</p>

<h2>Percentage increase: worked example</h2>
<p>A subscription goes from 80 to 120 a month.</p>
<ol>
<li>New − old = 120 − 80 = 40</li>
<li>40 ÷ 80 = 0.5</li>
<li>0.5 × 100 = <strong>50% increase</strong></li>
</ol>

<h2>Percentage decrease: worked example</h2>
<p>A price drops from 120 to 80.</p>
<ol>
<li>New − old = 80 − 120 = −40</li>
<li>−40 ÷ 120 = −0.3333</li>
<li>−0.3333 × 100 = <strong>33.3% decrease</strong></li>
</ol>
<p>Notice that the same 40-unit gap is a 50% increase going up and a 33.3% decrease going down. The change is the same size in absolute terms, but the base is different each time. That is the single most important thing to understand about percentages.</p>

{{infographic}}

<h2>Finding the new value from a percentage</h2>
<p>To apply a percentage change to a number, turn it into a multiplier.</p>
<ul>
<li><strong>Increase by p%:</strong> multiply by (1 + p ÷ 100). A 15% increase on 200 is 200 × 1.15 = 230.</li>
<li><strong>Decrease by p%:</strong> multiply by (1 − p ÷ 100). A 15% decrease on 200 is 200 × 0.85 = 170.</li>
</ul>
<p>This is faster than working out the percentage and adding or subtracting it, and it makes a series of changes easy to chain.</p>

<h2>Why +50% then −50% does not get you back</h2>
<p>Start with 100. Add 50% and you have 150. Take away 50% of that and you have 75, not 100. The second percentage applies to a larger base, so it removes more. To undo a 50% increase you need a 33.3% decrease; to undo a 50% decrease you need a 100% increase. The general rule: to reverse an increase of p%, decrease by p ÷ (100 + p) × 100%.</p>
<p>The same effect hits investments. A fund that falls 40% needs to rise by 66.7% just to break even, which is why avoiding large losses matters more than the arithmetic suggests.</p>

<h2>Reverse percentage: finding the original</h2>
<p>If you know the final value and the percentage change, divide by the multiplier. A coat costs 68 after a 15% discount. The multiplier is 0.85, so the original price was 68 ÷ 0.85 = 80. A common mistake is to add 15% to 68, which gives 78.2 and the wrong answer, because the 15% was taken from the original, not from the sale price.</p>

<h2>Percentage change vs percentage points</h2>
<p>These are not the same. If an interest rate rises from 4% to 6%, it has gone up by <strong>2 percentage points</strong>, but it has increased by <strong>50%</strong> in relative terms (2 ÷ 4). News stories and reports often blur the two, so when you read "rose by 2%" ask which is meant. Use "points" for the difference between two percentages and "percent" for relative change.</p>

<h2>Percentage difference is a different thing</h2>
<p>When neither value is the "old" one, as when comparing two products, use the percentage <em>difference</em>, which divides by the average of the two: |a − b| ÷ ((a + b) ÷ 2) × 100. For 80 and 120 that is 40 ÷ 100 × 100 = 40%. It gives the same answer in either direction, unlike percentage change.</p>

<h2>Where this comes up</h2>
<ul>
<li><strong>Pricing:</strong> discounts, mark-ups and margins. See <a href="/blogs/article/markup-vs-margin">markup vs margin</a> for how the choice of base changes the percentage.</li>
<li><strong>Search data:</strong> a click-through rate or impressions change between two periods is a percentage change, as covered in <a href="/blogs/article/good-ctr-google-search-console">what a good CTR is</a>.</li>
<li><strong>Loans:</strong> an interest rate change is often quoted in points; see the <a href="/blogs/article/loan-monthly-payment-formula">loan payment formula</a>.</li>
</ul>
<p>The <a href="/tools/percentage-calculator">percentage calculator</a> handles percentage change, percent of a number and reverse percentages directly.</p>

<h2>Frequently asked questions</h2>
<h3>What if the old value is zero?</h3>
<p>The percentage change is undefined, since you cannot divide by zero. Report the absolute change instead, or say the value "went from zero to" the new number.</p>
<h3>Can a percentage increase be more than 100%?</h3>
<p>Yes. Going from 20 to 70 is a 250% increase. A decrease, however, cannot exceed 100%, since a quantity cannot fall below zero.</p>
<h3>How do I calculate a percentage increase in Excel?</h3>
<p>If the old value is in A2 and the new value in B2, use <code>=(B2-A2)/A2</code> and format the cell as a percentage.</p>
<h3>How do I calculate a percentage of a number?</h3>
<p>Multiply the number by the percentage divided by 100. 35% of 240 is 240 × 0.35 = 84.</p>
`,
};
