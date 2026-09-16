import { useMemo, useState } from 'react';
import {
  Button, CopyButton, Field, Grid, Label, LabelledField, Panel, Segmented, Select, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { msg, useExtras, useT } from '../../../i18n/i18n.js';

const clean = (value) => value.trim().replace(/\s+/g, ' ');
const unique = (items) => [...new Set(items.map(clean).filter(Boolean))];

/* Canonical ids, doubling as the English labels; listed so the translation checker sees them all. */
const INTENT_IDS = [msg('Informational'), msg('Commercial'), msg('Transactional'), msg('Local'), msg('Navigational')];
const SPECIFIC = msg('Specific');
const AMBIGUOUS = msg('Ambiguous');
const ALL = msg('All');
const LONG_TAIL_GROUP_IDS = [msg('Questions'), msg('Problems'), msg('Commercial'), msg('Content')];
const INTENT_PAGES = {
  Local: msg('Local landing page'),
  Transactional: msg('Product or service page'),
  Commercial: msg('Comparison or review page'),
  Informational: msg('Guide or answer page'),
  Navigational: msg('Brand or destination page'),
};
const INSPECT = msg('Inspect live results');
const CONFIDENCE = { High: msg('High'), Medium: msg('Medium'), Low: msg('Low') };

/**
 * The English keyword language. Keyword templates and intent signals only
 * work in the language the searcher types, so every language version
 * supplies its own through the `seo` extras in src/i18n/ui/<lang>.js.
 */
const EN = {
  // First match wins, so order runs from the most specific signal.
  quickPatterns: [
    ['Local', /\b(near me|local)\b|\bin [a-z]/i],
    ['Transactional', /\b(buy|price|pricing|coupon|deal|hire|service)\b/i],
    ['Commercial', /\b(best|top|review|vs|versus|alternative|compare)\b/i],
    ['Informational', /\b(how|what|why|when|guide|ideas|examples|checklist|tips)\b/i],
  ],
  intentPatterns: {
    Local: /\b(near me|nearby|local|open now|directions|in [a-z][a-z\s]+)\b/i,
    Transactional: /\b(buy|book|download|coupon|discount|deal|hire|order|price|pricing|quote|service|subscribe)\b/i,
    Commercial: /\b(best|top|review|reviews|vs|versus|alternative|compare|comparison|recommended)\b/i,
    Informational: /\b(how|what|why|when|where|who|guide|tutorial|ideas|examples|checklist|tips|meaning)\b/i,
    Navigational: /\b(login|sign in|official|website|dashboard|support|contact)\b/i,
  },
  opportunity: {
    question: /^(how|what|why|when|where|can|is|are)\b/i,
    qualifier: /\b(for|with|without|under|near|in|on a budget|step by step)\b/i,
    competitive: /\b(best|software|insurance|loan|lawyer|casino|crypto)\b/i,
  },
  keywordIdeas: ({ seed, audience, location }) => {
    const audienceSuffix = audience ? ` for ${audience}` : '';
    const locationSuffix = location ? ` in ${location}` : '';
    return [
      `how to choose ${seed}${audienceSuffix}`,
      `how to use ${seed}${audienceSuffix}`,
      `${seed} for beginners${locationSuffix}`,
      `${seed}${audienceSuffix} on a budget`,
      `${seed}${audienceSuffix} without experience`,
      `${seed}${audienceSuffix} step by step`,
      `best ${seed}${audienceSuffix}`,
      `affordable ${seed}${locationSuffix}`,
      `${seed} alternatives${audienceSuffix}`,
      `${seed} vs doing it yourself`,
      `${seed} checklist${audienceSuffix}`,
      `${seed} examples${audienceSuffix}`,
      `${seed} mistakes to avoid${audienceSuffix}`,
      `${seed} tips${audienceSuffix}`,
      `is ${seed} worth it${audienceSuffix}`,
      `how much does ${seed} cost${locationSuffix}`,
      `where to find ${seed}${locationSuffix}`,
      `${seed} near me`,
      `${seed}${locationSuffix}${audienceSuffix}`,
      `what to look for in ${seed}${audienceSuffix}`,
    ];
  },
  audienceSuffix: (audience) => ` for ${audience}`,
  longTail: {
    Questions: (seed, audience) => [`how to start ${seed}`, `how does ${seed} work`, `what is the best ${seed}${audience}`, `why use ${seed}${audience}`, `can I do ${seed} myself`, `${seed} mistakes to avoid`, `${seed} step by step`],
    Problems: (seed, audience) => [`${seed} without spending too much`, `${seed} without experience`, `${seed} for a small budget`, `easy ${seed}${audience}`, `${seed} when nothing else works`, `common ${seed} problems`, `how to improve ${seed}`],
    Commercial: (seed, audience) => [`best ${seed}${audience}`, `affordable ${seed}${audience}`, `${seed} pricing for beginners`, `${seed} reviews and comparisons`, `${seed} alternatives`, `${seed} features to look for`, `is ${seed} worth it`],
    Content: (seed, audience) => [`${seed} checklist${audience}`, `${seed} examples${audience}`, `${seed} template${audience}`, `${seed} ideas${audience}`, `${seed} guide${audience}`, `${seed} tips${audience}`, `${seed} case study${audience}`],
  },
  locationIdeas: (topic, location) => [`${topic} in ${location}`, `best ${topic} near ${location}`, `how much does ${topic} cost in ${location}`],
  clusterStopWords: ['a', 'an', 'and', 'are', 'best', 'for', 'from', 'how', 'in', 'is', 'of', 'on', 'the', 'to', 'what', 'with'],
  defaultReader: 'people researching this topic',
  brief: ({ topic, reader, intent, depth, sentenceCase }) => {
    const optionalSections = depth === 'Quick' ? [] : [`- Common ${topic} mistakes and how to avoid them`, `- ${sentenceCase(topic)} examples and practical use cases`];
    if (depth === 'Comprehensive') optionalSections.push(`- How to compare ${topic} options`, `- Advanced ${topic} tips`, '- Next steps and useful resources');
    const angle = intent === 'Commercial' ? `Help ${reader} compare options and choose confidently.` : intent === 'Transactional' ? `Help ${reader} take the next step with clear requirements and expectations.` : `Give ${reader} a complete, practical answer without unnecessary filler.`;
    return [
      `SEO CONTENT BRIEF: ${sentenceCase(topic)}`,
      '', `Primary keyword: ${topic}`, `Audience: ${reader}`, `Search intent: ${intent}`, `Content depth: ${depth}`, `Recommended angle: ${angle}`,
      '', 'TITLE OPTIONS', `- ${sentenceCase(topic)}: A Practical Guide`, `- How to Get Started With ${sentenceCase(topic)}`, `- ${sentenceCase(topic)} Explained: Steps, Tips, and Mistakes`,
      '', 'PROPOSED OUTLINE', `- What is ${topic}?`, `- Who is ${topic} for?`, `- How ${topic} works`, `- How to get started with ${topic}`, ...optionalSections, `- Frequently asked questions about ${topic}`,
      '', 'QUESTIONS TO ANSWER', `- How much does ${topic} cost?`, `- How long does ${topic} take?`, `- What do beginners need to know about ${topic}?`, `- What are the alternatives to ${topic}?`,
      '', 'ON-PAGE CHECKLIST', '- Match the title and introduction to one clear intent.', '- Add first-hand examples, original data, or expert evidence.', '- Use the keyword naturally; do not target a density percentage.', '- Link to relevant supporting pages and one logical next step.', '- Write a unique title, description, and concise URL slug.', '- Verify facts and update time-sensitive details before publishing.',
    ].join('\n');
  },
};

const useSeoLanguage = () => {
  const { seo } = useExtras();
  return useMemo(() => {
    const language = seo ? { ...EN, ...seo } : EN;
    return { ...language, stopWordSet: new Set(language.clusterStopWords) };
  }, [seo]);
};

const quickIntent = (keyword, patterns) => patterns.find(([, pattern]) => pattern.test(keyword))?.[0] || SPECIFIC;

const opportunityFor = (keyword, seed, signals) => {
  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const seedWords = new Set(seed.toLowerCase().split(/\s+/).filter(Boolean));
  const extraWords = words.filter((word) => !seedWords.has(word)).length;
  let score = 18 + Math.min(words.length, 8) * 5 + Math.min(extraWords, 5) * 4;
  if (signals.question.test(keyword)) score += 7;
  if (signals.qualifier.test(keyword)) score += 6;
  if (signals.competitive.test(keyword)) score -= 8;
  return Math.max(20, Math.min(94, score));
};

const makeKeywordIdeas = (language, seedValue, audienceValue, locationValue) => {
  const seed = clean(seedValue).toLowerCase();
  const audience = clean(audienceValue).toLowerCase();
  const location = clean(locationValue).toLowerCase();
  if (!seed) return [];
  return unique(language.keywordIdeas({ seed, audience, location }))
    .map((keyword) => ({ keyword, intent: quickIntent(keyword, language.quickPatterns), score: opportunityFor(keyword, seed, language.opportunity) }))
    .sort((a, b) => b.score - a.score || a.keyword.localeCompare(b.keyword));
};

export function LowCompetitionKeywordFinder() {
  const t = useT();
  const language = useSeoLanguage();
  const [seed, setSeed] = useState('');
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState('');
  const [intent, setIntent] = useState(ALL);
  const [generated, setGenerated] = useState(false);
  const ideas = useMemo(() => makeKeywordIdeas(language, seed, audience, location), [language, seed, audience, location]);
  const shown = ideas.filter((item) => intent === ALL || item.intent === intent);
  const output = shown.map((item) => `${item.keyword}\t${item.score}\t${t(item.intent)}`).join('\n');

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField id="kw-seed" label={t('Seed topic')} value={seed} onChange={(event) => { setSeed(event.target.value); setGenerated(false); }} placeholder={t('e.g. email marketing')} />
        <LabelledField id="kw-audience" label={t('Audience')} hint={t('optional')} value={audience} onChange={(event) => setAudience(event.target.value)} placeholder={t('e.g. dentists')} />
        <LabelledField id="kw-location" label={t('Location')} hint={t('optional')} value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t('e.g. Karachi')} />
      </Grid>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => setGenerated(true)} disabled={!clean(seed)}>{t('Find keyword opportunities')}</Button>
        {generated && (
          <Select value={intent} onChange={(event) => setIntent(event.target.value)} className="w-auto" aria-label={t('Filter by search intent')}>
            {[ALL, 'Informational', 'Commercial', 'Transactional', 'Local', SPECIFIC].map((item) => <option key={item} value={item}>{t(item)}</option>)}
          </Select>
        )}
      </div>
      {generated && (
        <>
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-100">
            {t('Opportunity scores estimate specificity only. Verify search demand and inspect the live results before creating content.')}
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3">{t('Keyword idea')}</th><th className="p-3">{t('Intent')}</th><th className="p-3">{t('Opportunity')}</th></tr></thead>
              <tbody>{shown.map((item) => (
                <tr key={item.keyword} className="border-t border-white/5">
                  <td className="p-3 font-medium text-white">{item.keyword}</td>
                  <td className="p-3 text-slate-400">{t(item.intent)}</td>
                  <td className="p-3"><span className={`rounded-full px-2.5 py-1 font-bold ${item.score >= 75 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-indigo-400/10 text-indigo-300'}`}>{item.score}/100</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="mt-4"><CopyButton value={output} label={t('Copy keyword list')} /></div>
        </>
      )}
    </>
  );
}

export function LongTailKeywordGenerator() {
  const t = useT();
  const language = useSeoLanguage();
  const [seed, setSeed] = useState('');
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState('');
  const [enabled, setEnabled] = useState(LONG_TAIL_GROUP_IDS);
  const audienceSuffix = clean(audience) ? language.audienceSuffix(clean(audience).toLowerCase()) : '';
  const ideas = useMemo(() => {
    const topic = clean(seed).toLowerCase();
    if (!topic) return [];
    const base = enabled.flatMap((group) => language.longTail[group](topic, audienceSuffix));
    if (clean(location)) base.push(...language.locationIdeas(topic, clean(location).toLowerCase()));
    return unique(base);
  }, [seed, audienceSuffix, location, enabled, language]);
  const toggleGroup = (group) => setEnabled((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField id="lt-seed" label={t('Seed topic')} value={seed} onChange={(event) => setSeed(event.target.value)} placeholder={t('e.g. home workout')} />
        <LabelledField id="lt-audience" label={t('Audience')} hint={t('optional')} value={audience} onChange={(event) => setAudience(event.target.value)} placeholder={t('e.g. busy parents')} />
        <LabelledField id="lt-location" label={t('Location')} hint={t('optional')} value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t('e.g. Lahore')} />
      </Grid>
      <div className="mt-5 flex flex-wrap gap-2">{LONG_TAIL_GROUP_IDS.map((group) => <Toggle key={group} checked={enabled.includes(group)} onChange={() => toggleGroup(group)} label={t(group)} />)}</div>
      <StatGrid columns="md:grid-cols-2"><Stat label={t('Ideas generated')} value={ideas.length} accent="emerald" /><Stat label={t('Intent groups')} value={enabled.length} accent="cyan" /></StatGrid>
      <Label htmlFor="lt-output">{t('Generated keyword ideas')}</Label>
      <TextArea id="lt-output" className="mt-2 min-h-72" value={ideas.join('\n')} readOnly placeholder={t('Enter a seed topic to generate long-tail ideas.')} />
      <div className="mt-4"><CopyButton value={ideas.join('\n')} label={t('Copy all ideas')} /></div>
    </>
  );
}

const CLUSTER_THRESHOLDS = { broad: 0.34, balanced: 0.5, strict: 0.67 };
// Unicode-aware, so "información" and "Größe" count as whole words.
const termsOf = (keyword, stopWords) => new Set(keyword.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter((word) => !stopWords.has(word)) || []);
const similarity = (left, right, stopWords) => {
  const a = termsOf(left, stopWords);
  const b = termsOf(right, stopWords);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / Math.max(1, Math.min(a.size, b.size));
};

const clusterKeywords = (keywords, threshold, stopWords) => {
  const clusters = [];
  keywords.forEach((keyword) => {
    let best = null;
    let bestScore = 0;
    clusters.forEach((cluster) => {
      const score = Math.max(...cluster.items.map((item) => similarity(keyword, item, stopWords)));
      if (score > bestScore) { best = cluster; bestScore = score; }
    });
    if (best && bestScore >= threshold) best.items.push(keyword);
    else clusters.push({ items: [keyword] });
  });
  return clusters.sort((a, b) => b.items.length - a.items.length);
};

export function KeywordClusteringTool() {
  const t = useT();
  const { stopWordSet } = useSeoLanguage();
  const [input, setInput] = useState('');
  const [strictness, setStrictness] = useState('balanced');
  const [minSize, setMinSize] = useState('2');
  const keywords = useMemo(() => unique(input.split(/\r?\n/)), [input]);
  const clusters = useMemo(() => clusterKeywords(keywords, CLUSTER_THRESHOLDS[strictness], stopWordSet), [keywords, strictness, stopWordSet]);
  const grouped = clusters.filter((cluster) => cluster.items.length >= Number(minSize));
  const ungrouped = clusters.filter((cluster) => cluster.items.length < Number(minSize)).flatMap((cluster) => cluster.items);
  const output = grouped.map((cluster, index) => `${t('Cluster {n}', { n: index + 1 })}\n${cluster.items.join('\n')}`).join('\n\n') + (ungrouped.length ? `\n\n${t('Ungrouped')}\n${ungrouped.join('\n')}` : '');

  return (
    <>
      <Label htmlFor="cluster-input">{t('Keywords')} <span className="text-slate-500">{t('(one per line)')}</span></Label>
      <TextArea id="cluster-input" className="mt-2 min-h-52" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('email marketing for dentists\ndentist email marketing ideas\nbest newsletter software for dentists')} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Segmented ariaLabel={t('Clustering strictness')} value={strictness} onChange={setStrictness} options={[{ value: 'broad', label: t('Broad') }, { value: 'balanced', label: t('Balanced') }, { value: 'strict', label: t('Strict') }]} />
        <label className="flex items-center gap-2 text-sm text-slate-400">{t('Minimum cluster size')} <Field type="number" min="2" max="10" value={minSize} onChange={(event) => setMinSize(event.target.value)} className="w-20 py-2" /></label>
      </div>
      <StatGrid columns="md:grid-cols-3"><Stat label={t('Unique keywords')} value={keywords.length} /><Stat label={t('Suggested clusters')} value={grouped.length} accent="emerald" /><Stat label={t('Needs review')} value={ungrouped.length} accent="cyan" /></StatGrid>
      {grouped.length > 0 && <div className="mt-6 grid gap-4 md:grid-cols-2">{grouped.map((cluster, index) => (
        <Panel key={cluster.items.join('|')} title={t('Cluster {n} · {count} keywords', { n: index + 1, count: cluster.items.length })}>
          <ul className="space-y-2 text-sm text-slate-300">{cluster.items.map((keyword) => <li key={keyword} className="rounded-lg bg-white/5 px-3 py-2">{keyword}</li>)}</ul>
        </Panel>
      ))}</div>}
      {keywords.length > 0 && grouped.length === 0 && <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">{t('No groups meet this setting. Try Broad similarity, lower the minimum size, or add more related phrases.')}</p>}
      <div className="mt-5"><CopyButton value={output.trim()} label={t('Copy clusters')} /></div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{t('These are word-overlap suggestions, not live SERP clusters. Confirm that every phrase in a cluster expects the same kind of page.')}</p>
    </>
  );
}

const classifyIntent = (keyword, patterns) => {
  const matches = ['Local', 'Transactional', 'Commercial', 'Informational', 'Navigational'].filter((intent) => patterns[intent].test(keyword));
  if (!matches.length) return { intent: AMBIGUOUS, confidence: CONFIDENCE.Low, page: INSPECT };
  return { intent: matches[0], confidence: matches.length === 1 ? CONFIDENCE.High : CONFIDENCE.Medium, page: INTENT_PAGES[matches[0]] };
};

export function SearchIntentClassifier() {
  const t = useT();
  const { intentPatterns } = useSeoLanguage();
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(ALL);
  const rows = useMemo(() => unique(input.split(/\r?\n/)).map((keyword) => ({ keyword, ...classifyIntent(keyword, intentPatterns) })), [input, intentPatterns]);
  const shown = rows.filter((row) => filter === ALL || row.intent === filter);
  const output = shown.map((row) => `${row.keyword}\t${t(row.intent)}\t${t(row.confidence)}\t${t(row.page)}`).join('\n');

  return (
    <>
      <Label htmlFor="intent-input">{t('Keywords')} <span className="text-slate-500">{t('(one per line)')}</span></Label>
      <TextArea id="intent-input" className="mt-2 min-h-52" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('how to start a podcast\nbest podcast microphone\nbuy podcast microphone\npodcast studio near me')} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-auto" aria-label={t('Filter classified keywords')}>
          {[ALL, 'Local', 'Transactional', 'Commercial', 'Informational', 'Navigational', AMBIGUOUS].map((item) => <option key={item} value={item}>{t(item)}</option>)}
        </Select>
        <CopyButton value={output} label={t('Copy results')} />
      </div>
      {rows.length > 0 && <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3">{t('Keyword')}</th><th className="p-3">{t('Intent')}</th><th className="p-3">{t('Confidence')}</th><th className="p-3">{t('Suggested page')}</th></tr></thead>
          <tbody>{shown.map((row) => <tr key={row.keyword} className="border-t border-white/5"><td className="p-3 font-medium text-white">{row.keyword}</td><td className="p-3 text-indigo-300">{t(row.intent)}</td><td className="p-3 text-slate-400">{t(row.confidence)}</td><td className="p-3 text-slate-400">{t(row.page)}</td></tr>)}</tbody>
        </table>
      </div>}
      <p className="mt-4 text-sm text-slate-500">{t('Ambiguous and mixed-intent queries need a live search-result check.')}</p>
    </>
  );
}

