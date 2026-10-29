export default {
  slug: 'flesch-reading-ease-score-explained',
  title: 'Flesch Reading Ease Score: Formula, Chart and What to Aim For',
  category: 'seo',
  theme: 'seo',
  tags: ['flesch reading ease', 'readability score', 'flesch kincaid', 'reading level', 'readability formula', 'plain english'],
  description: 'What the Flesch Reading Ease score means, the formula behind it, a chart from 0 to 100, a worked example, and the score to aim for on a website.',
  cover: {
    kicker: 'Higher is easier to read',
    visual: {
      type: 'formula',
      title: 'FLESCH READING EASE',
      lines: ['206.835', '− 1.015 × words/sentence', '− 84.6 × syllables/word', '100 words · 5 sentences · 150 syl', '= 59.6'],
    },
  },
  infographic: {
    type: 'table',
    title: 'Flesch Reading Ease chart',
    subtitle: 'Score bands and the US school level they roughly match.',
    columns: ['Score', 'How it reads', 'Typical level', 'Example'],
    widths: [170, 270, 290, 326],
    rows: [
      ['90–100', 'Very easy', '5th grade', 'Children’s books, short instructions'],
      ['80–90', 'Easy', '6th grade', 'Conversational text, product copy'],
      ['70–80', 'Fairly easy', '7th grade', 'Most popular fiction'],
      ['60–70', 'Plain English', '8th–9th grade', 'Good web content, news'],
      ['50–60', 'Fairly difficult', '10th–12th grade', 'Quality magazines, blogs on complex topics'],
      ['30–50', 'Difficult', 'College', 'Academic and trade writing'],
      ['0–30', 'Very difficult', 'College graduate', 'Legal and scientific papers'],
    ],
    alt: 'Chart of Flesch Reading Ease score bands from 0 to 100 with the school level and typical text for each band',
    caption: 'Scores can fall below 0 or rise above 100 for extreme text; they are not capped.',
    footer: 'Score your own text: talkandtool.com/tools/readability-score-checker',
  },
  html: `
<p>The Flesch Reading Ease score rates how easy a passage is to read on a scale that usually runs from 0 to 100, where higher means easier. It looks only at two things: how long your sentences are and how many syllables your words have. This guide gives the formula, a chart you can read a score against, a worked example, and the range to aim for when you write for the web.</p>

<h2>The formula</h2>
<p>Rudolf Flesch published the score in 1948. It is still the readability measure most writing tools report, including the statistics panel in Microsoft Word.</p>
<p><strong>Reading Ease = 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words)</strong></p>
<p>Both averages pull the score down. A passage with long sentences loses points through the first term, and a passage full of long words loses points through the second. The second term is the heavier one: adding one syllable to the average word costs about 85 points, while adding one word to the average sentence costs only about one.</p>

{{infographic}}

<h2>A worked example</h2>
<p>Take a passage of 100 words that has 5 sentences and 150 syllables.</p>
<ul>
<li>Words per sentence: 100 ÷ 5 = 20</li>
<li>Syllables per word: 150 ÷ 100 = 1.5</li>
<li>Score: 206.835 − (1.015 × 20) − (84.6 × 1.5) = 206.835 − 20.3 − 126.9 = <strong>59.6</strong></li>
</ul>
<p>That lands at the top of the "fairly difficult" band, close to plain English. Cut the average sentence to 14 words and keep the same vocabulary, and the score rises to about 65.7. Keep the sentences at 20 words but swap a few long words for shorter ones so the average falls to 1.4 syllables, and it rises to about 68.1. Both levers work, and the word-length one is stronger.</p>

<h2>What score should you aim for?</h2>
<p>Match the score to the reader, not to a number. Some rough guidance:</p>
<ul>
<li><strong>60–70 for general web content.</strong> Most adults read this comfortably without effort. It is the usual target for articles, help pages and marketing copy.</li>
<li><strong>70–80 for instructions and landing pages.</strong> People in a hurry, or reading on a phone, need less friction.</li>
<li><strong>40–60 for specialist audiences.</strong> Pages about law, medicine, finance or engineering will score lower because the vocabulary is technical. A low score is not a fault when the readers expect the terms.</li>
</ul>
<p>Do not chase 100. Text built from one-syllable words in three-word sentences scores very high and reads like a robot. The score is a smoke alarm for dense writing, not a measure of quality.</p>

<h2>Does readability matter for SEO?</h2>
<p>Google has not named a readability score as a ranking factor, and there is no point in treating it as one. The connection is practical. Pages that are easy to scan get read for longer, answer the query more directly, and are easier to quote in a featured snippet or an AI summary. Those are the outcomes that help a page. If you want a reading-level number to track while you edit, use it as a prompt to simplify, then judge the result by whether it is clearer.</p>
<p>It pairs naturally with the rest of on-page work: a title that fits the display limit (see <a href="/blogs/article/seo-title-length-pixel-limit">how long an SEO title can be</a>), and headings that match the question. Check your copy with the <a href="/tools/readability-score-checker">readability score checker</a>, and use the <a href="/tools/word-counter">word counter</a> when you need length targets.</p>

<h2>How the score is limited</h2>
<ul>
<li><strong>It counts syllables, not meaning.</strong> "Utilise" and "use" are different lengths but the same idea. A short word can still be unfamiliar, and a long word can be everyday.</li>
<li><strong>It is built for English.</strong> The constants were fitted to English text. Other languages need adapted versions, which is why German and Dutch have their own formulas.</li>
<li><strong>It ignores structure.</strong> Headings, bullet lists, tables and short paragraphs make a page far easier to read, and none of them change the score.</li>
<li><strong>Syllable counting is approximate.</strong> Software uses rules of thumb for syllables, so two tools will differ by a point or two on the same text.</li>
</ul>

<h2>Flesch Reading Ease vs the Flesch-Kincaid grade level</h2>
<p>The two come from the same two inputs but run in opposite directions. Reading Ease goes up as text gets easier. The Flesch-Kincaid grade level, developed for the US Navy in the 1970s, goes up as text gets harder and approximates the US school grade needed to understand it. The 100-word example above scores a grade of about 9.9. If you have to report one number to a colleague, the grade level is usually easier to explain, since "grade 8" needs no chart.</p>

<h2>Frequently asked questions</h2>
<h3>Can a Flesch score be above 100 or below 0?</h3>
<p>Yes. The scale is not capped. One short sentence of one-syllable words can score above 100, and a sentence stuffed with long words can score below zero.</p>
<h3>Is a higher score always better?</h3>
<p>No. Higher means easier, which suits a general audience. Technical readers may find text that is too simple slow and imprecise. Aim for the level your readers use.</p>
<h3>How many words do I need for a reliable score?</h3>
<p>Use at least 100 words, and a few hundred if you can. Over a handful of sentences the averages swing widely and one long sentence can move the score by ten points or more.</p>
<h3>How do I see the score in Microsoft Word?</h3>
<p>Go to File → Options → Proofing, tick "Show readability statistics", then run a spelling and grammar check. The statistics appear at the end of the check.</p>
`,
};
