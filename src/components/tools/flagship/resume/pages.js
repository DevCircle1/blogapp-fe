export const ATS_PATH = '/tools/ats-resume-checker';
export const KEYWORD_PATH = '/tools/resume-keyword-scanner';
export const PARSER_PATH = '/tools/resume-parser-test';
export const FRIENDLY_PATH = '/tools/is-my-resume-ats-friendly';

const META = 'See exactly what an ATS extracts from your resume. Full results free, no sign-up, no paywall. Your file never leaves your browser.';

const RELATED = [
  { to: '/job-alert', label: 'Job Alerts', description: 'Get new openings by email once your resume is ready.' },
  { to: '/tools/word-counter', label: 'Word Counter', description: 'Check the length of your summary and bullets.' },
  { to: '/tools/seo-title-meta-checker', label: 'Title & Meta Checker', description: 'Tighten the wording of headlines and descriptions.' },
];

const SIBLINGS = [
  { to: ATS_PATH, label: 'Free ATS resume checker' },
  { to: KEYWORD_PATH, label: 'Resume keyword scanner' },
  { to: PARSER_PATH, label: 'Resume parser test' },
  { to: FRIENDLY_PATH, label: 'Is my resume ATS friendly?' },
];

const CHECK_TABLE = [
  'Multi-column layout — 15 points',
  'Text only in images (no readable text) — up to 60 points',
  'Tables or grid layouts — 8 points',
  'Contact details only in a header or footer — 8 points',
  'Unrecognised section headings — 4 points each, up to 12',
  'No Experience section found — 12 points; no Education or Skills — 6 points each',
  'Dates in a non-standard format — 8 points',
  'Garbled text from a font encoding problem — 25 points',
  'No email — 20 points; no phone — 8 points',
  'Very little text — 10 points; a page count over two for under ten years of experience — 5 points',
];

const FAQS = [
  { q: 'Is this ATS resume checker really free, with no sign-up?', a: 'Yes. You get the full result — score, every issue, the fixes and the parsed output — without an account, a trial or a locked teaser. The site is funded by advertising.' },
  { q: 'Is my resume uploaded to a server?', a: 'No. The file is read by code running in your browser and is never sent anywhere. The site records only an anonymous count of checks with the file type, page count, the codes of the issues found and the score — never your text, name or contact details.' },
  { q: 'Which applicant tracking system does this simulate?', a: 'None in particular, and it does not claim to. It shows what a typical resume parser can and cannot extract, and flags the structural problems — columns, tables, images, unusual headings — that are known to cause trouble across many systems. Real products such as Workday, Greenhouse or Taleo each behave a little differently.' },
  { q: 'What does the score mean?', a: 'It starts at 100 and loses the points shown next to each issue, so you can see exactly how it was calculated. It measures how likely your file is to be read correctly, not how good your career is or whether you will get an interview.' },
  { q: 'Does an ATS automatically reject resumes?', a: 'Mostly no. Most systems parse a resume into a searchable profile that a recruiter then searches and reads. A badly parsed resume is rarely rejected outright; it is more often unfindable, or shows up with missing jobs and dates.' },
  { q: 'Should I add keywords from the job description?', a: 'Only ones that describe experience you genuinely have. The job description tab shows which terms from a posting appear in your resume, which are missing and which are buried, so you can bring real experience forward. Adding skills you lack, or hiding keywords in white text, is dishonest and easily detected.' },
];

const common = {
  category: 'Career · Resume',
  applicationCategory: 'BusinessApplication',
  description: META,
  related: RELATED,
  siblingsHeading: 'Resume tools',
};

const HOW_ATS = {
  heading: 'How an ATS actually reads your resume',
  paragraphs: [
    'An applicant tracking system does not read a resume the way a person does. It converts the file to plain text, tries to split that text into fields — name, contact details, jobs with titles and dates, education, skills — and stores the result as a searchable profile. Recruiters then search that profile by keyword, title or years of experience. Everything depends on the first step, the conversion, and on the parser correctly guessing which line is a job title and which is a date.',
    'That is why layout matters more than most advice admits. A parser reads the text in the order it appears in the file, usually top to bottom and left to right. A two-column resume can be read straight across, mixing a sidebar with the main column. A table can be flattened or dropped. Text drawn as an image does not exist as text at all. A creative heading such as “Career Journey” may not be recognised as Experience.',
  ],
};

