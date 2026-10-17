export default {
  slug: 'ascii-vs-utf-8-explained',
  title: 'ASCII vs UTF-8 vs Unicode: What’s the Difference?',
  category: 'programming',
  theme: 'dev',
  tags: ['ascii vs utf-8', 'unicode vs utf-8', 'what is utf-8', 'character encoding', 'ascii table', 'utf-8 bytes'],
  description: 'ASCII is a 128-character table, Unicode is a catalogue of over 150,000 characters, and UTF-8 is how Unicode is stored in bytes. See how many bytes each character takes.',
  cover: {
    kicker: 'A table, a catalogue and an encoding',
    visual: {
      type: 'bars',
      title: 'Bytes per character in UTF-8',
      items: [
        { label: 'A', value: 1, display: '1' },
        { label: 'é', value: 2, display: '2', highlight: true },
        { label: '€', value: 3, display: '3' },
        { label: '😀', value: 4, display: '4' },
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'How UTF-8 stores a character',
    subtitle: 'The first bits of the first byte say how many bytes the character uses.',
    columns: ['Code point range', 'Bytes', 'Byte pattern', 'Example'],
    widths: [290, 120, 340, 306],
    rows: [
      ['U+0000 – U+007F', '1', '0xxxxxxx', 'A  (01000001)'],
      ['U+0080 – U+07FF', '2', '110xxxxx 10xxxxxx', 'é  (11000011 10101001)'],
      ['U+0800 – U+FFFF', '3', '1110xxxx 10xxxxxx 10xxxxxx', '€  (E2 82 AC)'],
      ['U+10000 – U+10FFFF', '4', '11110xxx 10xxxxxx ×3', '😀  (F0 9F 98 80)'],
    ],
    alt: 'Table showing UTF-8 byte patterns for one, two, three and four byte characters with examples',
    caption: 'Continuation bytes always start with 10, so a decoder can find the start of any character.',
    footer: 'See the bytes yourself: talkandtool.com/tools/text-to-binary-converter',
  },
  html: `
<p>ASCII is a small table that gives 128 characters a number. Unicode is a much larger catalogue that gives every character in every writing system its own number, called a code point. UTF-8 is a way of storing those Unicode numbers as bytes, using one byte for ASCII characters and up to four for everything else. They are not rival standards: UTF-8 is an encoding of Unicode that happens to match ASCII for the first 128 characters.</p>

<h2>ASCII: the original 128</h2>
<p>ASCII, from 1963, assigns the numbers 0 to 127 to English letters, digits, punctuation and some control codes. A is 65, a is 97, 0 is 48, and the space is 32. Because 128 values fit in seven bits, ASCII text needs only 7 bits per character, though it is almost always stored in an 8-bit byte with the top bit set to 0.</p>
<p>The weakness is obvious: there is no room for é, ü, ñ, Ω, Arabic, Chinese, or emoji. In the 1980s and 90s, different systems filled the unused upper half with different characters ("code pages"). A file written on one computer could display as nonsense on another. That mess is what Unicode set out to end.</p>

<h2>Unicode: one number per character</h2>
<p>Unicode defines a code point for each character, written as U+ followed by hex digits. Capital A is U+0041, the euro sign is U+20AC and the grinning-face emoji is U+1F600. There are over 150,000 assigned characters across more than 150 scripts, with room for over a million code points (up to U+10FFFF).</p>
<p>Unicode itself says nothing about how those numbers are stored. That is the job of an encoding.</p>

<h2>UTF-8: the encoding that won</h2>
<p>UTF-8 stores each code point in one to four bytes. It is variable length: common characters take little space and rare ones take more. The patterns are in the table above. Three properties explain its dominance:</p>
<ul>
<li><strong>Backward compatible with ASCII.</strong> Any ASCII file is already a valid UTF-8 file, with identical bytes.</li>
<li><strong>Self-synchronising.</strong> Continuation bytes begin with 10, so if a stream is cut you can find the next character start without reading from the beginning.</li>
<li><strong>No byte-order problem.</strong> Unlike UTF-16 and UTF-32, UTF-8 reads the same on every machine, so it needs no byte-order mark.</li>
</ul>
<p>More than 98% of web pages are served as UTF-8, and it is the default for HTML5, JSON, and most programming languages and operating systems today.</p>

{{infographic}}

<h2>Worked example: encoding the euro sign</h2>
<p>The euro sign is U+20AC. In binary that is 0010 0000 1010 1100, which falls in the three-byte range. Fit those 16 bits into the pattern 1110xxxx 10xxxxxx 10xxxxxx:</p>
<ul>
<li>First 4 bits 0010 go into the first byte: 1110<strong>0010</strong> = E2</li>
<li>Next 6 bits 000010 go into the second: 10<strong>000010</strong> = 82</li>
<li>Last 6 bits 101100 go into the third: 10<strong>101100</strong> = AC</li>
</ul>
<p>The result is the bytes E2 82 AC. You can check any character this way with the <a href="/tools/text-to-binary-converter">text to binary converter</a>, which shows the real UTF-8 bytes in binary, hex, decimal or octal.</p>

<h2>UTF-16, UTF-32 and why they exist</h2>
<p>UTF-16 uses two bytes for most characters and four for the rest; Windows internals, Java strings and JavaScript strings use it. UTF-32 uses four bytes for every character, which makes indexing simple but wastes space. Neither is common for files on disk or on the web. When you read about "string length" in JavaScript giving 2 for an emoji, this is why: JavaScript counts UTF-16 code units, and an emoji outside the basic range takes two of them.</p>

<h2>Common problems and how to spot them</h2>
<ul>
<li><strong>Mojibake</strong> such as "é" instead of é. UTF-8 bytes were read as a single-byte encoding like Windows-1252. The fix is to declare or read the file as UTF-8.</li>
<li><strong>Question marks or black diamonds.</strong> The text was converted to an encoding that cannot represent the characters, and they were replaced.</li>
<li><strong>A stray "BOM" at the start.</strong> A byte-order mark (EF BB BF) in a UTF-8 file confuses some parsers. Save without it.</li>
<li><strong>Length mismatches.</strong> A database column limited to 255 bytes may hold fewer than 255 characters when accents or emoji are involved.</li>
<li><strong>Broken URLs.</strong> Non-ASCII characters in a URL must be percent-encoded as their UTF-8 bytes; the <a href="/tools/url-encoder">URL encoder</a> does this, and the <a href="/tools/html-encoder">HTML entity encoder</a> handles characters in HTML.</li>
</ul>
<p>Always declare UTF-8 in HTML with <code>&lt;meta charset="utf-8"&gt;</code> and in HTTP headers, and use it as the default everywhere new.</p>

<h2>How this relates to other encodings</h2>
<p>UTF-8 is a text encoding; Base64 is a way to represent arbitrary bytes using 64 safe characters, covered by the <a href="/tools/base64-tool">Base64 tool</a>. For a hands-on introduction to turning characters into bits, see <a href="/blogs/article/how-to-convert-text-to-binary">how to convert text to binary</a>. Token counts for language models also depend on how text is broken into bytes and pieces; our guide to <a href="/blogs/article/how-to-count-tokens-llm">counting tokens for an LLM</a> explains that side.</p>

<h2>Frequently asked questions</h2>
<h3>Is UTF-8 the same as Unicode?</h3>
<p>No. Unicode is the character set (the numbering). UTF-8 is one way to store it in bytes. Others include UTF-16 and UTF-32.</p>
<h3>Is ASCII still used?</h3>
<p>Yes, as a subset. Every ASCII character keeps the same code in UTF-8, so protocols, programming languages and file formats built on ASCII still work.</p>
<h3>How many bytes is an emoji in UTF-8?</h3>
<p>Most are four bytes. Some emoji are sequences of several code points joined together, such as flags or family emoji, and can take 8 to 25 bytes.</p>
<h3>Why does UTF-8 use a variable length?</h3>
<p>It keeps English text compact while still covering every writing system. A fixed 4-byte encoding would make plain English files four times bigger.</p>
`,
};
