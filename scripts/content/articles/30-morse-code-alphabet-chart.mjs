import { MORSE } from '../../../src/lib/extra/engines.js';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const cell = (l) => (l ? l + '   ' + MORSE[l] : '');
const letterRows = Array.from({ length: 9 }, (_, i) => [cell(letters[i]), cell(letters[i + 9]), cell(letters[i + 18])]);

const digitRows = [
  ['0   -----', '1   .----', '2   ..---', '3   ...--', '4   ....-'],
  ['5   .....', '6   -....', '7   --...', '8   ---..', '9   ----.'],
];
const html = (list) => `<ul>${list.map((x) => `<li>${x}</li>`).join('')}</ul>`;

export default {
  slug: 'morse-code-alphabet-chart',
  title: 'Morse Code Alphabet Chart: Letters, Numbers and Punctuation',
  category: 'technology',
  theme: 'dev',
  tags: ['morse code alphabet', 'morse code chart', 'morse code letters', 'morse code numbers', 'sos morse code', 'morse code translator'],
  description: 'The complete International Morse code chart: every letter A–Z, the digits 0–9 and common punctuation, plus the timing rules for dots, dashes and spaces.',
  cover: {
    kicker: 'A–Z, 0–9 and punctuation',
    visual: { type: 'code', lines: [['S  ...', 'accent'], 'O  ---', ['S  ...', 'accent'], '', '... --- ...'] },
  },
  infographic: {
    type: 'table',
    title: 'International Morse code: the letters A to Z',
    subtitle: 'A dot is one short signal, a dash is three times longer.',
    columns: ['A – I', 'J – R', 'S – Z'],
    widths: [352, 352, 352],
    rows: letterRows,
    alt: 'Chart of the International Morse code for each letter of the alphabet from A to Z',
    caption: 'Memorise the shortest codes first: E is a single dot and T a single dash.',
    footer: 'Translate any text: talkandtool.com/tools/morse-code-translator',
  },
  html: `
<p>International Morse code represents each letter, digit and punctuation mark as a sequence of short signals (dots) and long signals (dashes). A is dot-dash (.-), B is dash-dot-dot-dot (-...), and the distress signal SOS is three dots, three dashes, three dots (... --- ...). The full chart is below, together with the timing rules that separate letters and words.</p>

<h2>The letters A to Z</h2>
<p>Write a letter as its dots and dashes, leave a space between letters, and use a slash (or a longer pause when sending) between words.</p>

{{infographic}}

<h2>The digits 0 to 9</h2>
<p>Numbers follow a tidy pattern. Every digit uses exactly five signals:</p>
${html(digitRows.flat())}
<p>In 1 to 5 the dots take over from the dashes one at a time (.----, ..---, ...--, ....-, .....), and 6 to 0 do the reverse (-...., --..., ---.., ----., -----). The pattern makes digits quick to learn.</p>

<h2>Common punctuation</h2>
<ul>
<li>Full stop (.) = .-.-.-</li>
<li>Comma (,) = --..--</li>
<li>Question mark (?) = ..--..</li>
<li>Apostrophe (') = .----.</li>
<li>Exclamation mark (!) = -.-.--</li>
<li>Slash (/) = -..-.</li>
<li>Parentheses ( ) = -.--. and -.--.-</li>
<li>Colon (:) = ---...</li>
<li>Equals (=) = -...-</li>
<li>Plus (+) = .-.-.</li>
<li>Hyphen (-) = -....-</li>
<li>At sign (@) = .--.-.</li>
</ul>

<h2>Timing: how the spaces work</h2>
<p>Morse is defined by durations, with one "unit" as the basic length:</p>
<ul>
<li>A dot lasts 1 unit.</li>
<li>A dash lasts 3 units.</li>
<li>The gap between dots and dashes within a letter is 1 unit.</li>
<li>The gap between letters is 3 units.</li>
<li>The gap between words is 7 units.</li>
</ul>
<p>Speed is measured in words per minute using the word PARIS as the standard (it is exactly 50 units long). At 15 words per minute, a unit is 80 milliseconds. That is the speed the <a href="/tools/morse-code-translator">Morse code translator</a> uses when you press play.</p>

<h2>Why the letters look the way they do</h2>
<p>Morse assigned the shortest codes to the most frequent letters in English. E (.) and T (-) are single signals; I (..), A (.-), N (-.) and M (--) are two. Rare letters such as Q (--.-), Z (--..) and J (.---) are longer. This makes typical English messages much shorter than if every letter had the same length. It is the same idea behind variable-length character encodings like UTF-8, which we compare in <a href="/blogs/article/ascii-vs-utf-8-explained">ASCII vs UTF-8 explained</a>, and behind the way data is compressed.</p>

<h2>A short history</h2>
<p>Samuel Morse and Alfred Vail developed the original code for the electric telegraph in the 1830s and 1840s. The version used today, International Morse code, was standardised in 1865 and revised over the following decades, and it replaced the older American Morse that used different timing and some different letters. For more than a century it was the backbone of long-distance communication by wire and radio, especially for ships.</p>

<h2>Prosigns and SOS</h2>
<p>Prosigns are procedural signals sent as a single run of characters without the usual letter gaps. SOS is the best known: it is sent as ...---... and is not an abbreviation of anything; it was chosen because it is easy to recognise and send. Other prosigns include AR (end of message, .-.-.) and SK (end of contact, ...-.-).</p>

<h2>How to use the chart to decode</h2>
<ol>
<li>Split the message into words wherever you see a slash or a long gap.</li>
<li>Split each word into letters at the spaces.</li>
<li>Look each group up in the chart, starting from the number of signals: one-signal groups are E or T, two-signal groups are I, A, N or M, and so on.</li>
</ol>
<p>The quickest way to practise is to translate your own name, then something longer, and check yourself with the <a href="/tools/morse-code-translator">translator</a>. If you want a learning plan, our guide to <a href="/blogs/article/how-to-learn-morse-code">how to learn Morse code</a> lays one out. And for another way of encoding text as dots and bits, see <a href="/blogs/article/how-to-convert-text-to-binary">how to convert text to binary</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is SOS in Morse code?</h3>
<p>... --- ... (three dots, three dashes, three dots), sent as one unbroken group.</p>
<h3>How do you write a space in Morse code?</h3>
<p>Leave one space between letters and a slash (/) between words in written form. When sent aloud, the pause is three units between letters and seven between words.</p>
<h3>Does Morse code have lowercase letters?</h3>
<p>No. Morse is case-insensitive; the same code stands for A and a.</p>
<h3>Is Morse code still used?</h3>
<p>Yes. Amateur radio operators, aviation navigation beacons and some assistive technologies still use it, because a simple tone or flash can carry a message under poor conditions.</p>
`,
};
