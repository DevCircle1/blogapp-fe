export default {
  slug: 'resume-keyword-scanner-match-job-description',
  title: 'Resume Keyword Scanner: Match Your CV to a Job Description',
  category: 'technology',
  theme: 'career',
  tags: ['resume keyword scanner', 'resume keywords', 'job description keywords', 'ats keywords', 'match resume to job description', 'cv keywords'],
  description: 'How to find the keywords in a job posting, check which ones your resume is missing, and add them honestly, without stuffing. A worked example and a placement checklist.',
  cover: {
    kicker: 'Find the gaps before a recruiter does',
    visual: { type: 'stat', value: '3 of 6', label: 'job-posting keywords found in the resume', note: 'the other three are gaps to review, where true' },
  },
  infographic: {
    type: 'table',
    title: 'From job posting to resume: a worked example',
    subtitle: 'A data analyst posting compared with a resume. Add a gap only if it is true for you.',
    columns: ['Keyword in the posting', 'On the resume?', 'What to do'],
    widths: [330, 210, 516],
    rows: [
      ['SQL', 'Yes', 'Keep it in Skills and name it in a bullet'],
      ['Tableau', 'Yes', 'Fine, add a result next to it'],
      ['Power BI', 'No', 'Add if you have used it; otherwise leave it out'],
      ['A/B testing', 'Partly ("experiments")', 'Use the posting wording: "A/B testing"'],
      ['Stakeholder reporting', 'No', 'Rephrase a real bullet that fits'],
      ['Python', 'Yes', 'Mention libraries you actually used'],
    ],
    alt: 'Table comparing job posting keywords with a resume, showing which are present, which are missing, and what to do about each',
    caption: 'Use the posting\'s own words for things you really did.',
    footer: 'Scan yours: talkandtool.com/tools/resume-keyword-scanner',
  },
  html: `
<p>A resume keyword scanner compares the text of a job posting with the text of your resume and lists the skills, tools and phrases the posting uses that your resume does not. The point is not to game anything. Recruiters and applicant tracking systems search resumes for the words in the job posting, so a resume that describes the same experience in different words can be missed.</p>

<h2>What keywords actually do in hiring</h2>
<p>Many people believe an ATS automatically scores and rejects resumes. In practice, most systems store the resume as searchable text, and recruiters search it with the terms from the role. Some systems rank or filter, others do not. Either way the same rule applies: if the exact term a recruiter types is not on your resume, a search will not find you. Formatting matters too, because a parser that cannot read your file cannot index it. Our guide to an <a href="/blogs/article/how-to-make-resume-ats-friendly">ATS-friendly resume</a> covers layout, and the <a href="/tools/ats-resume-checker">ATS resume checker</a> tests whether a file parses correctly.</p>

{{infographic}}

<h2>Step 1: pull the keywords out of the job posting</h2>
<p>Read the posting once, and mark words in four groups:</p>
<ul>
<li><strong>Job titles:</strong> "Data Analyst", "Senior Accountant". Match the title if it honestly describes what you did.</li>
<li><strong>Hard skills and tools:</strong> SQL, Excel, Salesforce, Figma, AutoCAD.</li>
<li><strong>Methods and domain terms:</strong> A/B testing, month-end close, patient triage, GDPR.</li>
<li><strong>Qualifications:</strong> degrees, licences and certifications, written the way the posting writes them.</li>
</ul>
<p>Words that appear several times, or in the "requirements" section rather than "nice to have", matter most. Skip generic phrases such as "team player" and "fast-paced", which every posting has and no recruiter searches for.</p>

<h2>Step 2: scan your resume against them</h2>
<p>Paste both texts into the <a href="/tools/resume-keyword-scanner">resume keyword scanner</a>. It shows which terms from the posting appear in your resume, which are missing, and which appear only once or buried at the bottom. Everything runs in your browser, so neither the posting nor your resume is uploaded. You can do the same check by hand with a two-column list, but a scanner is faster and catches variants.</p>

<h2>Step 3: close the gaps, honestly</h2>
<p>For each missing keyword, ask one question: <em>did I do this?</em></p>
<ul>
<li><strong>Yes, in different words.</strong> Use the posting's wording. If you wrote "ran experiments" and the posting says "A/B testing", and that is what you did, say A/B testing.</li>
<li><strong>Yes, but it is not on the resume.</strong> Add it to a bullet that shows the result, not just to the skills list.</li>
<li><strong>No.</strong> Leave it out. Claiming a skill you cannot back up in an interview costs more than the missing keyword does.</li>
</ul>

<h2>Where keywords belong on the page</h2>
<ul>
<li><strong>Headline or summary:</strong> the role title and the two or three most important skills.</li>
<li><strong>Skills section:</strong> a clean list of tools and methods, separated by commas, readable as plain text.</li>
<li><strong>Experience bullets:</strong> the strongest place, because a keyword next to a result proves you used it. "Built Tableau dashboards that cut weekly reporting time by 6 hours" beats "Tableau" alone.</li>
<li><strong>Certifications and education:</strong> spelled out the way the posting spells them.</li>
</ul>

<h2>Acronyms, synonyms and exact phrases</h2>
<p>Write both forms once: "Search Engine Optimization (SEO)", "Applicant Tracking System (ATS)". A recruiter may search either. Keep tool names exactly as the vendor writes them, such as "Power BI" and "JavaScript". Do not replace a plain term with a fancy synonym, because the search will be for the plain one.</p>

<h2>What keyword stuffing looks like, and why to avoid it</h2>
<p>Repeating a term ten times, hiding white text on a white background, or pasting the whole posting at the bottom of the file is easy for software to flag and obvious to any human. A keyword needs to appear naturally one to three times, each time in a different part of the resume. If a bullet reads worse after you added a keyword, rewrite the bullet.</p>

<h2>A quick checklist before you submit</h2>
<ol>
<li>The job title and top five skills from the posting appear on your resume.</li>
<li>Each added keyword is something you can talk about for two minutes.</li>
<li>Acronyms are written in both forms once.</li>
<li>The file is a text-based PDF or DOCX that parses cleanly.</li>
<li>You tailored the resume for this posting, not just the generic one.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>How many keywords should my resume include?</h3>
<p>There is no magic number. Cover the required skills and tools in the posting that are true for you, which for most roles is eight to fifteen terms, each used naturally.</p>
<h3>Do I need a different resume for every job?</h3>
<p>You need a different version of the keywords and the top third of the page. The facts about your experience stay the same.</p>
<h3>Does the scanner tell me my chances of getting hired?</h3>
<p>No. It shows overlap between two texts. Whether that overlap is enough depends on the employer, the competition and the rest of your experience.</p>
<h3>Is it safe to paste my resume into an online tool?</h3>
<p>Check how the tool handles data. The scanner on this site compares the text locally in your browser and does not upload it.</p>
`,
};
