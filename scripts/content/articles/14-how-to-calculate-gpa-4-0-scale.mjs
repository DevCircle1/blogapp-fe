export default {
  slug: 'how-to-calculate-gpa-4-0-scale',
  title: 'How to Calculate GPA on a 4.0 Scale (Weighted and Unweighted)',
  category: 'math',
  theme: 'math',
  tags: ['gpa calculator', 'how to calculate gpa', '4.0 gpa scale', 'weighted gpa', 'cumulative gpa', 'grade point average'],
  description: 'Calculate GPA on a 4.0 scale: convert grades to points, multiply by credits, add, and divide. Worked examples for unweighted, weighted, and cumulative GPA.',
  cover: {
    kicker: 'Quality points ÷ credits, with worked examples',
    visual: { type: 'stat', value: '3.53', label: 'GPA from 53 quality points', note: 'across 15 credit hours' },
  },
  infographic: {
    type: 'table',
    title: 'The standard 4.0 GPA scale',
    subtitle: 'The most common US conversion. Your school’s percentage cut-offs and plus/minus values may differ slightly.',
    columns: ['Letter grade', 'Grade points', 'Typical percentage'],
    widths: [352, 352, 352],
    rows: [
      ['A / A+', '4.0', '93–100%'],
      ['A−', '3.7', '90–92%'],
      ['B+', '3.3', '87–89%'],
      ['B', '3.0', '83–86%'],
      ['B−', '2.7', '80–82%'],
      ['C+', '2.3', '77–79%'],
      ['C', '2.0', '73–76%'],
      ['C−', '1.7', '70–72%'],
      ['D+ / D', '1.3 / 1.0', '63–69%'],
      ['F', '0.0', 'Below about 60–63%'],
    ],
    alt: 'Table converting letter grades to grade points on the 4.0 GPA scale with typical percentage ranges',
    caption: 'Most US schools cap an unweighted A+ at 4.0; a few award 4.3.',
    footer: 'Calculate yours: talkandtool.com/tools/gpa-calculator',
  },
  html: `
<p>To calculate GPA on a 4.0 scale, convert each letter grade to grade points, multiply by the course's credit hours, add those up, and divide by the total credits. For example, 53 quality points over 15 credits is a 3.53 GPA. Here is each step, plus weighted GPA and how to combine semesters correctly.</p>

<h2>Step 1: Convert grades to points</h2>
<p>Most US high schools and colleges use this scale:</p>

{{infographic}}

<h2>Step 2: Multiply by credit hours</h2>
<p>A four-credit course counts for more than a one-credit course. Multiply each course's grade points by its credits to get <strong>quality points</strong>:</p>
<ul>
<li>English, A, 3 credits: 4.0 × 3 = <strong>12.0</strong></li>
<li>Calculus, B+, 4 credits: 3.3 × 4 = <strong>13.2</strong></li>
<li>Chemistry, A−, 4 credits: 3.7 × 4 = <strong>14.8</strong></li>
<li>History, B, 3 credits: 3.0 × 3 = <strong>9.0</strong></li>
<li>PE, A, 1 credit: 4.0 × 1 = <strong>4.0</strong></li>
</ul>

<h2>Step 3: Add up and divide</h2>
<p>Total quality points: 12 + 13.2 + 14.8 + 9 + 4 = <strong>53.0</strong>. Total credits: 3 + 4 + 4 + 3 + 1 = <strong>15</strong>.</p>
<p><strong>GPA = 53.0 ÷ 15 = 3.53</strong></p>
<p>If every course has the same credits, this simplifies to the plain mean of the grade points. The <a href="/tools/gpa-calculator">GPA calculator</a> does this for you, handling mixed credit hours and plus/minus grades.</p>

<h2>Weighted GPA: honors and AP classes</h2>
<p>Many high schools add extra points for harder courses, so an A can be worth more than 4.0. The most common scheme:</p>
<ul>
<li><strong>Honors:</strong> +0.5 (an A becomes 4.5)</li>
<li><strong>AP / IB / dual enrollment:</strong> +1.0 (an A becomes 5.0)</li>
</ul>
<p>If Chemistry in the example were AP, the A− would count as 4.7: 4.7 × 4 = 18.8 quality points instead of 14.8. The new total is 57.0 ÷ 15 = <strong>3.80 weighted</strong>, against 3.53 unweighted.</p>
<p>Schools vary on whether they weight at all, how much they add, and whether they weight grades below a C. Colleges know this, and many recalculate applicants' GPAs on their own consistent scale. When a form asks for your GPA, check whether it wants weighted or unweighted.</p>

<h2>Cumulative GPA: combine totals, not averages</h2>
<p>The most common GPA mistake is averaging semester GPAs. That only works if every semester has the same credits. The correct way is to add all quality points and divide by all credits.</p>
<p>Example: semester 1 is a 3.53 over 15 credits (53.0 quality points). Semester 2 is a 3.20 over 12 credits (38.4 quality points).</p>
<ul>
<li><strong>Correct:</strong> (53.0 + 38.4) ÷ (15 + 12) = 91.4 ÷ 27 = <strong>3.39</strong></li>
<li><strong>Wrong:</strong> (3.53 + 3.20) ÷ 2 = 3.37</li>
</ul>
<p>The gap is small here but grows when semester loads differ a lot, such as a light summer term. The same weighted-average logic appears in <a href="/blogs/article/mean-median-mode-difference">mean, median and mode</a>.</p>

<h2>Pass/fail, withdrawals and repeated courses</h2>
<ul>
<li><strong>Pass/fail courses</strong> usually earn credit but no grade points, so they are left out of the GPA calculation entirely.</li>
<li><strong>Withdrawals (W)</strong> normally do not affect GPA.</li>
<li><strong>Repeated courses</strong> vary by school: some replace the old grade, some average both, some count both. Check your registrar's policy.</li>
<li><strong>Incompletes</strong> are left out until a grade is recorded.</li>
</ul>

<h2>How to raise your GPA: the maths</h2>
<p>Because GPA is a credit-weighted average, the more credits you already have, the harder it moves. With a 3.0 over 60 credits, a perfect 4.0 over the next 15 credits raises it to (180 + 60) ÷ 75 = 3.2. Early semesters matter most. Later, high-credit courses are where improvement counts. For a single course, work out what you need on the final with our <a href="/blogs/article/what-score-do-i-need-on-my-final-exam">final exam grade guide</a>.</p>

<h2>Converting percentages or other scales</h2>
<p>If your school reports percentages, convert each course using the table above, then follow the same steps. Converting from other systems, such as a 10-point scale, UK classifications or the German 1–5 scale, has no single official formula. Universities publish their own conversion tables, and those are the numbers to use in applications.</p>

<h2>Frequently asked questions</h2>
<h3>Is a 3.5 GPA good?</h3>
<p>On an unweighted 4.0 scale, 3.5 averages between an A− and a B+, and is generally considered strong. How it compares depends on your school and the programs you are applying to.</p>
<h3>Can GPA be higher than 4.0?</h3>
<p>Weighted GPAs can. Honors and AP courses add 0.5 or 1.0 points, so weighted GPAs up to 5.0 are possible. Unweighted GPA tops out at 4.0 at most schools.</p>
<h3>Do all courses count toward GPA?</h3>
<p>Usually graded academic courses count; pass/fail, audited and withdrawn courses do not. Some high schools exclude PE or electives. Check your school's handbook.</p>
`,
};
