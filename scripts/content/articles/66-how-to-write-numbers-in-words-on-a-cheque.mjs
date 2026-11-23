export default {
  slug: 'how-to-write-numbers-in-words-on-a-cheque',
  title: 'How to Write Numbers in Words (Cheques, Contracts, Ordinals)',
  category: 'math',
  theme: 'math',
  tags: ['number to words', 'write numbers in words', 'how to write a cheque', 'cheque amount in words', 'ordinal numbers', 'spelling numbers'],
  description: 'Rules for spelling numbers in words: hyphens, hundreds and “and”, decimals, ordinals like twenty-first, and exactly how to write the amount on a cheque.',
  cover: {
    kicker: 'Hyphens, “and”, decimals and the cheque fraction',
    visual: { type: 'formula', title: 'ON A CHEQUE', lines: ['$1,234.56', 'One thousand two hundred', 'thirty-four and 56/100', 'dollars'] },
  },
  infographic: {
    type: 'table',
    title: 'Spelling rules for numbers in words',
    subtitle: 'The rules that cover almost every number you will write out.',
    columns: ['Rule', 'Example', 'Words'],
    widths: [330, 250, 476],
    rows: [
      ['Hyphenate 21 to 99', '47', 'forty-seven'],
      ['Do not hyphenate hundreds, thousands', '300', 'three hundred'],
      ['No commas in the words themselves', '1,250', 'one thousand two hundred fifty'],
      ['UK style adds “and” after hundreds', '105', 'one hundred and five'],
      ['Decimals are read digit by digit', '3.14', 'three point one four'],
      ['Ordinals change the last word', '21', 'twenty-first'],
    ],
    alt: 'Table of spelling rules for writing numbers in words with examples',
    caption: 'US and UK styles differ only in the “and”; everything else is the same.',
    footer: 'Convert any number: talkandtool.com/tools/number-to-words-converter',
  },
  html: `
<p>To write a number in words, say it out loud and write what you hear: 1,234 becomes "one thousand two hundred thirty-four". Hyphenate numbers from 21 to 99 (forty-seven), add "and" after the hundreds in British English (one hundred and five), and read decimals digit by digit (3.14 is "three point one four"). On a cheque, write the whole amount in words and the cents as a fraction of 100, for example "One thousand two hundred thirty-four and 56/100 dollars". Here are the rules in detail.</p>

{{infographic}}

<h2>Numbers up to 99</h2>
<p>Zero to nineteen all have their own names: zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen. From 20, build the word from the tens (twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety) and the ones, joined with a hyphen: twenty-one, sixty-eight, ninety-nine. Note the spelling of forty (no "u") and fifty, and that "fourteen" has a "u" while "forty" does not.</p>

<h2>Hundreds, thousands and bigger</h2>
<p>Split the number into groups of three digits from the right. Write each group as a number below one thousand, then add the group name: thousand, million, billion, trillion. For 2,345,678 you write:</p>
<ul>
<li>2 → two million</li>
<li>345 → three hundred forty-five thousand</li>
<li>678 → six hundred seventy-eight</li>
</ul>
<p>Together: "two million three hundred forty-five thousand six hundred seventy-eight". Skip any group that is zero: 1,002,003 is "one million two thousand three". Do not make the group names plural when a number comes before them: "three hundred", not "three hundreds", and "two million", not "two millions".</p>

<h2>The "and" question: US versus UK</h2>
<p>British English puts "and" between the hundreds and the rest: "one hundred and five", "two thousand three hundred and twelve". American English normally leaves it out: "one hundred five". In American usage "and" is reserved for the decimal point or for cents on a cheque. Both are accepted, so be consistent with your reader. The <a href="/tools/number-to-words-converter">number to words converter</a> lets you switch between the two styles.</p>

<h2>Decimals and negatives</h2>
<p>Say the whole part, say "point", then read each digit on its own: 0.75 is "zero point seven five", not "zero point seventy-five". For negative numbers, start with "minus" (or "negative" in American English): −7 is "minus seven". When you need to express money precisely, use the cents fraction method below rather than "point".</p>

<h2>How to write the amount on a cheque</h2>
<p>A cheque has two places for the amount: the numeric box (the "courtesy amount") and the line for the amount in words (the "legal amount"). If they disagree, the words normally take precedence, so write both carefully.</p>
<ol>
<li>Write the whole amount in words starting at the far left of the line, with no gap before it.</li>
<li>Add "and" then the cents as a fraction over 100: "and 56/100". Use "and 00/100" or "only" for whole amounts.</li>
<li>Write the currency at the end: dollars, pounds or euros.</li>
<li>Draw a line through any unused space so that nothing can be added after the amount.</li>
</ol>
<p>Example: $1,234.56 is "One thousand two hundred thirty-four and 56/100 dollars". £250 is "Two hundred and fifty pounds only" in British usage.</p>

<h2>Ordinal numbers: first, second, twenty-first</h2>
<p>Ordinals show position. The first three are irregular (first, second, third), as are fifth (not "fiveth"), eighth, ninth and twelfth. Others add "th": fourth, sixth, seventh, tenth, hundredth. Numbers ending in "y" change it to "ieth": twentieth, thirtieth, ninetieth. For compound numbers, only the last word becomes an ordinal: twenty-first, one hundred and fifth, two thousand three hundred forty-second.</p>

<h2>When to use words and when to use digits</h2>
<p>Style guides differ, but a common rule is to spell out numbers from zero to nine and use digits for 10 and above, spelling out any number that starts a sentence. Use digits for measurements, percentages, money, dates and anything in a table. Legal documents, invoices and cheques often use both: "ten thousand (10,000)". If you are writing very large or very small numbers, see <a href="/blogs/article/how-to-write-numbers-in-scientific-notation">how to write numbers in scientific notation</a>, and for number systems such as Roman numerals or binary, the <a href="/tools/roman-numeral-converter">Roman numeral converter</a> and <a href="/blogs/article/how-to-convert-text-to-binary">converting text to binary</a> cover the rest. To find a percentage before writing it out, see <a href="/blogs/article/how-to-calculate-percentage-increase-decrease">how to calculate percentage increase and decrease</a>.</p>

<h2>Frequently asked questions</h2>
<h3>How do you write 100 in words?</h3>
<p>One hundred. The number 105 is "one hundred five" in American English and "one hundred and five" in British English.</p>
<h3>How do I write 1,000,000 in words?</h3>
<p>One million.</p>
<h3>Do you hyphenate numbers?</h3>
<p>Hyphenate compound numbers from twenty-one to ninety-nine. Do not hyphenate the hundreds, thousands or other group names.</p>
<h3>How do you write cents on a cheque?</h3>
<p>As a fraction over 100, after "and": "and 25/100". For a whole amount write "and 00/100" or "only".</p>
<h3>How many digits can the converter handle?</h3>
<p>The converter on this site handles numbers up to 27 digits, plus decimals and negatives.</p>
`,
};
