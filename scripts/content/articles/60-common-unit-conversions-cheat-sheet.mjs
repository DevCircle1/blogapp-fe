export default {
  slug: 'common-unit-conversions-cheat-sheet',
  title: 'Common Unit Conversions: Length, Weight, Volume, Temperature',
  category: 'math',
  theme: 'math',
  tags: ['unit conversion chart', 'metric to imperial', 'unit converter', 'conversion cheat sheet', 'celsius to fahrenheit', 'kg to lb'],
  description: 'A cheat sheet of the unit conversions people use most: length, weight, volume, area, speed and temperature, with exact factors and worked examples.',
  cover: {
    kicker: 'Metric and imperial in one place',
    visual: { type: 'formula', title: 'QUICK FACTORS', lines: ['1 in = 2.54 cm', '1 mile = 1.609 km', '1 kg = 2.205 lb', '°F = °C × 9/5 + 32'] },
  },
  infographic: {
    type: 'table',
    title: 'The conversions you will use most',
    subtitle: 'Exact or rounded to the digits shown. Multiply to go from the first unit to the second.',
    columns: ['From', 'To', 'Multiply by', 'Example'],
    widths: [230, 230, 220, 416],
    rows: [
      ['Inches', 'Centimetres', '2.54', '10 in = 25.4 cm'],
      ['Feet', 'Metres', '0.3048', '6 ft = 1.829 m'],
      ['Miles', 'Kilometres', '1.609344', '26.2 mi = 42.16 km'],
      ['Pounds', 'Kilograms', '0.45359', '165 lb = 74.84 kg'],
      ['US gallons', 'Litres', '3.78541', '5 gal = 18.93 L'],
      ['Square feet', 'Square metres', '0.092903', '120 sq ft = 11.15 m²'],
    ],
    alt: 'Table of common unit conversions with factors and examples: inches to centimetres, feet to metres, miles to kilometres, pounds to kilograms, gallons to litres, square feet to square metres',
    caption: 'To go the other way, divide by the same factor.',
    footer: 'Convert anything: talkandtool.com/tools/unit-converter',
  },
  html: `
<p>The conversions most people need are 1 inch = 2.54 cm, 1 foot = 0.3048 m, 1 mile = 1.609 km, 1 pound = 0.4536 kg, 1 US gallon = 3.785 litres and °F = °C × 9/5 + 32. To convert in the opposite direction, divide by the same factor. This page collects the factors in one place, with examples so you can check your own sums.</p>

{{infographic}}

<h2>How to use a conversion factor</h2>
<p>Every conversion is a multiplication. Write the factor as "1 unit = this many of the other", then choose multiply or divide:</p>
<ul>
<li>Going from the unit on the left of the equals sign to the one on the right: <strong>multiply</strong>. 10 inches × 2.54 = 25.4 cm.</li>
<li>Going the other way: <strong>divide</strong>. 25.4 cm ÷ 2.54 = 10 inches.</li>
</ul>
<p>A quick sanity check helps. A centimetre is smaller than an inch, so a number in centimetres should be larger than the same length in inches. If your answer goes the wrong way, you multiplied when you should have divided.</p>

<h2>Length</h2>
<ul>
<li>1 inch = 2.54 cm (exact)</li>
<li>1 foot = 12 inches = 0.3048 m (exact)</li>
<li>1 yard = 3 feet = 0.9144 m (exact)</li>
<li>1 mile = 1,760 yards = 1.609344 km (exact)</li>
<li>1 nautical mile = 1.852 km (exact)</li>
</ul>
<p>Example: a person who is 180 cm tall is 180 ÷ 2.54 = 70.87 inches, which is 5 ft 10.87 in. Our guide on <a href="/blogs/article/how-to-convert-cm-to-feet-and-inches">converting cm to feet and inches</a> shows the steps, and the <a href="/tools/height-converter">height converter</a> does it instantly.</p>

<h2>Weight and mass</h2>
<ul>
<li>1 pound = 0.45359237 kg (exact), or 453.59 g</li>
<li>1 ounce = 28.3495 g</li>
<li>1 kilogram = 2.20462 pounds</li>
<li>1 stone = 14 pounds = 6.35 kg</li>
<li>1 US ton = 2,000 pounds, and 1 metric tonne = 1,000 kg</li>
</ul>
<p>Example: 75 kg × 2.20462 = 165.35 lb. To convert 165 lb to kilograms, 165 × 0.45359 = 74.84 kg.</p>

<h2>Volume</h2>
<ul>
<li>1 US gallon = 3.78541 litres, and 1 UK (imperial) gallon = 4.54609 litres</li>
<li>1 US quart = 0.946353 litres</li>
<li>1 US cup = 236.588 ml</li>
<li>1 US fluid ounce = 29.5735 ml</li>
<li>1 litre = 1,000 ml = 1,000 cm³</li>
</ul>
<p>Pay attention to the "US" and "UK" labels. A UK gallon is about 20% bigger than a US gallon, so fuel economy figures and recipes can differ depending on where they came from. A US cup is 236.6 ml, but a metric cup in some countries is exactly 250 ml.</p>

<h2>Area</h2>
<ul>
<li>1 square foot = 0.092903 m², and 1 m² = 10.7639 sq ft</li>
<li>1 square yard = 0.836127 m²</li>
<li>1 acre = 4,046.86 m² = 43,560 sq ft</li>
<li>1 hectare = 10,000 m² = 2.471 acres</li>
</ul>
<p>Area conversions are squares of the length factors, which is why 1 m² is 10.76 sq ft rather than 3.28. The walkthrough is in <a href="/blogs/article/square-feet-to-square-meters">square feet to square meters</a>, and you can calculate the areas themselves with the <a href="/blogs/article/area-of-a-rectangle-formula">area of a rectangle formula</a>.</p>

<h2>Speed</h2>
<ul>
<li>1 mph = 1.609344 km/h</li>
<li>1 m/s = 3.6 km/h</li>
<li>1 knot = 1.852 km/h</li>
</ul>
<p>A 26.2-mile marathon is 26.2 × 1.609344 = 42.16 km. If you want to turn a finish time into a pace per mile or per kilometre, see <a href="/blogs/article/how-to-calculate-running-pace">how to calculate running pace</a>.</p>

<h2>Temperature</h2>
<p>Temperature is the one conversion that does not work by multiplying alone, because the scales start at different points.</p>
<ul>
<li>Celsius to Fahrenheit: °F = °C × 9/5 + 32</li>
<li>Fahrenheit to Celsius: °C = (°F − 32) × 5/9</li>
<li>Celsius to Kelvin: K = °C + 273.15</li>
</ul>
<p>Example: a 350°F oven is (350 − 32) × 5/9 = 176.7°C. Body temperature, 37°C, is 37 × 9/5 + 32 = 98.6°F. A rough mental shortcut for Celsius to Fahrenheit is to double the number and add 30, which is close in everyday ranges: 20°C gives 70°F against the exact 68°F.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Multiplying when you should divide.</strong> Use the size check above.</li>
<li><strong>Using US and UK units interchangeably.</strong> Gallons, pints and tons differ.</li>
<li><strong>Converting squares like lengths.</strong> A square foot is not 0.3048 m², it is 0.3048 × 0.3048 = 0.0929 m².</li>
<li><strong>Rounding too early.</strong> Keep extra digits until the final answer.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How many centimetres are in an inch?</h3>
<p>Exactly 2.54.</p>
<h3>How many pounds are in a kilogram?</h3>
<p>About 2.205 pounds.</p>
<h3>How do I convert Celsius to Fahrenheit?</h3>
<p>Multiply by 9/5 and add 32. For example, 25°C is 25 × 1.8 + 32 = 77°F.</p>
<h3>Is a UK gallon the same as a US gallon?</h3>
<p>No. A UK gallon is 4.546 litres and a US gallon is 3.785 litres.</p>
<h3>Where can I convert any unit quickly?</h3>
<p>The <a href="/tools/unit-converter">unit converter</a> covers length, weight, volume, area, speed and temperature in one place.</p>
`,
};