const sentenceCase = (value) => value ? value[0].toUpperCase() + value.slice(1) : '';
const DEPTHS = [msg('Quick'), msg('Standard'), msg('Comprehensive')];

export function SeoContentBriefGenerator() {
  const t = useT();
  const language = useSeoLanguage();
  const [keyword, setKeyword] = useState('');
  const [audience, setAudience] = useState('');
  const [intent, setIntent] = useState('Informational');
  const [depth, setDepth] = useState('Standard');
  const [generated, setGenerated] = useState(false);

  const brief = useMemo(() => {
    const topic = clean(keyword).toLowerCase();
    if (!topic) return '';
    return language.brief({
      topic,
      reader: clean(audience) || language.defaultReader,
      intent,
      depth,
      sentenceCase,
    });
  }, [keyword, audience, intent, depth, language]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField id="brief-keyword" label={t('Primary keyword')} value={keyword} onChange={(event) => { setKeyword(event.target.value); setGenerated(false); }} placeholder={t('e.g. bookkeeping for freelancers')} />
        <LabelledField id="brief-audience" label={t('Target audience')} value={audience} onChange={(event) => setAudience(event.target.value)} placeholder={t('e.g. first-time freelancers')} />
      </Grid>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Select value={intent} onChange={(event) => setIntent(event.target.value)} className="w-auto" aria-label={t('Content search intent')}>
          {['Informational', 'Commercial', 'Transactional'].map((item) => <option key={item} value={item}>{t(item)}</option>)}
        </Select>
        <Segmented ariaLabel={t('Content depth')} value={depth} onChange={setDepth} options={DEPTHS.map((item) => ({ value: item, label: t(item) }))} />
        <Button onClick={() => setGenerated(true)} disabled={!clean(keyword)}>{t('Generate brief')}</Button>
      </div>
      {generated && <><Label htmlFor="brief-output">{t('Editable content brief')}</Label><TextArea id="brief-output" className="mt-2 min-h-[32rem]" value={brief} onChange={() => {}} readOnly /><div className="mt-4"><CopyButton value={brief} label={t('Copy content brief')} /></div></>}
    </>
  );
}

