import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '../../impl/toolFormat.js';

const ROW_H = 30;
const HEAD_H = 56;
const BUFFER = 20;
const MAX_SCROLL = 8_000_000; // px; browsers cap element heights, so huge files use a scaled scrollbar

const TYPE_TONE = {
  integer: 'bg-sky-400/20 text-sky-200', decimal: 'bg-sky-400/20 text-sky-200', date: 'bg-violet-400/20 text-violet-200', boolean: 'bg-amber-400/20 text-amber-200', text: 'bg-white/10 text-slate-300', empty: 'bg-white/5 text-slate-500',
};

/**
 * A table that renders only the rows in view. Rows are fetched from the worker
 * (which reads just those bytes from the file) as the user scrolls, so the
 * number of rows in the file is irrelevant to memory and to render cost.
 * `fetchRows(from, count)` resolves to string[][] for data rows [from, from + count).
 */
export default function VirtualTable({
  total, header, types, fetchRows, height = 460, gotoRef,
}) {
  const box = useRef(null);
  const request = useRef(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState([]);
  const [widths, setWidths] = useState({});
  const columns = Math.max(header.length, types.length, ...rows.map((row) => row.length), 1);

  const visible = Math.ceil((height - HEAD_H) / ROW_H) + 1;
  const trueHeight = total * ROW_H;
  const scaled = trueHeight > MAX_SCROLL;
  const scrollHeight = scaled ? MAX_SCROLL : trueHeight;

  const rowAt = useCallback((scrollTop) => {
    if (!scaled) return Math.floor(scrollTop / ROW_H);
    const max = scrollHeight - (height - HEAD_H);
    return Math.min(total - visible, Math.floor((scrollTop / Math.max(1, max)) * (total - visible)));
  }, [scaled, scrollHeight, height, total, visible]);

  const load = useCallback(async (start) => {
    const from = Math.max(0, start - BUFFER);
    const count = visible + BUFFER * 2;
    request.current += 1;
    const ticket = request.current;
    const data = await fetchRows(from, Math.min(count, total - from));
    if (ticket === request.current) { setRows(data); setFirst(from); }
  }, [fetchRows, total, visible]);

  useEffect(() => { if (box.current) box.current.scrollTop = 0; load(0); }, [load, total, header]);

  const frame = useRef(0);
  const onScroll = () => {
    const row = Math.max(0, rowAt(box.current.scrollTop));
    // A scaled scrollbar moves many rows per pixel, so reload on every frame; otherwise only near the edge of the buffer.
    if (scaled) {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => load(row));
    } else if (row < first + BUFFER / 2 || row + visible > first + rows.length - BUFFER / 2) load(row);
  };

  const scrollToRow = useCallback((row) => {
    const target = Math.max(0, Math.min(total - 1, row));
    box.current.scrollTop = scaled ? (target / Math.max(1, total - visible)) * (scrollHeight - (height - HEAD_H)) : target * ROW_H;
    load(target);
  }, [total, scaled, scrollHeight, height, visible, load]);
  useEffect(() => { if (gotoRef) gotoRef.current = scrollToRow; }, [gotoRef, scrollToRow]);

  const drag = (column, event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = widths[column] || 160;
    const move = (e) => setWidths((current) => ({ ...current, [column]: Math.max(60, startWidth + e.clientX - startX) }));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const widthOf = (c) => widths[c] || 160;
  const totalWidth = 72 + Array.from({ length: columns }, (_, c) => widthOf(c)).reduce((a, b) => a + b, 0);

  return (
    <div ref={box} onScroll={onScroll} className="relative overflow-auto rounded-2xl border border-white/10 bg-slate-950/70" style={{ height }} role="region" aria-label="CSV rows" tabIndex={0}>
      <div style={{ height: scrollHeight + HEAD_H, width: totalWidth, position: 'relative' }}>
        <div className="sticky top-0 z-10 flex border-b border-white/10 bg-slate-900" style={{ height: HEAD_H, width: totalWidth }}>
          <div className="shrink-0 border-r border-white/10 px-2 py-2 text-right text-xs text-slate-500" style={{ width: 72 }}>#</div>
          {Array.from({ length: columns }, (_, c) => (
            <div key={c} className="relative shrink-0 overflow-hidden border-r border-white/10 px-3 py-1.5" style={{ width: widthOf(c) }}>
              <div className="truncate text-sm font-semibold text-white" title={header[c] || `Column ${c + 1}`}>{header[c] || `Column ${c + 1}`}</div>
              {types[c] && <span className={cx('mt-0.5 inline-block rounded px-1.5 py-px text-[10px] font-semibold uppercase', TYPE_TONE[types[c]] || TYPE_TONE.text)}>{types[c]}</span>}
              <span onPointerDown={(event) => drag(c, event)} className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-indigo-400/40" role="separator" aria-label={`Resize column ${c + 1}`} />
            </div>
          ))}
        </div>
        <div style={scaled ? { position: 'sticky', top: HEAD_H, width: totalWidth, height: visible * ROW_H } : { position: 'absolute', top: HEAD_H + first * ROW_H, left: 0, width: totalWidth }}>
          {rows.map((row, i) => (
            <div key={first + i} className="flex border-b border-white/5 text-sm hover:bg-white/[0.03]" style={{ height: ROW_H }}>
              <div className="shrink-0 border-r border-white/10 px-2 text-right text-xs leading-[30px] tabular-nums text-slate-500" style={{ width: 72 }}>{(first + i + 1).toLocaleString('en-US')}</div>
              {Array.from({ length: columns }, (_, c) => (
                <div key={c} className={cx('shrink-0 truncate border-r border-white/5 px-3 leading-[30px] text-slate-200', c >= header.length && header.length > 0 && 'text-amber-200')} style={{ width: widthOf(c) }} title={row[c]}>{row[c]}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
