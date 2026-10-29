export default {
  slug: 'how-long-does-it-take-to-crack-a-password',
  title: 'How Long Does It Take to Crack a Password? A Length Chart',
  category: 'technology',
  theme: 'dev',
  tags: ['how long to crack a password', 'password length', 'password strength', 'brute force time', 'passphrase', 'password entropy'],
  description: 'Brute-force times for passwords by length and character set, how the maths works, and why a long passphrase beats a short complex password.',
  cover: {
    kicker: 'Length beats complexity',
    visual: {
      type: 'bars',
      title: 'Average time to brute-force',
      items: [
        { label: '8 chars, all types', value: 3.5, display: '3.5 days' },
        { label: '12 chars, lowercase', value: 55, display: '55 days' },
        { label: '12 chars, all types', value: 100, display: '754,000 years', highlight: true },
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Brute-force time by length and character set',
    subtitle: 'Average time at 10 billion guesses a second, offline, against a fast hash. Illustrative, not a guarantee.',
    columns: ['Length', 'Lowercase', 'Letters + digits', 'All 94 printable'],
    widths: [200, 280, 280, 296],
    rows: [
      ['8', '10 seconds', '3 hours', '3.5 days'],
      ['10', '2 hours', '1.3 years', '85 years'],
      ['12', '55 days', '5,112 years', '754,050 years'],
      ['16', '69,094 years', '76 billion years', '59 trillion years'],
    ],
    alt: 'Table of average brute-force time for passwords of 8, 10, 12 and 16 characters across three character sets',
    caption: 'Each added character multiplies the work by the size of the character set.',
    footer: 'Test a password: talkandtool.com/tools/password-strength-checker',
  },
  html: `
<p>How long a password lasts against a brute-force attack depends on two numbers: how many characters it has, and how fast the attacker can guess. Length matters most, because each extra character multiplies the number of possibilities. The table below gives average times for passwords of different lengths. They are illustrations of the maths, not promises, and the assumptions behind them matter, so they are explained below.</p>

<h2>The maths</h2>
<p>If a password is chosen at random from an alphabet of <em>c</em> characters and has <em>L</em> characters, there are <strong>c<sup>L</sup></strong> possible passwords. On average an attacker finds the right one after trying half of them:</p>
<p><strong>Average time = c<sup>L</sup> ÷ 2 ÷ guesses per second</strong></p>
<ul>
<li>Lowercase letters only: c = 26</li>
<li>Letters of both cases: c = 52</li>
<li>Letters and digits: c = 62</li>
<li>All printable ASCII (letters, digits, symbols): c = 94</li>
</ul>
<p>The table uses a rate of 10 billion guesses per second. That is a realistic order of magnitude for an offline attack on a stolen database that stored passwords with a fast, unsalted hash such as MD5 or SHA-1, using several modern graphics cards.</p>

{{infographic}}

<h2>Why the rate changes everything</h2>
<p>The guess rate depends on how the site stored your password, and this swings the times by a factor of millions.</p>
<ul>
<li><strong>Fast hashes (MD5, SHA-1, unsalted SHA-256):</strong> billions of guesses per second. These are the cases in the table.</li>
<li><strong>Slow, purpose-built hashes (bcrypt, scrypt, Argon2, PBKDF2 with a high count):</strong> designed to cost time and memory per guess, bringing rates down to thousands or fewer per second per device. The same 8-character password that falls in days against MD5 can last many years.</li>
<li><strong>Online attacks against a login page:</strong> limited by rate limiting, lockouts and CAPTCHAs to a handful of guesses per second at most. Brute force is rarely the way in.</li>
</ul>
<p>You cannot see how a site stores passwords, so the safe approach is to assume the worst case and choose a long password. That also covers a service that gets breached, which is the case where offline cracking actually occurs.</p>

<h2>What the table shows</h2>
<ul>
<li><strong>8 characters is weak even with symbols.</strong> 3.5 days against a fast hash is not safe for anything that matters.</li>
<li><strong>Length beats complexity.</strong> 12 lowercase letters (55 days) are far tougher than 8 characters of every type (3.5 days). Adding four characters multiplies the work by 26<sup>4</sup>, about 457,000, while enlarging the alphabet from 26 to 94 multiplies it by only a factor of about 3.6 per position.</li>
<li><strong>12 mixed characters is strong, 16 is overkill for brute force.</strong> Beyond about 12 random characters, guessing is not how accounts get compromised.</li>
</ul>

<h2>Random passphrases</h2>
<p>A passphrase made of random words is easy to remember and has substantial strength. Using a list of 7,776 words (as in the Diceware method), each word adds about 12.9 bits.</p>
<ul>
<li>4 random words: 7,776<sup>4</sup> ≈ 3.7 × 10<sup>15</sup>, about 52 bits. Average time at 10 billion guesses a second: roughly 2 days.</li>
<li>5 random words: about 65 bits, roughly 45 years.</li>
<li>6 random words: about 78 bits, roughly 350,000 years.</li>
</ul>
<p>For an important account, use at least five or six words, and let a tool pick them. The <a href="/tools/password-generator">password generator</a> creates random passwords, and a password manager stores them so you only memorise one.</p>

<h2>The caveat: humans are not random</h2>
<p>All of the times above assume the password was chosen at random. Real attackers do not try every combination in order. They try common passwords, leaked passwords, dictionary words, names, dates, keyboard patterns and predictable substitutions like "P@ssw0rd1!" first. A password that looks complex but follows a pattern can fall in seconds. This is why "Summer2026!" is poor despite having four character types, and why the <a href="/tools/password-strength-checker">password strength checker</a> looks for patterns and not just length. Nothing you type there leaves your browser.</p>

<h2>What to do</h2>
<ol>
<li>Use a password manager and let it generate a unique random password of 16 or more characters for every account.</li>
<li>For the few passwords you must remember, use a random passphrase of five or six words.</li>
<li>Turn on two-factor authentication for email, banking and anything that can reset other accounts. A stolen password is then not enough.</li>
<li>Never reuse a password. Reuse turns one breach into many.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Is a 12-character password enough?</h3>
<p>If it is random and unique, yes for almost everything. If it is a predictable phrase or reused, no. Randomness and uniqueness matter more than the exact length.</p>
<h3>Do symbols make a password much stronger?</h3>
<p>Only a little. A symbol enlarges the alphabet, but a few extra characters of length add much more. Symbols in predictable places (a "!" at the end) add almost nothing.</p>
<h3>Are the times in the table accurate?</h3>
<p>They are accurate maths for the stated assumptions, and attackers' hardware keeps improving, so treat them as orders of magnitude. The conclusion, that length dominates, does not change.</p>
<h3>How does a site store my password safely?</h3>
<p>It should store only a salted hash made with a slow algorithm such as Argon2 or bcrypt, never the password itself.</p>
`,
};
