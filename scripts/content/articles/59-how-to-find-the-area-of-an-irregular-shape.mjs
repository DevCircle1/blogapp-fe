export default {
  slug: 'how-to-find-the-area-of-an-irregular-shape',
  title: 'How to Find the Area of an Irregular Shape (L-Shaped Rooms Too)',
  category: 'math',
  theme: 'math',
  tags: ['area of an irregular shape', 'area of an l-shaped room', 'how to find area', 'composite shapes', 'shoelace formula', 'area by grid method'],
  description: 'Four ways to find the area of an irregular shape or L-shaped room: split it, subtract a cut-out, count grid squares, or use coordinates. Worked examples included.',
  cover: {
    kicker: 'Split it, subtract it, or use coordinates',
    visual: { type: 'formula', title: 'L-SHAPED ROOM', lines: ['12 × 6 = 72', '+ 7 × 4 = 28', 'Total = 100 sq ft', 'or 12 × 10 − 5 × 4'] },
  },
  infographic: {
    type: 'table',
    title: 'Four ways to measure an irregular shape',
    subtitle: 'Pick the method that matches the shape. Straight edges favour the first two, curves the third.',
    columns: ['Method', 'Best for', 'How it works', 'Example'],
    widths: [210, 250, 440, 196],
    rows: [
      ['Split and add', 'L, T and U shapes', 'Cut into rectangles and triangles, add the areas', '72 + 28 = 100'],
      ['Subtract a cut-out', 'Rooms with a notch', 'Area of the full box minus the missing piece', '120 − 20 = 100'],
      ['Grid counting', 'Curves and maps', 'Count whole squares, then pair up the part squares', '≈ 33 squares'],
      ['Coordinates (shoelace)', 'Any straight-edged polygon', 'Cross-multiply the corner points and halve the difference', '33'],
    ],
    alt: 'Table of four methods to find the area of an irregular shape: split and add, subtract a cut-out, grid counting and the shoelace coordinate formula',
    caption: 'If a shape has curves, split off the curved part and treat it as a circle segment.',
    footer: 'Check your sums: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>To find the area of an irregular shape, split it into simple shapes you already have formulas for, such as rectangles, triangles and semicircles, find each area, and add them together. If the shape is a larger rectangle with a piece missing, find the full area and subtract the missing part. For curved outlines, use a grid, and for any polygon where you know the corner coordinates, use the shoelace formula.</p>

{{infographic}}

<h2>Method 1: split the shape and add</h2>
<p>This is the method for most rooms and gardens. Draw the shape, then draw lines that cut it into rectangles (or triangles), label every side, and work out each piece.</p>
<p>Take an L-shaped room. The bottom part is 12 ft wide and 6 ft tall, and the top part is 7 ft wide and 4 ft tall.</p>
<ol>
<li>Bottom rectangle: 12 × 6 = 72 sq ft.</li>
<li>Top rectangle: 7 × 4 = 28 sq ft.</li>
<li>Total: 72 + 28 = 100 sq ft.</li>
</ol>
<p>The cuts can go in different directions, and every direction gives the same answer. If you slice the same L vertically instead, into a 7 × 10 rectangle and a 5 × 6 rectangle, you get 70 + 30 = 100. When two methods agree, you have probably measured correctly.</p>

<h2>Method 2: subtract the missing piece</h2>
<p>Often it is quicker to treat the shape as a full rectangle and take away the notch. The same L-shaped room fits inside a 12 ft by 10 ft rectangle (120 sq ft) with a 5 ft by 4 ft corner missing (20 sq ft). The area is 120 − 20 = 100 sq ft, the same result in one line of arithmetic.</p>
<p>This works well for rooms with a chimney breast, a bay window cut-out or a built-in cupboard, and for a lawn with a patio in the middle.</p>

<h2>Triangles and sloped edges</h2>
<p>When one side is slanted, the extra piece is usually a triangle, with area ½ × base × height. A plot that is a 6 m by 4 m rectangle with a triangular end 6 m wide and 3 m high has an area of 24 + ½ × 6 × 3 = 24 + 9 = 33 m². The height of a triangle is the straight-line distance from the base to the top point, measured at a right angle, not along the slanted side. Formulas for trapezoids and other shapes are in <a href="/blogs/article/how-to-calculate-area-of-common-shapes">area formulas for common shapes</a>.</p>

<h2>Shapes with a curve</h2>
<p>Split off the curved part and treat it as part of a circle. A garden bed that is a 10 m by 6 m rectangle with a semicircular end of radius 3 m has an area of 60 + ½ × π × 3² = 60 + 14.14 = 74.14 m². The circle formulas are covered in <a href="/blogs/article/area-of-a-circle-formula">area of a circle</a>. Keep π unrounded until the last step to avoid drift.</p>

<h2>Method 3: the grid method for freeform outlines</h2>
<p>For a pond, a lake on a map or an outline with no straight sides, lay a grid over it. Choose a square size that suits the scale, such as 1 m or 1 cm. Then:</p>
<ol>
<li>Count the squares that are completely inside the outline.</li>
<li>Count the squares that are partly inside. Half of them, roughly, is the area they add.</li>
<li>Add the whole squares to half the partial squares, then multiply by the area of one square.</li>
</ol>
<p>With 28 whole squares and 10 partial ones on a 1 m grid, the area is about 28 + 5 = 33 m². A finer grid gives a more accurate estimate, and the error is usually a few percent for a reasonably large shape.</p>

<h2>Method 4: coordinates and the shoelace formula</h2>
<p>If you know the position of each corner, for example from a plan, a survey or a map, the shoelace formula gives the exact area of any polygon with straight edges. List the corners in order around the shape, then for each pair of neighbours calculate (x₁ × y₂) − (x₂ × y₁), add all the results, and halve the absolute value.</p>
<p>Corners (0, 0), (6, 0), (6, 4), (3, 7), (0, 4):</p>
<ul>
<li>(0 × 0) − (6 × 0) = 0</li>
<li>(6 × 4) − (6 × 0) = 24</li>
<li>(6 × 7) − (3 × 4) = 30</li>
<li>(3 × 4) − (0 × 7) = 12</li>
<li>(0 × 0) − (0 × 4) = 0</li>
</ul>
<p>The sum is 66, and half of that is 33. This matches the 6 × 4 rectangle (24) plus a triangle with a base of 6 and a height of 3 (9). Go around the corners in order, either clockwise or anticlockwise, but do not jump across the shape.</p>

<h2>Turning the result into a room measurement</h2>
<p>For floors, paint and carpet, the area you need is the sum of every part you will cover, so measure alcoves and bays too, and leave out areas that will not be covered, such as a fitted wardrobe. Then add waste: about 5 to 10% for straight layouts, and more for diagonals and patterns. Our guides on <a href="/blogs/article/how-to-calculate-square-footage">calculating square footage</a> and <a href="/blogs/article/how-much-flooring-do-i-need">how much flooring you need</a> cover this step. Rooms that are plain rectangles are quicker with the <a href="/blogs/article/area-of-a-rectangle-formula">area of a rectangle formula</a>, and the <a href="/tools/area-calculator">area calculator</a> handles each piece for you.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Using a sloped side as the height.</strong> A triangle's height is measured at a right angle to the base.</li>
<li><strong>Counting an overlap twice.</strong> If your pieces overlap, the shared area is added twice. Cut the shape cleanly.</li>
<li><strong>Missing a dimension.</strong> Work out any unlabelled side from the ones you have. In the L-shape, the top width is 12 − 5 = 7.</li>
<li><strong>Mixing units.</strong> Convert everything to one unit first.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How do you find the area of an L-shaped room?</h3>
<p>Split it into two rectangles and add their areas, or measure the full bounding rectangle and subtract the missing corner.</p>
<h3>What is the formula for the area of an irregular shape?</h3>
<p>There is no single formula. You divide the shape into regular shapes, apply each formula and add the results.</p>
<h3>How accurate is the grid method?</h3>
<p>It is an estimate. A finer grid improves it, and for most practical jobs a few percent of error is acceptable.</p>
<h3>Can I find the area from the perimeter?</h3>
<p>Not for an irregular shape. Many different shapes share the same perimeter and have different areas, so you need the dimensions or corner positions.</p>
`,
};
