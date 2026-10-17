const clock = (s) => {
  const t = Math.round(s);
  const h = Math.floor(t / 3600); const m = Math.floor((t % 3600) / 60); const sec = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};
const rows = [['4:30', '4:30'], ['5:00', '5:00'], ['5:30', '5:30'], ['6:00', '6:00'], ['6:30', '6:30'], ['7:00', '7:00']].map(([label]) => {
  const [m, s] = label.split(':').map(Number);
  const perKm = m * 60 + s;
  return [`${label} /km`, `${clock(perKm * 1.609344)} /mi`, `${(3600 / perKm).toFixed(1)} km/h`, clock(perKm * 5), clock(perKm * 10)];
});

export default {
  slug: 'how-to-calculate-running-pace',
  title: 'How to Calculate Running Pace per Mile and per Kilometre',
  category: 'health',
  theme: 'health',
  tags: ['running pace calculator', 'how to calculate pace', 'min per km to min per mile', 'pace to speed', 'average running pace', '5k pace'],
  description: 'Pace is time divided by distance. Learn to calculate minutes per km or mile, convert between them, turn pace into speed, and predict 5K and 10K times from a pace.',
  cover: {
    kicker: 'Time ÷ distance, then convert',
    visual: { type: 'formula', title: 'PACE', lines: ['pace = time ÷ distance', '25:00 ÷ 5 km', '= 5:00 per km', '= 8:03 per mile'] },
  },
  infographic: {
    type: 'table',
    title: 'Pace conversion and finish times',
    subtitle: 'Hold the pace for the whole distance. Times are rounded to the nearest second.',
    columns: ['Pace per km', 'Pace per mile', 'Speed', '5K time', '10K time'],
    widths: [210, 220, 210, 208, 208],
    rows,
    alt: 'Table converting running pace from minutes per kilometre to minutes per mile and speed, with 5K and 10K finish times',
    caption: 'A pace 30 seconds per km faster adds about 1 km/h and cuts roughly 2.5 minutes off a 5K.',
    footer: 'Calculate yours: talkandtool.com/tools/pace-calculator',
  },
  html: `
<p>Running pace is how long one kilometre or one mile takes you: divide your total time by the distance. A 5K in 25:00 is 25 ÷ 5 = 5:00 per kilometre. To convert to miles, multiply the pace per kilometre by 1.609, which gives 8:03 per mile. Speed is the inverse: 60 ÷ 5 minutes per km = 12 km/h.</p>

<h2>The pace formula</h2>
<p><strong>Pace = time ÷ distance</strong></p>
<p>Express the time in a single unit first. If you finished 10 km in 52 minutes 30 seconds, that is 52.5 minutes, and 52.5 ÷ 10 = 5.25 minutes per kilometre. The 0.25 is a fraction of a minute, so convert it to seconds: 0.25 × 60 = 15. Your pace is <strong>5:15 per kilometre</strong>.</p>
<p>Always convert the decimal part. Writing "5.15" when you mean 5:15 is the most common slip, and it would be 5 min 9 sec.</p>

<h2>Worked examples</h2>
<ul>
<li><strong>Half marathon in 1:55:00.</strong> 115 minutes ÷ 21.0975 km = 5.45 min/km, which is 5:27 per km or 8:46 per mile.</li>
<li><strong>5 miles in 42:30.</strong> 42.5 ÷ 5 = 8.5 min/mile = 8:30 per mile. Divide by 1.609 for the km pace: 8:30 ÷ 1.609 = 5:17 per km.</li>
<li><strong>Treadmill at 10 km/h.</strong> Pace = 60 ÷ 10 = 6:00 per km. At 8 mph the pace is 60 ÷ 8 = 7:30 per mile.</li>
</ul>

{{infographic}}

<h2>Converting between per km and per mile</h2>
<p>A mile is 1.609344 km, so:</p>
<ul>
<li>Pace per mile = pace per km × 1.609</li>
<li>Pace per km = pace per mile ÷ 1.609</li>
</ul>
<p>To do it on your fingers, work in seconds. 5:30 per km is 330 seconds. 330 × 1.609 = 531 seconds, which is 8:51 per mile. Going the other way, 9:00 per mile is 540 seconds, and 540 ÷ 1.609 = 335.6 seconds, or 5:36 per km.</p>

<h2>Pace to speed and back</h2>
<p>Pace and speed are two views of the same thing, and one is the reciprocal of the other:</p>
<ul>
<li>Speed (km/h) = 60 ÷ pace (minutes per km as a decimal)</li>
<li>Pace (min/km) = 60 ÷ speed (km/h)</li>
</ul>
<p>5:00 per km is 5.0 minutes, so the speed is 12 km/h. 6:30 per km is 6.5 minutes, so the speed is 9.2 km/h. This is useful for treadmills, which show speed, and for training plans, which show pace.</p>

<h2>What is a good running pace?</h2>
<p>There is no single answer, because pace depends on age, training, terrain and distance. For context, many recreational runners cover a 5K in 28–35 minutes (about 5:40–7:00 per km), and the typical beginner pace is often slower than people expect. A comfortable training run is one where you can speak in short sentences. A good first target is to finish a distance at a steady, even pace; improving pace is a later step.</p>

<h2>Using pace in training</h2>
<ul>
<li><strong>Easy runs.</strong> Most of your weekly volume should be at a conversational effort, often 1–2 minutes per mile slower than 5K race pace.</li>
<li><strong>Tempo runs.</strong> Comfortably hard, about the pace you could hold for an hour.</li>
<li><strong>Intervals.</strong> Faster than race pace with recovery, usually over 400 m to 1 mile.</li>
<li><strong>Long runs.</strong> Slow enough to finish the distance feeling you could do more.</li>
</ul>
<p>Pace targets from a table are a guide. Heat, hills, wind and fatigue can slow you by 10–30 seconds per kilometre without being a problem, so many coaches use effort or heart rate on hard days instead.</p>

<h2>Why you cannot just multiply a 5K pace</h2>
<p>The projections in a pace table assume you hold the same pace for the full distance. Most runners slow down over longer races, so a 5K pace multiplied up to a marathon is a ceiling, not a prediction. A common rule of thumb is that marathon pace is 15–25 seconds per km slower than 10K pace for trained runners, but it varies a lot. See how pace translates to typical distances in our <a href="/blogs/article/marathon-pace-chart-finish-times">marathon pace chart</a>.</p>
<p>The <a href="/tools/pace-calculator">pace calculator</a> does these conversions instantly and lists finish times for a mile, 5K, 10K, half marathon and marathon. To match training to your goals, estimate energy needs with the <a href="/tools/calorie-calculator">calorie calculator</a> and see how to set the split in <a href="/blogs/article/how-to-calculate-macros-for-weight-loss">how to calculate macros</a>. Hydration needs rise with training, which the <a href="/tools/water-intake-calculator">water intake calculator</a> estimates, and the <a href="/tools/unit-converter">unit converter</a> handles miles, kilometres and metres.</p>

<h2>Frequently asked questions</h2>
<h3>What is a 10-minute mile in km pace?</h3>
<p>10:00 per mile is 600 seconds, and 600 ÷ 1.609 = 372.8 seconds, so 6:13 per kilometre.</p>
<h3>How fast is a 5:00 per km pace?</h3>
<p>12 km/h, or 7.5 mph. A 5K at that pace takes 25 minutes.</p>
<h3>How do I calculate my finish time from pace?</h3>
<p>Multiply pace by distance. At 5:30 per km, a 10K takes 55:00.</p>
<h3>Does elevation change pace?</h3>
<p>Yes. Hills slow your pace uphill and only partly recover it downhill, so a hilly route is usually slower than a flat one at the same effort.</p>
`,
};