const parseKeywordMap = (input) => input.split(/\r?\n/).map((line, index) => {
  const parts = line.includes('\t') ? line.split('\t') : line.split('|');
  return { line: index + 1, url: clean(parts[0] || ''), keyword: clean(parts.slice(1).join(' ') || '') };
}).filter((row) => row.url && row.keyword);

export function KeywordCannibalizationChecker() {
  const t = useT();
  const { stopWordSet } = useSeoLanguage();
  const [input, setInput] = useState('');
  const [strictness, setStrictness] = useState('balanced');
  const rows = useMemo(() => parseKeywordMap(input), [input]);
  const threshold = strictness === 'strict' ? 0.8 : 0.6;
  const conflicts = useMemo(() => {
    const found = [];
    rows.forEach((left, index) => rows.slice(index + 1).forEach((right) => {
      if (left.url === right.url) return;
      const score = similarity(left.keyword, right.keyword, stopWordSet);
      if (score >= threshold) found.push({ left, right, score, exact: left.keyword.toLowerCase() === right.keyword.toLowerCase() });
    }));
    return found.sort((a, b) => b.score - a.score);
  }, [rows, threshold, stopWordSet]);
  const output = conflicts.map((item) => `${item.exact ? t('Exact') : t('Related')}\t${Math.round(item.score * 100)}%\t${item.left.url}\t${item.left.keyword}\t${item.right.url}\t${item.right.keyword}`).join('\n');

  return (
    <>
      <Label htmlFor="cannibal-input">{t('URL and primary keyword')} <span className="text-slate-500">{t('(one pair per line, separated by | or a tab)')}</span></Label>
      <TextArea id="cannibal-input" className="mt-2 min-h-60" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('/email-guide | email marketing guide\n/email-tips | email marketing tips\n/newsletter-tools | best newsletter software')} />
      <div className="mt-5"><Segmented ariaLabel={t('Conflict matching strictness')} value={strictness} onChange={setStrictness} options={[{ value: 'balanced', label: t('Balanced') }, { value: 'strict', label: t('Strict') }]} /></div>
      <StatGrid columns="md:grid-cols-3"><Stat label={t('Valid page mappings')} value={rows.length} /><Stat label={t('Potential conflicts')} value={conflicts.length} accent={conflicts.length ? 'cyan' : 'emerald'} /><Stat label={t('Exact target duplicates')} value={conflicts.filter((item) => item.exact).length} /></StatGrid>
      {conflicts.length > 0 && <div className="mt-6 space-y-3">{conflicts.map((item) => <Panel key={`${item.left.line}-${item.right.line}`} title={t('{kind} · {pct}% overlap', { kind: item.exact ? t('Exact target') : t('Related targets'), pct: Math.round(item.score * 100) })}><p className="break-all text-sm text-slate-400">{item.left.url} — <span className="text-white">{item.left.keyword}</span></p><p className="mt-2 break-all text-sm text-slate-400">{item.right.url} — <span className="text-white">{item.right.keyword}</span></p></Panel>)}</div>}
      {rows.length > 1 && !conflicts.length && <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{t('No strong overlaps were found at this setting.')}</p>}
      <div className="mt-5"><CopyButton value={output} label={t('Copy conflict report')} /></div>
    </>
  );
}

