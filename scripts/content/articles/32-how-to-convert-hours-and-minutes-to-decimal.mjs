const mins = [5, 6, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 50, 54, 57];
const rows = Array.from({ length: 8 }, (_, i) => [mins[i], mins[i + 8]].flatMap((m) => [m + ' min', (m / 60).toFixed(2)]));

export default {
  slug: 'how-to-convert-hours-and-minutes-to-decimal',
  title: 'How to Convert Hours and Minutes to Decimal Hours (Chart)',
  category: 'finance',
  theme: 'finance',
  tags: ['convert minutes to decimal hours', 'hours and minutes to decimal', 'decimal hours chart', 'timesheet decimal', 'minutes to decimal', 'payroll hours'],
  description: 'Divide minutes by 60 to get decimal hours: 7 h 45 min is 7.75. A minutes-to-decimal chart, worked examples, the Excel formula and how to convert back.',
  cover: {
    kicker: 'Minutes ÷ 60, added to the whole hours',
    visual: { type: 'formula', title: 'DECIMAL HOURS', lines: ['hours + minutes ÷ 60', '7 h 45 min', '45 ÷ 60 = 0.75', '= 7.75 hours'] },
  },
  infographic: {
    type: 'table',
    title: 'Minutes to decimal hours',
    subtitle: 'Add the decimal to the whole hours. 7 hours 30 minutes is 7.50.',
    columns: ['Minutes', 'Decimal', 'Minutes', 'Decimal'],
    widths: [264, 264, 264, 264],
    rows,
    alt: 'Chart converting minutes to decimal hours, for example 15 minutes is 0.25 and 45 minutes is 0.75',
    caption: 'Divide the minutes by 60 and round to two decimal places.',
    footer: 'Total a whole week: talkandtool.com/tools/timesheet-hours-calculator',
  },
  html: `
<p>To convert hours and minutes to decimal hours, divide the minutes by 60 and add the result to the whole hours. 7 hours 45 minutes is 7 + 45 ÷ 60 = 7 + 0.75 = 7.75 hours. To convert back, multiply the decimal part by 60: 0.75 × 60 = 45 minutes. Payroll systems, invoices and timesheets often need decimal hours because they multiply directly by an hourly rate.</p>

<h2>Why decimal hours exist</h2>
<p>Time on a clock uses base 60: 60 minutes in an hour. Money and rates use base 10. If you earn $18 an hour and work 7 hours 45 minutes, you cannot multiply 18 by "7.45", because 7.45 would mean 7 hours 27 minutes. Converting to 7.75 makes the arithmetic correct: 18 × 7.75 = $139.50.</p>
<p>The most common error in timesheets is writing 7.45 for 7 hours 45 minutes. The digits after the point are fractions of an hour, not minutes.</p>

<h2>The conversion formula</h2>
<p><strong>Decimal hours = hours + (minutes ÷ 60)</strong></p>
<p>For a quick check use these anchors: 15 minutes = 0.25, 30 minutes = 0.50, 45 minutes = 0.75. Every other value lies between them.</p>

{{infographic}}

<h2>Worked examples</h2>
<ul>
<li><strong>3 h 20 min:</strong> 20 ÷ 60 = 0.33, so 3.33 hours (more exactly 3.3333).</li>
<li><strong>8 h 10 min:</strong> 10 ÷ 60 = 0.17, so 8.17 hours.</li>
<li><strong>6 h 54 min:</strong> 54 ÷ 60 = 0.90, so 6.90 hours.</li>
<li><strong>40 h 15 min (a week):</strong> 15 ÷ 60 = 0.25, so 40.25 hours.</li>
</ul>
<p>Rounding matters at scale. Rounding 20 minutes to 0.33 loses 0.0033 of an hour per entry. Over a year of daily entries at $25 an hour, that is under $25, but some employers round to the nearest quarter hour (0.25), tenth of an hour (6 minutes) or minute. Follow your payroll policy, and in places that regulate pay rounding, make sure it is neutral over time.</p>

<h2>Converting decimal hours back to hours and minutes</h2>
<p>Take the whole number as hours and multiply the decimal part by 60:</p>
<ul>
<li>5.5 hours: 0.5 × 60 = 30, so 5 h 30 min.</li>
<li>2.2 hours: 0.2 × 60 = 12, so 2 h 12 min.</li>
<li>9.83 hours: 0.83 × 60 = 49.8, so about 9 h 50 min.</li>
</ul>

<h2>Adding up a whole week</h2>
<p>When you total several days, add them as decimal hours rather than as clock times, or convert the final total once. Monday to Friday with daily shifts of 8.50, 7.75, 8.00, 9.25 and 6.50 hours adds up to 40.00 hours. Adding clock times instead (8:30 + 7:45 + 8:00 + 9:15 + 6:30) works too, but you must carry minutes over 60 into hours, which is where mistakes creep in.</p>
<p>The <a href="/tools/timesheet-hours-calculator">timesheet hours calculator</a> does this for you: enter start and end times and breaks for each day, and it shows hours worked as hours and minutes and in decimal. For a single time span between two clock times, the <a href="/tools/time-duration-calculator">time duration calculator</a> works well. If you need the hourly equivalent of a salary or the reverse, use the <a href="/tools/salary-to-hourly-calculator">salary to hourly calculator</a>.</p>

<h2>Excel and Google Sheets formulas</h2>
<ul>
<li>Time cell to decimal hours: <code>=A1*24</code> (format the result as a number). A time of 7:45 is stored as 0.3229 of a day; times 24 gives 7.75.</li>
<li>Decimal hours to a time: <code>=A1/24</code>, formatted as [h]:mm.</li>
<li>Hours and minutes in separate cells: <code>=B1+C1/60</code>.</li>
<li>Rounding to the nearest quarter hour: <code>=MROUND(A1*24, 0.25)</code>.</li>
</ul>
<p>If the total of hours exceeds 24, use the custom format [h]:mm; otherwise Excel wraps the display back to zero at midnight.</p>

<h2>Overtime and pay</h2>
<p>Once your hours are decimal, pay is hours × rate, with overtime added on hours beyond a threshold. In the US, federal law generally requires time-and-a-half after 40 hours in a work week for non-exempt employees; other countries and many contracts set different limits. Our guide on <a href="/blogs/article/how-to-calculate-hours-worked-and-overtime">calculating hours worked and overtime</a> shows the full method with breaks and night shifts. To estimate the cost of a number of days, see <a href="/blogs/article/days-between-two-dates">days between two dates</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is 7 hours 30 minutes in decimal?</h3>
<p>7.50 hours, because 30 minutes is half an hour.</p>
<h3>What is 15 minutes as a decimal?</h3>
<p>0.25 hours. It is a quarter of an hour.</p>
<h3>Is 1.30 hours the same as 1 hour 30 minutes?</h3>
<p>No. 1.30 hours is 1 hour 18 minutes (0.30 × 60 = 18). One and a half hours is 1.50.</p>
<h3>How do I convert minutes only to a decimal?</h3>
<p>Divide by 60. For 90 minutes, 90 ÷ 60 = 1.5 hours.</p>
`,
};
