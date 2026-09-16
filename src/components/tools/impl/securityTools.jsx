import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Button, CopyButton, Field, Grid, Label, Panel, Result, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { num } from './toolFormat.js';
import { msg, useT } from '../../../i18n/i18n.js';

const POOLS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*_-+=?',
};
const POOL_LABELS = { uppercase: msg('Uppercase'), lowercase: msg('Lowercase'), numbers: msg('Numbers'), symbols: msg('Symbols') };
const LOOKALIKES = /[Il1O0]/g;

const strengthLabel = (entropy) => (
  entropy >= 100 ? msg('Excellent') : entropy >= 75 ? msg('Strong') : entropy >= 55 ? msg('Moderate') : entropy >= 35 ? msg('Weak') : msg('Very weak')
);

/** Rejection sampling keeps every character equally likely — a plain modulo does not. */
const randomIndex = (limit) => {
  const max = Math.floor(0xffffffff / limit) * limit;
  const buffer = new Uint32Array(1);
  let value;
  do { crypto.getRandomValues(buffer); [value] = buffer; } while (value >= max);
  return value % limit;
};

export function PasswordGenerator() {
  const t = useT();
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [avoidLookalikes, setAvoidLookalikes] = useState(false);
  const [password, setPassword] = useState('');

  const enabled = Object.keys(options).filter((key) => options[key]);
  const pools = enabled.map((key) => (avoidLookalikes ? POOLS[key].replace(LOOKALIKES, '') : POOLS[key])).filter(Boolean);
  const alphabet = pools.join('');
  const entropy = alphabet.length ? length * Math.log2(alphabet.length) : 0;

  const generate = () => {
    if (!alphabet) return;
    const characters = pools.map((pool) => pool[randomIndex(pool.length)]);
    while (characters.length < length) characters.push(alphabet[randomIndex(alphabet.length)]);
    for (let i = characters.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    setPassword(characters.slice(0, length).join(''));
  };

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <p className="min-h-8 break-all font-mono text-xl text-emerald-300">{password || t('Press generate to create a password')}</p>
      </div>
      <label htmlFor="pw-length" className="mt-6 block text-sm text-slate-300">{t('Length: {value} characters', { value: <strong className="text-white">{length}</strong> })}</label>
      <input id="pw-length" type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-2 w-full accent-indigo-500" />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.keys(POOLS).map((key) => (
          <Toggle key={key} checked={options[key]} onChange={() => setOptions({ ...options, [key]: !options[key] })} label={t(POOL_LABELS[key])} />
        ))}
      </div>
      <div className="mt-3">
        <Toggle checked={avoidLookalikes} onChange={() => setAvoidLookalikes(!avoidLookalikes)} label={t('Exclude lookalike characters (I l 1 O 0)')} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={generate} disabled={!alphabet} className="inline-flex items-center gap-2"><RefreshCw size={16} /> {t('Generate')}</Button>
        <CopyButton value={password} />
      </div>
      <StatGrid columns="md:grid-cols-3">
        <Stat label={t('Character pool')} value={alphabet.length || 0} />
        <Stat label={t('Entropy')} value={t('{n} bits', { n: num(entropy, 0) })} accent={entropy >= 75 ? 'emerald' : 'indigo'} />
        <Stat label={t('Strength')} value={t(entropy >= 55 ? strengthLabel(entropy) : msg('Weak'))} accent="cyan" />
      </StatGrid>
      {!alphabet && <p className="mt-3 text-sm text-rose-300">{t('Select at least one character set.')}</p>}
    </>
  );
}

// Includes the passwords and keyboard layouts people in each market reach for:
// AZERTY in France, QWERTZ in German-speaking countries.
const COMMON = [
  'password', 'qwerty', '123456', 'letmein', 'welcome', 'admin', 'iloveyou', 'monkey', 'dragon', 'football', 'abc123', 'login', 'passw0rd',
  'passwort', 'hallo', 'schatz', 'contrasena', 'contraseña', 'senha', 'motdepasse', 'bonjour', 'soleil', 'azerty', 'qwertz', 'amor', 'futbol', 'brasil',
];
const SEQUENCES = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'azertyuiop', 'qsdfghjklm', 'wxcvbn', 'qwertzuiop', 'yxcvbnm', 'abcdefghijklmnopqrstuvwxyz', '01234567890'];

const crackTime = (seconds) => {
  if (seconds < 1) return [msg('instantly')];
  if (seconds < 60) return [msg('{n} seconds'), Math.round(seconds)];
  if (seconds < 3600) return [msg('{n} minutes'), Math.round(seconds / 60)];
  if (seconds < 86400) return [msg('{n} hours'), Math.round(seconds / 3600)];
  if (seconds < 31536000) return [msg('{n} days'), Math.round(seconds / 86400)];
  const years = seconds / 31536000;
  if (years > 1e9) return [msg('longer than the age of the universe')];
  if (years > 1e6) return [msg('{n} million years'), years / 1e6];
  return [msg('{n} years'), years];
};

