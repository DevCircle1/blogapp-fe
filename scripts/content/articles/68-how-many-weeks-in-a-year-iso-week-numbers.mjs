export default {
  slug: 'how-many-weeks-in-a-year-iso-week-numbers',
  title: 'How Many Weeks Are in a Year? ISO Week Numbers Explained',
  category: 'math',
  theme: 'math',
  tags: ['how many weeks in a year', 'iso week number', 'what week is it', 'week 53', 'week number calculator', 'iso 8601 week'],
  description: 'A year has 52 weeks and 1 or 2 days, but ISO years have 52 or 53. Learn how week 1 is defined, why week numbers differ by country, and how to find any week.',
  cover: {
    kicker: '52 weeks, plus a day or two, plus week 53',
    visual: { type: 'stat', value: '52.18', label: 'weeks in an average year', note: '365.25 days ÷ 7, so ISO years have 52 or 53' },
  },
  infographic: {
    type: 'table',
    title: 'Which years have 53 ISO weeks',
    subtitle: 'A year has 53 ISO weeks if it starts on a Thursday, or on a Wednesday in a leap year.',
    columns: ['Year', 'ISO weeks', 'Week 1 starts'],
    widths: [300, 300, 456],
    rows: [
      ['2024', '52', 'Monday 1 January 2024'], ['2025', '52', 'Monday 30 December 2024'],
      ['2026', '53', 'Monday 29 December 2025'], ['2027', '52', 'Monday 4 January 2027'],
      ['2028', '52', 'Monday 3 January 2028'], ['2029', '52', 'Monday 1 January 2029'],
      ['2030', '52', 'Monday 31 December 2029'], ['2032', '53', 'Monday 29 December 2031'],
    ],
    alt: 'Table of years with the number of ISO weeks and the date week 1 starts, showing that 2026 and 2032 have 53 weeks',
    caption: 'A 53-week year comes around about every five or six years.',
    footer: 'Find any week: talkandtool.com/tools/week-number-calculator',
  },
  html: `
<p>A calendar year has 52 weeks plus one day (two in a leap year), because 365 ÷ 7 is 52 with a remainder of 1. That remainder is why week-numbering systems sometimes give a year 53 weeks. Under the ISO 8601 standard used across Europe and in business planning, a year has either 52 or 53 numbered weeks, weeks start on Monday, and week 1 is the week that contains the year's first Thursday. This guide explains the rule, shows which years have 53 weeks, and covers how it differs from other systems.</p>

{{infographic}}

<h2>The simple answer</h2>
<p>There are 52 weeks and 1 day in a common year of 365 days, and 52 weeks and 2 days in a leap year of 366. The average year of 365.2425 days contains 52.18 weeks. So "52 weeks in a year" is a rounding, and calendars have to decide what to do with the extra day or two. For finding the number of days between two particular dates, see <a href="/blogs/article/days-between-two-dates">how to calculate days between two dates</a>.</p>

<h2>How ISO weeks work</h2>
<p>ISO 8601 defines a week as running Monday to Sunday and numbers weeks so that each belongs entirely to one year. Week 1 is the week that contains the first Thursday of the year. An equivalent definition: week 1 is the week with 4 January in it. Because weeks always start on Monday, the first days of January can fall into the last week of the previous year, and the last days of December can fall into week 1 of the next. For example:</p>
<ul>
<li>1 January 2026 is a Thursday, so it is in ISO week 1 of 2026, which starts on Monday 29 December 2025.</li>
<li>1 January 2021 was a Friday, so it belonged to week 53 of 2020.</li>
<li>30 December 2024 was a Monday, so it is already week 1 of 2025.</li>
</ul>

<h2>Which years have 53 weeks</h2>
<p>A year has 53 ISO weeks when it begins on a Thursday, or when it is a leap year that begins on a Wednesday. Put another way, the year has a 53rd week if it has 53 Thursdays. That happens roughly every five to six years. 2026 starts on a Thursday, so it has 53 weeks, and the last week runs from Monday 28 December 2026 to Sunday 3 January 2027. Other recent 53-week years include 2015 and 2020, and 2032 is the next after 2026. Knowing this matters for payroll, budgets and project plans that assume 52 weeks.</p>

<h2>Why week numbers differ between countries</h2>
<p>There is more than one convention, so the same date can have two different week numbers:</p>
<ul>
<li><strong>ISO 8601:</strong> Monday start, week 1 contains the first Thursday. Used in most of Europe, and common in business and logistics.</li>
<li><strong>US convention:</strong> Sunday start, and week 1 is the week containing 1 January, so the week can be a partial one.</li>
<li><strong>Middle Eastern convention:</strong> Saturday start in some countries, with week 1 containing 1 January.</li>
</ul>
<p>Spreadsheets add to the confusion. Excel's <code>WEEKNUM</code> uses the US system by default, while <code>ISOWEEKNUM</code> returns the ISO number. If a colleague in another country quotes "week 12", confirm which system they mean. The <a href="/tools/week-number-calculator">week number calculator</a> shows both side by side.</p>

<h2>How to find the week number of a date by hand</h2>
<ol>
<li>Find the day of the year (1 March is day 60 in a normal year).</li>
<li>Find the weekday of the date, numbering Monday as 1 and Sunday as 7.</li>
<li>Use: week = floor((day of year − weekday + 10) ÷ 7).</li>
<li>If the result is 0, the date belongs to the last week of the previous year. If it is 53, check whether that year really has 53 weeks. If not, it is week 1 of the next year.</li>
</ol>
<p>For example, 15 June 2026 is day 166 and a Monday (weekday 1). The calculation gives floor((166 − 1 + 10) ÷ 7) = floor(25) = 25, so it is ISO week 25.</p>

<h2>Finding the dates of a given week</h2>
<p>Go the other way by locating the Monday of week 1 (the Monday on or before 4 January), then adding 7 days for each extra week. ISO week 1 of 2027 starts on Monday 4 January 2027, so week 10 starts 63 days later, on Monday 8 March. You can skip the work with the second panel of the <a href="/tools/week-number-calculator">calculator</a>.</p>

<h2>Using week numbers in planning</h2>
<ul>
<li><strong>Sprints and projects:</strong> label deadlines with a week number and year, such as 2026-W24, to avoid ambiguity.</li>
<li><strong>Payroll:</strong> weekly pay and the hours worked in each week can be tracked with the <a href="/tools/timesheet-hours-calculator">timesheet hours calculator</a>, and the <a href="/blogs/article/how-to-calculate-hours-worked-and-overtime">overtime guide</a> explains the rules.</li>
<li><strong>Delivery dates:</strong> many shipping and manufacturing systems state "week 32" instead of a date.</li>
<li><strong>Cross-timezone teams:</strong> pair week numbers with the <a href="/tools/time-zone-converter">time zone converter</a>, since week boundaries fall at different moments in different places.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How many weeks are in a year?</h3>
<p>52 weeks and 1 or 2 days. ISO week numbering gives either 52 or 53 numbered weeks.</p>
<h3>Does 2026 have 53 weeks?</h3>
<p>Yes. 2026 starts on a Thursday, so it has 53 ISO weeks.</p>
<h3>How do I know which week it is today?</h3>
<p>Open the <a href="/tools/week-number-calculator">week number calculator</a>. It starts on today's date and shows the ISO and US numbers.</p>
<h3>Why is 1 January sometimes in week 52 or 53?</h3>
<p>Because ISO weeks belong to the year that contains most of them. If 1 January falls on a Friday, Saturday or Sunday, its week has its Thursday in the previous year.</p>
<h3>How many working days are in a year?</h3>
<p>About 260 to 262 weekdays, before public holidays. The <a href="/tools/working-days-calculator">working days calculator</a> counts them for any period.</p>
`,
};
