export default {
  slug: 'e-notation-explained',
  title: 'E-Notation Explained: What 1.5e+10 Means in Excel and Code',
  category: 'programming',
  theme: 'dev',
  tags: ['e notation', 'what does e mean in excel', '1e6', 'scientific notation excel', 'floating point precision', 'convert e notation to number'],
  description: 'The “e” in 1.5e+10 means “times ten to the power of”. Learn how to read it, stop Excel showing it, parse it in code, and why very large numbers lose precision.',
  cover: {
    kicker: 'The “e” means “times ten to the power of”',
    visual: { type: 'code', lines: [['1.5e3  = 1.5 × 10³ = 1500', 'accent'], '2e-4  = 0.0002', '6.02e23 = Avogadro', 'Number("1e6") // 1000000', '0.1 + 0.2 // 0.30000000000000004'] },
  },
  infographic: {
    type: 'table',
    title: 'Reading e-notation',
    subtitle: 'Move the decimal point right for a positive exponent and left for a negative one.',
    columns: ['E-notation', 'Means', 'Standard form'],
    widths: [300, 400, 356],
    rows: [
      ['1e3', '1 × 10³', '1,000'],
      ['2.5e6', '2.5 × 10⁶', '2,500,000'],
      ['7e-3', '7 × 10⁻³', '0.007'],
      ['1.2345e2', '1.2345 × 10²', '123.45'],
      ['9.1e-31', '9.1 × 10⁻³¹', '0.00…0091 (30 zeros after the point)'],
    ],
    alt: 'Table converting e-notation values such as 1e3 and 7e-3 into scientific notation and standard decimal form',
    caption: 'The number after the e is how many places to shift the decimal point.',
    footer: 'Convert both ways: talkandtool.com/tools/scientific-notation-converter',
  },
  html: `
<p>In 1.5e+10 the letter "e" stands for "exponent" and means "times ten to the power of". So 1.5e+10 is 1.5 × 10¹⁰, or 15,000,000,000, and 2e-4 is 2 × 10⁻⁴, or 0.0002. This is simply scientific notation typed on a keyboard, and spreadsheets, calculators and programming languages all use it to display numbers that are too long or too small to print in full.</p>

<h2>How to read it</h2>
<p>The part before the "e" is the coefficient, and the part after is the exponent of ten. A plus sign means the decimal moves right (a bigger number); a minus sign means it moves left (a smaller one). Read "e+6" as "move the point six places right" and "e-3" as "move it three places left". The plus sign is optional: 1e6 and 1e+6 are the same.</p>

{{infographic}}

<p>Do not confuse the "e" of e-notation with Euler's number e (about 2.718). In 1e3, the thousand is simply 10³; there is no mathematical constant involved. If you do need to enter 2.718 and a power of it, spreadsheets use the EXP function: EXP(3) is 20.09.</p>

<h2>Why Excel shows e-notation</h2>
<p>Excel switches to scientific format in the General format when a number needs more characters than the column can display. A value such as 123456789012 in a narrow column displays as 1.23457E+11. The cell still holds the full number; only the display is shortened. To change it:</p>
<ul>
<li>Widen the column, or</li>
<li>Select the cells, choose Format Cells, then Number with 0 decimal places, or</li>
<li>Use a custom format such as <code>0</code> or <code>#,##0</code>.</li>
</ul>
<p>Excel keeps only 15 significant digits. Long identifiers, such as credit card numbers, tracking numbers or ID numbers typed as numbers, are rounded after the 15th digit and the rest become zeros, with no way to get them back. Format those cells as Text <em>before</em> typing or importing, or add an apostrophe in front. The same happens with CSV files that are opened directly, which is a frequent cause of corrupted product codes and phone numbers. If you work with data files, our <a href="/tools/csv-to-json">CSV to JSON converter</a> keeps values as text so long IDs survive.</p>

<h2>E-notation in programming</h2>
<p>Nearly every language accepts and prints it:</p>
<ul>
<li><strong>JavaScript:</strong> <code>1e6 === 1000000</code>. <code>Number("2.5e3")</code> is 2500. JavaScript switches to e-notation when a number is 1e21 or larger or smaller than 1e-6.</li>
<li><strong>Python:</strong> <code>float("1.5e3")</code> is 1500.0. Printing a float like 0.00001 may show 1e-05.</li>
<li><strong>JSON:</strong> numbers can be written as 1e3 or 1E+3. Both are valid, as is 1.5e-2.</li>
<li><strong>SQL and CSV:</strong> many exports use e-notation for floating-point columns, which can surprise tools that expect plain digits.</li>
</ul>
<p>When you view JSON that contains such numbers, the <a href="/tools/json-studio">JSON formatter</a> helps you inspect them. And if an API returns a very large integer in e-notation, it probably went through a floating-point conversion and may already have lost precision.</p>

<h2>Floating-point precision</h2>
<p>Computers store most numbers as binary floating-point values (the double-precision format has about 15–17 significant decimal digits). Two consequences matter:</p>
<ul>
<li><strong>Whole numbers above 2⁵³ (about 9 × 10¹⁵) cannot all be represented exactly.</strong> In JavaScript, <code>9007199254740993</code> becomes 9007199254740992. IDs larger than that should travel as strings.</li>
<li><strong>Decimal fractions often cannot be stored exactly.</strong> 0.1 + 0.2 gives 0.30000000000000004 because neither 0.1 nor 0.2 has a finite binary representation. For money, use integer cents or a decimal library.</li>
</ul>
<p>This is why a number printed as 1.0000000000000002e+0 can appear after calculations that look exact on paper. Use rounding when displaying, and compare floats with a tolerance, not with equality.</p>

<h2>Converting between forms</h2>
<ol>
<li><strong>E-notation to standard form:</strong> shift the decimal point by the exponent, filling with zeros.</li>
<li><strong>Standard form to e-notation:</strong> shift the point until one non-zero digit remains in front, and write the number of shifts after the e (negative if you moved right).</li>
</ol>
<p>The <a href="/tools/scientific-notation-converter">scientific notation converter</a> does both and also shows engineering notation. For a step-by-step explanation of the underlying idea, see <a href="/blogs/article/how-to-write-numbers-in-scientific-notation">how to write numbers in scientific notation</a>. If you convert between number systems, the <a href="/tools/number-base-converter">number base converter</a> is the next stop, and <a href="/blogs/article/how-to-convert-text-to-binary">how to convert text to binary</a> covers how computers store text.</p>

<h2>Frequently asked questions</h2>
<h3>What does E+ mean on a calculator?</h3>
<p>It means "times ten to the power of" a positive number. 3.2E+5 is 320,000.</p>
<h3>How do I stop Excel from using scientific notation?</h3>
<p>Format the cells as Number with zero decimals, or as Text for identifiers. Widening the column also helps for numbers under 15 digits.</p>
<h3>Is 1e3 the same as 1000?</h3>
<p>Yes. It is the number 1 times 10³.</p>
<h3>Is lowercase e different from uppercase E?</h3>
<p>No. Both mean the same thing in nearly every system.</p>
`,
};
