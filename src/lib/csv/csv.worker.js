import { indexFile } from './scan.js';
import {
  dedupe, filterRows, mergeFiles, sortRows, splitFile, toJsonLines, toXlsx,
} from './ops.js';

/**
 * All CSV work happens here, off the main thread, streaming from the File. The
 * offset index for the open file stays in this worker; the page only ever
 * receives the handful of rows it is showing, and Blobs for finished results.
 */
let state = null; // { file, index, hasHeader }
let cancelled = false;

const post = (message) => self.postMessage(message);

const contextFor = (id) => ({
  file: state.file,
  delimiter: state.index.delimiter,
  hasHeader: state.hasHeader,
  start: state.index.bom ? 3 : 0,
  tick: (fraction, rows) => { post({ id, type: 'progress', fraction, rows }); return !cancelled; },
});

const stem = (name) => name.replace(/\.[^.]+$/, '');

async function runOperation(id, name, params) {
  const ctx = contextFor(id);
  const base = stem(state.file.name || 'data');
  let result;
  let filename;
  let meta = {};
  if (name === 'filter') { result = await filterRows(ctx, params); filename = `${base}_filtered.csv`; }
  else if (name === 'dedupe') { result = await dedupe(ctx, params); filename = `${base}_deduplicated.csv`; }
  else if (name === 'sort') { result = await sortRows(ctx, params); filename = `${base}_sorted.csv`; }
  else if (name === 'split') { result = await splitFile(ctx, params); filename = `${base}_split.zip`; }
  else if (name === 'jsonl') { result = await toJsonLines(ctx, state.index.header); filename = `${base}.jsonl`; }
  else if (name === 'xlsx') {
    const dataRows = state.index.rows - (state.hasHeader ? 1 : 0);
    result = await toXlsx(ctx, { dataRows, columns: Math.max(state.index.fields, state.index.maxFields) });
    filename = `${base}.xlsx`;
  }
  if (result.cancelled) { post({ id, type: 'cancelled' }); return; }
  if (result.error) { post({ id, type: 'error', code: result.error, detail: result }); return; }
  const { blob, ...rest } = result;
  meta = rest;
  post({ id, type: 'result', name, blob, filename, meta, size: blob.size });
}

self.onmessage = async (event) => {
  const message = event.data;
  try {
    if (message.type === 'cancel') { cancelled = true; return; }
    cancelled = false;
    if (message.type === 'index') {
      const { id, file, name } = message;
      const index = await indexFile(file, { onProgress: (fraction, rows) => { post({ id, type: 'progress', fraction, rows }); return !cancelled; } });
      if (index.cancelled) { post({ id, type: 'cancelled' }); return; }
      if (index.error === 'UTF16') { post({ id, type: 'error', code: 'UTF16' }); return; }
      if (!index.rows) { post({ id, type: 'error', code: 'EMPTY' }); return; }
      const named = file.name ? file : new File([file], name || 'data.csv', { type: 'text/csv' });
      state = { file: named, index, hasHeader: index.hasHeader };
      post({
        id,
        type: 'indexed',
        info: {
          name: named.name, size: index.size, rows: index.rows, fields: index.fields, maxFields: index.maxFields, ragged: index.ragged, delimiter: index.delimiter, bom: index.bom, types: index.types, hasHeader: index.hasHeader, header: index.header,
        },
      });
    } else if (message.type === 'rows' && state) {
      post({ id: message.id, type: 'rows', from: message.from, rows: await state.index.read(message.from, message.count) });
    } else if (message.type === 'header' && state) {
      state.hasHeader = message.hasHeader;
    } else if (message.type === 'op' && state) {
      await runOperation(message.id, message.name, message.params);
    } else if (message.type === 'merge') {
      const result = await mergeFiles(message.files, { mode: message.mode, tick: (fraction, rows) => { post({ id: message.id, type: 'progress', fraction, rows }); return !cancelled; } });
      if (result.cancelled) { post({ id: message.id, type: 'cancelled' }); return; }
      if (result.error) { post({ id: message.id, type: 'error', code: result.error, detail: result }); return; }
      const { blob, ...meta } = result;
      post({ id: message.id, type: 'result', name: 'merge', blob, filename: 'merged.csv', meta, size: blob.size });
    }
  } catch (error) {
    post({ id: message.id, type: 'error', code: error?.code || 'FAILED', message: String(error?.message || error) });
  }
};