const WHAT_IT_DOES_NOT = {
  heading: 'What an ATS does and does not do',
  paragraphs: [
    'Contrary to a popular belief, most systems do not automatically reject a resume for a low “score”. Many have no score at all, and where a ranking exists it usually depends on the recruiter’s own search. The real risk is quieter: a resume that parses badly shows up with missing jobs, wrong dates or no email, so it cannot be found or contacted.',
    'This is also why the numeric “ATS score” shown by many resume tools is largely arbitrary. There is no single ATS and no universal score, so a precise-looking figure with hidden weights is little more than a guess. This checker reports concrete, verifiable structural problems instead, and shows the points each one costs.',
  ],
};

const SCORE_SECTION = {
  heading: 'How the score is calculated',
  paragraphs: ['The score starts at 100 and each issue removes the points listed here. Nothing is hidden or weighted behind the scenes.'],
  list: CHECK_TABLE,
};

const atsMain = {
  ...common,
  path: ATS_PATH,
  toolId: 'ats-resume-checker',
  slug: 'ats-resume-checker',
  title: 'Free ATS Resume Checker — Full Results, No Sign-Up',
  h1: 'Free ATS Resume Checker',
  crumb: 'ATS Resume Checker',
  appName: 'Free ATS Resume Checker',
  lead: 'This free ATS resume checker shows you what an applicant tracking system actually extracts from your resume — your name, contact details, jobs, education and skills — and flags every structural reason the parse could fail. Full results, no sign-up, and your file never leaves your browser.',
  sections: [
    HOW_ATS,
    WHAT_IT_DOES_NOT,
    {
      heading: 'What this ATS resume checker looks for',
      list: [
        'Multi-column layouts and sidebars that make text read out of order.',
        'Pages that are images with no readable text.',
        'Tables and grids that get flattened or dropped.',
        'Email and phone placed only in a page header or footer.',
        'Section headings a parser will not recognise.',
        'Dates in formats a parser cannot read.',
        'Fonts that produce garbled text when extracted.',
        'A missing email or phone number, and unusual page counts.',
      ],
    },
    SCORE_SECTION,
    {
      heading: 'Read the parsed output, not just the score',
      paragraphs: ['The most useful part is the “What an ATS extracts” tab. It puts your resume’s text in reading order beside the fields a parser pulled out. A blank job title, a missing email or a scrambled skills list is immediately obvious in a way a score never is. It is an approximation of a typical parser, not a copy of any vendor’s.'],
    },
  ],
  steps: [
    'Drop your resume (PDF or DOCX) onto the box, or try a sample.',
    'Read the verdict and open each issue for the explanation and the fix.',
    'Open “What an ATS extracts” and check the parsed fields are right.',
    'Optionally paste a job description on the last tab to see which terms you match.',
    'Fix the file, drop the new version in to re-check it, and download the report if you want a copy.',
  ],
  faqs: FAQS,
  siblings: SIBLINGS.slice(1),
  disclaimer: 'This tool checks how machine-readable a resume is. It is not a simulation of any specific ATS and cannot predict whether you will be shortlisted.',
};

