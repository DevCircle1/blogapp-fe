export default {
  slug: 'what-do-i-need-on-my-final-exam',
  title: 'What Do I Need on My Final Exam to Get an A, B or C?',
  category: 'math',
  theme: 'math',
  tags: ['what do i need on my final', 'final exam grade calculator', 'final grade formula', 'grade needed on final', 'target course grade', 'exam weight'],
  description: 'Use one formula to find the score you need on your final exam for any target grade, see what happens at different exam weights, and learn when a target is out of reach.',
  cover: {
    kicker: 'The one formula that answers it',
    visual: { type: 'formula', title: 'NEEDED ON FINAL', lines: ['(target − current × (1 − w))', '÷ w', '(90 − 87.4 × 0.7) ÷ 0.3', '= 96%'] },
  },
  infographic: {
    type: 'table',
    title: 'Score needed on the final for a target grade',
    subtitle: 'Current grade 85% on the rest of the course, at four different final exam weights.',
    columns: ['Final exam weight', 'To finish on 80%', 'To finish on 85%', 'To finish on 90%'],
    widths: [330, 242, 242, 242],
    rows: [
      ['10%', '35%', '85%', '135%'],
      ['20%', '60%', '85%', '110%'],
      ['30%', '68.3%', '85%', '101.7%'],
      ['40%', '72.5%', '85%', '97.5%'],
      ['50%', '75%', '85%', '95%'],
    ],
    alt: 'Table of scores needed on the final exam to reach 80, 85 or 90 percent for exam weights from 10 to 50 percent when the current grade is 85 percent',
    caption: 'Above 100% means the target needs extra credit. Heavier finals make high targets easier to recover.',
    footer: 'Plug in your own numbers: talkandtool.com/tools/grade-calculator',
  },
  html: `
<p>The score you need on your final exam is (target grade − current grade × (1 − exam weight)) ÷ exam weight, with the weight written as a decimal. If you have 87.4% before a final worth 30% and want 90% overall, you need (90 − 87.4 × 0.70) ÷ 0.30 = 96%. That one formula answers "what do I need on my final to get an A, a B or a C?" for any course.</p>

<h2>Where the formula comes from</h2>
<p>Your final course grade is made of two parts: the work already marked and the final exam. If the final is worth w (as a decimal) of the course, the work you have done is worth 1 − w. So:</p>
<p><strong>Course grade = current × (1 − w) + final × w</strong></p>
<p>You know the course grade you want, your current grade and the weight. Rearrange to solve for the final score:</p>
<p><strong>Final = (target − current × (1 − w)) ÷ w</strong></p>
<p>The key assumption is that "current" is your average over everything except the final, so it already reflects the weighting of those categories. If you are unsure how to get it, start with our guide to <a href="/blogs/article/how-to-calculate-weighted-grade">calculating a weighted grade</a>.</p>

{{infographic}}

<h2>Worked example: aiming for an A</h2>
<p>Your homework, midterm and project average 87.4% across the 70% of the course that has been graded, and the final is worth 30%. To finish on 90%:</p>
<ul>
<li>Current contribution: 87.4 × 0.70 = 61.18 points</li>
<li>Points still required: 90 − 61.18 = 28.82</li>
<li>Score on the final: 28.82 ÷ 0.30 = <strong>96.1%</strong></li>
</ul>
<p>For a B (80%) the same steps give (80 − 61.18) ÷ 0.30 = 62.7%. For a C (70%) you need only (70 − 61.18) ÷ 0.30 = 29.4%. Seeing the three numbers together is useful: moving from a C to a B costs about 33 points on the exam, and from a B to an A about 33 more.</p>

<h2>What the table tells you</h2>
<p>Look at the 85% column in the table: whatever the weight, you need exactly 85% on the final to finish on 85%, because you are simply continuing at your current level. Targets above your current grade get easier to reach as the final gets heavier (90% needs 135% at a 10% weight but 95% at a 50% weight), while targets below it get harder to hold on to (80% needs only 35% at a 10% weight but 75% at a 50% weight). A heavy final is a bigger opportunity if you are below your target and a bigger risk if you are above it.</p>
<p>Notice the cells above 100%. With a 10% final you would need 135% to lift an 85 to a 90, which is impossible. If a result is over 100, the target cannot be reached without extra credit. The honest next step is to pick the best grade still available, which you find by putting 100 in as the final score and reading off the result.</p>

<h2>Calculating the best and worst case</h2>
<p>Before you panic or relax, work out both extremes:</p>
<ul>
<li><strong>Best case:</strong> current × (1 − w) + 100 × w. With 87.4% and a 30% final: 61.18 + 30 = 91.2%.</li>
<li><strong>Worst case:</strong> current × (1 − w) + 0 × w = 61.2%.</li>
</ul>
<p>If your best case is below the grade you want, the target is out of reach and you should plan for the highest grade you can still secure. If your worst case is already above it, you are safe, as long as your instructor's rules about passing the exam separately do not apply.</p>

<h2>Things that change the answer</h2>
<ul>
<li><strong>Exams that replace a lower score.</strong> Some courses let the final replace your lowest midterm. Recalculate your current grade without that midterm and adjust the weights.</li>
<li><strong>Minimum exam marks.</strong> A "must score 40% to pass" rule sits on top of the weighted average. Both must be satisfied.</li>
<li><strong>Curved exams.</strong> A curve changes the exam score you receive. The formula still works; apply it to the curved score.</li>
<li><strong>Rounding.</strong> Some instructors round 89.5% up to 90%. If so, your target may be slightly lower than it appears.</li>
<li><strong>Extra credit.</strong> Treat extra credit as raising your current grade or adding to the final, depending on how the syllabus applies it.</li>
</ul>

<h2>Use the numbers to plan, not to worry</h2>
<p>Once you know the required score you can plan your revision time. A 96% target means practising every topic to near perfection; a 63% target means securing the core material well and not obsessing over the hardest questions. If you are choosing between two courses to spend extra effort on, compare the marks per hour of study each would gain you.</p>
<p>The <a href="/tools/grade-calculator">grade calculator</a> does the arithmetic and flags impossible targets and weights that do not add up. For a semester-level view, convert grades with the <a href="/tools/gpa-calculator">GPA calculator</a> and read how it works in <a href="/blogs/article/how-to-calculate-gpa-4-0-scale">our 4.0-scale GPA guide</a>. To turn a raw mark such as 43 out of 50 into a percentage, use the <a href="/tools/percentage-calculator">percentage calculator</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What do I need on the final to pass if I have a 50% now?</h3>
<p>It depends on the exam weight. With a 40% final and 50% current, passing at 60% needs (60 − 50 × 0.60) ÷ 0.40 = 75%. With a 20% final it needs 100%.</p>
<h3>Is the formula the same if my final is worth 100%?</h3>
<p>Yes. With w = 1 your current grade drops out, and you simply need your target grade on the exam.</p>
<h3>Can I use this for a midterm instead of a final?</h3>
<p>Yes. Use the weight of whichever assessment is next, and your current grade over everything graded so far, adjusted to the remaining weight. If other assessments are still to come, the simple version only applies to the last one.</p>
<h3>What if the answer is negative?</h3>
<p>A negative or zero result means you have already secured the target, whatever you score. It does not usually override a rule that you must pass the exam itself.</p>
`,
};
