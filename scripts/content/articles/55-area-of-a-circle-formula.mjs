export default {
  slug: 'area-of-a-circle-formula',
  title: 'Area of a Circle: Formula, Examples and the Diameter Shortcut',
  category: 'math',
  theme: 'math',
  tags: ['area of a circle', 'area of a circle formula', 'circle area calculator', 'area from diameter', 'area of a semicircle', 'area of a ring'],
  description: 'The area of a circle is π × radius². Worked examples from radius, diameter and circumference, plus semicircles, sectors and rings, and the common mistakes to avoid.',
  cover: {
    kicker: 'Radius, diameter or circumference',
    visual: { type: 'formula', title: 'AREA OF A CIRCLE', lines: ['A = π × r²', 'A = π × (d ÷ 2)²', 'A = C² ÷ (4π)', 'r = 4  →  50.27'] },
  },
  infographic: {
    type: 'table',
    title: 'Circle area from whatever you know',
    subtitle: 'Round at the end, not in the middle, to keep the answer accurate.',
    columns: ['You know', 'Formula', 'Example', 'Area'],
    widths: [210, 300, 330, 216],
    rows: [
      ['Radius r', 'π × r²', 'r = 4', '50.27'],
      ['Diameter d', 'π × (d ÷ 2)²', 'd = 10', '78.54'],
      ['Circumference C', 'C² ÷ (4π)', 'C = 20', '31.83'],
      ['Semicircle, radius r', '½ × π × r²', 'r = 6', '56.55'],
      ['Ring, radii R and r', 'π × (R² − r²)', 'R = 5, r = 3', '50.27'],
      ['Sector, angle θ°', 'θ ÷ 360 × π × r²', '90° with r = 6', '28.27'],
    ],
    alt: 'Table of circle area formulas starting from radius, diameter, circumference, plus a semicircle, a ring and a sector with worked examples',
    caption: 'The answer is always in square units of whatever you measured.',
    footer: 'Calculate it instantly: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>The area of a circle is <strong>π × radius²</strong>, written A = πr². For a circle with a radius of 4 m, the area is π × 16 = 50.27 m². If you only know the diameter, halve it to get the radius first. If you know the circumference, use A = C² ÷ (4π). The answer is always in square units, so a radius in metres gives square metres.</p>

{{infographic}}

<h2>Area from the radius</h2>
<p>The radius is the distance from the centre to the edge. Square it, then multiply by π (3.14159…). With r = 7 cm: 7² = 49, and 49 × π = 153.94 cm². Squaring means multiplying the radius by itself, not by two. People who calculate π × 2 × r are finding the circumference, not the area.</p>

<h2>Area from the diameter</h2>
<p>The diameter is the full width of the circle, twice the radius. Halve it, then use the same formula. A round table with a diameter of 10 ft has a radius of 5 ft, so its area is π × 25 = 78.54 sq ft. The shortcut formula is A = (π ÷ 4) × d², which gives the same result: 0.7854 × 100 = 78.54. Use whichever is easier on your calculator, but never put the whole diameter into πr², because that would give four times the real area.</p>

<h2>Area from the circumference</h2>
<p>If you measured around the circle with a tape, the circumference C equals 2πr. Solve for r, then substitute into the area formula, and you get A = C² ÷ (4π). For C = 20 cm: 400 ÷ 12.566 = 31.83 cm². This is the formula to use for round objects such as tree trunks, pipes or columns, where wrapping a tape measure around is easier than measuring straight across.</p>

<h2>Why the area grows so fast</h2>
<p>Because the radius is squared, doubling the radius makes the area four times larger. A 12-inch pizza has an area of 113.10 sq in and a 16-inch pizza has 201.06 sq in, which is about 78% more pizza for a 33% wider pan. The same rule explains why a slightly larger pipe carries much more water, and why a slightly larger round rug covers far more floor than it appears to.</p>

<h2>Semicircle, sector and ring</h2>
<ul>
<li><strong>Semicircle:</strong> half of a circle, so A = ½ × π × r². For r = 6 m, the area is 56.55 m². A half-round window or garden bed uses this.</li>
<li><strong>Sector (a slice):</strong> the fraction of the circle is the angle divided by 360. A 90° slice of a circle with r = 6 is ¼ of 113.10, which is 28.27. Pie charts and fan shapes are sectors.</li>
<li><strong>Ring (annulus):</strong> subtract the inner circle from the outer. With R = 5 and r = 3, the area is π × (25 − 9) = 50.27. A washer, a running track or a round path around a pond is a ring.</li>
</ul>

<h2>Step by step: a worked example</h2>
<p>A circular garden has a diameter of 6 m and you want to cover it with turf sold per square metre.</p>
<ol>
<li>Radius = 6 ÷ 2 = 3 m.</li>
<li>Radius squared = 3 × 3 = 9.</li>
<li>Area = π × 9 = 28.27 m².</li>
<li>Add about 10% for cutting and waste: 28.27 × 1.10 = 31.1 m², so order 32 m².</li>
</ol>
<p>The same steps apply to rooms, rugs and tabletops. For rectangles and other shapes, see our guide to <a href="/blogs/article/how-to-calculate-area-of-common-shapes">area formulas for common shapes</a>, and for converting your answer between units, the <a href="/tools/unit-converter">unit converter</a> handles square feet, square metres and acres.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Using the diameter as the radius.</strong> This quadruples the result.</li>
<li><strong>Forgetting to square.</strong> π × r is not an area.</li>
<li><strong>Mixing units.</strong> Convert everything to one unit first. A radius in centimetres gives square centimetres, and 10,000 cm² make 1 m², not 100.</li>
<li><strong>Rounding π too early.</strong> Using 3.14 is fine for quick estimates, but for large circles keep more digits, or use your calculator's π key.</li>
</ul>

<h2>Where circle area is used</h2>
<ul>
<li>Buying turf, paving, paint or flooring for round spaces. Our guide to <a href="/blogs/article/how-to-calculate-square-footage">calculating square footage</a> covers the rectangular cases.</li>
<li>Pipes and ducts, where the cross-sectional area controls flow.</li>
<li>Pizza, cake tins and anything priced by size.</li>
<li>Maths and physics homework, where showing the squared unit often earns a mark.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>What is the area of a circle with a radius of 5?</h3>
<p>π × 25 = 78.54 square units.</p>
<h3>What is the area of a circle with a diameter of 12?</h3>
<p>The radius is 6, so the area is π × 36 = 113.10 square units.</p>
<h3>How do I find the area of a circle without π?</h3>
<p>You cannot avoid it exactly, but 3.14 or 22/7 give a close estimate for everyday jobs. For precise work use your calculator's π button.</p>
<h3>Is the area of a circle the same as its circumference?</h3>
<p>No. Circumference is a length, the distance around the edge, measured in units such as cm. Area is the space inside, measured in square units such as cm². For a circle of radius 2 they happen to share the same number (about 12.57), but they never mean the same thing.</p>
`,
};