const keywordPage = {
  ...common,
  path: KEYWORD_PATH,
  toolId: 'resume-keyword-scanner',
  slug: 'resume-keyword-scanner',
  title: 'Resume Keyword Scanner — Match Your Resume to a Job',
  h1: 'Resume Keyword Scanner',
  crumb: 'Resume Keyword Scanner',
  appName: 'Resume Keyword Scanner',
  lead: 'This resume keyword scanner compares your resume with a job description and shows which of the posting’s skills and phrases you already cover, which are missing and which are buried. It runs entirely in your browser, and it is designed to help you surface real experience, not to add keywords you do not have.',
  sections: [
    {
      heading: 'How the resume keyword scanner matches your resume',
      paragraphs: [
        'Recruiters and applicant tracking systems find candidates largely by searching for terms. The scanner does the same in reverse: it pulls the skills and repeated phrases out of the job description, then looks for each of them in your resume as a literal term, allowing for simple plurals. The result is three lists — matched, missing and buried.',
        '“Buried” is the useful middle category. It means the term does appear, but only once, in the body of a bullet, and not in your skills section or opening lines. If you genuinely have that experience, the fix is to say so where a keyword search will look: in the skills list, the summary or a job title.',
      ],
    },
    {
      heading: 'Use the gap list honestly',
      list: [
        'A missing term is a prompt to ask “do I really have this experience?” — not a to-do list of words to add.',
        'If you do, add it with a real example: what you did, with which tool, and with what result.',
        'If you do not, leave it out. Interviews test claims, and a keyword you cannot discuss costs more than it gains.',
        'Never hide keywords in white or tiny text. Systems flag it and a human reading the resume will notice.',
      ],
    },
    SCORE_SECTION,
    {
      heading: 'Limits of a keyword match',
      paragraphs: ['A literal match cannot understand meaning: “managed a team of six” will not match “people management”. Treat the lists as a prompt to review the posting against your experience, and read the job description yourself for what it really asks.'],
    },
  ],
  steps: [
    'Drop your resume onto the box, then open the “Job description match” tab.',
    'Paste the full job posting into the box.',
    'Review the matched, buried and missing lists.',
    'Where you genuinely have the experience, bring it forward in your skills or summary and re-check.',
  ],
  faqs: [
    { q: 'How do I match my resume to a job description?', a: 'Compare the skills and phrases the posting repeats with your resume, and make sure the ones you genuinely have are visible in your skills section, summary or job titles. This scanner automates the comparison.' },
    { q: 'How many keywords should match?', a: 'There is no magic number. Cover the requirements you truly meet, in the posting’s own wording where it is accurate, and do not chase a 100% match.' },
    { q: 'Does the scanner work for any job?', a: 'It recognises a built-in vocabulary of common technical, business, finance and healthcare skills and also picks up phrases repeated in the posting, so it works for most professional roles, though very specialised jargon may be missed.' },
    FAQS[1],
    FAQS[5],
  ],
  siblings: SIBLINGS.filter((s) => s.to !== KEYWORD_PATH),
  disclaimer: 'A keyword match is a prompt to review your resume against a posting, not a prediction of whether you will be shortlisted.',
};

const parserPage = {
  ...common,
  path: PARSER_PATH,
  toolId: 'resume-parser-test',
  slug: 'resume-parser-test',
  title: 'Resume Parser Test — See What an ATS Extracts',
  h1: 'Resume Parser Test',
  crumb: 'Resume Parser Test',
  appName: 'Resume Parser Test',
  lead: 'This resume parser test shows the literal fields a parser can extract from your resume — name, email, phone, each job with title, company and dates, education and skills — next to your resume in reading order, with anything it could not find marked in red. Your file stays in your browser.',
  sections: [
    {
      heading: 'What a resume parser test shows you',
      paragraphs: [
        'A score tells you something is wrong; a parsed profile shows you what. The parser test lays out your resume’s text in the order a simple parser reads it, then lists the fields extracted from it. If your name is missing, a job has no title, your dates are blank or your skills are jumbled, you see it immediately and can trace it to the cause: a column, a table, a heading or a date format.',
        'Fields that are empty or wrong are highlighted and labelled “an ATS may not find this”, which is the point where a recruiter’s search would fail to find you.',
      ],
    },
    {
      heading: 'What the parser looks for',
      list: [
        'Name — usually the first short line without digits or symbols.',
        'Email, phone and LinkedIn address — found anywhere in the text.',
        'Jobs — a title, a company and a date range, usually on the same line or the lines around a date.',
        'Education — a degree name and an institution.',
        'Skills — terms from a built-in vocabulary found anywhere in the resume.',
      ],
    },
    {
      heading: 'An approximation, not any vendor’s parser',
      paragraphs: ['Real parsers use different rules and often machine learning, so results differ between systems. This test uses simple, transparent rules so failures are easy to understand. If something is extracted correctly here, it is a good sign; if it fails here, it is likely to fail somewhere.'],
    },
    SCORE_SECTION,
  ],
  steps: [
    'Drop your resume onto the box.',
    'Open the “What an ATS extracts” tab.',
    'Compare the reading-order text with the extracted fields, looking for red labels.',
    'Fix the cause in the source document, export again and re-test.',
  ],
  faqs: [
    { q: 'What is a resume parser?', a: 'Software that converts a resume file into structured data — name, contact details, employment history, education and skills — so it can be stored and searched by an applicant tracking system.' },
    { q: 'Why is my job title blank in the parsed output?', a: 'Usually the title and company share a line in an unusual format, the date is on a separate line, or a column or table has separated them. Put title, company and dates on consecutive lines in a plain layout.' },
    { q: 'Is this the same parser Workday or Greenhouse uses?', a: 'No. It is an independent, simplified parser meant to expose common failures. It does not simulate any specific vendor.' },
    FAQS[1],
    FAQS[3],
  ],
  siblings: SIBLINGS.filter((s) => s.to !== PARSER_PATH),
  disclaimer: 'The parsed output is an approximation of a typical resume parser and does not simulate any specific applicant tracking system.',
};

