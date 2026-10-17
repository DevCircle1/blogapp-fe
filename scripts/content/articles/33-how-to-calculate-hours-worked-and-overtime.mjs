export default {
  slug: 'how-to-calculate-hours-worked-and-overtime',
  title: 'How to Calculate Hours Worked and Overtime Pay (Examples)',
  category: 'finance',
  theme: 'finance',
  tags: ['calculate hours worked', 'overtime pay calculator', 'how to calculate overtime', 'timesheet calculator', 'hours worked with lunch break', 'night shift hours'],
  description: 'Subtract start from end, take off unpaid breaks, and handle shifts past midnight. Then work out overtime at time-and-a-half with a full weekly worked example.',
  cover: {
    kicker: 'End − start − unpaid break, then overtime',
    visual: { type: 'formula', title: 'WEEK OF 46.5 HOURS', lines: ['40 h × $20 = $800', '6.5 h × $30 = $195', 'total = $995', 'time-and-a-half'] },
  },
  infographic: {
    type: 'steps',
    title: 'Hours worked and overtime in four steps',
    subtitle: 'Example: $20 an hour, overtime at 1.5× after 40 hours in the week.',
    items: [
      ['1. Shift length', 'End time − start time. If the end is earlier than the start, the shift crosses midnight: add 24 hours.'],
      ['2. Unpaid break', 'Subtract breaks you are not paid for. 09:00–17:30 with a 30-minute lunch = 8 h 00 m.'],
      ['3. Weekly total', 'Add the days in decimal hours. Five days of 9.3 hours = 46.5 hours.'],
      ['4. Overtime', 'Hours over the threshold × rate × multiplier: 6.5 × $20 × 1.5 = $195 on top of 40 × $20 = $800.'],
    ],
    alt: 'Four steps for calculating hours worked and overtime pay from start and end times, breaks and a weekly overtime threshold',
    caption: 'Thresholds and multipliers depend on your country, state and contract.',
    footer: 'Add up a week: talkandtool.com/tools/timesheet-hours-calculator',
  },
  html: `
<p>To calculate hours worked, subtract the start time from the end time and then subtract any unpaid break. A shift from 09:00 to 17:30 with a 30-minute lunch is 8 hours. Add up the days for the week, and any hours beyond your overtime threshold are paid at a higher rate, commonly time-and-a-half. A week of 46.5 hours at $20 an hour pays 40 × $20 + 6.5 × $30 = $995.</p>

<h2>Step 1: the length of one shift</h2>
<p>Subtract the start time from the end time. Work in 24-hour time to avoid AM and PM mistakes: 5:30 PM is 17:30.</p>
<ul>
<li>09:00 to 17:30 = 8 h 30 min</li>
<li>08:15 to 16:45 = 8 h 30 min</li>
<li>13:00 to 21:20 = 8 h 20 min</li>
</ul>
<p>If minutes in the end time are smaller than those in the start time, borrow an hour. For 08:45 to 16:15, 16:15 − 08:45 is 7 h 30 min (from 08:45 to 16:00 is 7 h 15 min, plus 15 minutes).</p>

<h2>Step 2: take off unpaid breaks</h2>
<p>Subtract only the breaks you are not paid for. In many workplaces a 30-minute lunch is unpaid and two 10-minute breaks are paid. The 8 h 30 min shift above with a 30-minute unpaid lunch gives <strong>8 h 00 min</strong> of paid time. Check your contract or local law, since some places require paid rest breaks and others do not.</p>

<h2>Step 3: shifts that cross midnight</h2>
<p>When a shift ends after midnight, the end time looks earlier than the start. Add 24 hours to the end time first. A night shift from 22:00 to 06:00 is (06:00 + 24:00) − 22:00 = 30:00 − 22:00 = <strong>8 hours</strong>. The same applies to 21:30 to 05:45, which is 8 h 15 min. Watch the clock-change weekends: on the night daylight saving time begins or ends, a shift spanning the change is an hour shorter or longer in real elapsed time.</p>

{{infographic}}

<h2>Step 4: convert to decimal and total the week</h2>
<p>Payroll multiplies hours by a rate, so convert minutes to decimals: divide by 60. 8 h 15 min is 8.25 hours. Our <a href="/blogs/article/how-to-convert-hours-and-minutes-to-decimal">decimal hours chart</a> lists the common values. Then add the days:</p>
<ul>
<li>Monday 08:00–18:00, 30-minute break: <strong>9.5</strong> hours</li>
<li>Tuesday 08:00–18:00, 30-minute break: <strong>9.5</strong> hours</li>
<li>Wednesday 08:00–17:30, 30-minute break: <strong>9.0</strong> hours</li>
<li>Thursday 08:00–18:00, 30-minute break: <strong>9.5</strong> hours</li>
<li>Friday 08:00–17:30, 30-minute break: <strong>9.0</strong> hours</li>
<li>Weekly total: <strong>46.5</strong> hours</li>
</ul>

<h2>Step 5: work out overtime</h2>
<p>Overtime rules differ widely. In the United States, federal law (the Fair Labor Standards Act) requires non-exempt employees to be paid at least one and a half times their regular rate for hours over 40 in a work week, and some states also count daily hours. In the UK there is no statutory overtime premium; it depends on the contract. Many other countries set weekly or daily limits and premiums by law or collective agreement. Check the rules where you work.</p>
<p>Using the common US pattern, with a rate of $20 and a threshold of 40 hours:</p>
<ul>
<li>Regular pay: 40 × $20 = $800</li>
<li>Overtime hours: 46.5 − 40 = 6.5</li>
<li>Overtime rate: $20 × 1.5 = $30</li>
<li>Overtime pay: 6.5 × $30 = $195</li>
<li><strong>Gross pay: $995</strong></li>
</ul>
<p>That is before tax and other deductions. If your overtime is double time on Sundays or holidays, apply the multiplier to those hours instead. Salaried employees may be exempt from overtime depending on their pay level and duties, so do not assume.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Writing minutes as decimals</strong> (8.15 for 8 h 15 min). It should be 8.25.</li>
<li><strong>Forgetting the break.</strong> Unpaid lunch left in inflates every day.</li>
<li><strong>Averaging overtime across weeks.</strong> A 50-hour week and a 30-hour week are not 40 and 40 for most overtime rules.</li>
<li><strong>Ignoring rounding policy.</strong> Some employers round to the nearest quarter hour; the rule should be neutral over time.</li>
<li><strong>Using clock subtraction across a midnight.</strong> Always add 24 hours when the end time is before the start.</li>
</ul>

<h2>Tools to save time</h2>
<p>The <a href="/tools/timesheet-hours-calculator">timesheet hours calculator</a> subtracts breaks, handles night shifts, totals the week and shows the decimal figure and gross pay. For a single span such as a project or a flight, use the <a href="/tools/time-duration-calculator">time duration calculator</a>; to understand your pay from a yearly salary, convert with the <a href="/tools/salary-to-hourly-calculator">salary to hourly calculator</a>. To count working days between two dates, read <a href="/blogs/article/days-between-two-dates">how to calculate the days between two dates</a> or use the <a href="/tools/working-days-calculator">business days calculator</a>.</p>

<h2>Frequently asked questions</h2>
<h3>How do I calculate hours worked with a lunch break?</h3>
<p>Subtract the start from the end and then take away the unpaid lunch. 08:30 to 17:00 with a 45-minute lunch is 8 h 30 min − 45 min = 7 h 45 min, or 7.75 hours.</p>
<h3>How is overtime calculated at time-and-a-half?</h3>
<p>Multiply your regular hourly rate by 1.5 and apply it to hours beyond the threshold. At $18 an hour, overtime is $27 per hour.</p>
<h3>Do paid breaks count as hours worked?</h3>
<p>Yes. Only unpaid breaks are subtracted.</p>
<h3>How many hours is 9 to 5?</h3>
<p>Eight hours with no break, or seven and a half if a 30-minute lunch is unpaid.</p>
`,
};