const estimatedPixels = (value) => Math.round(Array.from(value).reduce((total, character) => total + (/\s/.test(character) ? 4 : /[MW@%]/.test(character) ? 11 : /[ilI1.,']/i.test(character) ? 4 : 7.2), 0));

export function SeoTitleMetaChecker() {
  const t = useT();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('https://example.com/page');
  const [keyword, setKeyword] = useState('');
  const titlePixels = estimatedPixels(title);
  const keywordPresent = clean(keyword) ? title.toLowerCase().includes(clean(keyword).toLowerCase()) : null;
  const titleWords = title.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 3);
  const checks = [
    { label: t('Title width'), pass: titlePixels >= 250 && titlePixels <= 580, detail: t('{chars} characters · about {px}px', { chars: title.length, px: titlePixels }) },
    { label: t('Description length'), pass: description.length >= 120 && description.length <= 160, detail: t('{n} characters', { n: description.length }) },
    { label: t('Primary keyword in title'), pass: keywordPresent !== false, detail: keywordPresent === null ? t('Add a keyword to check') : keywordPresent ? t('Found naturally') : t('Not found') },
    { label: t('No repeated title words'), pass: !titleWords.some((word, index, words) => words.indexOf(word) !== index), detail: t('Avoid accidental repetition') },
  ];

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField id="meta-title" label={t('SEO title')} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('A clear title that matches the page')} />
        <LabelledField id="meta-keyword" label={t('Primary keyword')} hint={t('optional')} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t('e.g. freelance bookkeeping')} />
      </Grid>
      <div className="mt-4"><LabelledField id="meta-url" label={t('Display URL')} value={url} onChange={(event) => setUrl(event.target.value)} /></div>
      <div className="mt-4"><Label htmlFor="meta-description">{t('Meta description')}</Label><TextArea id="meta-description" className="mt-2 min-h-32" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t('Describe the benefit of this page accurately and give the searcher a reason to click.')} /></div>
      <Panel title={t('Desktop search preview')}>
        <div className="max-w-2xl bg-white p-5 font-sans">
          <p className="truncate text-sm text-emerald-800">{url || 'https://example.com/page'}</p>
          <p className="mt-1 truncate text-xl text-[#1a0dab]">{title || t('Your SEO title will appear here')}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-700">{description || t('Your meta description preview will appear here as you type.')}</p>
        </div>
      </Panel>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{checks.map((check) => <div key={check.label} className={`rounded-xl border p-4 ${check.pass ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-amber-400/20 bg-amber-400/10'}`}><strong className={check.pass ? 'text-emerald-300' : 'text-amber-200'}>{check.pass ? t('Pass') : t('Review')} · {check.label}</strong><p className="mt-1 text-sm text-slate-400">{check.detail}</p></div>)}</div>
      <p className="mt-4 text-sm text-slate-500">{t('Pixel width is estimated from character shapes. Search engines may rewrite or display different metadata for each query.')}</p>
    </>
  );
}