const friendlyPage = {
  ...common,
  path: FRIENDLY_PATH,
  toolId: 'is-my-resume-ats-friendly',
  slug: 'is-my-resume-ats-friendly',
  primaryKeyword: 'resume ats friendly',
  title: 'Is My Resume ATS Friendly? Free Instant Check',
  h1: 'Is My Resume ATS Friendly?',
  crumb: 'Is My Resume ATS Friendly?',
  appName: 'ATS Friendly Resume Check',
  lead: 'Is my resume ATS friendly? Drop in your resume and get a plain yes, mostly or no, with every reason listed and how to fix it. The check runs in your browser, so your resume is never uploaded.',
  sections: [
    {
      heading: 'What makes a resume ATS friendly',
      paragraphs: [
        'A resume is ATS friendly when a system can turn it into plain text in the right order and recognise its parts. In practice that means a single column, standard section headings, real text rather than images, dates in a common format, and contact details in the body of the page. A resume that follows those rules is readable by nearly every system, and it is also easier for a person to skim.',
      ],
    },
    {
      heading: 'The quick checklist',
      list: [
        'One column, no sidebars, text boxes or tables.',
        'Standard headings: Summary, Experience, Education, Skills.',
        'Email and phone as text at the top of the first page.',
        'Dates like “Jan 2021 – Mar 2023” or “2021 – 2023”.',
        'A standard font, exported as a PDF or DOCX with real text.',
        'No text or skill ratings drawn as images.',
      ],
    },
    {
      heading: 'PDF or Word?',
      paragraphs: ['Both are accepted by most systems, provided the PDF contains real text rather than a scan. A DOCX has one extra risk: text placed in the Word header or footer may be skipped, so keep contact details in the page body. If a posting says which format it wants, use that.'],
    },
    SCORE_SECTION,
  ],
  steps: [
    'Drop your resume (PDF or DOCX) onto the box.',
    'Read the verdict at the top: friendly, mostly friendly or not yet.',
    'Open the issues for the reason and the fix, then re-check the new file.',
  ],
  faqs: [
    { q: 'Is my resume ATS friendly if it looks good?', a: 'Not necessarily. Design that helps a human — columns, icons, graphics, coloured sidebars — is often what hurts machine reading. Check the file, not how it looks.' },
    { q: 'Do I need a plain, boring resume?', a: 'No. A single-column layout can still be attractive: use good typography, spacing and a restrained colour for headings. It just avoids structures that break parsing.' },
    FAQS[0],
    FAQS[2],
    FAQS[4],
  ],
  siblings: SIBLINGS.filter((s) => s.to !== FRIENDLY_PATH),
  disclaimer: 'A friendly verdict means the file is likely to be read correctly. It does not predict whether you will be shortlisted.',
};

/* ------------------------------------------------------------- role pages */

