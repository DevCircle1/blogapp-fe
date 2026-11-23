export default {
  slug: 'how-to-find-gcf-and-lcm',
  title: 'How to Find the GCF and LCM (3 Methods With Examples)',
  category: 'math',
  theme: 'math',
  tags: ['how to find gcf', 'how to find lcm', 'greatest common factor', 'least common multiple', 'hcf', 'prime factorization', 'euclidean algorithm'],
  description: 'Find the greatest common factor and least common multiple with listing, prime factorisation and the Euclidean algorithm. Worked examples and how to use them with fractions.',
  cover: {
    kicker: 'Listing, prime factors and the Euclidean algorithm',
    visual: { type: 'formula', title: 'GCF AND LCM OF 12 AND 18', lines: ['12 = 2² × 3', '18 = 2 × 3²', 'GCF = 2 × 3 = 6', 'LCM = 2² × 3² = 36'] },
  },
  infographic: {
    type: 'steps',
    title: 'Finding the GCF and LCM with prime factors',
    subtitle: 'The most reliable method, and the one that scales to three or more numbers.',
    items: [
      ['Break each number into prime factors', '36 = 2 × 2 × 3 × 3 and 48 = 2 × 2 × 2 × 2 × 3, or 36 = 2² × 3² and 48 = 2⁴ × 3.'],
      ['For the GCF, take the lowest power of each shared prime', 'Shared primes are 2 and 3. Lowest powers: 2² and 3. GCF = 4 × 3 = 12.'],
      ['For the LCM, take the highest power of every prime', 'Highest powers: 2⁴ and 3². LCM = 16 × 9 = 144.'],
      ['Check with the product rule', 'For two numbers, GCF × LCM = a × b. Here 12 × 144 = 1,728 = 36 × 48.'],
    ],
    alt: 'Four-step method for finding the greatest common factor and least common multiple using prime factorisation, with 36 and 48 as the example',
    caption: 'GCF × LCM equals the product of the two numbers, which makes a handy check.',
    footer: 'Try your own numbers: talkandtool.com/tools/gcf-lcm-calculator',
  },
  html: `
<p>The greatest common factor (GCF, also called HCF or GCD) is the largest number that divides all your numbers exactly, and the least common multiple (LCM) is the smallest number that all of them divide into. For 12 and 18 the GCF is 6 and the LCM is 36. You can find them by listing factors, by prime factorisation, or with the Euclidean algorithm. Prime factorisation is the most reliable, and the Euclidean algorithm is the fastest for large numbers. All three are explained below with worked examples.</p>

{{infographic}}

<h2>Method 1: list the factors and multiples</h2>
<p>This works well for small numbers. To find the GCF of 24 and 36, list the factors of each:</p>
<ul>
<li>Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24</li>
<li>Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36</li>
</ul>
<p>The largest number in both lists is 12, so the GCF is 12. For the LCM, list the multiples until they meet. Multiples of 24: 24, 48, 72. Multiples of 36: 36, 72. The first match is 72, so the LCM is 72.</p>

<h2>Method 2: prime factorisation</h2>
<p>Write each number as a product of primes. Then use two rules:</p>
<ul>
<li><strong>GCF:</strong> multiply the primes that appear in every number, using the lowest power of each.</li>
<li><strong>LCM:</strong> multiply every prime that appears in any number, using the highest power of each.</li>
</ul>
<p><strong>Example: 24, 36 and 60.</strong></p>
<ul>
<li>24 = 2³ × 3</li>
<li>36 = 2² × 3²</li>
<li>60 = 2² × 3 × 5</li>
</ul>
<p>The primes in all three are 2 and 3, with lowest powers 2² and 3¹, so GCF = 4 × 3 = 12. For the LCM take the highest powers of 2, 3 and 5: 2³ × 3² × 5 = 8 × 9 × 5 = 360. The <a href="/tools/gcf-lcm-calculator">GCF and LCM calculator</a> shows this factorisation for every number you enter.</p>

<h2>Method 3: the Euclidean algorithm</h2>
<p>For big numbers, factorising is slow. The Euclidean algorithm finds the GCF by repeated division: divide the larger number by the smaller, replace the larger with the smaller and the smaller with the remainder, and repeat until the remainder is zero. The last non-zero remainder is the GCF.</p>
<p><strong>Example: GCF of 252 and 105.</strong></p>
<ul>
<li>252 = 2 × 105 + 42</li>
<li>105 = 2 × 42 + 21</li>
<li>42 = 2 × 21 + 0</li>
</ul>
<p>The last non-zero remainder is 21, so the GCF is 21. Then LCM = (252 × 105) ÷ 21 = 26,460 ÷ 21 = 1,260. This relationship, LCM = (a × b) ÷ GCF, only holds for two numbers at a time. For three numbers, find the LCM of the first two and then of that result with the third.</p>

<h2>Using the GCF to simplify fractions</h2>
<p>Divide the top and bottom of a fraction by their GCF. For 42/56, the GCF of 42 and 56 is 14, so the simplified fraction is 3/4. If the GCF is 1, the fraction is already in lowest terms. The same idea is used to simplify ratios, as shown in <a href="/blogs/article/how-to-simplify-a-ratio">how to simplify a ratio</a>, and you can try it with the <a href="/tools/fraction-calculator">fraction calculator</a> and the <a href="/tools/ratio-calculator">ratio calculator</a>.</p>

<h2>Using the LCM to add fractions</h2>
<p>To add fractions with different denominators, convert them to the least common denominator, which is the LCM of the denominators. For 5/6 + 3/8, the LCM of 6 and 8 is 24, so the sum is 20/24 + 9/24 = 29/24, or 1 5/24. Using the LCM instead of simply multiplying the denominators keeps the numbers small and often removes the need to simplify afterwards.</p>

<h2>Word problems</h2>
<p>The LCM answers "when will these coincide?" questions. If one bus arrives every 12 minutes and another every 18 minutes, and both leave together at 8:00, they next leave together after LCM(12, 18) = 36 minutes, at 8:36. The GCF answers "how can I split this into equal groups?" questions. With 48 red and 72 blue counters, the largest number of identical groups is GCF(48, 72) = 24, each containing 2 red and 3 blue.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Mixing up the two.</strong> The GCF is never larger than the smallest number. The LCM is never smaller than the largest.</li>
<li><strong>Using the product as the LCM.</strong> It only works when the numbers share no factor (they are coprime). LCM(6, 8) is 24, not 48.</li>
<li><strong>Taking the wrong powers.</strong> Lowest for the GCF and highest for the LCM.</li>
<li><strong>Forgetting 1.</strong> Two numbers with no shared prime have a GCF of 1.</li>
</ul>
<p>If you are calculating the mean of a group of numbers instead, see <a href="/blogs/article/mean-median-mode-difference">the difference between mean, median and mode</a>.</p>

<h2>Frequently asked questions</h2>
<h3>Are GCF, HCF and GCD the same?</h3>
<p>Yes. They are different names for the same value, used in different countries.</p>
<h3>What is the GCF of two prime numbers?</h3>
<p>It is 1, because they share no factor other than 1. Their LCM is their product.</p>
<h3>What is the LCM of 4 and 6?</h3>
<p>12. The multiples of 4 are 4, 8, 12 and of 6 are 6, 12, so 12 is the first they share.</p>
<h3>Can the GCF equal one of the numbers?</h3>
<p>Yes. If one number divides the other, such as 6 and 18, the GCF is the smaller one (6) and the LCM is the larger (18).</p>
<h3>How many numbers can I enter in the calculator?</h3>
<p>Between two and ten whole numbers of up to 15 digits each in the <a href="/tools/gcf-lcm-calculator">GCF and LCM calculator</a>.</p>
`,
};
