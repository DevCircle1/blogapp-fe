import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { downloadZip } from 'client-zip';
import {
  AlertTriangle, Download, Image as ImageIcon, MapPin, ShieldCheck, Trash2, Upload,
} from 'lucide-react';
import { ConvertPool, isMobile } from '../../../../lib/image/pool.js';
import { describeMeta, readMeta } from '../../../../lib/image/meta.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const RAW_RE = /\.(cr2|cr3|crw|nef|nrw|arw|srf|sr2|dng|raf|rw2|orf|pef|srw|3fr|erf|kdc|mrw|x3f|iiq)$/i;
const isRaw = (name) => RAW_RE.test(name);
const FORMATS = { jpg: 'JPEG', png: 'PNG', webp: 'WebP' };
const MAX_DIMS = [['0', 'Original size'], ['4096', '4096 px'], ['3000', '3000 px'], ['2048', '2048 px'], ['1600', '1600 px'], ['1200', '1200 px'], ['800', '800 px']];
const inputClass = 'rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400';

const fmtBytes = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const bucket = (n) => (n <= 1 ? '1' : n <= 10 ? '2-10' : n <= 50 ? '11-50' : '50+');

/** Rough output size for the quality slider: pixels × a typical bits-per-pixel figure, clearly labelled an estimate. */
function estimate(format, quality, pixels) {
  const jpegBpp = quality >= 100 ? 5 : quality >= 95 ? 2.6 : quality >= 90 ? 1.7 : quality >= 80 ? 1.1 : quality >= 70 ? 0.75 : 0.5;
  const bpp = format === 'png' ? 9 : format === 'webp' ? jpegBpp * 0.72 : jpegBpp;
  return Math.round((pixels * bpp) / 8);
}

