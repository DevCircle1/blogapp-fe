const iso = (d) => d.toISOString().slice(0, 10);
const day = (n) => new Date(Date.UTC(2026, 2, 1 + n));
const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const rows = [24, 26, 28, 30, 32, 35].map((cycle) => {
  const ov = cycle - 14;
  return [`${cycle} days`, `${ov} days after`, `${ov - 5} to ${ov + 1} days after`, `${fmt(day(ov))}`];
});
void iso;

export default {
  slug: 'how-to-calculate-ovulation-date',
  title: 'How to Calculate Your Ovulation Date (Cycle Length Method)',
  category: 'health',
  theme: 'health',
  tags: ['how to calculate ovulation date', 'ovulation calculator', 'when do i ovulate', 'fertile window', 'cycle length', 'luteal phase'],
  description: 'Ovulation usually happens 14 days before your next period. Count back from your expected period or use cycle length to find your ovulation day, with a table for 24 to 35-day cycles.',
  cover: {
    kicker: 'Count back 14 days from your next period',
    visual: { type: 'calendar', title: 'March 2026 · 28-day cycle', offset: 6, days: 31, highlight: [15], range: [10, 16] },
  },
  infographic: {
    type: 'table',
    title: 'When ovulation falls for different cycle lengths',
    subtitle: 'Assumes a 14-day luteal phase. Counted in days after the first day of your period.',
    columns: ['Cycle length', 'Ovulation', 'Fertile window', 'Ovulation if period began 1 March'],
    widths: [210, 210, 310, 326],
    rows,
    alt: 'Table showing the cycle day of ovulation and the fertile window for cycle lengths from 24 to 35 days',
    caption: 'In a 35-day cycle ovulation falls about 21 days after your period starts, not 14.',
    footer: 'Try your own dates: talkandtool.com/tools/ovulation-calculator',
  },
  html: `
<p>You can estimate your ovulation date by counting back 14 days from the day your next period is due. In a 28-day cycle that is about two weeks after your period starts, but in a 32-day cycle it is closer to 18 days after, because the length of the second half of the cycle (the luteal phase) is fairly constant while the first half varies. The fertile window is the five days before ovulation, ovulation day, and the day after.</p>

<h2>The cycle, in short</h2>
<p>A menstrual cycle is counted from the first day of one period to the day before the next. It has two halves:</p>
<ul>
<li><strong>Follicular phase.</strong> From the first day of bleeding until ovulation. Its length varies between people and from cycle to cycle.</li>
<li><strong>Luteal phase.</strong> From ovulation to the next period. It is typically 12–14 days and is usually consistent for one person.</li>
</ul>
<p>Because the luteal phase is steadier, the standard calculation counts <em>back</em> from the expected next period rather than forward from the last one.</p>

<h2>The calculation</h2>
<p><strong>Ovulation day = cycle length − luteal phase length</strong></p>
<p>The result is how many days after the first day of your period ovulation is expected. With the default 14-day luteal phase:</p>
<ul>
<li>28-day cycle: 28 − 14 = 14 days after your period starts</li>
<li>30-day cycle: 30 − 14 = 16 days after</li>
<li>35-day cycle: 35 − 14 = 21 days after</li>
</ul>
<p>To get a calendar date, add that number of days to the first day of your last period. If your period began on 1 March and your cycle is 28 days, ovulation falls on 15 March. Many sources describe this as "day 14" of a 28-day cycle; the difference is only whether you call the first day of bleeding day 0 or day 1, so it is the same date.</p>

{{infographic}}

<h2>The fertile window</h2>
<p>Sperm can survive in the reproductive tract for up to five days, while an egg survives only about 12–24 hours after release. So pregnancy is possible from about five days before ovulation until the day after. For a 28-day cycle starting 1 March, the window runs from 10 March to 16 March. The two or three days leading up to ovulation are typically the most fertile.</p>

<h2>Worked example</h2>
<p>Your last period began on 3 June and your cycles usually last 31 days.</p>
<ul>
<li>Ovulation: 31 − 14 = 17 days after the start, so 3 June + 17 days = <strong>20 June</strong>.</li>
<li>Fertile window: 15 June to 21 June.</li>
<li>Next period expected: 3 June + 31 days = <strong>4 July</strong>.</li>
</ul>
<p>If you track your luteal phase and it is shorter, say 12 days, ovulation moves later: 31 − 12 = 19 days after the start, which is 22 June. A calculator that lets you change the luteal phase, like the <a href="/tools/ovulation-calculator">ovulation calculator</a>, handles this.</p>

<h2>How reliable is a calendar estimate?</h2>
<p>A calendar estimate is a prediction, and it is only as good as your cycle regularity. Even with regular cycles, ovulation can shift by several days from month to month because of stress, illness, travel and changes in sleep. If your cycle length varies by more than about 7 days, the calculation is too uncertain to rely on. Consider additional signs to confirm ovulation:</p>
<ul>
<li><strong>Ovulation predictor kits.</strong> They detect the surge in luteinising hormone in urine, typically 24–36 hours before ovulation.</li>
<li><strong>Cervical mucus.</strong> It becomes clear, slippery and stretchy (like raw egg white) around the fertile days.</li>
<li><strong>Basal body temperature.</strong> Your resting temperature rises by about 0.2–0.5 °C after ovulation. It confirms that ovulation has happened but does not predict it.</li>
<li><strong>Cycle tracking over several months.</strong> Patterns across 3–6 cycles give a more personal estimate than the textbook 14.</li>
</ul>
<p>Combining the calendar method with one of these signs is much more accurate than the calendar alone.</p>

<h2>What if my cycles are irregular?</h2>
<p>Use your shortest and longest cycles from the last six months to estimate a range. Subtract 18 from the shortest cycle to find the earliest likely fertile day, and subtract 11 from the longest to find the last. For example, cycles from 26 to 32 days give a possible fertile window from day 8 to day 21, which is wide. Irregular cycles are common and are sometimes linked to conditions such as PCOS or thyroid problems, so it is worth speaking to a healthcare professional if your cycles are consistently shorter than 21 or longer than 35 days.</p>

<h2>Ovulation and due dates</h2>
<p>If you conceive, the due date is counted from your last period, not from ovulation. Our guide to <a href="/blogs/article/how-to-calculate-due-date-from-last-period">calculating a due date from the last period</a> covers Naegele's rule and how to adjust for cycle length, and the <a href="/tools/pregnancy-due-date-calculator">pregnancy due date calculator</a> does the sums. To count the days between two dates, such as from ovulation to a test date, see <a href="/blogs/article/days-between-two-dates">how to calculate days between two dates</a> or use the <a href="/tools/date-add-subtract">date add and subtract tool</a>.</p>
<p>For more detail on the fertile window and what the evidence says about timing, read our companion article on the <a href="/blogs/article/fertile-window-explained">fertile window</a>.</p>

<h2>Frequently asked questions</h2>
<h3>When do you ovulate in a 28-day cycle?</h3>
<p>About 14 days after your period starts, with a fertile window from about day 9 to day 15 after the start.</p>
<h3>Can you ovulate right after your period?</h3>
<p>It is uncommon but possible in short cycles, especially if bleeding lasts 7 days and ovulation occurs early. Sperm survival means early ovulation can follow sex during a late period.</p>
<h3>How do I know I have ovulated?</h3>
<p>A sustained rise in basal body temperature, a positive then negative ovulation test, and a change in cervical mucus suggest ovulation. Mid-luteal progesterone blood tests are used clinically.</p>
<h3>Is this a form of contraception?</h3>
<p>No. Calendar estimates are not reliable for avoiding pregnancy. Speak to a clinician about contraception.</p>
`,
};
