export default {
  slug: 'how-much-flooring-do-i-need',
  title: 'How Much Flooring Do I Need? Square Footage Plus Waste',
  category: 'math',
  theme: 'math',
  tags: ['how much flooring do i need', 'flooring calculator', 'waste factor flooring', 'tile calculator', 'laminate coverage per box', 'square feet to boxes'],
  description: 'Measure the room, add 5–15% waste for your layout, then divide by the coverage per box. A worked example, waste percentages by material and a cost estimate.',
  cover: {
    kicker: 'Area + waste, divided by coverage per box',
    visual: { type: 'checklist', items: ['Measure room area in sq ft', 'Add 5–15% waste', 'Divide by coverage per box', 'Round up to whole boxes'] },
  },
  infographic: {
    type: 'table',
    title: 'Typical waste allowance by layout',
    subtitle: 'Add this percentage to the measured area before dividing by coverage per box.',
    columns: ['Material and layout', 'Waste', 'Buy for a 144 sq ft room'],
    widths: [500, 200, 356],
    rows: [
      ['Laminate or vinyl plank, straight', '5–7%', '151–154 sq ft'],
      ['Laminate or vinyl plank, diagonal', '10–15%', '158–166 sq ft'],
      ['Hardwood, straight', '7–10%', '154–158 sq ft'],
      ['Ceramic or porcelain tile, straight', '10%', '158 sq ft'],
      ['Tile, diagonal or patterned', '15–20%', '166–173 sq ft'],
      ['Carpet (roll width limits)', '5–10%', '151–158 sq ft'],
    ],
    alt: 'Table of recommended flooring waste percentages by material and layout with the amount to buy for a 144 square foot room',
    caption: 'These are common rules of thumb. Always check the manufacturer’s guidance and keep a spare box.',
    footer: 'Measure the area first: talkandtool.com/tools/area-calculator',
  },
  html: `
<p>To work out how much flooring you need, multiply the room's length by its width to get the area, add a waste allowance of 5 to 15% depending on the material and layout, then divide by the coverage of one box and round up. A 12 × 12 ft room is 144 sq ft; with 10% waste you need 158.4 sq ft, which is 8 boxes of a 20 sq ft pack.</p>

<h2>Step 1: measure the area</h2>
<p>Measure the length and width of each room in feet and multiply. For L-shaped rooms, split the space into rectangles and add them. Include closets and alcoves if the flooring will run into them, and subtract only large fixed items such as built-in cabinets. Our guide to <a href="/blogs/article/how-to-calculate-square-footage">calculating square footage</a> covers irregular shapes, and the <a href="/tools/area-calculator">area calculator</a> does the maths for rectangles, triangles, circles and more.</p>
<p>If your measurements are in metric, multiply square metres by 10.764 to get square feet, or convert dimensions first. See <a href="/blogs/article/how-to-convert-cm-to-feet-and-inches">converting cm to feet and inches</a> if you only have centimetres.</p>

<h2>Step 2: add a waste allowance</h2>
<p>You always need more than the floor area, because of cuts at walls, doorways and obstacles, off-cuts that cannot be reused, a few damaged pieces, and mistakes. The allowance depends on the layout:</p>

{{infographic}}

<ul>
<li><strong>Straight layouts in a square room</strong> waste the least: about 5–10%.</li>
<li><strong>Diagonal layouts</strong> require angled cuts at every edge, so allow 10–15% or more.</li>
<li><strong>Small or complex rooms</strong> (many corners, bay windows) need extra, because a larger share of boards is cut.</li>
<li><strong>Patterns and large tiles</strong> such as herringbone, or tile bigger than 24 inches, may need 15–20%.</li>
<li><strong>Natural materials</strong> like hardwood or stone vary in colour and grain, so you may discard boards. Many installers add 10% for hardwood.</li>
</ul>
<p>Formula: <strong>total to buy = area × (1 + waste %)</strong>. For 144 sq ft at 10%: 144 × 1.10 = 158.4 sq ft.</p>

<h2>Step 3: convert to boxes</h2>
<p>Flooring is sold in boxes (or cartons, or rolls) that cover a fixed area, printed on the packaging. Divide your total by the coverage and round <em>up</em>:</p>
<ul>
<li>158.4 ÷ 20 sq ft per box = 7.92, so buy <strong>8 boxes</strong>.</li>
<li>With 23.4 sq ft per box: 158.4 ÷ 23.4 = 6.77, so buy <strong>7 boxes</strong>.</li>
</ul>
<p>Never round down. Buying one box short can mean waiting for a new batch that does not match the first in colour (batch variation is real, particularly with tile and wood). Buy everything from the same production lot where you can.</p>

<h2>Step 4: estimate the cost</h2>
<p>Multiply the total square footage you are buying by the price per square foot. Eight boxes of 20 sq ft at $3.50 per sq ft costs 160 × 3.50 = $560 before tax. Then add underlayment, adhesive or grout, trims and transitions, and tools or labour if you are hiring. Use the <a href="/tools/sales-tax-calculator">sales tax calculator</a> to add tax, and the <a href="/tools/discount-calculator">discount calculator</a> to compare sale prices between suppliers. Labour is often charged per square foot, so the area figure helps there too.</p>

<h2>Worked example: living room with an alcove</h2>
<ul>
<li>Main room: 15 ft × 12 ft = 180 sq ft</li>
<li>Alcove: 4 ft × 3 ft = 12 sq ft</li>
<li>Total area: 192 sq ft</li>
<li>Waste for straight laminate at 7%: 192 × 1.07 = 205.4 sq ft</li>
<li>Box coverage 24.5 sq ft: 205.4 ÷ 24.5 = 8.4, so <strong>9 boxes</strong> (220.5 sq ft, leaving a spare of about 28 sq ft)</li>
</ul>
<p>The spare is useful: keep a few planks or tiles for future repairs, since the same pattern may be discontinued later.</p>

<h2>Other things to check before you buy</h2>
<ul>
<li><strong>Acclimation.</strong> Wood and laminate usually need to sit in the room for 48 hours or as the manufacturer says before installation.</li>
<li><strong>Subfloor condition.</strong> Uneven or damp floors need levelling or moisture barriers, which affect cost.</li>
<li><strong>Expansion gaps.</strong> Floating floors need a gap around the edge, typically ¼ to ½ inch, covered by skirting or trim.</li>
<li><strong>Door clearances and transitions.</strong> New thickness can change how doors swing and how the floor meets other rooms.</li>
<li><strong>Stairs.</strong> Treat each tread and riser separately; do not simply count their area as a flat floor.</li>
</ul>

<h2>Painting and other area-based jobs</h2>
<p>The same approach (measure, add waste, divide by coverage) works for paint, turf, mulch and tile. Wall paint uses the wall area, which is the room perimeter times the height, minus doors and windows. For a ratio-based mix such as grout or concrete, see <a href="/blogs/article/how-to-simplify-a-ratio">how to simplify a ratio</a>, and use the <a href="/tools/percentage-calculator">percentage calculator</a> for waste percentages.</p>

<h2>Frequently asked questions</h2>
<h3>How much extra flooring should I buy?</h3>
<p>About 5–10% for simple straight layouts and 10–15% or more for diagonal layouts, patterns or complex rooms.</p>
<h3>How many boxes of flooring for 200 square feet?</h3>
<p>With 10% waste you need 220 sq ft. At 20 sq ft per box, that is 11 boxes.</p>
<h3>Do I include closets in the measurement?</h3>
<p>Include them if the flooring continues into them. Skip them if they are carpeted differently or will have another finish.</p>
<h3>Should I measure in square feet or square metres?</h3>
<p>Use whichever unit the product is sold in, and convert if needed. One square metre is 10.764 square feet.</p>
`,
};
