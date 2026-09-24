/** Run: node scripts/checks/csv.mjs — correctness checks for the streaming CSV engine. */
import ExcelJS from 'exceljs';
import { unzipSync, strFromU8 } from 'fflate';
import { indexFile } from '../../src/lib/csv/scan.js';
import {
  dedupe, filterRows, mergeFiles, sortRows, splitFile, toJsonLines, toXlsx,
} from '../../src/lib/csv/ops.js';
import { parseRecords } from '../../src/lib/csv/rfc4180.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};
const file = (text, name = 'data.csv') => new File([text], name, { type: 'text/csv' });
const text = (blob) => blob.text();
const ctxFor = async (f) => {
  const index = await indexFile(f);
  return { index, ctx: { file: f, delimiter: index.delimiter, hasHeader: index.hasHeader, start: index.bom ? 3 : 0, tick: () => true } };
};

// RFC 4180 parsing.
eq('quotes', parseRecords('a,"b,c","d ""x"" e"\n1,2,3\n'), [['a', 'b,c', 'd "x" e'], ['1', '2', '3']]);
eq('embedded newline', parseRecords('a,"line1\nline2",c\n'), [['a', 'line1\nline2', 'c']]);
eq('crlf', parseRecords('a,b\r\n1,2\r\n'), [['a', 'b'], ['1', '2']]);
eq('mid-field quote', parseRecords('5" pipe,ok\n'), [['5" pipe', 'ok']]);

// Index: BOM, CRLF, quoted newline, ragged row, semicolon delimiter.
const tricky = '﻿id;name;note\r\n1;Ali;"line one\nline two"\r\n2;"Sara; the ""great""";ok\r\n3;Bob\r\n4;Dan;fine;extra\r\n';
const tf = file(tricky);
const ti = await indexFile(tf);
eq('delimiter', ti.delimiter, ';');
eq('bom', ti.bom, 'utf-8');
eq('rows', ti.rows, 5);
eq('ragged', ti.ragged, 2);
eq('header', ti.header, ['id', 'name', 'note']);
eq('has header', ti.hasHeader, true);
eq('types', ti.types.slice(0, 1), ['integer']);
const read = await ti.read(1, 2);
eq('read rows', read, [['1', 'Ali', 'line one\nline two'], ['2', 'Sara; the "great"', 'ok']]);

// Block boundaries: force tiny blocks through a big file with quoted newlines everywhere.
const bigLines = ['a,b,c'];
for (let i = 0; i < 60000; i += 1) bigLines.push(`${i},"row ${i}\nmore",${i % 7 === 0 ? '' : 'x'}`);
const big = file(`${bigLines.join('\n')}\n`, 'big.csv');
const bi = await indexFile(big);
eq('big rows', bi.rows, 60001);
eq('big ragged', bi.ragged, 0);
eq('big row 45000', (await bi.read(45001, 1))[0][1], 'row 45000\nmore');

// Filter, dedupe, sort.
const data = 'id,name,score\n1,Ali,50\n2,Sara,90\n3,Bob,70\n2,Sara,90\n4,ali,10\n';
let { ctx } = await ctxFor(file(data));
const filtered = await filterRows(ctx, { predicates: [{ col: 1, op: 'equals', value: 'ali' }] });
eq('filter', await text(filtered.blob), 'id,name,score\n1,Ali,50\n4,ali,10\n');
const gt = await filterRows(ctx, { predicates: [{ col: 2, op: 'gt', value: 60 }] });
eq('filter gt', filtered.rowsOut + gt.rowsOut, 2 + 3);
({ ctx } = await ctxFor(file(data)));
const dd = await dedupe(ctx, {});
eq('dedupe', await text(dd.blob), 'id,name,score\n1,Ali,50\n2,Sara,90\n3,Bob,70\n4,ali,10\n');
eq('dedupe removed', dd.removed, 1);
const dc = await dedupe(ctx, { columns: [1], trim: true });
eq('dedupe by column', dc.rowsOut, 4); // Ali vs ali differ, Sara twice
const srt = await sortRows(ctx, { col: 2, numeric: true, desc: true });
eq('sort numeric desc', await text(srt.blob), 'id,name,score\n2,Sara,90\n2,Sara,90\n3,Bob,70\n1,Ali,50\n4,ali,10\n');
const srt2 = await sortRows(ctx, { col: 1, numeric: false });
eq('sort text stable', (await text(srt2.blob)).split('\n').slice(1, 3), ['1,Ali,50', '4,ali,10']);

