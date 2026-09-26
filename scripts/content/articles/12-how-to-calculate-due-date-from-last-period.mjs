export default {
  slug: 'how-to-calculate-due-date-from-last-period',
  title: 'How to Calculate Your Due Date From Your Last Period',
  translationKey: 'due-date-from-last-period',
  category: 'health',
  theme: 'health',
  tags: ['pregnancy due date calculator', 'due date from last period', 'naegeles rule', 'how many weeks pregnant', 'estimated due date', 'gestational age'],
  description: 'Your due date is 280 days (40 weeks) after the first day of your last period. See the formula, a worked example, how cycle length changes it, and how accurate it is.',
  cover: {
    kicker: 'First day of last period + 280 days',
    visual: { type: 'calendar', title: 'December 2026', offset: 1, days: 31, highlight: [15], range: [8, 22] },
  },
  infographic: {
    type: 'table',
    title: 'Four ways to get a due date, one example',
    subtitle: 'Last menstrual period (LMP) starting 10 March 2026, unless stated otherwise.',
    columns: ['Method', 'Calculation', 'Due date'],
    widths: [330, 440, 286],
    rows: [
      ['Count 280 days', 'LMP + 280 days', '15 December 2026'],
      ['Naegele’s shortcut', '+1 year, −3 months, +7 days', '17 December 2026'],
      ['35-day cycle', 'LMP + 280 + (35 − 28) days', '22 December 2026'],
      ['IVF, day-5 transfer', 'Transfer date + 261 days', 'Depends on transfer'],
      ['Early ultrasound', 'Baby’s measured size', 'May replace the LMP date'],
    ],
    alt: 'Table comparing four ways to calculate a pregnancy due date for a last period starting 10 March 2026',
    caption: 'The shortcut and a day count can differ by a day or two, because months have different lengths.',
    footer: 'Calculate yours: talkandtool.com/tools/pregnancy-due-date-calculator',
  },
  html: `
<p>To calculate your due date from your last period, add 280 days (40 weeks) to the first day of your last menstrual period. For example, a last period starting on 10 March 2026 gives a due date of 15 December 2026. Here is the method, the quick shortcut, how to adjust for longer or shorter cycles, and how much to rely on the date.</p>

<p><em>This article explains how due dates are estimated. It is not medical advice. Your midwife or doctor will confirm your dates, usually with an early ultrasound.</em></p>

<h2>Why the count starts before conception</h2>
<p>Pregnancy is dated from the first day of your last menstrual period (LMP), not from conception. This is called gestational age. Most people do not know exactly when they conceived, but they do know when their period started. In a typical 28-day cycle, ovulation and conception happen about two weeks after the LMP. So at "4 weeks pregnant" the embryo is about two weeks old, and a 40-week pregnancy is about 38 weeks from conception.</p>

<h2>Method 1: count 280 days</h2>
<p>Take the first day of your last period and add 280 days. Counting from 10 March 2026: 21 days remain in March, then April through November add up to 244 days, reaching 265 by 30 November. Fifteen more days lands on <strong>15 December 2026</strong>. This is what online calculators and pregnancy wheels do.</p>

<h2>Method 2: Naegele's rule (the mental shortcut)</h2>
<p>Take the first day of your LMP, <strong>add one year, subtract three months, and add seven days</strong>. From 10 March 2026: add seven days to get 17 March, subtract three months to get 17 December 2025, then add a year to get <strong>17 December 2026</strong>.</p>
<p>Notice that is two days later than the day count. Months have different lengths, so Naegele's shortcut can drift by a day or two from an exact 280-day count. For a quick estimate that does not matter. For booking appointments, use the counted date.</p>

{{infographic}}

<h2>Adjusting for your cycle length</h2>
<p>Both methods assume a 28-day cycle with ovulation around day 14. If your cycles are consistently longer or shorter, ovulation shifts, and so does the due date. Adjust by the difference:</p>
<ul>
<li><strong>Longer cycles:</strong> add the extra days. With a 35-day cycle, add 7 days to the standard due date.</li>
<li><strong>Shorter cycles:</strong> subtract the missing days. With a 25-day cycle, subtract 3 days.</li>
</ul>
<p>Example: an LMP of 15 January 2026 gives a standard due date of 22 October 2026. With 35-day cycles, it becomes 29 October 2026. If your cycles are irregular, the LMP method is less reliable, and an early ultrasound becomes the main way to date the pregnancy.</p>

<h2>IVF and known conception dates</h2>
<p>With IVF, the date is precise because the embryo's age is known:</p>
<ul>
<li><strong>Day-5 (blastocyst) transfer:</strong> transfer date + 261 days.</li>
<li><strong>Day-3 transfer:</strong> transfer date + 263 days.</li>
<li><strong>Known conception date:</strong> conception date + 266 days (38 weeks).</li>
</ul>

<h2>How many weeks pregnant am I?</h2>
<p>Count the days from the first day of your LMP to today and divide by 7. The whole number is completed weeks and the remainder is days. From an LMP of 10 March 2026 to 27 September 2026 is 201 days, which is <strong>28 weeks and 5 days</strong>, written 28+5. The <a href="/tools/pregnancy-due-date-calculator">pregnancy due date calculator</a> shows this along with trimester dates, and the <a href="/tools/date-add-subtract">date add and subtract tool</a> handles any other "X days from" calculation.</p>

<h2>How accurate is a due date?</h2>
<p>A due date is an estimate of the midpoint, not a deadline. Only a small minority of babies, often quoted at around 4–5%, arrive on their due date. Most spontaneous births happen within about two weeks either side. Clinicians use these terms:</p>
<ul>
<li><strong>Early term:</strong> 37 weeks 0 days to 38 weeks 6 days</li>
<li><strong>Full term:</strong> 39 weeks 0 days to 40 weeks 6 days</li>
<li><strong>Late term:</strong> 41 weeks 0 days to 41 weeks 6 days</li>
<li><strong>Post-term:</strong> 42 weeks 0 days and beyond</li>
</ul>

<h2>When an ultrasound changes your due date</h2>
<p>A first-trimester ultrasound measures the baby's crown-rump length, which is a very accurate way to estimate gestational age early on. If the ultrasound date and the LMP date differ by more than a set margin, typically around a week in the first trimester (less in the earliest weeks), clinicians usually go with the ultrasound. Later scans are less precise for dating, because babies grow at different rates, so an early scan date normally stays fixed for the rest of the pregnancy.</p>

<h2>Frequently asked questions</h2>
<h3>Is my due date calculated from conception or my last period?</h3>
<p>From the first day of your last period. Conception typically happens about two weeks later, which is why a pregnancy is 40 weeks by date but about 38 weeks of actual development.</p>
<h3>What if I don't remember my last period?</h3>
<p>An early ultrasound can date the pregnancy accurately from the baby's size. It is the standard approach when the LMP is unknown or cycles are irregular.</p>
<h3>Can my due date change?</h3>
<p>Usually only once, after an early dating scan. After that, it normally stays the same even if later scans suggest the baby is bigger or smaller than average.</p>
`,
};
