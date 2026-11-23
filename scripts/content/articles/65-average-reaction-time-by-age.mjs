export default {
  slug: 'average-reaction-time-by-age',
  title: 'Average Reaction Time by Age (and How to Improve Yours)',
  category: 'health',
  theme: 'health',
  tags: ['average reaction time', 'reaction time by age', 'good reaction time', 'reaction time test', 'how to improve reaction time', 'human reaction time'],
  description: 'The average human reaction time is about 250 milliseconds for a visual cue. See typical ranges by age, why online tests read higher, and what actually improves reflexes.',
  cover: {
    kicker: 'About a quarter of a second, and what changes it',
    visual: { type: 'stat', value: '≈ 250 ms', label: 'typical reaction to a visual cue', note: 'sound is faster, about 170 ms' },
  },
  infographic: {
    type: 'table',
    title: 'Typical visual reaction time by age',
    subtitle: 'Rough ranges for a simple click-when-it-changes test. Online tests read 20 to 50 ms higher than lab equipment.',
    columns: ['Age group', 'Typical range', 'What to expect'],
    widths: [300, 280, 476],
    rows: [
      ['Under 12', '300 to 400 ms', 'Improves quickly through childhood'],
      ['12 to 19', '240 to 290 ms', 'Close to adult speed by the late teens'],
      ['20 to 29', '230 to 270 ms', 'The fastest decade for most people'],
      ['30 to 49', '240 to 290 ms', 'Very slight slowing, offset by practice'],
      ['50 to 69', '260 to 320 ms', 'Noticeable but small change'],
      ['70 and over', '290 to 380 ms', 'More variation between individuals'],
    ],
    alt: 'Table of typical visual reaction times in milliseconds for age groups from under 12 to 70 and over',
    caption: 'Differences between people of the same age are bigger than the differences between age groups.',
    footer: 'Test yours: talkandtool.com/tools/reaction-time-test',
  },
  html: `
<p>For a simple visual cue such as a colour change on a screen, the average person reacts in about 250 milliseconds, a quarter of a second. Reaction to a sound is a little quicker, around 170 milliseconds, and reaction to touch falls in between. Young adults tend to be fastest, with a gradual slowing from the thirties onward, but individual differences are large. This guide covers typical times by age, why your result on a website may look worse than the textbook number, and the habits that actually help.</p>

{{infographic}}

<h2>What reaction time measures</h2>
<p>Reaction time is the delay between a stimulus and your response. In a simple test, a signal appears and you press a button as soon as you see it. The time includes detecting the signal, deciding to act, sending the command from the brain to the muscles and the movement of the finger. Only a small part of it is under your conscious control, which is why the number moves in tens of milliseconds, not hundreds.</p>
<p>A "choice" reaction, where you have to decide between options (left or right, red or green), takes longer than a simple one, usually 350 to 500 milliseconds, because deciding takes time. Driving and most sport are choice tasks.</p>

<h2>Typical times by age</h2>
<p>The table above gives approximate ranges. Children are slower because their nervous systems and attention are still developing, and speeds approach adult values in the late teens. Most people are fastest in their twenties. After that, reaction time lengthens slowly, by roughly a few milliseconds every few years, and the change is mostly visible after 50. Many older adults still outperform younger people who are tired or distracted, and regular activity narrows the gap. Treat any chart as a rough guide, not a verdict.</p>

<h2>Why an online test may show a higher number</h2>
<p>Lab studies use dedicated hardware. A website adds delays you cannot see:</p>
<ul>
<li><strong>Screen refresh rate:</strong> a 60 Hz display updates every 16.7 ms, so the colour change may appear up to that much late. A 144 Hz screen cuts it to about 7 ms.</li>
<li><strong>Display and input lag:</strong> TVs and some wireless mice add 10 to 50 ms or more.</li>
<li><strong>Mouse or trackpad:</strong> a button press on a wired gaming mouse registers faster than a trackpad tap.</li>
</ul>
<p>That is why you should compare yourself only against scores from the same device. Use the average of five attempts on the <a href="/tools/reaction-time-test">reaction time test</a> rather than your single best, and see the guide on <a href="/blogs/article/mean-median-mode-difference">mean, median and mode</a> for why. The <a href="/tools/average-calculator">average calculator</a> gives you the figure quickly.</p>

<h2>What affects reaction time</h2>
<ul>
<li><strong>Sleep:</strong> sleep loss slows reaction time and increases lapses. In one widely cited study, 17 to 19 hours awake produced performance on some tests similar to a blood alcohol level of about 0.05%. How much rest you need is covered in <a href="/blogs/article/how-much-sleep-do-you-need">how much sleep you need</a>.</li>
<li><strong>Caffeine:</strong> a moderate dose can sharpen attention and shave a little time off, though too much brings jitters.</li>
<li><strong>Distraction and stress:</strong> divided attention slows responses, and so does anxiety.</li>
<li><strong>Alcohol and some medications:</strong> both slow reactions. Read the label of anything that causes drowsiness before driving.</li>
<li><strong>Practice:</strong> repeating a specific task makes you faster at that task, though it does not necessarily transfer to others.</li>
<li><strong>Anticipation:</strong> a result under about 150 ms on a random-delay test is almost always guessing, not reacting.</li>
</ul>

<h2>How to improve your reaction time</h2>
<ul>
<li><strong>Get consistent sleep.</strong> It is the single most effective change. Use the <a href="/tools/sleep-calculator">sleep calculator</a> to pick a bedtime that matches your wake-up time.</li>
<li><strong>Exercise regularly.</strong> Aerobic activity is linked to faster processing, particularly in older adults.</li>
<li><strong>Practise the real task.</strong> If you want to be faster at a game, play it, and warm up with a few quick trials first.</li>
<li><strong>Reduce lag you control.</strong> Use a wired mouse, a high refresh rate monitor and game mode on your TV.</li>
<li><strong>Stay hydrated and eat regularly.</strong> Low energy and dehydration reduce alertness.</li>
</ul>
<p>Do not expect large permanent gains from "brain training". Gains tend to be small and specific to the exercise. Related skills such as click speed are trainable in their own right, as covered in <a href="/blogs/article/how-to-increase-click-speed-cps">how to increase your CPS</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is a good reaction time?</h3>
<p>For a visual test, under 250 ms is good and under 200 ms is excellent. Over 300 ms is on the slow side, and often means you are tired.</p>
<h3>What is the fastest human reaction time?</h3>
<p>In sprinting, athletes cannot legally start earlier than 100 ms after the gun, because anything faster is judged to be a guess. Reactions of 120 to 150 ms are seen in elite performers on auditory cues.</p>
<h3>Is reaction to sound faster than to light?</h3>
<p>Yes. A sound takes roughly 140 to 180 ms and a visual cue about 180 to 250 ms for most people, because auditory signals reach the brain faster.</p>
<h3>Does reaction time get worse with age?</h3>
<p>It slows gradually after about 30 and more noticeably after 50 to 60, but the average difference is tens of milliseconds, and exercise and practice reduce it.</p>
<h3>How many attempts should I average?</h3>
<p>At least five. The first attempts are usually the slowest, and a single great result can be luck.</p>
`,
};
