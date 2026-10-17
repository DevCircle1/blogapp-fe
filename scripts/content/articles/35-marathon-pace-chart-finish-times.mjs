const clock = (s) => {
  const t = Math.round(s);
  const h = Math.floor(t / 3600); const m = Math.floor((t % 3600) / 60); const sec = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};
const KM = 1.609344;
const goals = [['3:00:00', 3 * 3600], ['3:30:00', 3.5 * 3600], ['4:00:00', 4 * 3600], ['4:30:00', 4.5 * 3600], ['5:00:00', 5 * 3600], ['5:30:00', 5.5 * 3600], ['6:00:00', 6 * 3600]];
const rows = goals.map(([label, sec]) => {
  const perKm = sec / 42.195;
  return [label, `${clock(perKm)} /km`, `${clock(perKm * KM)} /mi`, `${(3600 / perKm).toFixed(1)} km/h`, clock(perKm * 21.0975)];
});

export default {
  slug: 'marathon-pace-chart-finish-times',
  title: 'Marathon Pace Chart: Pace Needed for Every Finish Time',
  category: 'health',
  theme: 'health',
  tags: ['marathon pace chart', 'marathon pace calculator', 'sub 4 hour marathon pace', 'marathon finish time', 'half marathon pace', 'pace per mile marathon'],
  description: 'The pace per km and per mile needed to run a marathon in 3:00 to 6:00, with half-marathon splits, plus pacing strategy for a negative split and how to train for it.',
  cover: {
    kicker: 'What a 4-hour marathon really requires',
    visual: { type: 'formula', title: 'SUB-4:00 MARATHON', lines: ['42.195 km in 4:00:00', '= 5:41 per km', '= 9:09 per mile', 'halfway: 2:00:00'] },
  },
  infographic: {
    type: 'table',
    title: 'Marathon pace chart',
    subtitle: 'Even pacing over 42.195 km (26.2 miles). Half-marathon split is the time at the halfway point.',
    columns: ['Goal time', 'Pace per km', 'Pace per mile', 'Speed', 'Half split'],
    widths: [200, 220, 220, 200, 216],
    rows,
    alt: 'Marathon pace chart showing the pace per kilometre, pace per mile, speed and halfway split needed for finish times from 3 to 6 hours',
    caption: 'A 4:00:00 marathon needs 5:41 per km. Every 10 seconds per km saved is about 7 minutes off the finish.',
    footer: 'Check your own goal: talkandtool.com/tools/pace-calculator',
  },
  html: `
<p>To run a marathon in four hours you need an average pace of 5:41 per kilometre, or 9:09 per mile. Three hours needs 4:16 per km, and five hours needs 7:07 per km. The chart below lists the pace for every half-hour goal from 3:00 to 6:00, including the time you should pass the halfway mark if you run evenly.</p>

{{infographic}}

<h2>How to read the chart</h2>
<p>The pace columns are the average you must hold over the whole 42.195 km. The half split shows where you should be at 21.0975 km on an even-paced plan. Use it as a check during the race: if you reach halfway 3 minutes faster than the split, you have run the first half too quickly, a common mistake that tends to cost far more than 3 minutes in the second half.</p>
<p>Notice how much each second matters. Saving just 10 seconds per kilometre is about 7 minutes over the marathon. A sub-4:00 attempt that averages 5:41 gives you only a few seconds of margin per kilometre, so aim a little faster on the day, such as 5:38, to allow for aid stations and the course not being perfectly straight.</p>

<h2>Measuring the course honestly</h2>
<p>A marathon is 42.195 km, but a GPS watch usually records 42.5 km or more, because runners do not follow the shortest line and signal wobbles add distance. The course is certified along the shortest path. If your watch says 5:41 per km but you actually covered extra distance, your official pace is slightly slower than the display. Rely on the mile or kilometre markers on the course for your splits, and use your watch for effort.</p>

<h2>Pacing strategies</h2>
<h3>Even pace</h3>
<p>Run each kilometre at the same pace. It is efficient and predictable, and it is the foundation of the chart. It works best on flat courses and for runners who have trained at that pace.</p>
<h3>Negative split</h3>
<p>Run the second half faster than the first by a small margin, for example 2 minutes. Most world-record marathons are run with the two halves within a minute or two of each other, and recreational runners who slow down a lot in the second half would do better with a conservative start. Start 5–10 seconds per kilometre slower than goal pace for the first 5 km, settle in, and speed up only if you feel strong after 30 km.</p>
<h3>Run the hills by effort</h3>
<p>On hilly courses, hold the same effort rather than the same pace, then recover on the downhills. The chart's even pace is a reference, not a rule for every kilometre.</p>

<h2>Is your goal realistic?</h2>
<p>A reasonable check is a recent race. Many runners can estimate marathon potential from a half marathon by doubling the half time and adding 10–15 minutes. A runner with a 1:45 half marathon might aim for about 3:40–3:45. Another common check is a 10K: marathon time is often about 4.7 to 5 times the 10K time for runners who have done adequate long runs. These are rough rules of thumb and depend heavily on training volume.</p>
<p>Use the <a href="/tools/pace-calculator">pace calculator</a> to convert any recent race into a pace and see what the same pace would mean over other distances. If you want a refresher on the formula itself, read <a href="/blogs/article/how-to-calculate-running-pace">how to calculate running pace</a>.</p>

<h2>Training and fuelling basics</h2>
<ul>
<li><strong>Build the long run.</strong> Most plans peak at 32 km (20 miles) a few weeks before the race, with weekly mileage building over 12–20 weeks.</li>
<li><strong>Practise goal pace.</strong> Include runs with blocks at marathon pace so the effort feels familiar.</li>
<li><strong>Eat enough.</strong> Training increases energy needs. Estimate yours with the <a href="/tools/calorie-calculator">calorie calculator</a> and see how to split it in <a href="/blogs/article/how-to-calculate-macros-for-weight-loss">how to calculate macros for weight loss</a> (adjusting for maintenance rather than a deficit).</li>
<li><strong>Take on fuel during the race.</strong> Many runners aim for 30–60 grams of carbohydrate per hour after the first 45 minutes, trialled in training.</li>
<li><strong>Drink to thirst.</strong> The <a href="/tools/water-intake-calculator">water intake calculator</a> helps set daily baselines; during the race, follow thirst and conditions.</li>
<li><strong>Taper.</strong> Reduce mileage over the last two to three weeks to arrive fresh.</li>
</ul>

<h2>Converting between kilometres and miles</h2>
<p>Race organisers publish splits in both units. One mile is 1.609 km, so 5:41 per km is 9:09 per mile; and 26.2 miles is 42.195 km. For quick conversions of distances, use the <a href="/tools/unit-converter">unit converter</a>, and for the half-marathon distance 21.0975 km (13.1 miles) check the split column of the chart.</p>

<h2>Frequently asked questions</h2>
<h3>What pace do I need for a sub-4 hour marathon?</h3>
<p>5:41 per km or 9:09 per mile on average. Aim for about 5:38 per km to leave a safety margin.</p>
<h3>What is a good first marathon time?</h3>
<p>Finishing is the goal. Many first-timers finish between 4:30 and 5:30. Pick a pace you have trained at, and set a more ambitious target for your second.</p>
<h3>Should I go out fast and bank time?</h3>
<p>No. Time banked early usually costs more than it saves later, as glycogen runs low. Even or slightly negative splits are the more reliable approach.</p>
<h3>How many calories does a marathon burn?</h3>
<p>Roughly 1 kcal per kilogram of body weight per kilometre, so a 70 kg runner uses around 2,900 kcal. Individual results vary.</p>
`,
};
