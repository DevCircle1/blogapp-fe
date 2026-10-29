export default {
  slug: 'how-to-improve-readability-score',
  title: 'How to Improve Your Readability Score: 8 Edits That Work',
  category: 'seo',
  theme: 'seo',
  tags: ['improve readability score', 'readability', 'plain language', 'shorter sentences', 'writing for the web', 'flesch score'],
  description: 'Eight practical edits that raise a readability score without dumbing down your writing, with a before-and-after example that moves from 4 to 72.',
  cover: {
    kicker: 'Same message, rewritten',
    visual: { type: 'stat', value: '4 → 72', label: 'Flesch Reading Ease after one rewrite', note: 'one 51-word sentence became two short ones' },
  },
  infographic: {
    type: 'table',
    title: 'One paragraph, rewritten',
    subtitle: 'The same message before and after the edits in this guide.',
    columns: ['', 'Words', 'Sentences', 'Reading Ease', 'US grade'],
    widths: [330, 160, 190, 190, 186],
    rows: [
      ['Before', '51', '1', '4.1 · very difficult', '25.4'],
      ['After', '25', '2', '72.3 · fairly easy', '6.3'],
    ],
    alt: 'Table comparing a paragraph before and after editing: Flesch Reading Ease rises from 4.1 to 72.3 and the grade level falls from 25.4 to 6.3',
    caption: 'Fewer words, shorter sentences and plainer verbs did all of the work.',
    footer: 'Score yours: talkandtool.com/tools/readability-score-checker',
  },
  html: `
<p>You can raise a readability score quickly, and without making your writing childish, by shortening sentences, replacing long words with short ones and cutting padding. The eight edits below are ordered from the biggest effect to the smallest. A before-and-after example at the end shows a paragraph moving from a Flesch Reading Ease score of 4 to 72 using nothing but these edits.</p>

<h2>Know what the score rewards</h2>
<p>Readability formulas, including <a href="/blogs/article/flesch-reading-ease-score-explained">Flesch Reading Ease</a>, use two inputs: average sentence length and average word length in syllables. There is nothing else to edit. Make sentences shorter and words shorter, and the score goes up. Everything below is a way of doing that without losing meaning.</p>

<h2>The eight edits</h2>
<h3>1. Split your longest sentence first</h3>
<p>Run your text through the <a href="/tools/readability-score-checker">readability score checker</a>, which lists every sentence over 25 words. Start with the longest. A sentence with a comma, a "which" or an "and" in the middle usually splits into two sentences at that point with no other change. Aim for an average near 15 to 20 words, mixing in a few very short sentences so the rhythm does not go flat.</p>

<h3>2. Swap long words for short ones</h3>
<p>This edit is worth more than it looks, because word length counts for far more than sentence length in the formula. Common swaps:</p>
<ul>
<li>utilise → use</li>
<li>commence → start</li>
<li>facilitate → help</li>
<li>approximately → about</li>
<li>subsequently → then</li>
<li>in order to → to</li>
<li>prior to → before</li>
<li>demonstrate → show</li>
</ul>
<p>Keep technical terms your readers need. Replace words that are only long for the sake of sounding formal.</p>

<h3>3. Use verbs, not noun phrases</h3>
<p>"The configuration of preferences" is slower than "set your preferences". Nouns made from verbs (utilisation, implementation, commencement) add syllables and hide who is doing what. Turn them back into verbs.</p>

<h3>4. Prefer the active voice</h3>
<p>"Your preferences are used in every later step" is fine, but "the preferences that have been undertaken will be leveraged" is passive padding. Put the person or thing doing the action first when you can. The formula does not measure voice, but active sentences are almost always shorter.</p>

<h3>5. Cut filler</h3>
<p>Phrases like "it is important to note that", "as a matter of fact", "in the event that" and "for the purpose of" add words and carry nothing. Delete them and check that the sentence still works. It nearly always does.</p>

<h3>6. Break up paragraphs and add structure</h3>
<p>Short paragraphs of two to four sentences, descriptive subheadings and bullet lists make a page easier to scan. They will not change the score, because the formula counts words and sentences, not layout, but they matter more to a reader than the score does.</p>

<h3>7. Define a term once, then keep using it</h3>
<p>Switching between synonyms to avoid repetition (users, customers, clients, end-users) makes readers wonder if you mean different groups. Pick one word and keep it. Repetition of a familiar word reads easier than variety.</p>

<h3>8. Read it aloud</h3>
<p>Anywhere you run out of breath or stumble, the sentence is too long or the phrasing is awkward. This catches problems that a score cannot, including a good score on bad prose.</p>

{{infographic}}

<h2>A before-and-after example</h2>
<p><strong>Before (51 words, one sentence, Reading Ease 4.1, grade 25.4):</strong></p>
<p>"In order to facilitate the utilisation of our platform, it is recommended that users should endeavour to complete the onboarding process prior to the commencement of their first project, as the configuration of preferences that has been undertaken at this stage will be leveraged throughout the entirety of the subsequent workflow."</p>
<p><strong>After (25 words, two sentences, Reading Ease 72.3, grade 6.3):</strong></p>
<p>"To get the most from our platform, finish onboarding before your first project. The preferences you set there are used in every step that follows."</p>
<p>What changed: "in order to facilitate the utilisation of" became "to get the most from"; "it is recommended that users should endeavour to complete" became "finish"; "prior to the commencement of" became "before"; the long sentence was split in two; and the noun phrase "configuration of preferences" became the verb phrase "preferences you set". The message is intact, and it is half the length.</p>

<h2>When not to push the score higher</h2>
<p>A technical or legal page can have good reasons to use precise, longer terms. If a medical article says "hypertension", do not replace it with "high blood pressure" only to lift a number; explain the term the first time and use it. Judge success by whether your target reader gets to the answer faster. If they do, the score is doing its job. Pair the edits with checks on your other on-page elements, such as the <a href="/blogs/article/meta-tags-that-matter-for-seo">meta tags that matter</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is the fastest way to raise my score?</h3>
<p>Split the longest sentences and replace the longest words. Those two edits account for most of the gain in nearly every text.</p>
<h3>What reading level should website copy have?</h3>
<p>For a general audience, grade 8 or lower is a common target, which corresponds to a Reading Ease score of roughly 60 or higher.</p>
<h3>Will AI rewrite tools do this for me?</h3>
<p>They can produce a first pass, but check what they return. They sometimes simplify by removing the detail you needed. Re-score the output and read it against the original before you keep it.</p>
<h3>Does short always mean better?</h3>
<p>No. A run of very short sentences reads choppy. Vary the length and let one or two longer sentences carry an idea that needs the room.</p>
`,
};
