/**
 * Skill vocabulary used to find skills in a resume and to match a job
 * description. Deliberately a plain list: it is what an ATS keyword search
 * effectively does, so the tool shows the same literal-match behaviour.
 * Entries are lower-case; aliases are matched as separate whole terms.
 */
export const SKILL_GROUPS = {
  Programming: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'sql', 'bash', 'shell scripting', 'matlab', 'perl', 'dart', 'html', 'css', 'sass'],
  Frameworks: ['react', 'react native', 'angular', 'vue', 'vue.js', 'next.js', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring boot', 'spring', '.net', 'asp.net', 'rails', 'laravel', 'flutter', 'jquery', 'redux', 'graphql', 'rest api', 'restful apis', 'microservices'],
  'Data & cloud': ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'linux', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'spark', 'hadoop', 'airflow', 'snowflake', 'bigquery', 'redshift', 'dbt', 'etl', 'data warehouse', 'data modeling'],
  'Data & analytics': ['excel', 'power bi', 'tableau', 'looker', 'google analytics', 'statistics', 'regression', 'a/b testing', 'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'data visualization', 'forecasting', 'data analysis', 'dashboards', 'kpi', 'sql server'],
  'Engineering practice': ['git', 'agile', 'scrum', 'kanban', 'tdd', 'unit testing', 'code review', 'system design', 'devops', 'sre', 'jira', 'confluence', 'api design', 'object-oriented programming', 'design patterns', 'debugging', 'performance optimization', 'security'],
  'Project management': ['project management', 'program management', 'pmp', 'prince2', 'stakeholder management', 'risk management', 'budgeting', 'resource planning', 'roadmap', 'waterfall', 'change management', 'ms project', 'asana', 'trello', 'gantt', 'scope management', 'vendor management', 'requirements gathering', 'project planning', 'status reporting'],
  'Accounting & finance': ['gaap', 'ifrs', 'general ledger', 'accounts payable', 'accounts receivable', 'reconciliation', 'month-end close', 'financial reporting', 'financial statements', 'budgeting', 'forecasting', 'variance analysis', 'audit', 'internal controls', 'tax preparation', 'payroll', 'quickbooks', 'sap', 'oracle', 'netsuite', 'xero', 'cpa', 'accruals', 'cash flow', 'sox compliance', 'fixed assets', 'bookkeeping', 'invoicing'],
  Healthcare: ['patient care', 'bls', 'acls', 'pals', 'rn', 'bsn', 'epic', 'cerner', 'electronic health records', 'ehr', 'medication administration', 'iv therapy', 'triage', 'wound care', 'hipaa', 'infection control', 'telemetry', 'critical care', 'icu', 'emergency department', 'patient education', 'care plans', 'charting', 'vital signs', 'phlebotomy', 'case management', 'clinical documentation', 'patient assessment'],
  'Business & communication': ['leadership', 'communication', 'stakeholder communication', 'presentation', 'negotiation', 'problem solving', 'cross-functional', 'mentoring', 'team leadership', 'customer service', 'crm', 'salesforce', 'hubspot', 'sales', 'marketing', 'seo', 'content strategy', 'product management', 'user research', 'ux', 'figma', 'process improvement', 'lean', 'six sigma', 'operations', 'reporting', 'training', 'analysis'],
};

export const ALL_SKILLS = [...new Set(Object.values(SKILL_GROUPS).flat())];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const skillPattern = (skill) => {
  // Whole-term match: a skill must not be glued to other letters or digits
  // ("r" inside "react" must not count), and symbols such as c++ / c# / .net are literal.
  const body = escapeRegex(skill);
  return new RegExp(`(?<![a-z0-9+#.])${body}(?![a-z0-9+#])`, 'i');
};

const patternCache = new Map();
export const hasTerm = (text, term) => {
  if (!patternCache.has(term)) patternCache.set(term, skillPattern(term));
  return patternCache.get(term).test(text);
};

export const countTerm = (text, term) => {
  if (!patternCache.has(term)) patternCache.set(term, skillPattern(term));
  const pattern = new RegExp(patternCache.get(term).source, 'gi');
  return (text.match(pattern) || []).length;
};

/** Skills from the vocabulary that appear in `text`, in vocabulary order. */
export const findSkills = (text) => ALL_SKILLS.filter((skill) => hasTerm(text, skill));
