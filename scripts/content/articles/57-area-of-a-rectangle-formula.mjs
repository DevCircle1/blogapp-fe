export default {
  slug: 'area-of-a-rectangle-formula',
  title: 'Area of a Rectangle: Formula, Examples and Unit Conversions',
  category: 'math',
  theme: 'math',
  tags: ['area of a rectangle', 'rectangle area formula', 'area of a square', 'length times width', 'find the missing side', 'area units'],
  description: 'The area of a rectangle is length × width. Worked examples for rooms and tiles, how to find a missing side, the square shortcut, and how to convert between units.',
  cover: {
    kicker: 'Length × width, in square units',
    visual: { type: 'formula', title: 'AREA OF A RECTANGLE', lines: ['A = l × w', 'Square: A = s²', 'l = 12, w = 10', 'A = 120 sq ft'] },
  },
  infographic: {
    type: 'table',
    title: 'Rectangle and square area at a glance',
    subtitle: 'Measure every side in the same unit before you multiply.',
    columns: ['Question', 'Formula', 'Example', 'Result'],
    widths: [260, 280, 340, 176],
    rows: [
      ['Area of a rectangle', 'l × w', '12 ft × 10 ft', '120 sq ft'],
      ['Area of a square', 's × s', 's = 7 cm', '49 cm²'],
      ['Missing side', 'A ÷ known side', '96 ÷ 8', '12'],
      ['Perimeter', '2 × (l + w)', 'l = 12, w = 10', '44'],
      ['Tiles needed', 'room area ÷ tile area', '12 m² ÷ 0.25 m²', '48 tiles'],
      ['Square metres to sq ft', '× 10.764', '8.4 m²', '90.4 sq ft'],
    ],
    alt: 'Table of rectangle and square area formulas with examples: area, square, missing side, perimeter, tiles needed and square metre conversion',
    caption: 'Area is always in square units, perimeter in plain units.',
    footer: 'Calculate it instantly: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>The area of a rectangle is <strong>length × width</strong>, written A = l × w. A room that is 12 ft long and 10 ft wide has an area of 12 × 10 = 120 square feet. For a square, where every side is equal, the formula becomes side × side, or s². The answer is always in square units, so measurements in metres give square metres and measurements in inches give square inches.</p>

{{infographic}}

<h2>Step by step: find the area of a rectangle</h2>
<ol>
<li><strong>Measure the two sides that meet at a corner.</strong> Length is usually the longer side, but it makes no difference to the answer which you call which.</li>
<li><strong>Check the units match.</strong> If one side is in feet and the other in inches, convert one first.</li>
<li><strong>Multiply them.</strong> 8 cm × 5 cm = 40.</li>
<li><strong>Write the unit squared.</strong> 40 cm², which means 40 squares that are each 1 cm by 1 cm.</li>
</ol>
<p>The reason this works is that a rectangle 8 cm wide and 5 cm tall can be cut into 5 rows of 8 unit squares. Counting them is the same as multiplying.</p>

<h2>Mixed units: feet and inches</h2>
<p>A common slip is multiplying feet by inches. A hallway measuring 5 ft 6 in by 10 ft is not 5.6 × 10. Convert the inches to a decimal first: 6 in is 0.5 ft, so the width is 5.5 ft, and the area is 5.5 × 10 = 55 sq ft. If you prefer to work in inches, 66 in × 120 in = 7,920 sq in, and dividing by 144 (the number of square inches in a square foot) gives the same 55 sq ft.</p>

<h2>Area of a square</h2>
<p>A square is a rectangle with equal sides, so you only need one measurement. A square with a side of 7 cm has an area of 7 × 7 = 49 cm². If you know the area and want the side, take the square root: the side of a 64 m² square plot is 8 m.</p>

<h2>Find a missing side from the area</h2>
<p>Rearrange the formula. If the area is 96 m² and the width is 8 m, then the length is 96 ÷ 8 = 12 m. This is useful when you know how much floor, fabric or paper you have and need to know what size fits. Likewise, if the area is 150 sq ft and the length is 15 ft, the width is 10 ft.</p>

<h2>Area and perimeter are not the same</h2>
<p>Area measures the space inside the rectangle. Perimeter measures the distance around it: 2 × (length + width). A 12 ft by 10 ft room has a perimeter of 44 ft, which is what you need for skirting boards or fencing, and an area of 120 sq ft, which is what you need for flooring or paint on the floor. Two rectangles can have the same perimeter and very different areas: a 10 × 10 square and a 19 × 1 strip both have a perimeter of 40, but their areas are 100 and 19.</p>

<h2>Length × width × height is volume, not area</h2>
<p>Searches for "length x width x height area" usually mean volume. Multiplying three measurements gives a volume in cubic units: a box 4 m × 3 m × 2 m holds 24 m³. Area only ever uses two dimensions. For a box, the surface area is the sum of all six faces: 2 × (lw + lh + wh) = 2 × (12 + 8 + 6) = 52 m².</p>

<h2>A practical example: tiling a floor</h2>
<p>A bathroom floor is 4 m by 3 m, and you are using square tiles that measure 50 cm (0.5 m) on each side.</p>
<ol>
<li>Floor area = 4 × 3 = 12 m².</li>
<li>Tile area = 0.5 × 0.5 = 0.25 m².</li>
<li>Tiles needed = 12 ÷ 0.25 = 48.</li>
<li>Add about 10% for cuts and breakages: 48 × 1.10 = 52.8, so buy 53.</li>
</ol>
<p>The same method works for paving, carpet and turf. Our guide to <a href="/blogs/article/how-much-flooring-do-i-need">how much flooring you need</a> shows how to handle waste and room shapes.</p>

<h2>Converting rectangle area between units</h2>
<ul>
<li>1 square metre = 10.764 square feet</li>
<li>1 square yard = 9 square feet</li>
<li>1 square foot = 144 square inches</li>
<li>1 square metre = 10,000 square centimetres</li>
<li>1 acre = 43,560 square feet</li>
</ul>
<p>Square units multiply by the conversion factor twice, which is why 1 m² is not 100 cm² but 10,000 cm². A rectangle 3.5 m by 2.4 m has an area of 8.4 m², or about 90.4 sq ft. For the full walkthrough, see <a href="/blogs/article/square-feet-to-square-meters">square feet to square meters</a>, or use the <a href="/tools/unit-converter">unit converter</a>.</p>

<h2>Rectangles that are not quite rectangles</h2>
<p>If a room has an alcove, a bay or an L-shape, split it into rectangles, find each area and add them. The method is explained in <a href="/blogs/article/how-to-find-the-area-of-an-irregular-shape">how to find the area of an irregular shape</a>. For triangles, trapezoids and other shapes, see <a href="/blogs/article/how-to-calculate-area-of-common-shapes">area formulas for common shapes</a>, and for round shapes, <a href="/blogs/article/area-of-a-circle-formula">the area of a circle</a>. If you are measuring a whole room, <a href="/blogs/article/how-to-calculate-square-footage">how to calculate square footage</a> adds the practical steps, and the <a href="/tools/area-calculator">area calculator</a> does the arithmetic for you.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Adding instead of multiplying.</strong> 12 + 10 is not the area. It is half the perimeter.</li>
<li><strong>Mixing units.</strong> Convert before you multiply, not after.</li>
<li><strong>Forgetting the squared unit.</strong> "120" is incomplete. "120 sq ft" is the answer.</li>
<li><strong>Measuring a sloped or uneven edge as a straight one.</strong> If the opposite sides are not equal, it is not a rectangle.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>What is the formula for the area of a rectangle?</h3>
<p>Area = length × width.</p>
<h3>What is the area of a rectangle that is 8 by 5?</h3>
<p>8 × 5 = 40 square units.</p>
<h3>Is the area of a square the same formula?</h3>
<p>Yes. A square is a rectangle with equal sides, so length × width becomes side × side.</p>
<h3>How do I find the width if I know the area and length?</h3>
<p>Divide the area by the length. An area of 150 and a length of 15 gives a width of 10.</p>
<h3>Does it matter which side is the length?</h3>
<p>No. Multiplication gives the same result in either order.</p>
`,
};
