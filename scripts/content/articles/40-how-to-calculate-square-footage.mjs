export default {
  slug: 'how-to-calculate-square-footage',
  title: 'How to Calculate Square Footage of a Room, Lot or L-Shape',
  category: 'math',
  theme: 'math',
  tags: ['how to calculate square footage', 'square footage calculator', 'area of a room', 'square feet to square meters', 'l-shaped room area', 'measure a room'],
  description: 'Multiply length by width in feet for square footage. Learn how to measure, handle L-shaped and irregular rooms, convert from metres and inches, and add waste for materials.',
  cover: {
    kicker: 'Length × width, one rectangle at a time',
    visual: { type: 'formula', title: 'SQUARE FOOTAGE', lines: ['12 ft × 10 ft = 120', '+ 6 ft × 4 ft = 24', 'L-shaped room', '= 144 sq ft'] },
  },
  infographic: {
    type: 'table',
    title: 'Square footage cheat sheet',
    subtitle: 'Common room sizes and unit conversions.',
    columns: ['Room size', 'Square feet', 'Square metres', 'Square yards'],
    widths: [264, 264, 264, 264],
    rows: [
      ['8 × 10 ft', '80', '7.4', '8.9'],
      ['10 × 12 ft', '120', '11.1', '13.3'],
      ['12 × 12 ft', '144', '13.4', '16.0'],
      ['12 × 16 ft', '192', '17.8', '21.3'],
      ['15 × 20 ft', '300', '27.9', '33.3'],
      ['20 × 30 ft', '600', '55.7', '66.7'],
    ],
    alt: 'Table of common room dimensions in feet with their area in square feet, square metres and square yards',
    caption: '1 square foot = 0.0929 square metres. 1 square metre = 10.764 square feet.',
    footer: 'Work out any shape: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>To calculate the square footage of a rectangular room, measure its length and width in feet and multiply them. A room 12 feet by 10 feet is 120 square feet. For an L-shaped or irregular space, split it into rectangles, calculate each one and add the results. For measurements in metres, multiply length by width and then multiply the result by 10.764 to convert square metres to square feet.</p>

<h2>What you need</h2>
<ul>
<li>A tape measure (a laser measure is quicker for long rooms).</li>
<li>Paper and a pencil, or your phone.</li>
<li>A calculator, or the <a href="/tools/area-calculator">area calculator</a>.</li>
</ul>

<h2>Step 1: measure the length and width</h2>
<p>Measure along the floor from wall to wall, not along the skirting if it is thick. For a room that is not perfectly square, measure each wall pair and use the average, or treat the room as a few rectangles. Take each measurement twice. Round to the nearest inch, then convert inches to feet by dividing by 12: 11 feet 6 inches is 11.5 feet.</p>

<h2>Step 2: multiply</h2>
<p><strong>Area = length × width</strong></p>
<p>A room that is 14 ft 6 in by 11 ft 3 in is 14.5 ft × 11.25 ft = 163.1 square feet. It is important to use decimal feet. Multiplying 14.6 by 11.3, treating inches as decimals, would give a wrong answer.</p>

{{infographic}}

<h2>L-shaped and irregular rooms</h2>
<p>Break the shape into rectangles by extending one wall line until it splits the space. Calculate each rectangle and add:</p>
<ul>
<li>Main section: 12 ft × 10 ft = 120 sq ft</li>
<li>Extension: 6 ft × 4 ft = 24 sq ft</li>
<li><strong>Total: 144 sq ft</strong></li>
</ul>
<p>Alternatively, calculate the large bounding rectangle and subtract the missing corner: a 12 × 14 ft box (168 sq ft) minus a 6 × 4 ft notch (24 sq ft) is also 144.</p>
<p>Alcoves and bay windows are extra rectangles or trapezoids. Do not include closets unless you are covering them with flooring, and subtract fixed items such as kitchen islands only if the material will not run underneath.</p>

<h2>Triangles, circles and other shapes</h2>
<ul>
<li><strong>Triangle:</strong> ½ × base × height. A triangular nook with a 6 ft base and 4 ft height is 12 sq ft.</li>
<li><strong>Circle:</strong> π × radius². A 10 ft diameter circle has a radius of 5 ft, so its area is 3.1416 × 25 = 78.5 sq ft.</li>
<li><strong>Trapezoid:</strong> ½ × (top + bottom) × height. A garden bed 8 ft and 12 ft wide at its ends and 5 ft deep: ½ × 20 × 5 = 50 sq ft.</li>
</ul>
<p>The <a href="/tools/area-calculator">area calculator</a> covers all of these, shows the result in square feet, metres, yards and acres, and can estimate a cost per square foot.</p>

<h2>Converting units</h2>
<ul>
<li>Square metres to square feet: multiply by 10.764.</li>
<li>Square feet to square metres: multiply by 0.0929.</li>
<li>Square feet to square yards: divide by 9.</li>
<li>Square feet to acres: divide by 43,560.</li>
</ul>
<p>The reason is that area units scale with the square of length. A yard is 3 feet, so a square yard is 3 × 3 = 9 square feet. If you need other units, the <a href="/tools/unit-converter">unit converter</a> handles lengths, areas and more, and if you need to turn centimetre measurements into feet and inches first, see <a href="/blogs/article/how-to-convert-cm-to-feet-and-inches">how to convert cm to feet and inches</a>.</p>

<h2>Adding waste when buying materials</h2>
<p>Materials come in boxes and rolls, and cuts waste some. A standard allowance is 5–10% extra for simple rectangular rooms, 10–15% for diagonal layouts, and more for patterned or large-format tiles. For 144 sq ft of flooring with 10% waste, buy 144 × 1.10 = 158.4 sq ft, then round up to whole boxes. We cover the details by material in <a href="/blogs/article/how-much-flooring-do-i-need">how much flooring you need</a>.</p>
<p>To work out the cost, multiply the area by the price per square foot, then apply sales tax if relevant. The <a href="/tools/sales-tax-calculator">sales tax calculator</a> adds tax quickly, and the <a href="/tools/discount-calculator">discount calculator</a> shows the price after a sale.</p>

<h2>Square footage for real estate</h2>
<p>Listings use different rules. Gross living area counts finished, heated, above-ground space, generally measured from the exterior walls. Basements, garages and unfinished attics are usually excluded or listed separately. If you need an official figure, rely on an appraisal or the local standard; for your own planning, measure and calculate as above.</p>

<h2>Frequently asked questions</h2>
<h3>How many square feet is a 10 by 10 room?</h3>
<p>100 square feet.</p>
<h3>How do I calculate square feet from inches?</h3>
<p>Multiply length by width in inches, then divide by 144, because a square foot is 12 × 12 inches. A 96 × 120 inch room is 11,520 ÷ 144 = 80 sq ft.</p>
<h3>How do I find the square footage of a house?</h3>
<p>Calculate each room or floor, add them, and exclude non-living areas if you want the living area. Using a floor plan with stated dimensions speeds this up.</p>
<h3>How many square feet are in a square metre?</h3>
<p>10.764.</p>
`,
};
