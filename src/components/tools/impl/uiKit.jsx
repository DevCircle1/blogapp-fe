import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cx } from './toolFormat.js';

export const TextArea = ({ className = '', ...props }) => (
  <textarea
    spellCheck="false"
    {...props}
    className={cx('min-h-56 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-indigo-400', className)}
  />
);

export const Field = ({ className = '', ...props }) => (
  <input
    {...props}
    className={cx('w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400', className)}
  />
);

export const Select = ({ className = '', children, ...props }) => (
  <select
    {...props}
    className={cx('w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400', className)}
  >
    {children}
  </select>
);

export const Label = ({ children, htmlFor, hint }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300">
    {children}
    {hint && <span className="ml-2 text-xs font-normal text-slate-500">{hint}</span>}
  </label>
);

export const LabelledField = ({ label, hint, id, ...props }) => (
  <div>
    <Label htmlFor={id} hint={hint}>{label}</Label>
    <Field id={id} {...props} className="mt-2" />
  </div>
);

export const LabelledSelect = ({ label, id, children, ...props }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Select id={id} {...props} className="mt-2">{children}</Select>
  </div>
);

export const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button
    type="button"
    {...props}
    className={cx(
      'rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
      variant === 'primary' && 'bg-indigo-500 text-white hover:bg-indigo-400',
      variant === 'ghost' && 'bg-white/10 text-slate-100 hover:bg-white/20',
      className,
    )}
  />
);

export const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-slate-200">
    <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-indigo-500" />
    {label}
  </label>
);

export const Segmented = ({ options, value, onChange, ariaLabel }) => (
  <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
    {options.map((option) => {
      const key = typeof option === 'string' ? option : option.value;
      const text = typeof option === 'string' ? option : option.label;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            value === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white',
          )}
        >
          {text}
        </button>
      );
    })}
  </div>
);

export const CopyButton = ({ value, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Button onClick={copy} disabled={!value} className="inline-flex items-center gap-2">
      {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : label}
    </Button>
  );
};

export const Stat = ({ label, value, accent = 'indigo', hint }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
    <strong className={cx('block break-words text-2xl font-black', accent === 'emerald' ? 'text-emerald-300' : accent === 'cyan' ? 'text-cyan-300' : 'text-indigo-300')}>{value}</strong>
    <span className="mt-1 block text-xs uppercase tracking-wider text-slate-500">{label}</span>
    {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
  </div>
);

export const StatGrid = ({ children, columns = 'md:grid-cols-3' }) => (
  <div className={cx('mt-6 grid grid-cols-2 gap-3', columns)}>{children}</div>
);

export const Result = ({ label, value, accent = 'emerald', note }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
    <span className="text-sm text-slate-400">{label}</span>
    <strong className={cx('mt-2 block break-words text-3xl font-black', accent === 'emerald' ? 'text-emerald-300' : accent === 'cyan' ? 'text-cyan-300' : 'text-indigo-300')}>{value}</strong>
    {note && <p className="mt-2 text-sm text-slate-500">{note}</p>}
  </div>
);

export const Panel = ({ title, children }) => (
  <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
    {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
    <div className={title ? 'mt-4' : ''}>{children}</div>
  </section>
);

export const ErrorNote = ({ children }) => (
  children ? <p role="alert" className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{children}</p> : null
);

export const Grid = ({ children, className = 'md:grid-cols-2' }) => (
  <div className={cx('grid gap-4', className)}>{children}</div>
);
