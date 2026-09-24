import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  AlertTriangle, Download, Film, Undo2, Upload,
} from 'lucide-react';
import { parseSubtitles, findProblems, parseTime } from '../../../../lib/subtitles/parse.js';
import { FORMATS, serialize, srtTime } from '../../../../lib/subtitles/serialize.js';
import {
  FPS_PRESETS, fixOverlaps, merge, scale, shift, twoPointSync,
} from '../../../../lib/subtitles/transform.js';
import { ENCODINGS, decode, detectEncoding } from '../../../../lib/subtitles/encoding.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const PAGE = 100;
const inputClass = 'rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400';
const bucket = (n) => (n < 100 ? '<100' : n < 1000 ? '100-1k' : '1k+');

const SAMPLE_CUES = [
  ['Welcome back to the channel.', 2100, 4300], ['Today we are fixing a problem', 4600, 6900], ['that every video editor knows:', 6900, 9000],
  ['subtitles that drift out of sync.', 9000, 11800], ['First, check the frame rate of your video.', 13500, 16800], ['A 23.976 fps source played at 25 fps', 17200, 20100],
  ['will slowly pull the dialogue ahead.', 20100, 22900], ['Second, look at the first and last lines.', 25000, 28000], ['If both are off by the same amount,', 28400, 30900],
  ['a simple shift is all you need.', 30900, 33200], ['If the error grows over time,', 35000, 37500], ['use a stretch instead.', 37500, 39800],
].map(([text, start, end], i) => ({ index: i + 1, start, end, text }));

const toSeconds = (raw) => {
  const text = String(raw).trim().replace(',', '.');
  if (!text) return null;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Math.round(Number(text) * 1000);
  const t = parseTime(text);
  return t;
};

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-medium text-slate-400">
      {label}
      <span className="mt-1 block">{children}</span>
      {hint && <span className="mt-1 block text-[11px] font-normal text-slate-500">{hint}</span>}
    </label>
  );
}

function Btn({ children, variant = 'ghost', icon: Icon, ...props }) {
  return (
    <button type="button" {...props} className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40', variant === 'primary' ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white/10 text-slate-100 hover:bg-white/20')}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}

/** Reads a subtitle file: detects its encoding, decodes it and parses it. */
async function readSubtitleFile(file, encodingOverride) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = await detectEncoding(bytes);
  const encoding = encodingOverride || detected.encoding;
  const text = decode(bytes, encoding);
  return { bytes, detected, encoding, ...parseSubtitles(text, { fileName: file.name }) };
}

