export default {
  slug: 'markup-vs-margin',
  title: 'Markup vs Margin: The Difference, the Formulas and a Chart',
  category: 'finance',
  theme: 'finance',
  tags: ['markup vs margin', 'margin vs markup', 'gross margin formula', 'markup formula', 'pricing', 'profit margin'],
  description: 'Markup and margin both describe profit but use different bases. Learn the formulas, how to convert between them, and a chart showing why 50% markup is only 33% margin.',
  cover: {
    kicker: 'Same profit, different percentage',
    visual: {
      type: 'bars',
      title: 'Cost 60, price 100',
      items: [
        { label: 'Margin', value: 40, display: '40%' },
        { label: 'Markup', value: 66.7, display: '66.7%', highlight: true },
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Markup to margin conversion',
    subtitle: 'The same profit expressed both ways.',
    columns: ['Markup on cost', 'Gross margin', 'Cost 100 sells for'],
    widths: [320, 320, 416],
    rows: [
      ['10%', '9.1%', '110'],
      ['20%', '16.7%', '120'],
      ['25%', '20.0%', '125'],
      ['50%', '33.3%', '150'],
      ['100%', '50.0%', '200'],
    ],
    alt: 'Table converting markup percentages to gross margin percentages for an item with cost 100',
    caption: 'Margin is always the smaller number, and the gap widens as the percentage grows.',
    footer: 'Convert either way: talkandtool.com/tools/margin-markup-calculator',
  },
  html: `
<p>Markup and margin both describe the profit on a sale, but they measure it against different things. Markup is profit as a percentage of cost. Margin is profit as a percentage of the selling price. Because the price is larger than the cost, margin is always the smaller number, and confusing the two is a quick way to under-price a product. Here are the formulas, a conversion chart and the common mistake.</p>

<h2>The two formulas</h2>
<p>Let <em>profit = price − cost</em>.</p>
<ul>
<li><strong>Markup % = profit ÷ cost × 100</strong></li>
<li><strong>Margin % = profit ÷ price × 100</strong></li>
</ul>
<p>Example: an item costs 60 and sells for 100, so the profit is 40.</p>
<ul>
<li>Markup = 40 ÷ 60 = 66.7%</li>
<li>Margin = 40 ÷ 100 = 40%</li>
</ul>
<p>Same item, same profit, two different percentages. Neither is wrong; they answer different questions. Markup says "how much did I add on top of what I paid?" Margin says "how much of every sale do I keep?"</p>

{{infographic}}

<h2>Converting between them</h2>
<p>You can convert one to the other with simple formulas, using the percentages as decimals:</p>
<ul>
<li><strong>Margin = markup ÷ (1 + markup)</strong></li>
<li><strong>Markup = margin ÷ (1 − margin)</strong></li>
</ul>
<p>A 50% markup (0.5) gives a margin of 0.5 ÷ 1.5 = 33.3%. A 40% margin (0.4) gives a markup of 0.4 ÷ 0.6 = 66.7%, matching the example above. The <a href="/tools/margin-markup-calculator">margin and markup calculator</a> does the conversion and also finds the selling price for a target.</p>

<h2>Finding the selling price</h2>
<p>This is where mistakes cost real money.</p>
<ul>
<li><strong>From a target markup:</strong> price = cost × (1 + markup). Cost 80 with a 25% markup is 80 × 1.25 = 100.</li>
<li><strong>From a target margin:</strong> price = cost ÷ (1 − margin). Cost 80 with a 25% margin is 80 ÷ 0.75 = 106.67.</li>
</ul>
<p>The two prices differ by 6.67 on the same item. If you want a 25% margin but apply a 25% markup, you actually earn a 20% margin and give up 5 points of every sale. Over thousands of units, that is the gap between a healthy business and a thin one.</p>

<h2>Which one should you use?</h2>
<p>Both have uses, as long as you know which one you are reading.</p>
<ul>
<li><strong>Markup</strong> is convenient for setting prices from known costs. Retailers and contractors often add a standard markup to cost.</li>
<li><strong>Margin</strong> is the standard for reporting and comparing profitability, because it ties directly to revenue: a 30% margin means 30 cents of profit per dollar of sales. Income statements, investors and benchmarks use margin.</li>
</ul>
<p>The cleanest practice is to price using whichever is easier, then report margin, so numbers from different products and periods can be compared. If you receive a figure and do not know which it is, ask. "We make 30% on everything" has two very different meanings.</p>

<h2>Gross margin vs net margin</h2>
<p>The margin above is <strong>gross margin</strong>: price minus the direct cost of the product. It does not include rent, wages, marketing, shipping to the customer, payment fees or tax. <strong>Net margin</strong> subtracts all of those, so it is lower. When you set a price, a gross margin target must be large enough to cover the overheads and leave a profit. A product with a 30% gross margin and 35% in overheads loses money on every sale.</p>

<h2>Quick reference</h2>
<ul>
<li>Margin &lt; markup, always, for any profit above zero.</li>
<li>A 100% markup is a 50% margin: you double the cost.</li>
<li>Margin cannot exceed 100%; markup can.</li>
<li>Discounts reduce margin faster than they look: see <a href="/blogs/article/how-to-calculate-percentage-increase-decrease">how to calculate a percentage change</a> for the arithmetic of a price cut.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Is markup or margin higher?</h3>
<p>Markup is higher for the same profit, because it divides by the smaller number (cost) instead of the larger one (price).</p>
<h3>How do I turn a 50% markup into margin?</h3>
<p>Divide the markup by one plus the markup: 0.5 ÷ 1.5 = 33.3%.</p>
<h3>Can margin be 100%?</h3>
<p>Only if the cost is zero. A product that cost nothing to supply would have a 100% margin. Services with low direct cost can approach it.</p>
<h3>What is a good margin?</h3>
<p>It depends heavily on the industry. Grocery retail often runs in single digits to the low twenties, while software and some services exceed 70%. Compare against your own sector rather than a general figure.</p>
`,
};