// Sort across many runs (force merge path): use a small run size by sorting a larger file.
const rnd = ['k,v'];
let seed = 7;
for (let i = 0; i < 900000; i += 1) { seed = (seed * 1103515245 + 12345) % 2147483648; rnd.push(`${seed % 100000},${i}`); }
const rndFile = file(`${rnd.join('\n')}\n`, 'rnd.csv');
({ ctx } = await ctxFor(rndFile));
const rs = await sortRows(ctx, { col: 0, numeric: true });
const sortedText = await text(rs.blob);
const sortedKeys = sortedText.split('\n').slice(1, -1).map((line) => Number(line.split(',')[0]));
eq('sort rows', sortedKeys.length, 900000);
eq('sort runs used', rs.runs > 1, true);
eq('sorted ascending', sortedKeys.every((k, i) => i === 0 || sortedKeys[i - 1] <= k), true);

// Merge: same headers (fast path), different headers (union), strict refusal.
const m1 = file('a,b\n1,2\n', 'm1.csv');
const m2 = file('a,b\n3,4\n', 'm2.csv');
const m3 = file('b,c\n5,6\n', 'm3.csv');
const same = await mergeFiles([m1, m2], { mode: 'strict', tick: () => true });
eq('merge same', await text(same.blob), 'a,b\n1,2\n3,4\n');
const union = await mergeFiles([m1, m3], { mode: 'union', tick: () => true });
eq('merge union', await text(union.blob), 'a,b,c\n1,2,\n,5,6\n');
eq('merge strict refuses', (await mergeFiles([m1, m3], { mode: 'strict', tick: () => true })).error, 'HEADERS_DIFFER');

// Split by rows, by column, and zip contents.
({ ctx } = await ctxFor(file('id,team\n1,red\n2,blue\n3,red\n4,green\n5,blue\n', 'teams.csv')));
const byRows = await splitFile(ctx, { mode: 'rows', rows: 2 });
eq('split parts', byRows.parts, 3);
const unzipped = unzipSync(new Uint8Array(await byRows.blob.arrayBuffer()));
eq('split names', Object.keys(unzipped).sort(), ['teams_part_001.csv', 'teams_part_002.csv', 'teams_part_003.csv']);
eq('split content', strFromU8(unzipped['teams_part_001.csv']), 'id,team\n1,red\n2,blue\n');
const byCol = await splitFile(ctx, { mode: 'column', col: 1 });
eq('split by column', Object.keys(unzipSync(new Uint8Array(await byCol.blob.arrayBuffer()))).sort(), ['teams_blue.csv', 'teams_green.csv', 'teams_red.csv']);
const bySize = await splitFile(ctx, { mode: 'size', bytes: 30 });
eq('split by size makes several parts', bySize.parts > 1, true);

// JSON Lines and XLSX (verified by reading it back with exceljs).
({ ctx } = await ctxFor(file('id,name\n1,"A, B"\n2,Ç\n')));
eq('jsonl', await text((await toJsonLines(ctx)).blob), '{"id":"1","name":"A, B"}\n{"id":"2","name":"Ç"}\n');
const xlsxSource = 'id,name,amount,zip\n1,"Line one\nline two",12.5,00123\n2,Ç & <b>,-3,45\n';
({ ctx } = await ctxFor(file(xlsxSource)));
const xl = await toXlsx(ctx, { dataRows: 2, columns: 4 });
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(await xl.blob.arrayBuffer());
const sheet = workbook.getWorksheet(1);
eq('xlsx header', sheet.getRow(1).values.slice(1), ['id', 'name', 'amount', 'zip']);
eq('xlsx number', sheet.getRow(2).getCell(3).value, 12.5);
eq('xlsx leading zero stays text', sheet.getRow(2).getCell(4).value, '00123');
eq('xlsx newline', sheet.getRow(2).getCell(2).value, 'Line one\nline two');
eq('xlsx escaping', sheet.getRow(3).getCell(2).value, 'Ç & <b>');
eq('xlsx sheets', xl.sheets, 1);

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