function CueTable({ cues, onChange }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(cues.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = cues.slice(current * PAGE, (current + 1) * PAGE);
  const patch = (index, change) => onChange(cues.map((cue, i) => (i === index ? { ...cue, ...change } : cue)));
  const timeCell = (cue, index, key) => (
    <input
      key={`${index}-${cue[key]}`}
      defaultValue={srtTime(cue[key])}
      aria-label={`${key === 'start' ? 'Start' : 'End'} time, cue ${index + 1}`}
      onBlur={(event) => { const ms = parseTime(event.target.value.replace(',', '.')); if (ms === null) event.target.value = srtTime(cue[key]); else if (ms !== cue[key]) patch(index, { [key]: ms }); }}
      className="w-28 rounded-md border border-transparent bg-transparent px-2 py-1 font-mono text-xs text-slate-200 outline-none hover:border-white/10 focus:border-indigo-400 focus:bg-slate-950"
    />
  );
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead><tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400"><th className="w-12 px-3 py-2.5">#</th><th className="w-32 px-1 py-2.5">Start</th><th className="w-32 px-1 py-2.5">End</th><th className="px-3 py-2.5">Text</th></tr></thead>
          <tbody>
            {slice.map((cue, i) => {
              const index = current * PAGE + i;
              return (
                <tr key={index} className="border-t border-white/5 align-top">
                  <td className="px-3 py-2 text-xs text-slate-500">{index + 1}</td>
                  <td className="px-1 py-1.5">{timeCell(cue, index, 'start')}</td>
                  <td className="px-1 py-1.5">{timeCell(cue, index, 'end')}</td>
                  <td className="px-3 py-1.5">
                    <textarea aria-label={`Text, cue ${index + 1}`} defaultValue={cue.text} key={`${index}-${cue.text}`} rows={Math.min(4, cue.text.split('\n').length)} onBlur={(event) => { if (event.target.value !== cue.text) patch(index, { text: event.target.value }); }} className="w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-slate-100 outline-none hover:border-white/10 focus:border-indigo-400 focus:bg-slate-950" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3 text-sm text-slate-400">
          <Btn disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</Btn>
          <span>Cues {current * PAGE + 1}–{Math.min(cues.length, (current + 1) * PAGE)} of {cues.length}</span>
          <Btn disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Next</Btn>
        </div>
      )}
    </div>
  );
}

function SyncPanel({ cues, apply }) {
  const [offset, setOffset] = useState('');
  const [preset, setPreset] = useState(0);
  const [custom, setCustom] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [report, setReport] = useState('');
  const firstCue = cues[0]; const lastCue = cues[cues.length - 1];

  const doShift = () => {
    const ms = toSeconds(offset);
    if (ms === null) { setReport('Enter an offset in seconds, such as 2.5 or -1.25.'); return; }
    const result = shift(cues, ms);
    apply(result.cues, 'shift');
    setReport(`Shifted every cue by ${ms / 1000} s.${result.clamped ? ` ${result.clamped} cue${result.clamped === 1 ? '' : 's'} would have started before zero and were clamped to 0.` : ''}`);
  };
  const doScale = () => {
    const ratio = custom.trim() ? Number(custom) : FPS_PRESETS[preset][1];
    if (!ratio || ratio <= 0) { setReport('Enter a positive ratio, for example 1.04271.'); return; }
    apply(scale(cues, ratio), 'stretch');
    setReport(`Multiplied every time by ${ratio.toFixed(6)}.`);
  };
  const doTwoPoint = () => {
    const a = toSeconds(first); const b = toSeconds(last);
    if (a === null || b === null) { setReport('Enter the correct start time of the first and last cue, as seconds or hh:mm:ss.'); return; }
    const result = twoPointSync(cues, a, b);
    if (result.error) { setReport(result.error); return; }
    apply(result.cues, 'two-point');
    setReport(`Solved: scale ${result.scale.toFixed(6)}, offset ${(result.offset / 1000).toFixed(3)} s. Applied to every cue.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <h3 className="font-bold text-white">Shift all timings</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">Everything is a fixed amount early or late? Enter seconds; negative moves subtitles earlier.</p>
        <div className="mt-3 flex items-end gap-2">
          <Field label="Offset (seconds)"><input value={offset} onChange={(event) => setOffset(event.target.value)} placeholder="-2.500" inputMode="decimal" className={cx(inputClass, 'w-32')} /></Field>
          <Btn variant="primary" onClick={doShift}>Shift</Btn>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <h3 className="font-bold text-white">Stretch for frame rate</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">Drift that grows over the film? Multiply all times by a ratio. Pick the frame-rate pair, or enter your own ratio.</p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <Field label="Frame-rate pair"><select value={preset} onChange={(event) => { setPreset(Number(event.target.value)); setCustom(''); }} className={inputClass}>{FPS_PRESETS.map(([label], i) => <option key={label} value={i}>{label}</option>)}</select></Field>
          <Field label="or custom ratio"><input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="1.04271" inputMode="decimal" className={cx(inputClass, 'w-28')} /></Field>
          <Btn variant="primary" onClick={doScale}>Stretch</Btn>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <h3 className="font-bold text-white">Two-point sync</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">Give the true time of the first and last line spoken. The tool works out both the offset and the stretch.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Field label="First cue should start at" hint={`Now: ${firstCue ? srtTime(firstCue.start) : '—'}`}><input value={first} onChange={(event) => setFirst(event.target.value)} placeholder="00:00:03,200" className={cx(inputClass, 'w-full')} /></Field>
          <Field label="Last cue should start at" hint={`Now: ${lastCue ? srtTime(lastCue.start) : '—'}`}><input value={last} onChange={(event) => setLast(event.target.value)} placeholder="01:32:10,500" className={cx(inputClass, 'w-full')} /></Field>
        </div>
        <div className="mt-3"><Btn variant="primary" onClick={doTwoPoint}>Sync</Btn></div>
      </section>
      {report && <p role="status" className="lg:col-span-3 rounded-xl border border-indigo-400/25 bg-indigo-400/10 p-3 text-sm text-indigo-100">{report}</p>}
    </div>
  );
}

function VideoPreview({ cues }) {
  const [video, setVideo] = useState(null);
  const [trackUrl, setTrackUrl] = useState('');
  useEffect(() => () => { if (video) URL.revokeObjectURL(video.url); }, [video]);
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([serialize(cues, 'vtt')], { type: 'text/vtt' }));
    setTrackUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cues]);
  return (
    <div>
      <p className="text-sm text-slate-300">Preview against your video to check the sync before you download. The video stays on your device.</p>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/20">
        <Film size={16} /> Choose a video file
        <input type="file" accept="video/*" className="sr-only" onChange={(event) => { const file = event.target.files[0]; if (file) setVideo({ name: file.name, url: URL.createObjectURL(file) }); event.target.value = ''; }} />
      </label>
      {video && (
        <div className="mt-4">
          <video key={video.url} src={video.url} controls className="max-h-[26rem] w-full rounded-2xl bg-black" crossOrigin="anonymous">
            {trackUrl && <track key={trackUrl} kind="subtitles" src={trackUrl} srcLang="en" label="Your subtitles" default />}
          </video>
          <p className="mt-2 text-xs text-slate-500">{video.name} — subtitles update as you edit or sync.</p>
        </div>
      )}
    </div>
  );
}

export default function SubtitleClient({ mode = 'converter', from = null, to = 'srt' }) {
  const [file, setFile] = useState(null); // { name, bytes, encoding, detected }
  const [cues, setCues] = useState(null);
  const [format, setFormat] = useState(from);
  const [warnings, setWarnings] = useState([]);
  const [history, setHistory] = useState([]);
  const [outFormat, setOutFormat] = useState(to);
  const [timestamps, setTimestamps] = useState(false);
  const [bom, setBom] = useState(false);
  const [tab, setTab] = useState(mode === 'merge' ? 'merge' : mode === 'sync' ? 'sync' : 'cues');
  const [second, setSecond] = useState(null);
  const [mergeMode, setMergeMode] = useState('stacked');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const operation = useRef('convert');

  const load = useCallback(async (f, override) => {
    setError('');
    try {
      const result = await readSubtitleFile(f, override);
      if (!result.cues.length) { setError('No subtitle cues were found in that file. Check it is an SRT, VTT, ASS, SSA or SBV file, or try a different encoding.'); return; }
      setFile({ name: f.name, raw: f, encoding: result.encoding, detected: result.detected });
      setCues(result.cues); setFormat(result.format); setWarnings(result.warnings); setHistory([]);
      trackToolEvent('subtitle-toolkit', 'open', { from_format: result.format, to_format: outFormat, cue_count_bucket: bucket(result.cues.length), operation: mode });
    } catch {
      setError('That file could not be read.');
    }
  }, [mode, outFormat]);

  const update = (next, label) => {
    setHistory((h) => [...h, cues]);
    setCues(next);
    operation.current = label || operation.current;
  };
  const undo = () => { setCues(history[history.length - 1]); setHistory((h) => h.slice(0, -1)); };

  const loadSample = () => {
    const blob = new File([serialize(SAMPLE_CUES, 'srt')], 'sample.srt', { type: 'text/plain' });
    load(blob);
  };

  const loadSecond = async (f) => {
    try { const r = await readSubtitleFile(f); if (r.cues.length) setSecond({ name: f.name, cues: r.cues, encoding: r.encoding }); else setError('No cues found in the second file.'); } catch { setError('The second file could not be read.'); }
  };

  const problems = useMemo(() => (cues ? findProblems(cues) : { overlaps: [], inverted: [] }), [cues]);
  const output = useMemo(() => (cues ? serialize(cues, outFormat, { timestamps }) : ''), [cues, outFormat, timestamps]);
  const duration = cues?.length ? cues[cues.length - 1].end : 0;

  const download = () => {
    const base = (file?.name || 'subtitles').replace(/\.[^.]+$/, '');
    const blob = new Blob([bom ? String.fromCharCode(0xfeff) : '', output], { type: `${FORMATS[outFormat].mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${base}${mode === 'sync' ? '_synced' : mode === 'merge' ? '_bilingual' : ''}.${FORMATS[outFormat].ext}`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    trackToolEvent('subtitle-toolkit', 'download', { from_format: format, to_format: outFormat, cue_count_bucket: bucket(cues.length), operation: operation.current });
  };

  const tabs = mode === 'converter' ? [['cues', 'Cues'], ['sync', 'Sync & timing'], ['merge', 'Merge'], ['preview', 'Video preview']]
    : mode === 'sync' ? [['sync', 'Sync & timing'], ['preview', 'Video preview'], ['cues', 'Cues']]
      : mode === 'merge' ? [['merge', 'Merge'], ['cues', 'Cues'], ['preview', 'Video preview']]
        : [['cues', 'Cues'], ['preview', 'Video preview']];

  return (
    <div data-clarity-mask="true">
      <label
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files[0]) load(event.dataTransfer.files[0]); }}
        className={cx('flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition', dragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
      >
        <Upload size={28} className="text-indigo-300" aria-hidden="true" />
        <span className="text-lg font-semibold text-white">Drop a subtitle file here</span>
        <span className="text-sm text-slate-400">SRT, VTT, ASS/SSA or SBV, in any encoding — it is processed in your browser and never uploaded</span>
        <input type="file" accept=".srt,.vtt,.ass,.ssa,.sbv,.txt,text/plain,text/vtt" className="sr-only" onChange={(event) => { if (event.target.files[0]) load(event.target.files[0]); event.target.value = ''; }} />
      </label>
      <p className="mt-3 text-center text-sm text-slate-400">No file handy? <button type="button" onClick={loadSample} className="font-semibold text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">Try a sample subtitle file</button></p>
      {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</p>}

      {cues && file && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-300">
              <span className="max-w-[16rem] truncate font-semibold text-white" title={file.name}>{file.name}</span>
              <span>Format <strong className="text-white">{format.toUpperCase()}</strong>{from && format !== from && <span className="ml-1 text-amber-200">(expected {from.toUpperCase()})</span>}</span>
              <span><strong className="text-white">{cues.length}</strong> cues</span>
              <span>{srtTime(duration).slice(0, 8)} long</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400">Encoding
                <select value={file.encoding} onChange={(event) => load(file.raw, event.target.value)} className={cx(inputClass, 'py-1')}>
                  {ENCODINGS.map(([value, label]) => <option key={value} value={value}>{label}{value === file.detected.encoding ? ' — detected' : ''}</option>)}
                </select>
              </label>
              {history.length > 0 && <Btn icon={Undo2} onClick={undo}>Undo</Btn>}
            </div>
          </div>

          {file.encoding !== 'utf-8' && <p className="mt-3 rounded-xl border border-indigo-400/25 bg-indigo-400/10 p-3 text-sm text-indigo-100">This file was not UTF-8, so it was read as <strong>{file.encoding}</strong> ({file.detected.reason}). If accented or non-Latin characters look wrong in the table below, pick a different encoding above. The download is always UTF-8.</p>}
          {warnings.map((warning) => <p key={warning.message} className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{warning.message}</p>)}
          {(problems.overlaps.length > 0 || problems.inverted.length > 0) && (
            <p className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
              <AlertTriangle size={16} />
              {problems.overlaps.length > 0 && <span>{problems.overlaps.length} cue{problems.overlaps.length === 1 ? ' overlaps' : 's overlap'} the one before (first at cue {problems.overlaps[0] + 1}).</span>}
              {problems.inverted.length > 0 && <span>{problems.inverted.length} cue{problems.inverted.length === 1 ? ' ends' : 's end'} before it starts (first at cue {problems.inverted[0] + 1}).</span>}
              <button type="button" onClick={() => update(fixOverlaps(cues).cues, 'fix-overlaps')} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20">Fix them</button>
              <span className="text-xs opacity-80">Nothing is changed until you click.</span>
            </p>
          )}

          <div role="tablist" aria-label="Tools" className="mt-6 flex flex-wrap gap-2">
            {tabs.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={cx('rounded-full px-4 py-2 text-sm font-semibold', tab === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white')}>{label}</button>)}
          </div>
          <div className="mt-5" role="tabpanel">
            {tab === 'cues' && <CueTable cues={cues} onChange={(next) => update(next, 'edit')} />}
            {tab === 'sync' && <SyncPanel cues={cues} apply={update} />}
            {tab === 'preview' && <VideoPreview cues={cues} />}
            {tab === 'merge' && (
              <div>
                <p className="text-sm text-slate-300">Merge a second subtitle file (another language) into this one.</p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/20"><Upload size={16} /> {second ? second.name : 'Choose the second file'}<input type="file" accept=".srt,.vtt,.ass,.ssa,.sbv,.txt" className="sr-only" onChange={(event) => { if (event.target.files[0]) loadSecond(event.target.files[0]); event.target.value = ''; }} /></label>
                  <Field label="Mode"><select value={mergeMode} onChange={(event) => setMergeMode(event.target.value)} className={inputClass}><option value="stacked">Stacked — both languages in one cue</option><option value="interleaved">Interleaved — separate cues</option></select></Field>
                  <Btn variant="primary" disabled={!second} onClick={() => { update(merge(cues, second.cues, mergeMode), 'merge'); setTab('cues'); }}>Merge</Btn>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Stacked puts each line of the second file under the cue it overlaps most in time, in a smaller size. Cues of the second file that overlap nothing are kept as their own cues, so no text is lost.</p>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <h3 className="font-bold text-white">Download</h3>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <Field label="Format"><select value={outFormat} onChange={(event) => setOutFormat(event.target.value)} className={inputClass}>{Object.entries(FORMATS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></Field>
              {outFormat === 'txt' && <label className="flex items-center gap-2 pb-2 text-sm text-slate-300"><input type="checkbox" checked={timestamps} onChange={(event) => setTimestamps(event.target.checked)} className="accent-indigo-500" /> Include timestamps</label>}
              <label className="flex items-center gap-2 pb-2 text-sm text-slate-300"><input type="checkbox" checked={bom} onChange={(event) => setBom(event.target.checked)} className="accent-indigo-500" /> Add a UTF-8 byte-order mark (helps some older players)</label>
              <Btn variant="primary" icon={Download} onClick={download}>Download {outFormat.toUpperCase()}</Btn>
            </div>
            <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs leading-5 text-slate-300">{output.slice(0, 1500)}{output.length > 1500 ? '\n…' : ''}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
