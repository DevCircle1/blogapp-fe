const letters = ['H', 'e', 'l', 'o', ' ', 'W', 'r', 'd'].filter((c, i, a) => a.indexOf(c) === i);
const rows = letters.map((ch) => {
  const code = ch.charCodeAt(0);
  return [ch === ' ' ? 'space' : ch, String(code), code.toString(16).toUpperCase(), code.toString(2).padStart(8, '0')];
});

export default {
  slug: 'how-to-convert-text-to-binary',
  title: 'How to Convert Text to Binary (And Binary Back to Text)',
  category: 'programming',
  theme: 'dev',
  tags: ['text to binary', 'binary to text', 'ascii to binary', 'how to convert text to binary', 'binary translator', 'hello in binary'],
  description: 'Convert text to binary by finding each character’s ASCII code and writing it as an 8-bit number. Worked example for “Hello”, the reverse method, and how UTF-8 handles emoji.',
  cover: {
    kicker: 'Every character is a number; every number is bits',
    visual: { type: 'code', lines: [['H = 72 = 01001000', 'accent'], 'e = 101 = 01100101', 'l = 108 = 01101100', 'l = 108 = 01101100', 'o = 111 = 01101111'] },
  },
  infographic: {
    type: 'table',
    title: 'Characters, their codes and their binary',
    subtitle: 'ASCII values for the letters in “Hello World”. Binary is padded to 8 bits.',
    columns: ['Character', 'Decimal', 'Hex', 'Binary (8 bits)'],
    widths: [264, 264, 264, 264],
    rows,
    alt: 'Table listing characters from Hello World with their ASCII decimal, hexadecimal and 8-bit binary values',
    caption: 'Lowercase letters differ from uppercase by exactly 32, one bit in binary.',
    footer: 'Convert any text: talkandtool.com/tools/text-to-binary-converter',
  },
  html: `
<p>To convert text to binary, look up the numeric code of each character (its ASCII value), write that number in base 2, and pad it to 8 digits. The letter H is 72, which is 01001000. "Hello" therefore becomes 01001000 01100101 01101100 01101100 01101111. To go back, split the binary into groups of eight, convert each group to a number, and look up the character.</p>

<h2>Why text can be turned into binary at all</h2>
<p>Computers store everything as numbers, and numbers as bits that are on or off. Text works by agreeing a table that assigns a number to each character. The original table is ASCII, which gives 128 characters a code from 0 to 127: capital letters run from 65 to 90, lowercase from 97 to 122, and digits from 48 to 57. Modern systems use Unicode, and the UTF-8 encoding of Unicode is designed so that its first 128 values are identical to ASCII. That is why the same method works for English text on every modern device.</p>

<h2>Method: converting text to binary by hand</h2>
<ol>
<li><strong>Write down each character.</strong> Spaces and punctuation have codes too (space is 32).</li>
<li><strong>Find its decimal code</strong> from an ASCII table, or from the chart below.</li>
<li><strong>Convert to binary</strong> by repeatedly dividing by two and keeping the remainders, or by subtracting the largest powers of two: 128, 64, 32, 16, 8, 4, 2, 1.</li>
<li><strong>Pad to 8 digits</strong> with leading zeros so every character occupies one byte.</li>
</ol>
<p><strong>Worked example: the letter H (72).</strong> 72 − 64 = 8, and 8 is itself a power of two. So the 64 and 8 positions are 1, and the rest 0: 0 1 0 0 1 0 0 0 = <strong>01001000</strong>.</p>

{{infographic}}

<h2>The reverse: binary to text</h2>
<ol>
<li>Split the stream into groups of 8 bits.</li>
<li>Convert each group to decimal by adding the place values where there is a 1 (128, 64, 32, 16, 8, 4, 2, 1).</li>
<li>Look up the character for that number.</li>
</ol>
<p>Take 01001000: 64 + 8 = 72 = H. Take 01101001: 64 + 32 + 8 + 1 = 105 = i. So 01001000 01101001 reads "Hi". If a stream has no spaces and its length is not a multiple of eight, the data is damaged or a bit is missing at the start.</p>

<h2>Handy patterns</h2>
<ul>
<li><strong>Uppercase and lowercase differ by one bit.</strong> A is 01000001 and a is 01100001; adding 32 (the third bit from the left) switches case.</li>
<li><strong>Digits start at 48.</strong> The digit 7 is 55, which is 00110111. The binary of the digit character is not the same as the binary of the number 7.</li>
<li><strong>Every ASCII character starts with 0.</strong> The leading bit is unused in ASCII, which is why binary text of plain English always has a 0 first.</li>
</ul>

<h2>What about accents, symbols and emoji?</h2>
<p>Characters outside ASCII need more than one byte in UTF-8. The letter é becomes two bytes (11000011 10101001), the euro sign € is three bytes, and most emoji take four. The first byte tells a decoder how many follow: a leading 110 means two bytes, 1110 means three and 11110 means four. A converter that always writes 8 bits per character will therefore mangle these, which is a common source of "binary translator" output that does not decode back.</p>

<h2>Other bases: hex, decimal and octal</h2>
<p>Programmers rarely write binary by hand because it is long. Hexadecimal packs four bits into one digit, so a byte is two hex digits: H is 48. Decimal and octal are also used in older systems and file permissions. For converting plain numbers between bases rather than text, use the <a href="/tools/number-base-converter">number base converter</a>. If you meet text that looks encoded but is neither, it may be Base64, which you can decode with the <a href="/tools/base64-tool">Base64 tool</a>, or a hash, which is one-way and cannot be reversed.</p>
<p>The <a href="/tools/text-to-binary-converter">text to binary converter</a> does all four bases in both directions, with UTF-8 support, and nothing is uploaded. Another character-based code worth knowing is Morse; see the <a href="/blogs/article/morse-code-alphabet-chart">Morse code alphabet chart</a>, or try the <a href="/tools/morse-code-translator">Morse code translator</a>. For background on how encoding changes data size, read <a href="/blogs/article/ascii-vs-utf-8-explained">ASCII vs UTF-8 explained</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is "Hello" in binary?</h3>
<p>01001000 01100101 01101100 01101100 01101111.</p>
<h3>Why is each character 8 bits?</h3>
<p>Eight bits make a byte, which can hold 256 values. That is enough for ASCII and the standard unit of computer memory, so text is written in whole bytes.</p>
<h3>How do I write a space in binary?</h3>
<p>A space is ASCII 32, which is 00100000.</p>
<h3>Is binary code the same as machine code?</h3>
<p>No. Text in binary is data using a character encoding. Machine code is a set of binary instructions that a processor executes. Both are ones and zeros, but they mean different things.</p>
`,
};
