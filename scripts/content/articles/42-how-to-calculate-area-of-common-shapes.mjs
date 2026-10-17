export default {
  slug: 'how-to-calculate-area-of-common-shapes',
  title: 'Area Formulas: Rectangle, Triangle, Circle, Trapezoid and More',
  category: 'math',
  theme: 'math',
  tags: ['area formulas', 'area of a circle', 'area of a triangle', 'area of a trapezoid', 'how to calculate area', 'area of an ellipse'],
  description: 'Every area formula you need on one page: rectangle, triangle, circle, trapezoid, parallelogram and ellipse, each with a worked example and common mistakes to avoid.',
  cover: {
    kicker: 'Six shapes, six formulas',
    visual: { type: 'formula', title: 'AREA FORMULAS', lines: ['rectangle   l × w', 'triangle    ½ × b × h', 'circle      π × r²', 'trapezoid   ½(a+b)h'] },
  },
  infographic: {
    type: 'table',
    title: 'Area formulas with a worked example',
    subtitle: 'Use the same unit for every measurement. The answer is in square units of that measurement.',
    columns: ['Shape', 'Formula', 'Example', 'Area'],
    widths: [210, 290, 340, 216],
    rows: [
      ['Rectangle', 'length × width', '8 × 5', '40'],
      ['Triangle', '½ × base × height', '½ × 10 × 6', '30'],
      ['Circle', 'π × radius²', 'π × 4²', '50.27'],
      ['Trapezoid', '½ × (a + b) × height', '½ × (3 + 5) × 2', '8'],
      ['Parallelogram', 'base × height', '7 × 4', '28'],
      ['Ellipse', 'π × a × b', 'π × 5 × 3', '47.12'],
    ],
    alt: 'Table of area formulas for the rectangle, triangle, circle, trapezoid, parallelogram and ellipse with worked examples',
    caption: 'Height is the perpendicular distance, not the slanted side.',
    footer: 'Calculate any of them: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>Area is the amount of flat space inside a shape, measured in square units. For a rectangle it is length × width, for a triangle ½ × base × height, for a circle π × radius², and for a trapezoid ½ × (a + b) × height. Always use the same unit for every measurement, and remember that the answer is in squares of that unit: centimetres give square centimetres.</p>

{{infographic}}

<h2>Rectangle and square</h2>
<p><strong>Area = length × width.</strong> A square is a rectangle with equal sides, so its area is side × side (side squared). A 8 m by 5 m terrace has an area of 40 m². The same idea applies to rooms, plots and screens, and we use it in <a href="/blogs/article/how-to-calculate-square-footage">how to calculate square footage</a>.</p>

<h2>Triangle</h2>
<p><strong>Area = ½ × base × height.</strong> The height is the perpendicular (right-angled) distance from the base to the opposite corner, not the length of a slanted side. A triangle with a base of 10 cm and a height of 6 cm has an area of ½ × 10 × 6 = 30 cm². When you know three sides but no height, use Heron's formula: with semi-perimeter s = (a + b + c) ÷ 2, area = √(s(s − a)(s − b)(s − c)).</p>
<p>Why half? Any triangle is half of a parallelogram with the same base and height, as two copies fit together to form one.</p>

<h2>Circle</h2>
<p><strong>Area = π × radius².</strong> The radius is half the diameter. A circle with a radius of 4 m has an area of π × 16 = 50.27 m². If you have the diameter, halve it first: a 10 ft round table has a radius of 5 ft and an area of 78.5 sq ft. The common mistake is to use the diameter in place of the radius, which makes the answer four times too large. Another is to confuse area with circumference (2 × π × r), which is the distance around the circle.</p>
<p>Doubling a circle's radius multiplies its area by four, which is why a 16-inch pizza has nearly 80% more area than a 12-inch pizza: (16/12)² = 1.78.</p>

<h2>Trapezoid</h2>
<p><strong>Area = ½ × (a + b) × height</strong>, where a and b are the two parallel sides. Average the parallel sides and multiply by the distance between them. For parallel sides of 3 m and 5 m, 2 m apart: ½ × 8 × 2 = 8 m². In the UK, a trapezoid is called a trapezium.</p>

<h2>Parallelogram</h2>
<p><strong>Area = base × perpendicular height.</strong> A parallelogram with a 7 cm base and 4 cm height has an area of 28 cm². The slanted side is not the height. A rhombus is a parallelogram with equal sides, so the same formula applies, or half the product of its diagonals.</p>

<h2>Ellipse</h2>
<p><strong>Area = π × a × b</strong>, where a and b are the semi-axes (half the longest and shortest widths). For a = 5 and b = 3: π × 15 = 47.12. A circle is the special case where a = b = r. Unlike the area, the perimeter of an ellipse has no simple exact formula.</p>

<h2>Composite shapes</h2>
<p>Real spaces are rarely a single shape. Split them into the shapes above, calculate each area and add them, or subtract a cut-out from a larger shape. A rectangular lawn of 12 m by 9 m (108 m²) with a circular flower bed of 2 m radius (12.57 m²) has a mowing area of 108 − 12.57 = <strong>95.43 m²</strong>.</p>

<h2>Unit conversions for area</h2>
<p>Because area is a product of two lengths, conversions use the square of the length factor:</p>
<ul>
<li>1 m² = 10,000 cm² (not 100)</li>
<li>1 ft² = 144 in²</li>
<li>1 yd² = 9 ft²</li>
<li>1 m² = 10.764 ft²</li>
<li>1 acre = 43,560 ft² = 4,047 m²</li>
<li>1 hectare = 10,000 m²</li>
</ul>
<p>Mixing these up is the main reason measurements go wrong. The <a href="/tools/area-calculator">area calculator</a> avoids it: pick a shape, enter dimensions in any common unit, and read the result in square feet, metres, yards and acres at once. For lengths, the <a href="/tools/unit-converter">unit converter</a> helps, and the <a href="/tools/ratio-calculator">ratio calculator</a> is useful for scaling plans. When you need to take an area as a share of a total, use the <a href="/tools/percentage-calculator">percentage calculator</a>.</p>

<h2>Where area calculations turn up</h2>
<ul>
<li>Buying <a href="/blogs/article/how-much-flooring-do-i-need">flooring, tile or paint</a>.</li>
<li>Estimating land, turf, mulch and fertiliser.</li>
<li>Working out coverage and pricing per square metre.</li>
<li>Scaling drawings and checking that a sofa fits a room.</li>
<li>Maths homework and exams, where showing the unit squared earns marks.</li>
</ul>
<p>If you are simplifying the dimensions of a scaled plan, our guide to <a href="/blogs/article/how-to-simplify-a-ratio">simplifying a ratio</a> may help.</p>

<h2>Frequently asked questions</h2>
<h3>What is the area of a circle with a diameter of 10?</h3>
<p>Radius 5, so π × 25 = 78.54 square units.</p>
<h3>What is the formula for the area of a trapezoid?</h3>
<p>½ × (sum of the two parallel sides) × height.</p>
<h3>Why is area measured in square units?</h3>
<p>Because it counts how many unit squares (1 × 1) fit inside the shape.</p>
<h3>How do I find the area of an irregular shape?</h3>
<p>Divide it into rectangles, triangles and circles, calculate each and add. For a map or drawing, you can also count grid squares or use a scaled grid for an estimate.</p>
`,
};
