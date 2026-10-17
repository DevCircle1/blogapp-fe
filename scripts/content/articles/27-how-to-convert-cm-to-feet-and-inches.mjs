const rows = [150, 155, 160, 165, 170, 175, 180, 185, 190, 195].map((cm) => {
  const totalIn = cm / 2.54;
  let feet = Math.floor(totalIn / 12);
  let inches = Math.round((totalIn - feet * 12) * 10) / 10;
  if (inches >= 12) { feet += 1; inches = 0; }
  return [`${cm} cm`, `${feet}′ ${inches}″`, `${totalIn.toFixed(1)} in`, `${(cm / 100).toFixed(2)} m`];
});

export default {
  slug: 'how-to-convert-cm-to-feet-and-inches',
  title: 'How to Convert cm to Feet and Inches (With a Height Chart)',
  category: 'math',
  theme: 'math',
  tags: ['cm to feet and inches', 'height converter', 'convert cm to feet', 'height chart', 'cm to inches', '170 cm in feet'],
  description: 'Divide centimetres by 2.54 for inches, then divide by 12 for feet. Worked examples, a height chart from 150 to 195 cm, and the reverse conversion.',
  cover: {
    kicker: 'Divide by 2.54, then by 12',
    visual: { type: 'formula', title: 'CM TO FEET AND INCHES', lines: ['cm ÷ 2.54 = inches', 'inches ÷ 12 = feet', '175 ÷ 2.54 = 68.9 in', '= 5′ 8.9″'] },
  },
  infographic: {
    type: 'table',
    title: 'Height chart: centimetres to feet and inches',
    subtitle: 'Heights from 150 cm to 195 cm in 5 cm steps. Inches are rounded to one decimal place.',
    columns: ['Centimetres', 'Feet and inches', 'Total inches', 'Metres'],
    widths: [264, 264, 264, 264],
    rows,
    alt: 'Chart converting heights from 150 to 195 centimetres into feet and inches, total inches and metres',
    caption: 'One inch is exactly 2.54 cm, so the conversion is exact apart from the rounding you choose.',
    footer: 'Convert any height: talkandtool.com/tools/height-converter',
  },
  html: `
<p>To convert centimetres to feet and inches, divide the height in centimetres by 2.54 to get total inches, then divide by 12: the whole number is the feet and the remainder is the inches. For 175 cm, 175 ÷ 2.54 = 68.9 inches, which is 5 feet 8.9 inches. The reverse is as simple: multiply total inches by 2.54. The chart below covers the heights people look up most.</p>

<h2>The conversion step by step</h2>
<p>The inch is defined as exactly 2.54 centimetres, so there is no approximation in the factor. Follow three steps:</p>
<ol>
<li><strong>Centimetres to inches:</strong> divide by 2.54.</li>
<li><strong>Inches to feet:</strong> divide by 12 and keep the whole number as feet.</li>
<li><strong>Remainder to inches:</strong> multiply what is left over by 12, or subtract feet × 12 from the total inches.</li>
</ol>

{{infographic}}

<h2>Worked examples</h2>
<p><strong>Example 1: 170 cm.</strong> 170 ÷ 2.54 = 66.93 inches. 66.93 ÷ 12 = 5 remainder 6.93, so the height is <strong>5 feet 6.9 inches</strong>, which most people round to 5′ 7″.</p>
<p><strong>Example 2: 183 cm.</strong> 183 ÷ 2.54 = 72.05 inches, which is exactly 6 feet and a fraction: <strong>6′ 0.05″</strong>, in practice 6′ 0″.</p>
<p><strong>Example 3: 160 cm.</strong> 160 ÷ 2.54 = 62.99 inches, or <strong>5′ 3″</strong> to the nearest inch.</p>
<p>A quick mental shortcut is that 30 cm is about one foot (it is 30.48 cm), so 180 cm is six feet minus a small amount: 5′ 10.9″.</p>

<h2>Converting feet and inches to centimetres</h2>
<p>Turn the height into inches first, then multiply by 2.54:</p>
<p><strong>cm = (feet × 12 + inches) × 2.54</strong></p>
<p>For 5′ 11″: (5 × 12 + 11) = 71 inches, and 71 × 2.54 = <strong>180.34 cm</strong>. For 6′ 2″: 74 inches × 2.54 = <strong>187.96 cm</strong>. For 5′ 4″: 64 × 2.54 = <strong>162.56 cm</strong>.</p>

<h2>Common conversions people search for</h2>
<ul>
<li>5′ 0″ = 152.4 cm</li>
<li>5′ 5″ = 165.1 cm</li>
<li>5′ 10″ = 177.8 cm</li>
<li>6′ 0″ = 182.88 cm</li>
<li>6′ 6″ = 198.12 cm</li>
</ul>
<p>When a form asks for a whole number of centimetres, round to the nearest one; a half-centimetre either way is within normal measurement error, since a person's height can vary by about a centimetre between morning and evening.</p>

<h2>Why the rounding sometimes looks odd</h2>
<p>If the inches part rounds up to 12, the height rolls over to the next foot, so 5′ 12″ is written as 6′ 0″. This catches some hand calculations: 182.5 cm is 71.85 inches, which is 5′ 11.85″, not 5′ 12″. Always carry the remainder before rounding.</p>

<h2>Where height conversion matters</h2>
<p>Height is the input to several calculators, and getting it wrong shifts the result more than most people expect. The BMI formula divides weight by height squared, so a 5 cm error at 170 cm changes BMI by about 6%. Our <a href="/tools/bmi-calculator">BMI calculator</a> accepts feet and inches directly, and the <a href="/tools/ideal-weight-calculator">ideal weight calculator</a> works from height as well. If you are tracking calories, height feeds the BMR estimate described in <a href="/blogs/article/how-to-calculate-macros-for-weight-loss">how to calculate macros for weight loss</a>.</p>
<p>For other measurements such as kilograms to pounds, miles to kilometres or square feet to square metres, use the <a href="/tools/unit-converter">unit converter</a>. To work out areas, such as a room's size in square feet from metric measurements, the <a href="/tools/area-calculator">area calculator</a> shows both systems at once.</p>

<h2>Measuring your height accurately</h2>
<ul>
<li>Stand barefoot with heels, buttocks and shoulders against a flat wall.</li>
<li>Look straight ahead with your chin level, not tilted up.</li>
<li>Place a flat object such as a hardcover book on top of your head, against the wall, and mark the underside.</li>
<li>Measure from the floor to the mark with a hard tape measure.</li>
</ul>
<p>Measure in the morning if you can. People are slightly taller after lying down and lose a little height through the day.</p>

<h2>Frequently asked questions</h2>
<h3>How many cm is 5 feet 7 inches?</h3>
<p>5′ 7″ is 67 inches, and 67 × 2.54 = 170.18 cm.</p>
<h3>How tall is 180 cm in feet?</h3>
<p>180 cm is 70.87 inches, which is 5 feet 10.9 inches, usually quoted as 5′ 11″.</p>
<h3>How do I convert cm to inches only?</h3>
<p>Divide by 2.54. For example 100 cm is 39.37 inches.</p>
<h3>Is it exactly 2.54?</h3>
<p>Yes. The international inch was fixed at exactly 25.4 millimetres in 1959, so 1 inch is exactly 2.54 cm.</p>
`,
};
