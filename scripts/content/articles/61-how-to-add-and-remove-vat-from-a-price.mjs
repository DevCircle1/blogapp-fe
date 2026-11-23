export default {
  slug: 'how-to-add-and-remove-vat-from-a-price',
  title: 'How to Add or Remove VAT From a Price (With Examples)',
  category: 'finance',
  theme: 'finance',
  tags: ['how to calculate vat', 'remove vat from price', 'add vat to price', 'vat inclusive price', 'reverse vat calculation', 'gst calculation'],
  description: 'Add VAT by multiplying by 1 + rate, remove it by dividing. Worked examples at 20%, 19% and 18%, the common mistake that undercounts tax, and invoice rules.',
  cover: {
    kicker: 'Multiply to add it, divide to take it out',
    visual: { type: 'formula', title: 'REMOVE 20% VAT', lines: ['£120 ÷ 1.20', '= £100 net', 'VAT = £120 − £100', '= £20'] },
  },
  infographic: {
    type: 'table',
    title: 'VAT multipliers at common rates',
    subtitle: 'Multiply the net price by the first number to add VAT. Divide a VAT-inclusive price by the first number to remove it.',
    columns: ['Rate', 'Multiplier', 'Share of the gross that is VAT'],
    widths: [352, 352, 352],
    rows: [
      ['5%', '1.05', '4.76%'], ['10%', '1.10', '9.09%'], ['15%', '1.15', '13.04%'],
      ['18%', '1.18', '15.25%'], ['19%', '1.19', '15.97%'], ['20%', '1.20', '16.67%'],
      ['21%', '1.21', '17.36%'], ['23%', '1.23', '18.70%'],
    ],
    alt: 'Table of VAT rates with the multiplier to add VAT and the share of a VAT-inclusive price that is tax',
    caption: 'At 20%, one sixth of the price you pay is VAT, not one fifth.',
    footer: 'Calculate any rate: talkandtool.com/tools/vat-calculator',
  },
  html: `
<p>To add VAT to a price, multiply it by 1 plus the rate as a decimal: £100 at 20% is £100 × 1.20 = £120. To take VAT out of a price that already includes it, divide by the same number: £120 ÷ 1.20 = £100. The VAT itself is the difference. The mistake almost everyone makes is subtracting 20% from the gross price, which removes too little tax. This guide shows both directions with worked examples.</p>

{{infographic}}

<h2>VAT and GST: the same calculation</h2>
<p>Value-added tax (VAT) and goods and services tax (GST) are the same idea under different names. Each business in a supply chain charges tax on what it sells and reclaims the tax it paid on what it bought, so the tax ends up falling on the final customer. The UK, the EU and the Gulf states say VAT; Australia, Canada, India, New Zealand and Pakistan say GST. The arithmetic does not change, only the rate does. If you want the one-click version, use the <a href="/tools/vat-calculator">VAT calculator</a>, which has presets for the common rates.</p>

<h2>Adding VAT to a net price</h2>
<p>If the price is before tax, convert the rate to a decimal, add 1, and multiply.</p>
<ul>
<li><strong>Formula:</strong> gross = net × (1 + rate ÷ 100)</li>
<li><strong>Example, 20% (UK):</strong> £250 × 1.20 = £300. The VAT is £50.</li>
<li><strong>Example, 19% (Germany):</strong> €80 × 1.19 = €95.20. The VAT is €15.20.</li>
<li><strong>Example, 18% (Pakistan GST):</strong> Rs 10,000 × 1.18 = Rs 11,800. The tax is Rs 1,800.</li>
</ul>
<p>If you only want the tax amount, multiply the net price by the rate: £250 × 0.20 = £50.</p>

<h2>Removing VAT from a gross price</h2>
<p>If the price already contains VAT, as most shelf prices in Europe do, divide by 1 plus the rate.</p>
<ul>
<li><strong>Formula:</strong> net = gross ÷ (1 + rate ÷ 100)</li>
<li><strong>Example, 20%:</strong> £59.99 ÷ 1.20 = £49.99 net, so VAT is £10.00.</li>
<li><strong>Example, 21% (Spain):</strong> €121 ÷ 1.21 = €100 net, so VAT is €21.</li>
<li><strong>Example, 5%:</strong> £21 ÷ 1.05 = £20 net, so VAT is £1.</li>
</ul>

<h2>The mistake: taking 20% off the total</h2>
<p>It is tempting to remove VAT from £120 by taking 20% off. But 20% of £120 is £24, which leaves £96. The real net price is £100. The error happens because VAT was calculated on the net price (£100), and £20 is only one sixth of £120, or 16.67% of the gross. The same trap exists with every rate: 15.25% of an 18% GST-inclusive price is tax, 15.97% at 19%, and 18.70% at 23%. The table above lists them. If you are working out percentages more generally, <a href="/blogs/article/how-to-calculate-percentage-increase-decrease">how to calculate percentage increase and decrease</a> explains why the base number matters.</p>

<h2>A quick mental method</h2>
<p>For 20% VAT, the VAT in a gross price is one sixth of it. Divide the gross by 6 to find the tax, then subtract: £90 ÷ 6 = £15 VAT, net £75. For 10% VAT it is one eleventh. For 5% it is one twenty-first. These shortcuts are handy for checking a receipt.</p>

<h2>Rounding on invoices</h2>
<p>Round VAT to the nearest penny, cent or paisa. If an invoice has several lines, authorities generally accept calculating VAT on each line or on the invoice total, but you must be consistent, and a total calculated both ways can differ by a penny. Show the net amount, the VAT rate, the VAT amount and the gross amount separately so the buyer can reclaim it. Rules differ by country, so confirm the format with your tax authority or accountant.</p>

<h2>Zero-rated, reduced and exempt goods</h2>
<p>Not everything carries the standard rate. Many countries apply a reduced rate to goods such as food, books or energy, charge 0% on some supplies (zero-rated), or exempt others entirely (exempt). Zero-rated and exempt are different: a zero-rated business can still reclaim the VAT on its costs, an exempt one usually cannot. Check which category your product is in before using a rate. Rates also change with budgets, so use the figures your tax authority publishes rather than a table from last year.</p>

<h2>Pricing and margin</h2>
<p>If you sell at a VAT-inclusive price, your income per sale is the net amount, not the price on the shelf. Work out your margin on the net figure, otherwise you will overestimate what you earn. The difference between markup and margin is explained in <a href="/blogs/article/markup-vs-margin">markup vs margin</a>, and the <a href="/tools/margin-markup-calculator">margin and markup calculator</a> does the sums. In the US, sales tax works the other way round, because it is added at the till, which the <a href="/tools/sales-tax-calculator">sales tax calculator</a> handles. If you are checking a discounted price, apply the <a href="/tools/discount-calculator">discount</a> first or after tax according to how the shop displays it.</p>

<h2>Frequently asked questions</h2>
<h3>How do I calculate 20% VAT on £100?</h3>
<p>Multiply by 0.20 to get the VAT, £20, or multiply by 1.20 to get the total, £120.</p>
<h3>How do I take VAT off a price?</h3>
<p>Divide the VAT-inclusive price by 1 plus the rate. For 20%, divide by 1.2. Do not subtract 20% of the total.</p>
<h3>What is the VAT fraction?</h3>
<p>It is the share of a VAT-inclusive price that is tax: rate ÷ (100 + rate). At 20% it is 20/120, or 1/6.</p>
<h3>Is GST calculated the same way as VAT?</h3>
<p>Yes. Add GST by multiplying by 1 plus the rate, and remove it by dividing by the same number.</p>
<h3>Where can I check my calculation?</h3>
<p>Enter the amount and rate into the <a href="/tools/vat-calculator">VAT calculator</a> and compare net, VAT and gross with your own working.</p>
`,
};
