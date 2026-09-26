export default {
  slug: 'what-is-a-good-keyword-density',
  title: 'What Is a Good Keyword Density? (And How to Check It)',
  translationKey: 'keyword-density',
  category: 'seo',
  theme: 'seo',
  tags: ['keyword density', 'keyword density checker', 'keyword stuffing', 'on-page seo', 'word frequency', 'seo writing'],
  description: 'There is no ideal keyword density for Google, but the number is still a useful check. Learn the formula, typical ranges, and how to spot keyword stuffing fast.',
  cover: {
    kicker: 'The formula, the typical range, and the myth',
    visual: { type: 'formula', title: 'KEYWORD DENSITY', lines: ['uses ÷ words × 100', '9 ÷ 1,200 × 100', '= 0.75%'] },
  },
  infographic: {
    type: 'table',
    title: 'Reading a keyword density result',
    subtitle: 'Typical ranges for a page’s main keyword in naturally written text. A diagnostic, not a target. Google publishes no ideal figure.',
    columns: ['Density of main keyword', 'What it usually means', 'What to do'],
    widths: [300, 400, 356],
    rows: [
      ['0%', 'Keyword never used verbatim', 'Add it to title, H1, intro'],
      ['Under 0.5%', 'Normal for long pages and variants', 'Nothing, if the topic is clear'],
      ['0.5%–2%', 'Typical for focused pages', 'Nothing, write for the reader'],
      ['2%–3%', 'Getting repetitive', 'Swap some uses for variants'],
      ['Over 3%', 'Likely reads as stuffing', 'Rewrite for natural language'],
    ],
    alt: 'Table of keyword density ranges from 0% to over 3%, what each range usually means and what to do about it',
    caption: 'Short pages swing wildly: one extra mention in a 200-word page adds 0.5 percentage points.',
    footer: 'Check a page: talkandtool.com/tools/word-frequency-counter',
  },
  html: `
<p>There is no ideal keyword density for Google. It has never published one, and its ranking systems do not reward hitting a percentage. Most naturally written pages land somewhere around 0.5–2% for their main keyword. The number is still useful as a quick check for two problems: a keyword you forgot to use, and one you have repeated so often it reads as stuffing.</p>

<h2>How keyword density is calculated</h2>
<p>For a single word, keyword density is the number of times the keyword appears divided by the total word count, times 100:</p>
<p><strong>Keyword density = (keyword occurrences ÷ total words) × 100</strong></p>
<p>Example: a 1,200-word article that uses "budget" 9 times has a density of 9 ÷ 1,200 × 100 = <strong>0.75%</strong>.</p>
<p>For a phrase, tools differ. Some count each occurrence of "keyword density checker" as one, giving 9 ÷ 1,200 = 0.75%. Others multiply by the number of words in the phrase, since the phrase takes up three words of the text each time: 9 × 3 ÷ 1,200 = 2.25%. Neither is wrong. Just compare numbers from the same tool, or you will think a page doubled its density overnight.</p>

<h2>What is a good keyword density?</h2>

{{infographic}}

<p>Treat the ranges as smoke alarms, not targets. A page at 0.3% can rank first because it covers the topic thoroughly with varied language. A page at 4% can rank because it is short and the keyword is the product name. What matters is whether the text reads naturally and covers what the searcher needs.</p>

<h2>Why density stopped mattering (and what replaced it)</h2>
<p>Early search engines matched pages to queries largely by counting words, so repeating a keyword worked. Modern search understands synonyms, related concepts and the meaning of a passage. A page about "how to lower my car insurance" can rank for "reduce auto insurance premium" without using those words at all.</p>
<p>What now matters instead:</p>
<ul>
<li><strong>Placement.</strong> The keyword or a close variant in the title, the H1, the first paragraph and at least one subheading tells Google and the reader what the page is about. Placement beats frequency.</li>
<li><strong>Coverage.</strong> Pages that rank well mention the related terms and subtopics a knowledgeable writer would naturally include. A mortgage page that never mentions interest rate, term or deposit looks thin whatever its density.</li>
<li><strong>Intent match.</strong> The right format and depth for the query. No density can fix a page that answers the wrong question.</li>
</ul>

<h2>Keyword stuffing: where density still matters</h2>
<p>Google's spam policies name keyword stuffing explicitly: filling a page with keywords or numbers in an attempt to manipulate rankings, often out of context. Classic signs:</p>
<ul>
<li>The same phrase in almost every sentence, often awkwardly ("Our cheap flights to Paris offer cheap flights to Paris…").</li>
<li>Lists of cities, keywords or phone numbers with no purpose for the reader.</li>
<li>Keywords hidden in footers, alt text or in text coloured to match the background.</li>
<li>Titles that are just comma-separated keyword variations.</li>
</ul>
<p>If a density check shows your main phrase well above 3%, read the page aloud. If it sounds like a sales robot, rewrite with pronouns, synonyms and more specific detail.</p>

<h2>How to check keyword density</h2>
<ol>
<li><strong>Paste the page text</strong> into the <a href="/tools/word-frequency-counter">word frequency and keyword density checker</a>. Copy only the main content; menus, footers and sidebars skew the count.</li>
<li><strong>Look at the top single words and phrases.</strong> Your main topic should be near the top. If a generic word like "tool" or "best" outranks it, the page may be vaguer than you think.</li>
<li><strong>Check two- and three-word phrases.</strong> These reveal repetitive phrasing that single-word counts miss.</li>
<li><strong>Confirm placement by eye:</strong> title, H1, first 100 words and a subheading.</li>
</ol>
<p>The <a href="/tools/word-counter">word counter</a> is handy alongside it for total length, reading time and character counts, especially when trimming meta descriptions or titles.</p>

<h2>What about length?</h2>
<p>Density and length are linked: the same number of mentions reads very differently in 300 words than in 3,000. Rather than aiming for a length, match the depth that the top-ranking pages for your query show. We covered that in <a href="/blogs/article/how-long-should-a-blog-post-be">how long should a blog post be</a>.</p>

<h2>A practical writing routine</h2>
<ul>
<li>Write the draft for the reader without thinking about keywords.</li>
<li>Put the primary keyword in the title, H1 and opening sentence.</li>
<li>Run a density check. Add a mention if the main term is missing; vary the wording if it passes about 2–3%.</li>
<li>Check that related terms a specialist would use are present.</li>
<li>Read it aloud once. Stuffing is easier to hear than to count.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Is 1% keyword density good?</h3>
<p>It is a normal, natural figure for a focused page. It is not a target, though. A page can rank well above or below it.</p>
<h3>Does keyword density affect rankings?</h3>
<p>Not as a ranking factor in itself. Very low usage can leave a page's topic unclear, and very high usage can be treated as keyword stuffing, which Google's spam policies prohibit.</p>
<h3>Do stop words count toward total words?</h3>
<p>In most checkers, yes. Stop words like "the", "and" and "of" are included in the total, which is why density figures from different tools rarely match exactly.</p>
`,
};
