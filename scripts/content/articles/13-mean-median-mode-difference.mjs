export default {
  slug: 'mean-median-mode-difference',
  title: 'Mean vs Median vs Mode: How to Calculate Each (With Examples)',
  category: 'math',
  theme: 'math',
  tags: ['mean median mode', 'median calculator', 'mean calculator', 'how to find the median', 'average calculator', 'statistics basics'],
  description: 'Mean adds and divides, median is the middle value, mode is the most common. See how to calculate each with worked examples, and why one outlier breaks the mean.',
  cover: {
    kicker: 'Why one outlier can wreck your average',
    visual: {
      type: 'bars',
      title: 'Seven salaries (thousands)',
      items: [
        { label: '32', value: 32 }, { label: '35', value: 35 }, { label: '38', value: 38 },
        { label: '38', value: 38 }, { label: '41', value: 41 }, { label: '45', value: 45 },
        { label: '250', value: 250, highlight: true },
      ].map((item) => ({ ...item, display: '' })),
    },
  },
  infographic: {
    type: 'table',
    title: 'Mean, median and mode side by side',
    subtitle: 'Same data set: salaries of 32k, 35k, 38k, 38k, 41k, 45k and 250k.',
    columns: ['Measure', 'How to calculate', 'Result', 'Best for'],
    widths: [170, 380, 150, 356],
    rows: [
      ['Mean', 'Add all values, divide by count', '68.4k', 'Symmetric data, no outliers'],
      ['Median', 'Sort, take the middle value', '38k', 'Skewed data: pay, house prices'],
      ['Mode', 'Most frequent value', '38k', 'Categories, sizes, ratings'],
      ['Range', 'Largest minus smallest', '218k', 'A quick sense of spread'],
    ],
    alt: 'Table comparing mean, median, mode and range for a set of seven salaries including one large outlier',
    caption: 'One 250k salary pulls the mean to 68.4k, above what six of the seven people earn.',
    footer: 'Calculate all three: talkandtool.com/tools/average-calculator',
  },
  html: `
<p>The mean is the sum of all values divided by how many there are. The median is the middle value once they are sorted. The mode is the value that appears most often. All three are "averages", and they can give very different answers for the same data. Here is how to calculate each, and how to pick the right one.</p>

<h2>How to calculate the mean</h2>
<p>Add every value, then divide by the number of values.</p>
<p><strong>Mean = sum of values ÷ number of values</strong></p>
<p>Example: test scores of 72, 85, 90, 64 and 89. The sum is 400, there are 5 scores, so the mean is 400 ÷ 5 = <strong>80</strong>.</p>
<p>The mean uses every data point, which is its strength and its weakness. It reflects the total exactly: 5 scores averaging 80 always add up to 400. But a single extreme value can drag it far from what is typical.</p>

<h2>How to find the median</h2>
<ol>
<li>Sort the values from smallest to largest.</li>
<li>If there is an odd number of values, the median is the middle one.</li>
<li>If there is an even number, the median is the mean of the two middle values.</li>
</ol>
<p>Odd example: 64, 72, <strong>85</strong>, 89, 90. The median is 85.</p>
<p>Even example: 3, <strong>7, 8</strong>, 12. The two middle values are 7 and 8, so the median is (7 + 8) ÷ 2 = <strong>7.5</strong>.</p>
<p>A quick way to find the middle position in a sorted list of <em>n</em> values is (<em>n</em> + 1) ÷ 2. For 5 values that is the 3rd. For 4 values it is 2.5, meaning halfway between the 2nd and 3rd.</p>

<h2>How to find the mode</h2>
<p>Count how often each value appears. The most frequent is the mode.</p>
<ul>
<li>2, 4, <strong>4</strong>, 5, 7: the mode is 4.</li>
<li>1, <strong>3</strong>, <strong>3</strong>, 6, <strong>6</strong>, 9: two modes, 3 and 6 (bimodal).</li>
<li>1, 2, 3, 4: no mode, because every value appears once.</li>
</ul>
<p>The mode is the only average that works for non-numeric data. You cannot take the mean of shirt sizes, but "medium" can be the mode.</p>

<h2>One data set, three answers</h2>
<p>Here is where the choice matters. Seven people's salaries: 32k, 35k, 38k, 38k, 41k, 45k and 250k.</p>

{{infographic}}

<p>The mean is 479k ÷ 7 = <strong>68.4k</strong>, higher than six of the seven salaries. The median and mode are both <strong>38k</strong>, which describes the typical person far better. That is why income, house prices and wealth are almost always reported as medians: a few very large values would make the mean misleading.</p>

<h2>Which average should you use?</h2>
<ul>
<li><strong>Use the mean</strong> when the data is roughly symmetric with no extreme values, such as heights, exam scores in a large class, or manufacturing measurements. Also use it when the total matters: average spend per order × orders = revenue.</li>
<li><strong>Use the median</strong> when the data is skewed or has outliers, such as incomes, prices, response times and delivery times. For website performance, the median load time better describes a typical visit, while high percentiles describe the slow tail.</li>
<li><strong>Use the mode</strong> for categories and discrete choices, such as the most common shoe size, the most chosen product option, or the most frequent rating.</li>
</ul>
<p>When the mean and median are far apart, that gap itself is informative: it tells you the data is skewed. Mean well above median means a long tail of high values.</p>

<h2>Weighted mean</h2>
<p>When values count differently, multiply each by its weight, add, then divide by the total weight. A course graded as coursework 40% (score 75) and exam 60% (score 62): (0.4 × 75) + (0.6 × 62) = 30 + 37.2 = <strong>67.2</strong>. The same method drives GPA calculations, covered in <a href="/blogs/article/how-to-calculate-gpa-4-0-scale">how to calculate GPA on a 4.0 scale</a>, and final-grade planning, covered in <a href="/blogs/article/what-score-do-i-need-on-my-final-exam">what score do I need on my final exam</a>.</p>

<h2>Calculating them quickly</h2>
<p>For a handful of numbers, the steps above take seconds. For longer lists, paste them into the <a href="/tools/average-calculator">average calculator</a>, which returns the mean, median, mode, range and standard deviation at once, from numbers pasted in any format. In a spreadsheet, the functions are <code>=AVERAGE()</code>, <code>=MEDIAN()</code> and <code>=MODE.SNGL()</code> (or <code>=MODE.MULT()</code> for several modes).</p>
<p>If you are comparing how much two averages have changed, the <a href="/tools/percentage-calculator">percentage calculator</a> and our guide to <a href="/blogs/article/how-to-calculate-percentage-increase-decrease">percentage increase and decrease</a> cover the next step.</p>

<h2>Frequently asked questions</h2>
<h3>Is the average the same as the mean?</h3>
<p>In everyday use, "average" usually means the mean. Strictly, mean, median and mode are all types of average.</p>
<h3>Can the median be a number not in the data?</h3>
<p>Yes. With an even number of values, the median is halfway between the two middle ones, so it may not appear in the list (7.5 in the example above).</p>
<h3>What if there is no mode?</h3>
<p>If every value appears once, the data set has no mode. That is common with continuous measurements like weights or times.</p>
`,
};
