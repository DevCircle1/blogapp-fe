export default {
  slug: 'how-much-sleep-do-you-need',
  title: 'How Much Sleep Do You Need? Sleep Cycles and Bedtimes',
  category: 'health',
  theme: 'health',
  tags: ['how much sleep do i need', 'sleep cycles', 'sleep calculator', 'what time should i go to bed', '90 minute sleep cycle', 'hours of sleep by age'],
  description: 'Sleep needs by age, how 90-minute sleep cycles work, and how to pick a bedtime so your alarm lands at the end of a cycle. Includes a quick bedtime chart.',
  cover: {
    kicker: '7 to 9 hours, in cycles of about 90 minutes',
    visual: { type: 'stat', value: '5 × 90 min', label: 'one full night: five cycles = 7.5 hours', note: 'plus about 15 minutes to fall asleep' },
  },
  infographic: {
    type: 'table',
    title: 'Bedtimes for a 7:00 AM wake-up',
    subtitle: 'Assumes 15 minutes to fall asleep and 90-minute cycles. Each row ends exactly as a cycle finishes.',
    columns: ['Go to bed at', 'Cycles', 'Sleep you get'],
    widths: [352, 352, 352],
    rows: [
      ['9:45 PM', '6 cycles', '9 hours'], ['11:15 PM', '5 cycles', '7.5 hours'],
      ['12:45 AM', '4 cycles', '6 hours'], ['2:15 AM', '3 cycles', '4.5 hours'],
    ],
    alt: 'Table of bedtimes for a 7 AM alarm showing the number of 90-minute sleep cycles and total sleep for each',
    caption: 'Five or six cycles suits most adults. Four or fewer is a short night.',
    footer: 'Your own times: talkandtool.com/tools/sleep-calculator',
  },
  html: `
<p>Most adults need 7 to 9 hours of sleep a night, which is five or six complete sleep cycles of roughly 90 minutes each. Teenagers need 8 to 10 hours and school-age children 9 to 12. Because you tend to wake more easily at the end of a cycle than in the middle of one, it helps to choose a bedtime or alarm that matches the cycles: for a 7:00 AM wake-up, going to bed at 11:15 PM gives five cycles after allowing 15 minutes to fall asleep. Here is how the numbers work and how to use them.</p>

{{infographic}}

<h2>Recommended sleep by age</h2>
<p>These ranges follow the guidance of major sleep organisations. Needs vary from person to person, so use them as a starting point.</p>
<ul>
<li><strong>Newborns (0 to 3 months):</strong> 14 to 17 hours</li>
<li><strong>Infants (4 to 11 months):</strong> 12 to 15 hours</li>
<li><strong>Toddlers (1 to 2 years):</strong> 11 to 14 hours</li>
<li><strong>Preschool (3 to 5):</strong> 10 to 13 hours</li>
<li><strong>School age (6 to 13):</strong> 9 to 11 hours</li>
<li><strong>Teenagers (14 to 17):</strong> 8 to 10 hours</li>
<li><strong>Adults (18 to 64):</strong> 7 to 9 hours</li>
<li><strong>Older adults (65+):</strong> 7 to 8 hours</li>
</ul>
<p>A good check is how you feel: if you wake up refreshed, need no alarm on holidays beyond your usual time and stay alert all day, you are probably getting enough.</p>

<h2>What a sleep cycle is</h2>
<p>During the night, your brain cycles through stages. Light sleep (stages 1 and 2) leads into deep, slow-wave sleep, which is when the body repairs itself, and then into REM sleep, when most vivid dreaming happens. One pass through the sequence takes about 90 minutes on average, although it can range from 80 to 110 and varies between people and between cycles. You usually complete four to six of them. Early cycles contain more deep sleep, and later ones contain more REM sleep.</p>
<p>The idea behind the 90-minute rule is that waking during deep sleep leaves you groggy, a feeling called sleep inertia, while waking near the end of a cycle in lighter sleep is easier. It is a helpful guide, not a precise science, so treat the times as a starting point and adjust by 10 to 15 minutes if you still feel groggy.</p>

<h2>How to calculate your bedtime</h2>
<p>The method is simple:</p>
<ol>
<li>Choose the wake-up time you need, for example 6:30 AM.</li>
<li>Subtract 7.5 hours (five cycles) to get 11:00 PM.</li>
<li>Subtract another 15 minutes for the time it takes to fall asleep, which gives 10:45 PM as your bedtime.</li>
<li>If that is too early, use four cycles (6 hours) as a minimum rather than an ideal.</li>
</ol>
<p>The <a href="/tools/sleep-calculator">sleep calculator</a> does this for you, and works the other way round as well: enter when you are going to bed and it lists the alarm times at the end of each cycle. You can change the minutes to fall asleep if you drop off faster or slower than 15.</p>

<h2>What too little sleep does</h2>
<p>A single short night reduces attention, slows reactions and affects mood. Habitual short sleep is linked with weight gain, weaker immunity, higher blood pressure and a greater risk of accidents. Alertness and speed take a hit first: see <a href="/blogs/article/average-reaction-time-by-age">average reaction time by age</a> for how tiredness shows up in reaction tests, and test yourself with the <a href="/tools/reaction-time-test">reaction time test</a> when you are rested and when you are not. Sleep also interacts with appetite, which is one reason sleep matters for people managing their weight; the <a href="/tools/calorie-calculator">calorie calculator</a> and <a href="/blogs/article/how-to-calculate-macros-for-weight-loss">macros guide</a> cover the food side.</p>

<h2>Habits that improve sleep quality</h2>
<ul>
<li><strong>Keep a regular schedule,</strong> including weekends. A consistent wake time is the strongest anchor for your body clock.</li>
<li><strong>Get morning light</strong> and be active during the day.</li>
<li><strong>Limit caffeine</strong> in the afternoon. Its effects can last for 6 hours or more.</li>
<li><strong>Keep the bedroom dark, quiet and cool.</strong> Many people sleep best at around 16 to 19 °C.</li>
<li><strong>Wind down for 30 to 60 minutes</strong> before bed, and put screens away.</li>
<li><strong>Avoid large meals and alcohol late.</strong> Alcohol may help you fall asleep but breaks up sleep later in the night.</li>
<li><strong>Stay hydrated through the day,</strong> though not so much right before bed that you wake up. The <a href="/tools/water-intake-calculator">water intake calculator</a> can help you pace it.</li>
</ul>

<h2>Naps</h2>
<p>A short nap of 10 to 20 minutes can restore alertness without leaving you groggy. A nap of about 90 minutes covers a full cycle. Naps in the late afternoon can make it harder to fall asleep at night.</p>

<h2>When to see a doctor</h2>
<p>If you regularly take more than 30 minutes to fall asleep, wake often, snore loudly, stop breathing at night or feel exhausted despite a full night, speak to a doctor. These can be signs of insomnia or sleep apnoea, which are treatable. This article is general information, not medical advice.</p>

<h2>Frequently asked questions</h2>
<h3>Is 6 hours of sleep enough?</h3>
<p>It is four cycles. Some people cope, but most adults function better and have better health on 7 to 9 hours.</p>
<h3>What time should I go to bed if I wake at 6 AM?</h3>
<p>For five cycles with 15 minutes to fall asleep, go to bed at 10:15 PM. For six cycles, 8:45 PM.</p>
<h3>Why do I feel tired after 9 hours?</h3>
<p>Sleep quality, waking mid-cycle, a very long sleep or an underlying condition can all be causes. Try a consistent schedule and cycle-based timing, and see a doctor if it persists.</p>
<h3>Are cycles really exactly 90 minutes?</h3>
<p>No. 90 minutes is an average. Yours might be 80 or 105, so adjust the times if the suggestions do not feel right.</p>
<h3>Should I go by hours or by cycles?</h3>
<p>Use cycles to fine-tune your times, but make sure the total still adds up to 7 or more hours.</p>
`,
};
