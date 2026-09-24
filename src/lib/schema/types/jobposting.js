import {
  checkbox, country, currency, date, datetime, group, multiselect, number, prune, select, text, textarea, url, numeric,
} from '../core.js';

const EMPLOYMENT = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN', 'VOLUNTEER', 'PER_DIEM', 'OTHER'];

export default {
  slug: 'job-posting',
  pageSlug: 'job-posting-schema-generator',
  name: 'JobPosting',
  label: 'Job Posting',
  previewKind: 'job',
  status: {
    richResult: 'eligible',
    googleNotes: 'JobPosting markup makes a job eligible for Google’s job search experience. Google requires a title, description, posting date, hiring organization and job location (or, for remote jobs, applicant location requirements).',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/job-posting',
    verifiedOn: '2026-09-24',
  },
  fields: [
    text('title', 'Job title', { required: true, placeholder: 'Senior Accountant', help: 'The position only: no company, location, dates or job codes.' }),
    textarea('description', 'Job description', { required: true, help: 'Responsibilities, qualifications, skills and hours. Basic HTML (p, br, ul, li) is allowed.' }),
    date('datePosted', 'Date posted', { required: true, placeholder: '2026-09-01' }),
    datetime('validThrough', 'Valid through', { recommended: true, tzRecommended: true, placeholder: '2026-10-31T23:59:00+05:00', help: 'Required if the job has an expiry date.' }),
    multiselect('employmentType', 'Employment type', { options: EMPLOYMENT, recommended: true }),
    group('org', 'Hiring organization', [
      text('name', 'Company name', { placeholder: 'Example Ltd' }),
      url('sameAs', 'Company website', { placeholder: 'https://example.com' }),
      url('logo', 'Logo URL'),
    ], { required: true }),
    checkbox('remote', 'This job is 100% remote'),
    group('address', 'Job location', [
      text('streetAddress', 'Street address'),
      text('addressLocality', 'City', { placeholder: 'Karachi' }),
      text('addressRegion', 'State or region', { placeholder: 'Sindh' }),
      text('postalCode', 'Postal code'),
      country('addressCountry', 'Country code', { placeholder: 'PK' }),
    ], { help: 'Where the work is done. Optional for fully remote jobs.', showIf: (v) => !v.remote }),
    text('applicantCountry', 'Applicant location requirement (country code)', { placeholder: 'PK', help: 'For remote jobs: the country applicants must be in.', showIf: (v) => v.remote }),
    group('salary', 'Base salary', [
      currency('currency', 'Currency', { placeholder: 'PKR' }),
      number('min', 'Minimum'),
      number('max', 'Maximum'),
      select('unit', 'Per', { options: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] }),
    ], { recommended: true, help: 'Only an actual salary from the employer, not a market estimate.' }),
    text('identifier', 'Job ID', { help: 'Your internal reference for the job.' }),
    checkbox('directApply', 'Candidates can apply directly on this page'),
  ],
  check: (v) => {
    const issues = [];
    const a = v.address || {};
    if (!v.remote) {
      if (!a.addressCountry) issues.push({ level: 'error', path: 'address.addressCountry', message: 'Job location needs at least a country code, unless the job is 100% remote.' });
      if (a.addressCountry && !(a.addressLocality || a.addressRegion)) issues.push({ level: 'warning', path: 'address.addressLocality', message: 'Add a city or region: a country alone is too vague for job search.' });
    } else if (!v.applicantCountry) {
      issues.push({ level: 'error', path: 'applicantCountry', message: 'A fully remote job needs at least one country in applicantLocationRequirements.' });
    }
    if (v.applicantCountry && !/^[A-Z]{2}$/.test(v.applicantCountry)) issues.push({ level: 'error', path: 'applicantCountry', message: 'Applicant country should be a two-letter ISO 3166-1 code such as PK.' });
    const s = v.salary || {};
    if ((s.min || s.max) && !(s.currency && s.unit)) issues.push({ level: 'error', path: 'salary.currency', message: 'A salary needs a currency and a unit (per hour, month, year…).' });
    if (s.min && s.max && Number(s.max) < Number(s.min)) issues.push({ level: 'error', path: 'salary.max', message: 'The maximum salary is below the minimum.' });
    if (v.description && v.title && v.description.trim() === v.title.trim()) issues.push({ level: 'error', path: 'description', message: 'The description cannot just repeat the title.' });
    return issues;
  },
  build: (v) => {
    const s = v.salary || {};
    const salaryValue = s.min || s.max ? { '@type': 'QuantitativeValue', ...(s.min && s.max && s.min !== s.max ? { minValue: numeric(s.min), maxValue: numeric(s.max) } : { value: numeric(s.min || s.max) }), unitText: s.unit } : undefined;
    return prune({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: v.title,
      description: v.description,
      datePosted: v.datePosted,
      validThrough: v.validThrough,
      employmentType: v.employmentType && v.employmentType.length ? (v.employmentType.length === 1 ? v.employmentType[0] : v.employmentType) : undefined,
      hiringOrganization: { '@type': 'Organization', ...(v.org || {}) },
      jobLocation: !v.remote ? { '@type': 'Place', address: { '@type': 'PostalAddress', ...(v.address || {}) } } : undefined,
      jobLocationType: v.remote ? 'TELECOMMUTE' : undefined,
      applicantLocationRequirements: v.remote && v.applicantCountry ? { '@type': 'Country', name: v.applicantCountry } : undefined,
      baseSalary: salaryValue ? { '@type': 'MonetaryAmount', currency: s.currency, value: salaryValue } : undefined,
      identifier: v.identifier ? { '@type': 'PropertyValue', name: v.org?.name, value: v.identifier } : undefined,
      directApply: v.directApply ? true : undefined,
    });
  },
  example: {
    title: 'Senior Accountant',
    description: '<p>We are looking for a Senior Accountant to lead our month-end close.</p><ul><li>Prepare financial statements under IFRS</li><li>Manage accounts payable and receivable</li><li>Support the annual audit</li></ul><p>Requirements: ACCA or CA qualification and 5+ years of experience.</p>',
    datePosted: '2026-09-01',
    validThrough: '2026-10-31T23:59:00+05:00',
    employmentType: ['FULL_TIME'],
    org: { name: 'Example Ltd', sameAs: 'https://example.com', logo: 'https://example.com/logo.png' },
    remote: false,
    address: {
      streetAddress: '45 Shahrah-e-Faisal', addressLocality: 'Karachi', addressRegion: 'Sindh', postalCode: '75350', addressCountry: 'PK',
    },
    salary: {
      currency: 'PKR', min: '300000', max: '400000', unit: 'MONTH',
    },
    identifier: 'ACC-2026-014',
    directApply: true,
  },
  copy: {
    keyword: 'job posting schema generator',
    lead: 'This job posting schema generator builds valid JobPosting JSON-LD for Google’s job search: title, description, posting date, hiring organization, location or remote requirements, employment type and salary, with each field checked as you type.',
    tableIntro: 'Google requires five properties for job postings — title, description, date posted, hiring organization and job location — and recommends an expiry date, employment type, salary and, for remote jobs, applicant location requirements.',
    mistakes: [
      'Putting the company, location or dates in the job title. The title should be the position only, such as “Senior Accountant”.',
      'A description that only repeats the title. It must describe the job: responsibilities, qualifications, skills and hours.',
      'Leaving validThrough off a job that has a closing date. If the posting expires, you must say when, and you should remove the markup or update it when the job is filled.',
      'Marking a remote job with a location but no applicant location requirement. Fully remote jobs use jobLocationType TELECOMMUTE and at least one country in applicantLocationRequirements.',
      'Adding estimated salaries. baseSalary should be the actual pay the employer offers, not a market estimate.',
      'Lower-case or made-up employment types. Values are case-sensitive: FULL_TIME, PART_TIME, CONTRACTOR, TEMPORARY, INTERN, VOLUNTEER, PER_DIEM or OTHER.',
      'Keeping markup on pages for jobs that are no longer open.',
    ],
    notes: [
      'JobPosting markup is how a job listing gets into Google’s job search experience, where candidates can filter by location, type and date. It is one of the most tightly specified types, and Google’s job guidelines are strict: the description must match the page, expired jobs must be removed or marked with an expiry date, and the salary must be real.',
      'If you run a job board or publish your own vacancies, the markup lives on the page for each individual job, not on a list of jobs. This generator produces the JSON-LD for one job at a time.',
    ],
    example: 'A full-time accountant role in Karachi with a monthly salary range, an expiry date and direct apply, as generated on this page, is shown below.',
    faqs: [
      { q: 'Which properties are required for JobPosting schema?', a: 'A title, a description, a date posted, a hiring organization and a job location. For a 100% remote job, applicant location requirements are required instead of a physical location.' },
      { q: 'How do I mark up a remote job?', a: 'Set jobLocationType to TELECOMMUTE, add at least one country in applicantLocationRequirements, and make sure the description states that the job is remote.' },
      { q: 'How do I show a salary range?', a: 'Use baseSalary with a currency and a QuantitativeValue holding minValue and maxValue and a unitText such as MONTH or YEAR. Only use real pay figures from the employer.' },
      { q: 'What happens when the job is filled?', a: 'Remove the markup or the page, or set validThrough to a past date. Google expects expired jobs not to be presented as open.' },
      { q: 'Can I use JobPosting markup on a page listing many jobs?', a: 'No. Put it on the page of each individual job. A list page should link to the individual jobs.' },
    ],
  },
};