export const ROLES = {
  'software-engineer': {
    name: 'Software Engineer',
    plural: 'Software Engineers',
    titles: ['Software Engineer', 'Software Developer', 'Backend Engineer', 'Frontend Engineer', 'Full-Stack Developer', 'Senior Software Engineer'],
    keywords: ['javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'ci/cd', 'rest api', 'microservices', 'agile', 'unit testing', 'system design'],
    credentials: ['AWS Certified Developer – Associate', 'AWS Certified Solutions Architect – Associate', 'Certified Kubernetes Application Developer (CKAD)', 'Google Cloud Associate Cloud Engineer'],
    intro: 'Recruiters searching for software engineers filter mainly on languages, frameworks and cloud tools, so the words in your skills section carry unusual weight. Write technologies the way job postings do: “JavaScript”, “Node.js”, “PostgreSQL”, “CI/CD”, and include a variant such as “React” alongside “React.js” only if you genuinely use both terms. Skill-bar graphics and logos are invisible to a parser, so list every technology as plain text.',
    order: 'Contact and links at the top, a short summary, a technical skills section, then experience with outcomes in numbers (latency, users, deployment frequency), then projects, education and certifications.',
    tips: ['Put your GitHub or portfolio URL in the body as visible text.', 'Group skills by type — languages, frameworks, cloud, tools — as a comma-separated list, not a table.', 'Show scale in each bullet: users, requests per second, cost or time saved.'],
  },
  accountant: {
    name: 'Accountant',
    plural: 'Accountants',
    titles: ['Accountant', 'Staff Accountant', 'Senior Accountant', 'Financial Accountant', 'Accounts Payable Specialist', 'Accounting Manager'],
    keywords: ['gaap', 'ifrs', 'general ledger', 'accounts payable', 'accounts receivable', 'reconciliation', 'month-end close', 'financial reporting', 'variance analysis', 'audit', 'internal controls', 'quickbooks', 'sap', 'excel', 'cpa', 'payroll', 'tax preparation'],
    credentials: ['CPA (Certified Public Accountant)', 'ACCA', 'CMA (Certified Management Accountant)', 'Chartered Accountant (CA)'],
    intro: 'Accounting resumes are searched for frameworks, ledgers and software, and for credentials, so a recruiter’s filter is often as simple as “CPA and NetSuite”. Spell out the standard you work to (GAAP or IFRS), the processes you own (month-end close, reconciliations, accounts payable) and the systems you use. Credentials are frequently used as hard filters, so put yours in a clearly labelled section and also next to your name if it is a formal designation.',
    order: 'Contact, a two-line summary, a skills section that names the accounting standards and software, experience with volumes and results (invoices processed, close time cut, audit findings cleared), then education and credentials.',
    tips: ['Quantify: transactions, entities, budget size, days to close.', 'Name the accounting systems exactly as they appear in postings.', 'List professional credentials in full, with the awarding body and year.'],
  },
  nurse: {
    name: 'Nurse',
    plural: 'Nurses',
    titles: ['Registered Nurse (RN)', 'Staff Nurse', 'ICU Nurse', 'Emergency Room Nurse', 'Charge Nurse', 'Clinical Nurse'],
    keywords: ['patient care', 'bls', 'acls', 'ehr', 'epic', 'cerner', 'medication administration', 'iv therapy', 'triage', 'hipaa', 'infection control', 'telemetry', 'critical care', 'care plans', 'charting', 'patient education'],
    credentials: ['RN licence (state or national board, with number and expiry)', 'BLS (Basic Life Support)', 'ACLS (Advanced Cardiovascular Life Support)', 'PALS (Pediatric Advanced Life Support)'],
    intro: 'Healthcare recruiters screen first on licence, certifications and clinical setting, so these should be unmistakable and near the top rather than on page two. State your licence type and jurisdiction, the unit you have worked in (ICU, emergency, medical-surgical), your patient ratios where relevant and the electronic health record systems you have used. Clinical acronyms are searched exactly as written, so use the standard forms — BLS, ACLS, EHR — and spell them out once.',
    order: 'Contact, licences and certifications immediately after the summary, then clinical experience by setting with ratios and outcomes, then education and continuing training.',
    tips: ['Put licence number, state or board and expiry where a recruiter can see it.', 'Name each EHR system (Epic, Cerner) explicitly.', 'Describe the unit and typical patient ratio, not just duties.'],
  },
  'project-manager': {
    name: 'Project Manager',
    plural: 'Project Managers',
    titles: ['Project Manager', 'Senior Project Manager', 'Program Manager', 'IT Project Manager', 'Technical Project Manager', 'Scrum Master'],
    keywords: ['project management', 'pmp', 'agile', 'scrum', 'stakeholder management', 'risk management', 'budgeting', 'roadmap', 'resource planning', 'jira', 'ms project', 'change management', 'requirements gathering', 'vendor management', 'status reporting'],
    credentials: ['PMP (Project Management Professional)', 'PRINCE2 Foundation or Practitioner', 'Certified ScrumMaster (CSM)', 'PMI-ACP'],
    intro: 'Project management postings are filled with method names and certifications, and recruiters search on them literally: PMP, Agile, Scrum, PRINCE2. Show the size of what you have run — budget, team size, duration and number of stakeholders — because that is how hiring managers judge seniority, and keep methodology terms spelled the standard way. State the tools you have used, such as Jira or MS Project, as plain text.',
    order: 'Contact, a summary that states the type and scale of projects, skills and certifications, experience with budget, team size and delivery results per role, then education.',
    tips: ['Lead each role with the scale: budget, team, timeline.', 'Say whether you delivered with Agile, waterfall or a hybrid.', 'List certifications with the full name and the year obtained.'],
  },
  'data-analyst': {
    name: 'Data Analyst',
    plural: 'Data Analysts',
    titles: ['Data Analyst', 'Business Analyst', 'Business Intelligence Analyst', 'Reporting Analyst', 'Analytics Analyst', 'Senior Data Analyst'],
    keywords: ['sql', 'excel', 'python', 'tableau', 'power bi', 'statistics', 'data visualization', 'dashboards', 'etl', 'a/b testing', 'looker', 'data modeling', 'kpi', 'pandas', 'forecasting', 'google analytics'],
    credentials: ['Microsoft Certified: Power BI Data Analyst Associate', 'Google Data Analytics Professional Certificate', 'Tableau Desktop Specialist', 'AWS Certified Data Engineer – Associate'],
    intro: 'Data analyst postings are short lists of tools, so keyword matching decides most first-pass searches: SQL, Excel, Python, Tableau or Power BI. Name the tools you use, the type of analysis (forecasting, cohort analysis, A/B testing) and the business outcome each one drove. A bullet that says “built dashboards” is far weaker than “built Power BI dashboards used weekly by finance leadership, cutting reporting time by ten hours”.',
    order: 'Contact, a summary naming your domain, a skills section split into query languages, analysis tools and visualisation tools, experience with measurable impact, then projects, education and certificates.',
    tips: ['List SQL dialects or databases you have used.', 'Tie every analysis to a decision or a number.', 'Link a portfolio or dashboard as visible text.'],
  },
};

const rolePage = (slug, role) => ({
  ...common,
  path: `${ATS_PATH}/${slug}`,
  toolId: 'ats-resume-checker',
  slug: `ats-resume-checker/${slug}`,
  roleSlug: slug,
  title: `ATS Resume Checker for ${role.name} — Free Scan`,
  h1: `ATS Resume Checker for ${role.plural}`,
  crumb: `ATS resume checker for ${role.name.toLowerCase()}`,
  parent: { name: 'ATS Resume Checker', path: ATS_PATH },
  appName: `ATS Resume Checker for ${role.plural}`,
  lead: `This ATS resume checker for ${role.name.toLowerCase()} roles shows what an applicant tracking system extracts from your resume, flags structural problems, and checks it for the keywords ${role.name.toLowerCase()} postings most often ask for. Full results are free, and your file never leaves your browser.`,
  sections: [
    { heading: `ATS resume checker for ${role.name.toLowerCase()} roles: what recruiters scan for`, paragraphs: [role.intro] },
    {
      heading: `${role.name} keywords the checker looks for`,
      paragraphs: ['Upload your resume and open “Job description match” to see which of these appear, which are only mentioned once and which are absent. Only list the ones that describe experience you actually have.'],
      list: role.keywords.map((keyword) => keyword),
    },
    { heading: `Common ${role.name.toLowerCase()} job titles`, list: role.titles },
    { heading: `Credentials to state clearly`, list: role.credentials },
    { heading: `How to lay out a ${role.name.toLowerCase()} resume`, paragraphs: [role.order], list: role.tips },
    SCORE_SECTION,
  ],
  steps: atsMain.steps,
  faqs: [
    { q: `What keywords should a ${role.name.toLowerCase()} resume include?`, a: `The most common in postings are ${role.keywords.slice(0, 8).join(', ')}. Include those that describe your real experience, in the same wording postings use.` },
    { q: `Is my ${role.name.toLowerCase()} resume ATS friendly?`, a: 'Drop it in above. The check looks at layout, headings, dates, contact details and text extraction, and tells you exactly what to fix.' },
    FAQS[1],
    FAQS[2],
    FAQS[5],
  ],
  siblings: [{ to: ATS_PATH, label: 'ATS resume checker (all roles)' }, ...Object.entries(ROLES).filter(([other]) => other !== slug).map(([other, r]) => ({ to: `${ATS_PATH}/${other}`, label: `ATS resume checker for ${r.name.toLowerCase()}` }))],
  siblingsHeading: 'Other role checkers',
  disclaimer: 'Keyword lists are typical of postings for the role, not a guarantee of what any employer will ask for. Include only skills you genuinely have.',
});

export const RESUME_PAGES = [
  { ...atsMain, siblings: [...SIBLINGS.slice(1), ...Object.entries(ROLES).map(([slug, role]) => ({ to: `${ATS_PATH}/${slug}`, label: `For ${role.plural.toLowerCase()}` }))] },
  keywordPage,
  parserPage,
  friendlyPage,
  ...Object.entries(ROLES).map(([slug, role]) => rolePage(slug, role)),
];

export const RESUME_VIEW_BY_PATH = {
  [ATS_PATH]: 'checker', [KEYWORD_PATH]: 'keywords', [PARSER_PATH]: 'parser', [FRIENDLY_PATH]: 'checker',
};
