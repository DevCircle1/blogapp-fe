/** Run: node scripts/checks/resume.mjs */
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { extractResumePdf } from '../../src/lib/resume/pdfResume.js';
import { modelFromPdf, modelFromDocx } from '../../src/lib/resume/model.js';
import { runChecks, checkFileType } from '../../src/lib/resume/checks.js';
import { buildBadResume, buildGoodResume } from '../../src/lib/resume/samples.js';
import { analyseJobDescription } from '../../src/lib/resume/jd.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};
const codes = (result) => result.issues.map((i) => i.code).sort();

const run = async (bytes) => runChecks(modelFromPdf(await extractResumePdf(pdfjs, bytes)));

const good = await run(buildGoodResume());
console.log('GOOD score', good.score, codes(good));
console.log(JSON.stringify({ ...good.entities, listedSkills: undefined }, null, 1));
eq('good has no critical', good.issues.filter((i) => i.severity === 'critical').length, 0);
eq('good email', good.entities.email, 'amina.rahman@example.com');
eq('good phone', Boolean(good.entities.phone), true);
eq('good name', good.entities.name, 'Amina Rahman');
eq('good jobs', good.entities.jobs.length, 2);
eq('good job1', [good.entities.jobs[0].title, good.entities.jobs[0].company], ['Senior Software Engineer', 'Northwind Labs']);
eq('good score high', good.score >= 90, true);

const bad = await run(buildBadResume());
console.log('BAD score', bad.score, codes(bad));
console.log(bad.issues.map((i) => `${i.severity}: ${i.title}`));
eq('bad multi column', codes(bad).includes('multi_column'), true);
eq('bad heading', codes(bad).includes('nonstandard_heading'), true);
eq('bad dates', codes(bad).includes('unparseable_dates'), true);
eq('bad email', codes(bad).includes('missing_email'), true);
eq('bad score low', bad.score < 60, true);

// Extra rules on hand-built models.
eq('file type ok', checkFileType('cv.pdf'), null);
eq('file type bad', checkFileType('cv.pages').code, 'file_type');
const docx = modelFromDocx({
  html: '<h2>Work Experience</h2><p><strong>Accountant</strong> | Acme Ltd</p><p>Jan 2020 - Present</p><table><tr><td><p>x</p></td><td><p>y</p></td></tr></table><p>ana@example.com +1 555 123 4567</p><h2>Skills</h2><p>Excel, QuickBooks</p>',
  headerFooter: ['Ana Lee ana@example.com'],
});
const docxResult = runChecks(docx);
console.log('DOCX', codes(docxResult));
eq('docx table', codes(docxResult).includes('table_layout'), true);

// Job description matching.
const jd = 'We need a data analyst with strong SQL, Power BI and Tableau skills. SQL experience is essential. You will build dashboards and forecasting models. Experience with Snowflake and dbt is a plus. Dashboards are reviewed weekly.';
const match = analyseJobDescription(jd, modelFromPdf(await extractResumePdf(pdfjs, buildBadResume())), bad.found);
console.log('matched', match.matched.map((t) => t.term), 'missing', match.missing.map((t) => t.term), 'buried', match.buried.map((t) => t.term));
eq('jd matched sql', match.matched.some((t) => t.term === 'sql'), true);
eq('jd missing snowflake', match.missing.some((t) => t.term === 'snowflake'), true);

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
