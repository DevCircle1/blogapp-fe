/**
 * Two fictional sample resumes built as real PDFs, so "try a sample" runs the
 * same worker and checks as an uploaded file. One is a clean single-column
 * resume; the other has the classic ATS-hostile layout: a sidebar, a creative
 * heading, a table-like skills grid and loose dates.
 */

const esc = (text) => text.replace(/[\\()]/g, (c) => `\\${c}`);

/** pages: [[{ x, top, text, size?, bold? }]] with `top` measured from the top of an A4 page. */
function buildPdf(pages) {
  const objects = [];
  const add = (body) => { objects.push(body); return objects.length; };
  add('<< /Type /Catalog /Pages 2 0 R >>');
  const kids = pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ');
  add(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`);
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  pages.forEach((ops, index) => {
    const stream = ops.map(({
      x, top, text, size = 10, bold = false,
    }) => `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${(842 - top).toFixed(1)} Td (${esc(text)}) Tj ET`).join('\n');
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${5 + index * 2 + 1} 0 R >>`);
    add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => { pdf += `${String(o).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}

const lines = (x, start, step, items, size = 10) => items.map((text, i) => ({
  x, top: start + i * step, text, size,
}));

export function buildGoodResume() {
  const ops = [
    { x: 50, top: 60, text: 'Amina Rahman', size: 20, bold: true },
    { x: 50, top: 80, text: 'Lahore, Pakistan | amina.rahman@example.com | +92 300 1234567 | linkedin.com/in/aminarahman', size: 9 },
    { x: 50, top: 115, text: 'SUMMARY', size: 12, bold: true },
    ...lines(50, 132, 13, ['Software engineer with 6 years of experience building web applications in JavaScript,', 'React and Node.js. Led a team of four and cut page load time by 40 percent.']),
    { x: 50, top: 180, text: 'WORK EXPERIENCE', size: 12, bold: true },
    { x: 50, top: 198, text: 'Senior Software Engineer | Northwind Labs', size: 10, bold: true },
    { x: 430, top: 198, text: 'Mar 2021 - Present', size: 10 },
    ...lines(58, 214, 13, ['- Built a React and TypeScript dashboard used by 20,000 customers.', '- Designed REST APIs in Node.js and PostgreSQL; reduced latency by 35 percent.', '- Introduced CI/CD with GitHub Actions and Docker across five services.']),
    { x: 50, top: 268, text: 'Software Engineer | Contoso Software', size: 10, bold: true },
    { x: 430, top: 268, text: 'Jun 2018 - Feb 2021', size: 10 },
    ...lines(58, 284, 13, ['- Developed features in JavaScript and Python for an e-commerce platform.', '- Wrote unit tests and led code reviews; mentored two junior developers.', '- Migrated a monolith to microservices, improving deployment frequency from monthly to weekly.']),
    { x: 50, top: 350, text: 'EDUCATION', size: 12, bold: true },
    { x: 50, top: 368, text: 'BSc Computer Science, University of Engineering and Technology', size: 10 },
    { x: 430, top: 368, text: '2018', size: 10 },
    { x: 50, top: 410, text: 'SKILLS', size: 12, bold: true },
    ...lines(50, 428, 13, ['JavaScript, TypeScript, React, Node.js, Python, SQL, PostgreSQL, Docker, AWS, Git, Agile']),
    { x: 50, top: 460, text: 'CERTIFICATIONS', size: 12, bold: true },
    ...lines(50, 478, 13, ['AWS Certified Developer - Associate, 2022', 'Scrum Master Certified (CSM), 2020']),
  ];
  return buildPdf([ops]);
}

export function buildBadResume() {
  const left = [
    { x: 40, top: 70, text: 'CONTACT', size: 11, bold: true },
    ...lines(40, 88, 13, ['ali.khan@gmail', '0300-1234567', 'Karachi']),
    { x: 40, top: 150, text: 'TOOLKIT', size: 11, bold: true },
    ...lines(40, 168, 13, ['Excel', 'Power BI', 'SQL', 'Tableau', 'Python']),
  ];
  const right = [
    { x: 210, top: 60, text: 'Ali Khan', size: 22, bold: true },
    { x: 210, top: 100, text: 'CAREER JOURNEY', size: 12, bold: true },
    { x: 210, top: 120, text: 'Data Analyst at Acme Analytics', size: 10, bold: true },
    { x: 210, top: 134, text: 'Summer 2021 - Present', size: 10 },
    ...lines(215, 152, 13, ['- Built dashboards in Power BI and Tableau for finance leadership.', '- Automated monthly reporting with SQL and Python, saving ten hours a week.']),
    { x: 210, top: 200, text: 'Business Analyst at Globex', size: 10, bold: true },
    { x: 210, top: 214, text: "'18 - '21", size: 10 },
    ...lines(215, 232, 13, ['- Gathered requirements and produced weekly KPI reports for operations.', '- Cleaned and modelled data in Excel and SQL Server.']),
    { x: 210, top: 285, text: 'ACADEMICS', size: 12, bold: true },
    { x: 210, top: 303, text: 'BBA, Institute of Business Administration', size: 10 },
  ];
  // A skills grid in the lower half: aligned columns, three per row.
  const grid = [];
  ['Excel|Power BI|SQL', 'Tableau|Python|R', 'Looker|dbt|Git', 'Statistics|Forecasting|Reporting'].forEach((row, i) => {
    row.split('|').forEach((cell, c) => grid.push({ x: 210 + c * 110, top: 350 + i * 14, text: cell, size: 10 }));
  });
  return buildPdf([[...left, ...right, ...grid]]);
}
