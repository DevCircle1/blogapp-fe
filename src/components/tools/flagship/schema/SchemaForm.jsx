import { Plus, Trash2 } from 'lucide-react';
import { cx } from '../../impl/toolFormat.js';

const inputClass = 'mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-400';

const badge = (def) => {
  if (def.required) return <span className="ml-2 rounded bg-rose-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-200">Required</span>;
  if (def.recommended) return <span className="ml-2 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-200">Recommended</span>;
  return <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">Optional</span>;
};

const optionValue = (option) => (typeof option === 'string' ? option : option.value);
const optionLabel = (option) => (typeof option === 'string' ? option : option.label);

const setAt = (obj, key, value) => ({ ...(obj || {}), [key]: value });

/** Errors and warnings whose path is exactly `path`, shown under the field they concern. */
const issuesAt = (issues, path) => issues.filter((issue) => issue.path === path);

function Leaf({ def, value, onChange, path, issues, id }) {
  const own = issuesAt(issues, path);
  const invalid = own.some((issue) => issue.level === 'error');
  const common = { id, 'aria-invalid': invalid || undefined, className: cx(inputClass, invalid && 'border-rose-400/60') };
  let control;
  if (def.type === 'textarea') control = <textarea {...common} rows={3} value={value ?? ''} placeholder={def.placeholder} onChange={(event) => onChange(event.target.value)} />;
  else if (def.type === 'select') {
    control = (
      <select {...common} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        <option value="">— none —</option>
        {def.options.map((option) => <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>)}
      </select>
    );
  } else if (def.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-slate-200"><input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-indigo-500" />{def.label}{badge(def)}</label>
    );
  } else if (def.type === 'multiselect') {
    const current = Array.isArray(value) ? value : [];
    control = (
      <div className="mt-1 flex flex-wrap gap-2">
        {def.options.map((option) => {
          const on = current.includes(option);
          return <button key={option} type="button" aria-pressed={on} onClick={() => onChange(on ? current.filter((x) => x !== option) : [...current, option])} className={cx('rounded-full px-3 py-1.5 text-xs font-semibold', on ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white')}>{option}</button>;
        })}
      </div>
    );
  } else if (def.type === 'list') {
    control = <textarea {...common} rows={3} value={Array.isArray(value) ? value.join('\n') : ''} placeholder={def.placeholder || 'One per line'} onChange={(event) => onChange(event.target.value.split('\n'))} />;
  } else {
    control = <input {...common} type={def.type === 'number' ? 'text' : 'text'} inputMode={def.type === 'number' ? 'decimal' : undefined} value={value ?? ''} placeholder={def.placeholder} onChange={(event) => onChange(event.target.value)} />;
  }
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">{def.label}{badge(def)}</label>
      {control}
      {def.help && <p className="mt-1 text-xs text-slate-500">{def.help}</p>}
      {own.map((issue) => <p key={issue.message} className={cx('mt-1 text-xs', issue.level === 'error' ? 'text-rose-300' : 'text-amber-200')}>{issue.message}</p>)}
    </div>
  );
}

/** Renders any type's fields from its definition: leaves, nested groups and repeaters. */
export default function SchemaForm({
  fields, values, onChange, issues, prefix = '', context,
}) {
  return (
    <div className="space-y-4">
      {fields.filter((def) => !def.showIf || def.showIf(context || values)).map((def) => {
        const path = prefix ? `${prefix}.${def.key}` : def.key;
        const id = `sf-${path.replace(/[^\w]/g, '-')}`;
        if (def.type === 'group') {
          return (
            <fieldset key={def.key} className="min-w-0 rounded-2xl border border-white/10 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-200">{def.label}{badge(def)}</legend>
              {def.help && <p className="-mt-1 mb-3 text-xs text-slate-500">{def.help}</p>}
              {issuesAt(issues, path).map((issue) => <p key={issue.message} className={cx('mb-2 text-xs', issue.level === 'error' ? 'text-rose-300' : 'text-amber-200')}>{issue.message}</p>)}
              <SchemaForm fields={def.fields} values={values?.[def.key] || {}} onChange={(sub) => onChange(setAt(values, def.key, sub))} issues={issues} prefix={path} context={context || values} />
            </fieldset>
          );
        }
        if (def.type === 'repeater') {
          const items = Array.isArray(values?.[def.key]) ? values[def.key] : [];
          const update = (next) => onChange(setAt(values, def.key, next));
          return (
            <fieldset key={def.key} className="min-w-0 rounded-2xl border border-white/10 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-200">{def.label}{badge(def)}</legend>
              {def.help && <p className="-mt-1 mb-3 text-xs text-slate-500">{def.help}</p>}
              {issuesAt(issues, path).map((issue) => <p key={issue.message} className={cx('mb-2 text-xs', issue.level === 'error' ? 'text-rose-300' : 'text-amber-200')}>{issue.message}</p>)}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{def.itemLabel || 'Item'} {index + 1}</span>
                      <button type="button" aria-label={`Remove ${def.itemLabel || 'item'} ${index + 1}`} onClick={() => update(items.filter((_, i) => i !== index))} className="hover:text-rose-300"><Trash2 size={14} /></button>
                    </div>
                    <SchemaForm fields={def.fields} values={item} onChange={(sub) => update(items.map((existing, i) => (i === index ? sub : existing)))} issues={issues} prefix={`${path}[${index}]`} context={context || values} />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => update([...items, {}])} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/20"><Plus size={14} /> Add {(def.itemLabel || 'item').toLowerCase()}</button>
            </fieldset>
          );
        }
        return <Leaf key={def.key} def={def} id={id} path={path} issues={issues} value={values?.[def.key]} onChange={(next) => onChange(setAt(values, def.key, next))} />;
      })}
    </div>
  );
}
