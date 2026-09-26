export default {
  slug: 'days-between-two-dates',
  title: 'How to Calculate Days Between Two Dates (By Hand and in Excel)',
  category: 'math',
  theme: 'math',
  tags: ['days between dates', 'date difference calculator', 'how many days until', 'excel datedif', 'networkdays', 'day of year'],
  description: 'Count the days between two dates with the day-of-year method, Excel’s subtraction, DATEDIF and NETWORKDAYS. Worked examples, leap years, and inclusive counting.',
  cover: {
    kicker: 'The day-of-year trick, Excel formulas, leap years',
    visual: { type: 'calendar', title: 'September 2026', offset: 1, days: 30, highlight: [27], range: [1, 26] },
  },
  infographic: {
    type: 'table',
    title: 'Day-of-year lookup (non-leap year)',
    subtitle: 'Day number of the 1st of each month. In a leap year, add 1 for every month from March onward.',
    columns: ['Month', 'Days in month', 'Day number of the 1st'],
    widths: [352, 352, 352],
    rows: [
      ['January', '31', '1'], ['February', '28 (29)', '32'], ['March', '31', '60'],
      ['April', '30', '91'], ['May', '31', '121'], ['June', '30', '152'],
      ['July', '31', '182'], ['August', '31', '213'], ['September', '30', '244'],
      ['October', '31', '274'], ['November', '30', '305'], ['December', '31', '335'],
    ],
    alt: 'Table listing each month, its number of days, and the day-of-year number of its first day in a non-leap year',
    caption: 'Day number of any date = day number of the 1st of its month + (day − 1).',
    footer: 'Count any range: talkandtool.com/tools/date-difference-calculator',
  },
  html: `
<p>To count the days between two dates, convert each date to its day number in the year and subtract. From 15 January to 27 September 2026 is 270 − 15 = 255 days. In Excel, subtract one date cell from the other. Below are the manual method, the spreadsheet formulas, and the two details that trip people up: leap years and whether to count both ends.</p>

<h2>Method 1: day of year, then subtract</h2>
<p>Every date has a position in the year, from day 1 (1 January) to day 365, or 366 in a leap year. Look up the day number of the 1st of the month, then add the day of the month minus one.</p>

{{infographic}}

<p><strong>Example 1:</strong> 15 January to 27 September 2026.</p>
<ul>
<li>15 January = day 15</li>
<li>27 September = 244 + 26 = day 270</li>
<li>Difference: 270 − 15 = <strong>255 days</strong></li>
</ul>
<p><strong>Example 2:</strong> 1 March to 25 December 2026.</p>
<ul>
<li>1 March = day 60</li>
<li>25 December = 335 + 24 = day 359</li>
<li>Difference: 359 − 60 = <strong>299 days</strong></li>
</ul>
<p><strong>Across a year boundary</strong>, count the days left in the first year and add the day number in the second. 20 December 2026 to 10 February 2027: 2026 has 365 − 354 = 11 days left, plus day 41 of 2027, equals <strong>52 days</strong>.</p>

<h2>Leap years</h2>
<p>A year is a leap year if it is divisible by 4, except century years, which must be divisible by 400. 2024 and 2028 are leap years. 2026 is not. 2000 was a leap year, and 1900 and 2100 are not. In a leap year, February has 29 days, and every date from 1 March onward is one day number later than in the table.</p>
<p>A quick check: 1 February to 1 March is 29 days in 2024 and 28 days in 2026.</p>

<h2>Inclusive or exclusive: the off-by-one question</h2>
<p>Subtracting dates gives the number of days <em>between</em> them, excluding the start day. That is what "how many days until" usually means. But if you are counting days of a hotel stay, a course, or leave that includes both the first and last day, add one.</p>
<ul>
<li>Monday to Friday of the same week by subtraction: 4 days.</li>
<li>Monday to Friday counting both days, such as days worked: 5 days.</li>
</ul>
<p>Most disagreements between two people's counts come down to this, so state which one you mean.</p>

<h2>Method 2: Excel and Google Sheets</h2>
<p>Spreadsheets store dates as serial numbers, one per day, so subtraction just works:</p>
<ul>
<li><code>=B1-A1</code>: days between the dates. Format the cell as a number, not a date.</li>
<li><code>=B1-A1+1</code>: inclusive count.</li>
<li><code>=DATEDIF(A1,B1,"d")</code>: the same as subtraction. It also takes "m" (whole months) and "y" (whole years), which is handy for ages and anniversaries. The start date must be earlier than the end date, or DATEDIF returns an error.</li>
<li><code>=DAYS(B1,A1)</code>: the same result, with the end date first.</li>
<li><code>=NETWORKDAYS(A1,B1)</code>: weekdays only, <em>counting both the start and end dates</em>. Add a range of holiday dates as a third argument to exclude them.</li>
</ul>
<p>Example: <code>=NETWORKDAYS("2026-03-01","2026-12-25")</code> returns 215. 1 March 2026 is a Sunday, so it is not counted, while 25 December 2026 is a Friday and is counted. Subtract public holidays for your country to get real working days.</p>

<h2>Weeks, months and years</h2>
<ul>
<li><strong>Weeks:</strong> divide the days by 7. 255 days is 36 weeks and 3 days.</li>
<li><strong>Months:</strong> count whole calendar months, then the remaining days. Months are not a fixed length, so "days ÷ 30" is only an approximation.</li>
<li><strong>Years:</strong> for ages, count whole years since the last birthday. The <a href="/tools/age-calculator">age calculator</a> gives years, months and days exactly.</li>
</ul>

<h2>Business days and deadlines</h2>
<p>If you need working days rather than calendar days, such as for contract notice periods, delivery estimates or payment terms, exclude weekends and public holidays. The <a href="/tools/working-days-calculator">working days calculator</a> does that, and our guide to <a href="/blogs/article/how-to-calculate-business-days-deadlines">calculating business days and deadlines</a> covers the rules that decide whether a deadline lands on day 10 or day 11.</p>
<p>To go the other way, finding the date that is 90 days from today, use the <a href="/tools/date-add-subtract">add or subtract days tool</a>. For any two dates, the <a href="/tools/date-difference-calculator">date difference calculator</a> shows days, weeks, months and years at once, with an option to exclude weekends.</p>

<h2>A note for developers</h2>
<p>Calculating date differences in code goes wrong most often around time zones and daylight saving. A "day" that crosses a clock change is 23 or 25 hours long, so dividing milliseconds by 86,400,000 can give 254.96 instead of 255. Compare calendar dates in UTC, or use a date library's day-difference function. More in <a href="/blogs/article/how-to-store-dates-and-times-without-timezone-bugs">how to store dates and times without time zone bugs</a>.</p>

<h2>Frequently asked questions</h2>
<h3>How many days are there between two dates, including both?</h3>
<p>Subtract the dates and add one. From 1 to 10 June is 9 days by subtraction, or 10 days counting both.</p>
<h3>How long is 40 business days?</h3>
<p>Eight working weeks, so about 56 calendar days, or longer if public holidays fall in the period.</p>
<h3>Why does Excel show a date instead of a number?</h3>
<p>The result cell inherited date formatting. Change the cell format to Number or General.</p>
`,
};
