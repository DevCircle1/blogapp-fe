export default {
  slug: 'how-to-simplify-a-ratio',
  title: 'How to Simplify a Ratio: Step-by-Step With Examples',
  category: 'math',
  theme: 'math',
  tags: ['simplify ratio', 'ratio calculator', 'ratio simplifier', 'greatest common divisor', 'equivalent ratios', 'aspect ratio'],
  description: 'Simplify a ratio by dividing every part by the greatest common divisor. Worked examples with decimals, fractions, mixed units, three-part ratios and aspect ratios.',
  cover: {
    kicker: 'Divide every part by the greatest common divisor',
    visual: { type: 'formula', title: 'SIMPLIFY', lines: ['24 : 36', '÷ 12   (GCD)', '= 2 : 3'] },
  },
  infographic: {
    type: 'steps',
    title: 'Simplifying any ratio in four steps',
    subtitle: 'Works for two-part and three-part ratios alike.',
    items: [
      ['Put both parts in the same unit', '50 cm : 2 m becomes 50 cm : 200 cm.'],
      ['Clear decimals and fractions', 'Multiply every part by the same number until all are whole: 0.75 : 2 × 4 = 3 : 8.'],
      ['Find the greatest common divisor', 'The largest whole number that divides every part exactly. For 24 and 36 it is 12.'],
      ['Divide every part by it', '24 ÷ 12 : 36 ÷ 12 = 2 : 3. If the only common divisor is 1, you are done.'],
    ],
    alt: 'Four steps to simplify a ratio: match units, clear decimals and fractions, find the greatest common divisor, and divide each part by it',
    caption: 'A simplified ratio has whole numbers with no common factor other than 1.',
    footer: 'Simplify or scale any ratio: talkandtool.com/tools/ratio-calculator',
  },
  html: `
<p>To simplify a ratio, divide every part by their greatest common divisor (GCD), the largest number that divides all of them exactly. For 24 : 36 the GCD is 12, so the ratio simplifies to 2 : 3. If the ratio contains decimals, fractions or different units, convert it to whole numbers in the same unit first. Here are the steps with an example for each case.</p>

<h2>The method in brief</h2>

{{infographic}}

<h2>Example 1: whole numbers</h2>
<p><strong>Simplify 24 : 36.</strong> Factors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24. Factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18 and 36. The largest shared factor is 12. 24 ÷ 12 = 2 and 36 ÷ 12 = 3, giving <strong>2 : 3</strong>.</p>
<p>You do not have to find the GCD in one go. Dividing by any common factor repeatedly gets you there: 24 : 36 → (÷2) 12 : 18 → (÷2) 6 : 9 → (÷3) 2 : 3. Stop when no number other than 1 divides both.</p>

<h2>Example 2: large numbers, using Euclid's method</h2>
<p>Listing factors of large numbers is slow. Euclid's algorithm finds the GCD quickly: divide the larger number by the smaller, keep the remainder, and repeat until the remainder is 0. The last non-zero remainder is the GCD.</p>
<p><strong>Simplify 1071 : 462.</strong></p>
<ul>
<li>1071 ÷ 462 = 2 remainder 147</li>
<li>462 ÷ 147 = 3 remainder 21</li>
<li>147 ÷ 21 = 7 remainder 0, so the GCD is <strong>21</strong></li>
</ul>
<p>1071 ÷ 21 = 51 and 462 ÷ 21 = 22, giving <strong>51 : 22</strong>.</p>

<h2>Example 3: decimals</h2>
<p><strong>Simplify 0.75 : 2.</strong> Multiply both parts by 100 to get 75 : 200, then divide by the GCD of 25 to get <strong>3 : 8</strong>. Multiplying by 4 gets there directly, since 0.75 × 4 = 3.</p>
<p>Multiply by 10 for one decimal place, 100 for two, and so on, using the part with the most decimal places.</p>

<h2>Example 4: fractions and mixed numbers</h2>
<p><strong>Simplify 1½ : 2¼.</strong> Convert to improper fractions: 3/2 : 9/4. Multiply both by the lowest common denominator, 4, to get 6 : 9. Divide by 3 to get <strong>2 : 3</strong>.</p>
<p>The <a href="/tools/fraction-calculator">fraction calculator</a> helps if the fractions are awkward.</p>

<h2>Example 5: different units</h2>
<p><strong>Simplify 50 cm : 2 m.</strong> Convert to the same unit: 50 cm : 200 cm. Divide by 50 to get <strong>1 : 4</strong>. A ratio has no units once simplified, but only if both parts were in the same unit to begin with. Forgetting this gives 50 : 2 = 25 : 1, which is wrong by a factor of 100. The <a href="/tools/unit-converter">unit converter</a> handles the conversion step.</p>

<h2>Example 6: three-part ratios</h2>
<p><strong>Simplify 12 : 18 : 30.</strong> Find the GCD of all three, which is 6, and divide each part: <strong>2 : 3 : 5</strong>. The divisor must go into every part. If one part is not divisible, it is not a common divisor.</p>

<h2>Using a simplified ratio</h2>
<h3>Splitting an amount</h3>
<p>To split 1,500 in the ratio 2 : 3, add the parts (5), divide the amount by the total (1,500 ÷ 5 = 300 per part), then multiply: 2 × 300 = <strong>600</strong> and 3 × 300 = <strong>900</strong>. The same ratio as percentages is 40% : 60%. The <a href="/tools/percentage-calculator">percentage calculator</a> covers the conversion.</p>
<h3>Scaling up and finding a missing value</h3>
<p>Equivalent ratios let you scale a recipe or solve a proportion. If a mix is 2 : 3 and you have 14 units of the first ingredient, you need 14 × 3 ÷ 2 = <strong>21</strong> of the second. This is the classic "rule of three".</p>
<h3>Aspect ratios</h3>
<p>1920 × 1080 has a GCD of 120, which gives <strong>16 : 9</strong>. To find the height of a 16 : 9 image 1280 pixels wide: 1280 × 9 ÷ 16 = <strong>720</strong>. Some screen sizes do not simplify neatly. 1366 × 768 reduces to 683 : 384 and is marketed as "about 16 : 9".</p>

<p>For any of these, the <a href="/tools/ratio-calculator">ratio calculator</a> simplifies, scales and solves for a missing value in one place. Ratios and percentages together cover most everyday maths. Our <a href="/blogs/article/everyday-calculator-guide-percentages-ratios-conversions">everyday calculator guide</a> walks through the rest.</p>

<h2>Frequently asked questions</h2>
<h3>How do you know a ratio is fully simplified?</h3>
<p>When all parts are whole numbers and their only common divisor is 1. For example, 2 : 3 and 51 : 22 are fully simplified, while 6 : 9 is not.</p>
<h3>Can a simplified ratio contain decimals?</h3>
<p>By convention, no. Multiply through to whole numbers first. The exception is the "1 : n" form, such as 1 : 2.5, which is sometimes used deliberately for comparisons and map scales.</p>
<h3>Does the order of a ratio matter?</h3>
<p>Yes. 2 : 3 and 3 : 2 are different ratios. Keep the parts in the order the question gives them.</p>
`,
};