export function PasswordStrengthChecker() {
  const t = useT();
  const [password, setPassword] = useState('');

  const analysis = useMemo(() => {
    if (!password) return null;
    const lower = password.toLowerCase();
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/\d/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const warnings = [];
    const leetNormalised = lower.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/@/g, 'a').replace(/\$/g, 's');
    if (COMMON.some((word) => leetNormalised.includes(word))) warnings.push(msg('Contains a very common password word — dictionary attacks try these first, including character substitutions.'));
    if (SEQUENCES.some((run) => Array.from({ length: Math.max(0, run.length - 3) }, (_, i) => run.slice(i, i + 4)).some((chunk) => lower.includes(chunk)))) warnings.push(msg('Contains a keyboard run or alphabet sequence, which cracking rules expand automatically.'));
    if (/(.)\1{2,}/.test(password)) warnings.push(msg('Contains a character repeated three or more times in a row.'));
    if (/^\d+$/.test(password)) warnings.push(msg('Digits only. The search space is tiny compared with a mixed alphabet.'));
    if (/(19|20)\d{2}/.test(password)) warnings.push(msg('Contains what looks like a year — birth years and anniversaries are guessed early.'));
    if (password.length < 12) warnings.push(msg('Shorter than 12 characters. Length contributes more to strength than any other single factor.'));

    const rawEntropy = password.length * Math.log2(pool || 1);
    const entropy = Math.max(0, rawEntropy - warnings.length * 8);
    const guesses = 2 ** entropy / 2;

    return {
      entropy,
      pool,
      warnings,
      crack: crackTime(guesses / 1e10),
      label: strengthLabel(entropy),
      score: Math.min(100, Math.round((entropy / 110) * 100)),
    };
  }, [password]);

  return (
    <>
      <Label htmlFor="pwstr">{t('Password to test')}</Label>
      <Field id="pwstr" className="mt-2" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('Type a password — nothing is sent anywhere')} autoComplete="off" />
      {analysis && (
        <>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${analysis.entropy >= 75 ? 'bg-emerald-400' : analysis.entropy >= 55 ? 'bg-amber-400' : 'bg-rose-400'}`}
              style={{ width: `${Math.max(4, analysis.score)}%` }}
            />
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Rating')} value={t(analysis.label)} accent={analysis.entropy >= 75 ? 'emerald' : 'indigo'} />
            <Stat label={t('Entropy')} value={t('{n} bits', { n: num(analysis.entropy, 0) })} />
            <Stat label={t('Character pool')} value={analysis.pool} accent="cyan" />
            <Stat label={t('Length')} value={password.length} accent="cyan" />
          </StatGrid>
          <Panel title={t('Estimated offline cracking time')}>
            <p className="text-2xl font-black text-emerald-300">{t(analysis.crack[0], { n: num(analysis.crack[1], 0) })}</p>
            <p className="mt-2 text-sm text-slate-500">{t('Assuming a fast offline attack at roughly 10 billion guesses per second. A site using bcrypt or Argon2 would take dramatically longer.')}</p>
          </Panel>
          {analysis.warnings.length > 0 && (
            <div className="mt-5 space-y-2">
              {analysis.warnings.map((warning) => (
                <p key={warning} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{t(warning)}</p>
              ))}
            </div>
          )}
        </>
      )}
      <p className="mt-6 text-sm text-slate-500">{t('Analysis runs entirely in your browser and nothing is transmitted or stored. As a habit, test a password similar to yours rather than the exact one.')}</p>
    </>
  );
}

const luhnValid = (digits) => {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) { value *= 2; if (value > 9) value -= 9; }
    sum += value;
    double = !double;
  }
  return digits.length > 0 && sum % 10 === 0;
};

const cardNetwork = (digits) => {
  if (/^4/.test(digits)) return { name: 'Visa', lengths: [13, 16, 19] };
  if (/^(5[1-5]|2[2-7])/.test(digits)) return { name: 'Mastercard', lengths: [16] };
  if (/^3[47]/.test(digits)) return { name: 'American Express', lengths: [15] };
  if (/^(6011|65|64[4-9])/.test(digits)) return { name: 'Discover', lengths: [16, 19] };
  if (/^3(0[0-5]|[68])/.test(digits)) return { name: 'Diners Club', lengths: [14, 16] };
  if (/^35/.test(digits)) return { name: 'JCB', lengths: [16] };
  if (/^(50|5[6-9]|6)/.test(digits)) return { name: 'Maestro', lengths: [12, 13, 14, 15, 16, 17, 18, 19] };
  return { name: msg('Unknown'), lengths: [] };
};

const TEST_CARDS = [
  ['Visa', '4242 4242 4242 4242'], ['Mastercard', '5555 5555 5555 4444'],
  ['American Express', '3782 822463 10005'], ['Discover', '6011 1111 1111 1117'],
];

export function CreditCardValidator() {
  const t = useT();
  const [input, setInput] = useState('');
  const digits = input.replace(/\D/g, '');
  const network = cardNetwork(digits);
  const valid = luhnValid(digits);
  const lengthOk = !network.lengths.length || network.lengths.includes(digits.length);

  return (
    <>
      <Label htmlFor="cc-input">{t('Card number')}</Label>
      <Field id="cc-input" className="mt-2 font-mono" value={input} onChange={(e) => setInput(e.target.value)} placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" />
      {digits.length > 0 && (
        <StatGrid columns="md:grid-cols-4">
          <Stat label={t('Luhn checksum')} value={valid ? t('Passes') : t('Fails')} accent={valid ? 'emerald' : 'indigo'} />
          <Stat label={t('Detected network')} value={t(network.name)} accent="cyan" />
          <Stat label={t('Digits entered')} value={digits.length} />
          <Stat label={t('Expected length')} value={network.lengths.length ? network.lengths.join(` ${t('or')} `) : '—'} accent={lengthOk ? 'emerald' : 'indigo'} />
        </StatGrid>
      )}
      <Panel title={t('Test card numbers for development')}>
        <div className="space-y-2">
          {TEST_CARDS.map(([name, number]) => (
            <div key={number} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <span className="text-sm text-slate-400">{name}</span>
              <span className="font-mono text-sm text-emerald-300">{number}</span>
              <Button variant="ghost" onClick={() => setInput(number)}>{t('Use')}</Button>
            </div>
          ))}
        </div>
      </Panel>
      <p className="mt-5 text-sm text-slate-500">{t('A passing checksum only means the digits are internally consistent. Whether the account exists or has funds can only be confirmed by the issuing bank.')}</p>
    </>
  );
}

// Big regional providers are listed too, so "gmx.dee" or "uol.com.bt" get a
// suggestion — and so a real gmx.de address is never "corrected" to gmail.com.
const COMMON_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me', 'live.com', 'msn.com',
  'gmx.de', 'web.de', 't-online.de', 'orange.fr', 'free.fr', 'laposte.net', 'hotmail.fr', 'yahoo.fr',
  'hotmail.es', 'yahoo.es', 'uol.com.br', 'bol.com.br', 'yahoo.com.br',
];

const editDistance = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return matrix[a.length][b.length];
};

export function EmailValidator() {
  const t = useT();
  const [input, setInput] = useState('');

  const results = useMemo(() => {
    const entries = input.split(/[\n,;]+/).map((entry) => entry.trim()).filter(Boolean);
    const pattern = /^[^\s@"]+(\.[^\s@"]+)*@[^\s@.]+(\.[^\s@.]+)+$/u;
    return entries.map((email) => {
      const valid = pattern.test(email) && email.length <= 254 && !email.includes('..');
      const domain = email.split('@')[1]?.toLowerCase() || '';
      const suggestion = domain && !COMMON_DOMAINS.includes(domain)
        ? COMMON_DOMAINS.find((candidate) => editDistance(domain, candidate) <= 2)
        : undefined;
      return { email, valid, suggestion };
    });
  }, [input]);

  const valid = results.filter((item) => item.valid);
  const invalid = results.filter((item) => !item.valid);
  const typos = results.filter((item) => item.valid && item.suggestion);

  return (
    <>
      <Label htmlFor="email-input" hint={t('one per line, or comma separated')}>{t('Email addresses')}</Label>
      <TextArea id="email-input" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder={'ada@example.com\ngrace@gmial.com\nnot-an-email'} />
      {results.length > 0 && (
        <>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Total')} value={results.length} />
            <Stat label={t('Valid syntax')} value={valid.length} accent="emerald" />
            <Stat label={t('Invalid')} value={invalid.length} />
            <Stat label={t('Likely typos')} value={typos.length} accent="cyan" />
          </StatGrid>
          {typos.length > 0 && (
            <Panel title={t('Possible domain typos')}>
              <ul className="space-y-2 text-sm">
                {typos.map((item) => (
                  <li key={item.email} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-200">
                    <span className="font-mono">{item.email}</span> {t('— did you mean {domain}?', { domain: <strong>@{item.suggestion}</strong> })}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <Grid className="mt-5 lg:grid-cols-2">
            <div>
              <Label>{t('Valid addresses')}</Label>
              <TextArea className="mt-2 min-h-40" readOnly value={valid.map((item) => item.email).join('\n')} />
              <div className="mt-3"><CopyButton value={valid.map((item) => item.email).join('\n')} label={t('Copy valid list')} /></div>
            </div>
            <div>
              <Label>{t('Invalid addresses')}</Label>
              <TextArea className="mt-2 min-h-40" readOnly value={invalid.map((item) => item.email).join('\n')} />
            </div>
          </Grid>
        </>
      )}
      <p className="mt-5 text-sm text-slate-500">{t('Syntax validation cannot confirm that a mailbox exists — only that the address is well formed. It does remove the entries that could never receive mail.')}</p>
    </>
  );
}
