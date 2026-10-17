export default {
  slug: 'how-to-calculate-weighted-grade',
  title: 'How to Calculate a Weighted Grade (With Worked Examples)',
  category: 'math',
  theme: 'math',
  tags: ['weighted grade', 'how to calculate weighted average', 'grade calculator', 'course grade', 'weighted average formula', 'homework and exam weights'],
  description: 'A weighted grade multiplies each score by its weight, adds the results and divides by the total weight. See the formula, a full worked example and the mistakes that skew it.',
  cover: {
    kicker: 'Why a plain average of your marks is usually wrong',
    visual: { type: 'formula', title: 'WEIGHTED GRADE', lines: ['Σ(grade × weight)', '÷ Σ(weight)', '92·20 + 84·30 + 88·20', '= 87.4%'] },
  },
  infographic: {
    type: 'table',
    title: 'A weighted grade worked out step by step',
    subtitle: 'Three graded categories, 70% of the course counted so far.',
    columns: ['Category', 'Grade', 'Weight', 'Grade × weight'],
    widths: [330, 242, 242, 242],
    rows: [
      ['Homework', '92%', '20%', '1,840'],
      ['Midterm', '84%', '30%', '2,520'],
      ['Project', '88%', '20%', '1,760'],
      ['Total', '', '70%', '6,120'],
      ['Weighted grade', '', '', '6,120 ÷ 70 = 87.4%'],
    ],
    alt: 'Table showing homework, midterm and project grades multiplied by their weights and divided by total weight to give 87.4 percent',
    caption: 'Divide by the weight counted so far, not by 100, until every category has been graded.',
    footer: 'Try your own numbers: talkandtool.com/tools/grade-calculator',
  },
  html: `
<p>To calculate a weighted grade, multiply each score by its weight, add those products together, and divide by the total of the weights. If homework (92%) counts for 20%, a midterm (84%) for 30% and a project (88%) for 20%, your grade so far is (92×20 + 84×30 + 88×20) ÷ 70 = 87.4%. A plain average of 92, 84 and 88 would give 88, which is wrong because it ignores how much each part is worth.</p>

<h2>Why weights matter</h2>
<p>Most courses do not treat every assessment equally. A final exam might carry 40% of the grade while a weekly quiz carries 2%. If you simply average your marks, a poor result on a heavy assessment is hidden by good results on light ones, and a great result on a big exam is under-counted. Weighting corrects that by making each mark count in proportion to its value.</p>
<p>A weight is just a share of the final grade. Weights in a syllabus normally add up to 100%, but while the term is still running you will have only some of them, which is where most calculation mistakes come from.</p>

<h2>The formula</h2>
<p>The weighted average formula is:</p>
<p><strong>Weighted grade = Σ(grade × weight) ÷ Σ(weight)</strong></p>
<p>Σ means "add up all of". Work through it in three steps:</p>
<ol>
<li>Convert each weight to a number (20% can be written as 20 or 0.20, as long as you are consistent).</li>
<li>Multiply each grade by its weight and add the results.</li>
<li>Divide the sum by the total of the weights you have used.</li>
</ol>

{{infographic}}

<h2>Worked example 1: grade so far</h2>
<p>The table above gives the sum of products as 1,840 + 2,520 + 1,760 = 6,120. The weights used add up to 20 + 30 + 20 = 70. So 6,120 ÷ 70 = <strong>87.43%</strong>. This is your grade on the work that has been marked, not your final course grade, because 30% of the course is still to come.</p>
<p>A common slip is dividing by 100 instead of 70. That gives 61.2%, which looks alarming but only reflects that 30% of the marks have not been earned yet. Divide by 100 only when every category has been graded.</p>

<h2>Worked example 2: points-based grading</h2>
<p>Some courses use points rather than percentages. Suppose you scored 45 out of 50 on a quiz, 78 out of 100 on a test and 18 out of 20 on a lab. You can pool the points: (45 + 78 + 18) ÷ (50 + 100 + 20) = 141 ÷ 170 = 82.9%. Here the weighting is built in because larger assessments carry more points. Do not average the three percentages (90, 78, 90) in this case; that would give 86 and overstate your result.</p>
<p>Always check your syllabus to see which system applies. If it states percentages for each category, use the weighted formula. If it says "total points", pool the points.</p>

<h2>Worked example 3: dropping the lowest score</h2>
<p>Many instructors drop the lowest quiz. Remove that score and its weight share first, then average what remains. With quiz scores of 70, 85, 90 and 95 worth equal shares, dropping the 70 leaves (85 + 90 + 95) ÷ 3 = 90 for the quiz category. Enter 90 as the category grade, then weight it as usual.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Weights that do not total 100.</strong> Add them up. If categories plus the final come to 105% or 95%, one of them is mistyped.</li>
<li><strong>Averaging inside categories incorrectly.</strong> Five homeworks worth the same amount are averaged first (a simple mean), and that average is what gets the homework weight.</li>
<li><strong>Mixing up percent and decimals.</strong> A weight of 0.2 and a weight of 20 give the same answer if you divide by the total of the weights, but mixing both in one calculation does not.</li>
<li><strong>Counting ungraded work as zero.</strong> Leave it out until it is marked, then recalculate.</li>
<li><strong>Rounding too early.</strong> Round only the final answer, since teachers usually round once at the end.</li>
</ul>

<h2>Turning it around: what you need on the final</h2>
<p>The same arithmetic tells you what score you need on the last assessment. If you hold 87.43% on 70% of the course and the final is worth 30%, the grade you need for a 90% overall is (90 − 87.43 × 0.70) ÷ 0.30 = 96%. We walk through this reverse calculation, including how to tell when a target is impossible, in <a href="/blogs/article/what-do-i-need-on-my-final-exam">what do I need on my final exam</a>.</p>
<p>You can skip the arithmetic with the <a href="/tools/grade-calculator">grade calculator</a>, which handles any number of categories and the final-exam case in one screen. If your school reports on a 4.0 scale, convert with our guide to <a href="/blogs/article/how-to-calculate-gpa-4-0-scale">calculating GPA on the 4.0 scale</a> or use the <a href="/tools/gpa-calculator">GPA calculator</a>.</p>

<h2>When a simple average is the right answer</h2>
<p>If every assessment is worth exactly the same, the weighted average collapses to the ordinary mean. For that case the <a href="/tools/average-calculator">average calculator</a> is enough, and our explainer on <a href="/blogs/article/mean-median-mode-difference">mean, median and mode</a> covers when a mean misleads. To turn a score into a percentage first (for example 37/42), use the <a href="/tools/percentage-calculator">percentage calculator</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is the difference between a weighted and an unweighted average?</h3>
<p>An unweighted average treats every score equally. A weighted average counts each score according to its importance, so a heavily weighted exam moves the result more than a light quiz.</p>
<h3>Can the weights be any numbers?</h3>
<p>Yes. They only need to be in proportion to each other. Weights of 2, 3 and 5 behave exactly like 20%, 30% and 50%.</p>
<h3>How do I calculate my grade if I have not done the final?</h3>
<p>Calculate the weighted grade for the work completed, dividing by the weight so far. That is your current standing; the final then changes it according to its weight.</p>
<h3>Why does my result differ from my teacher's gradebook?</h3>
<p>Usually because of drops, extra credit, rounding rules or category weights that differ from the syllabus. Compare your category averages first, since that is where differences start.</p>
`,
};
