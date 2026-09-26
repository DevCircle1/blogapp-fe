export default {
  slug: 'how-to-make-resume-ats-friendly',
  title: 'How to Make Your Resume ATS-Friendly: 2026 Checklist',
  category: 'technology',
  theme: 'career',
  tags: ['ats resume checker', 'ats friendly resume', 'resume keywords', 'applicant tracking system', 'resume format', 'job application tips'],
  description: 'Make your resume ATS-friendly: a single-column layout, standard headings, a text-based file, and keywords matched to the job description. A checklist that works.',
  cover: {
    kicker: 'Get parsed correctly, then get found',
    visual: { type: 'checklist', items: ['Single-column layout', 'Standard headings', 'Text-based PDF or DOCX', 'Keywords from the ad', 'Consistent dates'] },
  },
  infographic: {
    type: 'steps',
    title: 'The ATS-friendly resume checklist',
    subtitle: 'Parsing problems first (can the system read you?), then relevance (will a recruiter’s search find you?).',
    items: [
      ['Use one column and no text boxes', 'Tables, columns and floating shapes can scramble the reading order when parsed.'],
      ['Keep contact details in the body', 'Some parsers skip headers and footers, losing your email and phone number.'],
      ['Use standard section headings', 'Experience, Education, Skills. Creative labels may not be mapped to the right fields.'],
      ['Submit a text-based PDF or DOCX', 'If you cannot select the text in your PDF, the ATS cannot read it either.'],
      ['Mirror the job ad’s keywords', 'Use the exact skill names and job titles, with both acronym and full form.'],
      ['Format dates consistently', '“Mar 2023 – Present” or “03/2023 – Present” throughout, never mixed.'],
    ],
    alt: 'Six-item checklist for an ATS-friendly resume covering layout, contact details, headings, file type, keywords and date format',
    caption: 'Run the finished file through a parser test to see exactly what the ATS extracts.',
    footer: 'Check your resume: talkandtool.com/tools/ats-resume-checker',
  },
  html: `
<p>To make your resume ATS-friendly, use a single-column layout with standard section headings, save it as a text-based PDF or DOCX, keep contact details out of headers and footers, and use the exact skills and job titles from the job description. Formatting decides whether the system can read your resume. Keywords decide whether a recruiter finds it. Here is the full checklist.</p>

<h2>What an ATS actually does</h2>
<p>An applicant tracking system, such as Workday, Greenhouse, Lever, iCIMS or Taleo, is the database employers use to manage applications. When you apply, it <strong>parses</strong> your resume into structured fields: name, contact details, job titles, employers, dates, education and skills. Recruiters then <strong>search and filter</strong> those fields, and some systems rank applicants against the job.</p>
<p>Two things can go wrong. The parser can misread your resume, putting your job title in the company field or losing a whole section. Or it reads you perfectly, but your resume does not contain the terms the recruiter searches for. The checklist fixes both.</p>

<h2>The checklist</h2>

{{infographic}}

<h2>Formatting: make sure you get parsed correctly</h2>
<h3>Layout</h3>
<p>Two-column designs look great to humans and are the most common cause of parsing errors. The parser may read across both columns line by line, mixing your skills into your job history. A single column, with a clear heading and entries in reverse chronological order, is the safest layout. Designed templates with sidebars, icons for contact details and skill bars are high-risk.</p>
<h3>Headings</h3>
<p>Use conventional names: <strong>Summary, Experience</strong> (or Work Experience), <strong>Education, Skills, Certifications, Projects</strong>. "Where I've Made an Impact" is memorable but may not be recognised as the experience section.</p>
<h3>File type</h3>
<p>Both DOCX and PDF are widely supported. The condition for PDF is that it must contain real text, not an image. A resume exported from Canva as an image, or a scanned page, is unreadable to most parsers. Quick test: open the PDF and try to select a sentence. If the application says which format it prefers, use that one.</p>
<h3>Fonts and characters</h3>
<p>Standard fonts like Arial, Calibri or Georgia and simple bullet points avoid encoding problems. Avoid putting key information only in images, charts or icons.</p>

<h2>Keywords: make sure you get found</h2>
<p>Recruiters search the ATS for specific skills, tools, certifications and job titles. If the job ad says "stakeholder management" and your resume says "worked with various teams", you will not match the search, even though you have the experience.</p>
<ol>
<li><strong>Collect the terms.</strong> Copy the job description and note every hard skill, tool, qualification and title, especially those in the requirements section or repeated in the ad.</li>
<li><strong>Match the wording.</strong> Use the ad's exact phrasing where it is true for you. Include both forms of acronyms: "Search Engine Optimization (SEO)", "Certified Public Accountant (CPA)".</li>
<li><strong>Show them in context.</strong> A skills list helps searches, but the same keywords in your experience bullets, with results, convince the human who reads it next.</li>
<li><strong>Tailor per application.</strong> A resume matched to one ad will not match the next. Keep a master version and adjust the summary, skills and top bullets for each role.</li>
</ol>
<p>The <a href="/tools/resume-keyword-scanner">resume keyword scanner</a> compares your resume with a job description and lists the missing terms. For role-specific guidance, there are dedicated checkers for <a href="/tools/ats-resume-checker/software-engineer">software engineers</a>, <a href="/tools/ats-resume-checker/data-analyst">data analysts</a>, <a href="/tools/ats-resume-checker/accountant">accountants</a>, <a href="/tools/ats-resume-checker/nurse">nurses</a> and <a href="/tools/ats-resume-checker/project-manager">project managers</a>.</p>

<h2>Don't keyword-stuff</h2>
<p>Pasting the job description in white text, or listing 60 skills you have touched once, is easy to spot. A human reads every resume that gets shortlisted, and hidden text looks dishonest the moment someone copies your resume into another program. Include the keywords you can back up in an interview.</p>

<h2>A myth worth dropping</h2>
<p>You may have read that "75% of resumes are rejected by ATS before a human sees them". The figure is widely repeated, but it has no published research behind it. In most organisations the ATS does not reject resumes by itself. It organises and ranks them, and humans filter. Knockout questions, such as work authorisation or a required licence, are the main automatic rejections. The practical goal is not to "beat the robot" but to be read accurately and show up in searches.</p>

<h2>Test before you apply</h2>
<ul>
<li>Run your resume through the <a href="/tools/ats-resume-checker">ATS resume checker</a> for formatting and structure issues.</li>
<li>Use the <a href="/tools/resume-parser-test">resume parser test</a> to see the plain text an ATS would extract. If a section is missing or jumbled there, it is missing for the employer too.</li>
<li>Not sure about your template? <a href="/tools/is-my-resume-ats-friendly">Is my resume ATS-friendly?</a> flags columns, tables, images and header problems.</li>
</ul>
<p>All of these run in your browser, so your resume is not uploaded anywhere.</p>

<h2>Frequently asked questions</h2>
<h3>Is PDF or Word better for ATS?</h3>
<p>Most modern systems handle both well. A text-based PDF preserves your layout. DOCX is the safest choice for older systems. Follow the employer's stated preference if there is one.</p>
<h3>Can an ATS read two-column resumes?</h3>
<p>Some can, many do so unreliably. A single column removes the risk entirely, so it is the recommended choice.</p>
<h3>How many keywords should a resume have?</h3>
<p>There is no target number. Cover the must-have skills and tools in the job ad that you genuinely have, using the ad's wording, and back them up in your experience bullets.</p>
`,
};