function Segmented({ label, value, onChange, options }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap rounded-xl bg-white/5 p-1">
      {options.map(([key, text]) => <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={cx('rounded-lg px-3 py-1.5 text-sm font-semibold', value === key ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white')}>{text}</button>)}
    </div>
  );
}

let counter = 1;

export default function ImageClient({ defaultFormat = 'jpg', focus = 'any' }) {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState(defaultFormat);
  const [quality, setQuality] = useState(90);
  const [maxDim, setMaxDim] = useState('0');
  const [rawMode, setRawMode] = useState('quick');
  const [keepPreview, setKeepPreview] = useState(true);
  const [exif, setExif] = useState('keep');
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const poolRef = useRef(null);
  const urls = useRef(new Set());
  const mobile = useMemo(() => isMobile(), []);
  const maxFiles = mobile ? 25 : 300;

  useEffect(() => () => { poolRef.current?.terminate(); urls.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  const patch = useCallback((id, changes) => setFiles((current) => current.map((f) => (f.id === id ? { ...f, ...changes } : f))), []);

  const addFiles = useCallback(async (list) => {
    const incoming = [...list].filter((f) => f.size > 0);
    if (!incoming.length) return;
    setNotice('');
    let room = maxFiles - files.length;
    const accepted = incoming.slice(0, Math.max(0, room));
    if (accepted.length < incoming.length) setNotice(`${mobile ? 'On a phone' : 'To keep the page responsive'}, ${maxFiles} files at a time is the limit. ${incoming.length - accepted.length} file${incoming.length - accepted.length === 1 ? ' was' : 's were'} not added; convert this batch and add the rest.`);
    if (mobile && accepted.some((f) => isRaw(f.name)) && rawMode === 'full') setNotice((n) => `${n} Full-quality RAW decoding is memory-hungry on phones; Quick mode is safer for large batches.`.trim());
    const entries = accepted.map((file) => ({ id: counter++, file, name: file.name, size: file.size, status: 'queued', meta: null }));
    room -= entries.length;
    setFiles((current) => [...current, ...entries]);
    entries.forEach(async (entry) => {
      const meta = await readMeta(entry.file);
      patch(entry.id, { meta });
    });
  }, [files.length, maxFiles, mobile, patch, rawMode]);

  const options = useMemo(() => ({
    format, quality, maxDim: Number(maxDim), rawMode, keepPreview: keepPreview && rawMode === 'quick', exif,
  }), [format, quality, maxDim, rawMode, keepPreview, exif]);

  const convertAll = async () => {
    const targets = files.filter((f) => f.status === 'queued' || f.status === 'error' || f.status === 'done');
    if (!targets.length) return;
    poolRef.current ??= new ConvertPool();
    const pool = poolRef.current;
    setBusy(true);
    targets.forEach((f) => { if (f.result?.url) { URL.revokeObjectURL(f.result.url); urls.current.delete(f.result.url); } patch(f.id, { status: 'queued', result: null, error: '' }); });
    let ok = 0;
    await Promise.all(targets.map((entry) => pool.run(entry.file, entry.name, options, () => patch(entry.id, { status: 'working' }))
      .then((result) => {
        const blob = new Blob([result.bytes], { type: result.mime });
        const url = URL.createObjectURL(blob);
        urls.current.add(url);
        ok += 1;
        patch(entry.id, { status: 'done', result: { blob, url, width: result.width, height: result.height, note: result.note, size: blob.size } });
      })
      .catch((error) => {
        const message = error.code === 'NO_PREVIEW' ? 'This RAW file has no usable embedded preview. Switch to “Full quality”.'
          : error.code === 'CRASH' ? 'The browser ran out of memory on this file. Try Quick mode, a smaller size, or fewer files at once.'
            : error.code === 'CANCELLED' ? 'Cancelled.' : 'This file could not be converted. It may be damaged or use a variant that is not supported.';
        patch(entry.id, { status: 'error', error: message });
      })));
    setBusy(false);
    if (ok) trackToolEvent('image-converter', 'convert', { from_format: focus, to_format: format, count_bucket: bucket(ok) });
  };

  const stem = (name) => name.replace(/\.[^.]+$/, '');
  const save = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  const downloadOne = (f) => save(f.result.blob, `${stem(f.name)}.${format}`);
  const downloadAll = async () => {
    const done = files.filter((f) => f.status === 'done');
    if (done.length === 1) { downloadOne(done[0]); return; }
    setZipping(true);
    try {
      const used = new Map();
      const entries = done.map((f) => {
        let name = `${stem(f.name)}.${format}`;
        const count = (used.get(name) || 0) + 1;
        used.set(name, count);
        if (count > 1) name = `${stem(f.name)} (${count}).${format}`;
        return { name, input: f.result.blob };
      });
      save(await downloadZip(entries).blob(), 'converted-photos.zip');
    } finally { setZipping(false); }
  };

  const remove = (id) => setFiles((current) => { const f = current.find((x) => x.id === id); if (f?.result?.url) { URL.revokeObjectURL(f.result.url); urls.current.delete(f.result.url); } return current.filter((x) => x.id !== id); });
  const clear = () => { poolRef.current?.cancelQueued(); files.forEach((f) => { if (f.result?.url) URL.revokeObjectURL(f.result.url); }); setFiles([]); setNotice(''); };

  const withGps = files.filter((f) => f.meta?.hasGps);
  const doneCount = files.filter((f) => f.status === 'done').length;
  const anyRaw = files.some((f) => isRaw(f.name));

  return (
    <div data-clarity-mask="true">
      <p className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-center text-sm text-emerald-200"><ShieldCheck size={16} /> Your photos never leave your device. Everything is decoded and converted in your browser; nothing is uploaded.</p>

      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
        className={cx('flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition', dragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
      >
        <Upload size={28} className="text-indigo-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-white">{focus === 'raw' ? 'Drop your RAW photos here' : focus === 'heic' ? 'Drop your HEIC photos here' : 'Drop photos here'}</span>
        <span className="text-sm text-slate-400">or tap to choose — HEIC, HEIF, camera RAW (CR2, NEF, ARW, DNG…), JPG, PNG, WebP, AVIF</span>
        <input type="file" multiple accept="image/*,.heic,.heif,.hif,.cr2,.cr3,.crw,.nef,.nrw,.arw,.srf,.sr2,.dng,.raf,.rw2,.orf,.pef,.srw,image/heic,image/heif" className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = ''; }} />
      </label>
      {notice && <p role="status" className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{notice}</p>}

      <div className="mt-6 grid gap-5 rounded-2xl border border-white/10 bg-slate-950/50 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <div><span className="text-xs font-medium uppercase tracking-wider text-slate-500">Convert to</span><div className="mt-2"><Segmented label="Output format" value={format} onChange={setFormat} options={Object.entries(FORMATS)} /></div></div>
          {format !== 'png' && (
            <label className="block text-sm text-slate-300">
              Quality: <strong className="text-white">{quality}</strong>
              <input type="range" min={40} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-2 w-full accent-indigo-500" />
              <span className="text-xs text-slate-500">A typical 12-megapixel photo comes out around <strong className="text-slate-300">{fmtBytes(estimate(format, quality, 12e6))}</strong> (estimate).</span>
            </label>
          )}
          <label className="block text-sm text-slate-300">Longest side
            <select value={maxDim} onChange={(event) => setMaxDim(event.target.value)} className={cx(inputClass, 'ml-2')}>{MAX_DIMS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Metadata (JPEG output)</span>
            <div className="mt-2"><Segmented label="Metadata" value={exif} onChange={setExif} options={[['keep', 'Keep everything'], ['strip-gps', 'Remove location'], ['strip-all', 'Remove all']]} /></div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Keeping metadata preserves the date, camera, lens and exposure. “Remove location” deletes the GPS coordinates and keeps the rest. Photos can reveal where they were taken — check before you post them.</p>
          </div>
          {(anyRaw || focus === 'raw') && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">RAW files</span>
              <div className="mt-2"><Segmented label="RAW mode" value={rawMode} onChange={setRawMode} options={[['quick', 'Quick (embedded preview)'], ['full', 'Full quality']]} /></div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Quick uses the JPEG preview every RAW file contains — almost instant, at whatever size the camera stored (full size on many Canon and Nikon bodies, smaller on others). Full quality develops the sensor data itself with LibRaw: slower, full resolution.</p>
              {rawMode === 'quick' && format === 'jpg' && <label className="mt-2 flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={keepPreview} onChange={(event) => setKeepPreview(event.target.checked)} className="accent-indigo-500" /> Keep the preview exactly as stored (no recompression)</label>}
            </div>
          )}
        </div>
      </div>

      {withGps.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
          <MapPin size={16} /> {withGps.length} photo{withGps.length === 1 ? ' contains' : 's contain'} GPS location data
          {exif === 'keep' ? <><span>— it will be kept in JPEG output.</span><button type="button" onClick={() => setExif('strip-gps')} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20">Remove location</button></> : <span>— {exif === 'strip-gps' ? 'location will be removed.' : 'all metadata will be removed.'}</span>}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300"><strong className="text-white">{files.length}</strong> photo{files.length === 1 ? '' : 's'}{doneCount > 0 && <> · <strong className="text-emerald-300">{doneCount}</strong> converted</>}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={convertAll} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-400 disabled:opacity-40"><ImageIcon size={16} /> {busy ? 'Converting…' : doneCount ? 'Convert again' : `Convert to ${FORMATS[format]}`}</button>
              <button type="button" onClick={downloadAll} disabled={!doneCount || zipping} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/20 disabled:opacity-40"><Download size={16} /> {zipping ? 'Zipping…' : doneCount > 1 ? 'Download all (zip)' : 'Download'}</button>
              <button type="button" onClick={clear} className="rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-white">Clear</button>
            </div>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((f) => (
              <li key={f.id} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/5 text-slate-500">
                  {f.result?.url ? <img src={f.result.url} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={24} aria-hidden="true" />}
                </div>
                <div className="min-w-0 grow">
                  <div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-semibold text-white" title={f.name}>{f.name}</p><button type="button" aria-label={`Remove ${f.name}`} onClick={() => remove(f.id)} className="text-slate-500 hover:text-rose-300"><Trash2 size={14} /></button></div>
                  <p className="truncate text-xs text-slate-500">{fmtBytes(f.size)}{f.meta && describeMeta(f.meta) ? ` · ${describeMeta(f.meta)}` : ''}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {f.meta?.hasGps && <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-1.5 py-0.5 font-semibold text-amber-200"><MapPin size={10} /> GPS</span>}
                    {f.status === 'queued' && <span className="text-slate-500">Ready</span>}
                    {f.status === 'working' && <span className="text-indigo-300">Converting…</span>}
                    {f.status === 'done' && <span className="text-emerald-300">{f.result.width}×{f.result.height} · {fmtBytes(f.result.size)}</span>}
                    {f.status === 'error' && <span className="text-rose-300">{f.error}</span>}
                  </div>
                  {f.status === 'done' && f.result.note && <p className="mt-1 truncate text-[11px] text-slate-500" title={f.result.note}>{f.result.note}</p>}
                  {f.status === 'done' && <button type="button" onClick={() => downloadOne(f)} className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white"><Download size={12} /> Download {format.toUpperCase()}</button>}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">Photos are converted a few at a time, using several CPU threads. A file that fails is reported here and does not stop the others. {mobile ? 'On a phone the batch size is limited to protect memory.' : ''}</p>
        </div>
      )}
    </div>
  );
}
