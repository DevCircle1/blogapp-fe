/** Run: node scripts/checks/gsc.mjs */
import { parseGscCsv } from '../../src/lib/seo/gscData.js';
import {
  findCannibalization, findDecay, findLowCtr, findStrikingDistance, guessBrandTerms, normalizeUrl,
} from '../../src/lib/seo/analysis.js';
import {
  SAMPLE_PAGES_CURRENT, SAMPLE_PAGES_PREVIOUS, SAMPLE_QUERIES, SAMPLE_QUERY_PAGE,
} from '../../src/lib/seo/sampleData.js';
import { expectedCtr } from '../../src/lib/seo/ctrCurve.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};

// Header detection across export languages and formats.
const en = parseGscCsv('Top queries,Clicks,Impressions,CTR,Position\nseo tools,10,200,5%,7.5\n', 'Queries.csv');
eq('en kind', en.kind, 'queries');
eq('en row', [en.rows[0].clicks, en.rows[0].ctr, en.rows[0].position], [10, 0.05, 7.5]);
const de = parseGscCsv('Häufigste Seiten;Klicks;Impressionen;CTR;Position\nhttps://a.de/x;5;100;5,0 %;8,3\n', 'Seiten.csv');
eq('de kind', de.kind, 'pages');
eq('de row', [de.rows[0].clicks, de.rows[0].ctr, de.rows[0].position], [5, 0.05, 8.3]);
const es = parseGscCsv('Consultas principales,Clics,Impresiones,CTR,Posición\nhola,3,60,5%,9\n', 'c.csv');
eq('es kind', es.kind, 'queries');
const qp = parseGscCsv('Query,Page,Clicks,Impressions,CTR,Position\na,https://x.com/a,1,10,10%,3\n', 'qp.csv');
eq('qp kind', qp.kind, 'queryPage');
const cmp = parseGscCsv('Top pages,Last 3 months Clicks,Previous 3 months Clicks,Last 3 months Impressions,Previous 3 months Impressions,Last 3 months CTR,Previous 3 months CTR,Last 3 months Position,Previous 3 months Position\nhttps://x.com/a,50,100,1000,1200,5%,8.3%,6,5\n', 'c.csv');
eq('compare prev', [cmp.rows[0].clicks, cmp.rows[0].prev.clicks, cmp.rows[0].prev.position], [50, 100, 5]);
eq('junk', parseGscCsv('a,b\n1,2\n'), null);

eq('url norm', normalizeUrl('http://www.Example.com/a/?x=1#y'), normalizeUrl('https://example.com/a'));
eq('ctr monotone', expectedCtr(1) > expectedCtr(5) && expectedCtr(5) > expectedCtr(10) && expectedCtr(10) > expectedCtr(20), true);

const brand = guessBrandTerms(SAMPLE_QUERY_PAGE);
eq('brand', brand, ['example']);
const can = findCannibalization(SAMPLE_QUERY_PAGE, { brandTerms: brand });
console.log(can.map((i) => `${i.query} lost≈${i.potentialClicksLost} ${i.action}${i.branded ? ' (brand)' : ''}`));
eq('cannibal queries', can.map((i) => i.query).sort(), ['example seo tool', 'keyword research guide', 'keyword research tips']);
eq('token share not flagged', can.some((i) => i.query === 'seo checklist'), false);
eq('brand flagged as brand', can.find((i) => i.query === 'example seo tool').branded, true);
eq('consolidate', can.find((i) => i.query === 'keyword research guide').action, 'consolidate');

const decay = findDecay(SAMPLE_PAGES_CURRENT, SAMPLE_PAGES_PREVIOUS);
console.log(decay.map((d) => `${d.label.replace('https://example.com', '')} ${d.clicksDelta} ${d.cause}`));
const causes = (list) => Object.entries(list).sort(([a], [b]) => a.localeCompare(b));
eq('decay causes', causes(Object.fromEntries(decay.map((d) => [d.label.replace('https://example.com', ''), d.cause]))), causes({
  '/blog/keyword-research': 'lost_rankings',
  '/blog/old-guide': 'lost_all',
  '/tools/page-speed': 'lost_all',
  '/blog/robots-txt': 'lost_rankings',
  '/blog/canonical-urls': 'lost_ctr_stable_position',
  '/blog/meta-descriptions': 'lost_ctr_stable_position',
}));

const strike = findStrikingDistance(SAMPLE_QUERIES);
console.log(strike.map((s) => `${s.query} ${s.opportunity}`));
eq('striking top', strike[0].query, 'how to write meta descriptions');
const low = findLowCtr(SAMPLE_QUERIES);
console.log(low.map((s) => `${s.label} missed ${s.missedClicks}`));
eq('low ctr has canonical', low.some((x) => x.label === 'what is a canonical url'), true);
eq('zero click flagged', low.find((x) => x.label === 'page speed test').zero, true);
console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
