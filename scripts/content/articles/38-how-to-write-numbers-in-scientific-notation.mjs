import { toScientific } from '../../../src/lib/extra/engines.js';

const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const sample = ['4500000', '123.45', '0.0072', '0.00000093', '299792458', '602214076000000000000000'].map((n) => {
  const s = toScientific(n);
  const label = n.length > 12 ? 'Avogadro’s number (602,214,076 × 10¹⁵)' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 8 });
  return [label, s.mantissa + ' × 10' + sup(s.exponent), s.e];
});

export default {
  slug: 'how-to-write-numbers-in-scientific-notation',
  title: 'How to Write Numbers in Scientific Notation (Step by Step)',
  category: 'math',
  theme: 'math',
  tags: ['scientific notation', 'how to convert to scientific notation', 'standard form', 'powers of ten', 'scientific notation examples', 'multiply scientific notation'],
  description: 'Move the decimal until one non-zero digit stays in front, then count the moves for the exponent. Examples for big and small numbers, plus how to add, multiply and divide.',
  cover: {
    kicker: 'Move the decimal, count the jumps',
    visual: { type: 'formula', title: 'SCIENTIFIC NOTATION', lines: ['4,500,000', 'move 6 places left', '4.5 × 10⁶', 'e-notation: 4.5e+6'] },
  },
  infographic: {
    type: 'table',
    title: 'Numbers in scientific notation',
    subtitle: 'Big numbers get a positive exponent and small numbers a negative one.',
    columns: ['Number', 'Scientific notation', 'E-notation'],
    widths: [440, 340, 276],
    rows: sample,
    alt: 'Table of example numbers written in scientific notation and e-notation, including the speed of light and a very small number',
    caption: 'The coefficient is always at least 1 and less than 10.',
    footer: 'Convert any number: talkandtool.com/tools/scientific-notation-converter',
  },
  html: `
<p>To write a number in scientific notation, move the decimal point until one non-zero digit is in front of it, then multiply by 10 raised to the number of places you moved it. 4,500,000 becomes 4.5 × 10⁶ because the decimal moved six places left. A small number like 0.0072 becomes 7.2 × 10⁻³ because it moved three places right, which gives a negative exponent.</p>

<h2>The format</h2>
<p>Scientific notation has the form <strong>a × 10ⁿ</strong>, where:</p>
<ul>
<li><strong>a</strong> (the coefficient or mantissa) is at least 1 and less than 10.</li>
<li><strong>n</strong> (the exponent) is a whole number, positive or negative.</li>
</ul>
<p>It exists so that very large and very small values can be written briefly and compared at a glance. The distance to the sun is about 1.5 × 10⁸ km, and the diameter of a red blood cell is around 7 × 10⁻⁶ m. Writing all the zeros of either would invite mistakes.</p>

<h2>Step by step: large numbers</h2>
<ol>
<li>Find the decimal point. In a whole number it is at the end: 4500000 is 4500000.</li>
<li>Move it left until only one non-zero digit is before it: 4.500000.</li>
<li>Count the places you moved it: 6.</li>
<li>Write the coefficient (dropping trailing zeros) times 10 to that power: <strong>4.5 × 10⁶</strong>.</li>
</ol>
<p>Another: 299,792,458 (the speed of light in m/s) has the decimal moved 8 places, giving 2.99792458 × 10⁸, or about 3.0 × 10⁸ rounded to two significant figures.</p>

<h2>Step by step: small numbers</h2>
<ol>
<li>Move the decimal point right until it sits after the first non-zero digit: 0.0072 becomes 7.2.</li>
<li>Count the moves: 3.</li>
<li>Make the exponent negative, because you moved right: <strong>7.2 × 10⁻³</strong>.</li>
</ol>
<p>A handy rule: <em>big numbers, positive exponent; small numbers, negative exponent</em>. If a number is between 1 and 10 already, the exponent is zero: 6.4 = 6.4 × 10⁰.</p>

{{infographic}}

<h2>Converting back to standard form</h2>
<p>Do the reverse: a positive exponent moves the decimal right, a negative exponent moves it left, and zeros fill empty places. 3.2 × 10⁴ is 32,000. 8.1 × 10⁻⁵ is 0.000081. Check the size: if the exponent is -5 the number should be smaller than 0.0001.</p>

<h2>Significant figures</h2>
<p>All digits in the coefficient are significant. Writing 4.50 × 10⁶ says the value is known to three significant figures, while 4.5 × 10⁶ says two. That is a main advantage of scientific notation over writing 4,500,000, where it is unclear whether the trailing zeros are measured or placeholders.</p>

<h2>Calculating with scientific notation</h2>
<h3>Multiplying</h3>
<p>Multiply the coefficients and add the exponents. (3 × 10⁴) × (2 × 10⁵) = 6 × 10⁹. If the coefficient ends up at 10 or more, adjust: (5 × 10³) × (4 × 10²) = 20 × 10⁵ = 2 × 10⁶.</p>
<h3>Dividing</h3>
<p>Divide the coefficients and subtract the exponents. (6 × 10⁸) ÷ (3 × 10²) = 2 × 10⁶.</p>
<h3>Adding and subtracting</h3>
<p>First give both numbers the same exponent, then add the coefficients. 3.2 × 10⁴ + 5 × 10³ = 3.2 × 10⁴ + 0.5 × 10⁴ = 3.7 × 10⁴.</p>
<h3>Powers</h3>
<p>Raise the coefficient to the power and multiply the exponent by it. (2 × 10³)² = 4 × 10⁶.</p>

<h2>Where you will meet it</h2>
<p>Science and engineering use it constantly: astronomical distances, atomic sizes, concentrations and electrical quantities. Calculators and spreadsheets display it as "e-notation" when a number is too long for the screen, such as 4.5E+6. We explain that format and how programming languages treat it in <a href="/blogs/article/e-notation-explained">e-notation explained</a>.</p>
<p>The <a href="/tools/scientific-notation-converter">scientific notation converter</a> converts in both directions and also gives engineering notation (exponents in multiples of three). For related conversions between number bases, try the <a href="/tools/number-base-converter">number base converter</a>, and for unit prefixes such as kilo and micro, the <a href="/tools/unit-converter">unit converter</a>. If you are working with percentages and ratios of very small quantities, the <a href="/tools/percentage-calculator">percentage calculator</a> and <a href="/blogs/article/how-to-simplify-a-ratio">how to simplify a ratio</a> may help too.</p>

<h2>Frequently asked questions</h2>
<h3>How do I write 0.00045 in scientific notation?</h3>
<p>4.5 × 10⁻⁴. The decimal moves four places to the right.</p>
<h3>Is 12 × 10³ scientific notation?</h3>
<p>Not in proper form, because the coefficient is not below 10. Move one place: 1.2 × 10⁴.</p>
<h3>What is 10⁰?</h3>
<p>1. Any non-zero number to the power of zero is 1.</p>
<h3>What does a negative exponent mean?</h3>
<p>It means a reciprocal: 10⁻³ is 1 ÷ 10³ = 0.001.</p>
`,
};
