import { useMemo, useState } from 'react';
import {
  Button, CopyButton, Field, Grid, Label, LabelledField, Panel, Segmented, Select, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';

const clean = (value) => value.trim().replace(/\s+/g, ' ');
const unique = (items) => [...new Set(items.map(clean).filter(Boolean))];

const intentFor = (keyword) => {
  if (/\b(near me|local)\b/i.test(keyword) || /\bin [a-z]/i.test(keyword)) return 'Local';
  if (/\b(buy|price|pricing|coupon|deal|hire|service)\b/i.test(keyword)) return 'Transactional';
  if (/\b(best|top|review|vs|versus|alternative|compare)\b/i.test(keyword)) return 'Commercial';
  if (/\b(how|what|why|when|guide|ideas|examples|checklist|tips)\b/i.test(keyword)) return 'Informational';
  return 'Specific';
};

const opportunityFor = (keyword, seed) => {
  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const seedWords = new Set(seed.toLowerCase().split(/\s+/).filter(Boolean));
  const extraWords = words.filter((word) => !seedWords.has(word)).length;
  let score = 18 + Math.min(words.length, 8) * 5 + Math.min(extraWords, 5) * 4;
  if (/^(how|what|why|when|where|can|is|are)\b/i.test(keyword)) score += 7;
  if (/\b(for|with|without|under|near|in|on a budget|step by step)\b/i.test(keyword)) score += 6;
  if (/\b(best|software|insurance|loan|lawyer|casino|crypto)\b/i.test(keyword)) score -= 8;
  return Math.max(20, Math.min(94, score));
};

const makeKeywordIdeas = (seedValue, audienceValue, locationValue) => {
  const seed = clean(seedValue).toLowerCase();
  const audience = clean(audienceValue).toLowerCase();
  const location = clean(locationValue).toLowerCase();
  if (!seed) return [];
  const audienceSuffix = audience ? ` for ${audience}` : '';
  const locationSuffix = location ? ` in ${location}` : '';
  return unique([
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
  ]).map((keyword) => ({ keyword, intent: intentFor(keyword), score: opportunityFor(keyword, seed) }))
    .sort((a, b) => b.score - a.score || a.keyword.localeCompare(b.keyword));
};

export function LowCompetitionKeywordFinder() {
  const [seed, setSeed] = useState('');
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState('');
  const [intent, setIntent] = useState('All');
  const [generated, setGenerated] = useState(false);
  const ideas = useMemo(() => makeKeywordIdeas(seed, audience, location), [seed, audience, location]);
  const shown = ideas.filter((item) => intent === 'All' || item.intent === intent);
  const output = shown.map((item) => `${item.keyword}\t${item.score}\t${item.intent}`).join('\n');

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField id="kw-seed" label="Seed topic" value={seed} onChange={(event) => { setSeed(event.target.value); setGenerated(false); }} placeholder="e.g. email marketing" />
        <LabelledField id="kw-audience" label="Audience" hint="optional" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="e.g. dentists" />
        <LabelledField id="kw-location" label="Location" hint="optional" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Karachi" />
      </Grid>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => setGenerated(true)} disabled={!clean(seed)}>Find keyword opportunities</Button>
        {generated && (
          <Select value={intent} onChange={(event) => setIntent(event.target.value)} className="w-auto" aria-label="Filter by search intent">
            {['All', 'Informational', 'Commercial', 'Transactional', 'Local', 'Specific'].map((item) => <option key={item}>{item}</option>)}
          </Select>
        )}
      </div>
      {generated && (
        <>
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-100">
            Opportunity scores estimate specificity only. Verify search demand and inspect the live results before creating content.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3">Keyword idea</th><th className="p-3">Intent</th><th className="p-3">Opportunity</th></tr></thead>
              <tbody>{shown.map((item) => (
                <tr key={item.keyword} className="border-t border-white/5">
                  <td className="p-3 font-medium text-white">{item.keyword}</td>
                  <td className="p-3 text-slate-400">{item.intent}</td>
                  <td className="p-3"><span className={`rounded-full px-2.5 py-1 font-bold ${item.score >= 75 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-indigo-400/10 text-indigo-300'}`}>{item.score}/100</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="mt-4"><CopyButton value={output} label="Copy keyword list" /></div>
        </>
      )}
    </>
  );
}

const LONG_TAIL_GROUPS = {
  Questions: (seed, audience) => [`how to start ${seed}`, `how does ${seed} work`, `what is the best ${seed}${audience}`, `why use ${seed}${audience}`, `can I do ${seed} myself`, `${seed} mistakes to avoid`, `${seed} step by step`],
  Problems: (seed, audience) => [`${seed} without spending too much`, `${seed} without experience`, `${seed} for a small budget`, `easy ${seed}${audience}`, `${seed} when nothing else works`, `common ${seed} problems`, `how to improve ${seed}`],
  Commercial: (seed, audience) => [`best ${seed}${audience}`, `affordable ${seed}${audience}`, `${seed} pricing for beginners`, `${seed} reviews and comparisons`, `${seed} alternatives`, `${seed} features to look for`, `is ${seed} worth it`],
  Content: (seed, audience) => [`${seed} checklist${audience}`, `${seed} examples${audience}`, `${seed} template${audience}`, `${seed} ideas${audience}`, `${seed} guide${audience}`, `${seed} tips${audience}`, `${seed} case study${audience}`],
};

export function LongTailKeywordGenerator() {
  const [seed, setSeed] = useState('');
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState('');
  const [enabled, setEnabled] = useState(Object.keys(LONG_TAIL_GROUPS));
  const audienceSuffix = clean(audience) ? ` for ${clean(audience).toLowerCase()}` : '';
  const ideas = useMemo(() => {
    const topic = clean(seed).toLowerCase();
    if (!topic) return [];
    const base = enabled.flatMap((group) => LONG_TAIL_GROUPS[group](topic, audienceSuffix));
    if (clean(location)) base.push(`${topic} in ${clean(location).toLowerCase()}`, `best ${topic} near ${clean(location).toLowerCase()}`, `how much does ${topic} cost in ${clean(location).toLowerCase()}`);
    return unique(base);
  }, [seed, audienceSuffix, location, enabled]);
  const toggleGroup = (group) => setEnabled((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);

  return (
    <>
      <Grid className="md:grid-cols-3">
        <LabelledField id="lt-seed" label="Seed topic" value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="e.g. home workout" />
        <LabelledField id="lt-audience" label="Audience" hint="optional" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="e.g. busy parents" />
        <LabelledField id="lt-location" label="Location" hint="optional" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Lahore" />
      </Grid>
      <div className="mt-5 flex flex-wrap gap-2">{Object.keys(LONG_TAIL_GROUPS).map((group) => <Toggle key={group} checked={enabled.includes(group)} onChange={() => toggleGroup(group)} label={group} />)}</div>
      <StatGrid columns="md:grid-cols-2"><Stat label="Ideas generated" value={ideas.length} accent="emerald" /><Stat label="Intent groups" value={enabled.length} accent="cyan" /></StatGrid>
      <Label htmlFor="lt-output">Generated keyword ideas</Label>
      <TextArea id="lt-output" className="mt-2 min-h-72" value={ideas.join('\n')} readOnly placeholder="Enter a seed topic to generate long-tail ideas." />
      <div className="mt-4"><CopyButton value={ideas.join('\n')} label="Copy all ideas" /></div>
    </>
  );
}

const CLUSTER_STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'best', 'for', 'from', 'how', 'in', 'is', 'of', 'on', 'the', 'to', 'what', 'with']);
const CLUSTER_THRESHOLDS = { broad: 0.34, balanced: 0.5, strict: 0.67 };
const terms = (keyword) => new Set(keyword.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => !CLUSTER_STOP_WORDS.has(word)) || []);
const similarity = (left, right) => {
  const a = terms(left);
  const b = terms(right);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / Math.max(1, Math.min(a.size, b.size));
};

const clusterKeywords = (keywords, threshold) => {
  const clusters = [];
  keywords.forEach((keyword) => {
    let best = null;
    let bestScore = 0;
    clusters.forEach((cluster) => {
      const score = Math.max(...cluster.items.map((item) => similarity(keyword, item)));
      if (score > bestScore) { best = cluster; bestScore = score; }
    });
    if (best && bestScore >= threshold) best.items.push(keyword);
    else clusters.push({ items: [keyword] });
  });
  return clusters.sort((a, b) => b.items.length - a.items.length);
};

export function KeywordClusteringTool() {
  const [input, setInput] = useState('');
  const [strictness, setStrictness] = useState('balanced');
  const [minSize, setMinSize] = useState('2');
  const keywords = useMemo(() => unique(input.split(/\r?\n/)), [input]);
  const clusters = useMemo(() => clusterKeywords(keywords, CLUSTER_THRESHOLDS[strictness]), [keywords, strictness]);
  const grouped = clusters.filter((cluster) => cluster.items.length >= Number(minSize));
  const ungrouped = clusters.filter((cluster) => cluster.items.length < Number(minSize)).flatMap((cluster) => cluster.items);
  const output = grouped.map((cluster, index) => `Cluster ${index + 1}\n${cluster.items.join('\n')}`).join('\n\n') + (ungrouped.length ? `\n\nUngrouped\n${ungrouped.join('\n')}` : '');

  return (
    <>
      <Label htmlFor="cluster-input">Keywords <span className="text-slate-500">(one per line)</span></Label>
      <TextArea id="cluster-input" className="mt-2 min-h-52" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'email marketing for dentists\ndentist email marketing ideas\nbest newsletter software for dentists'} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Segmented ariaLabel="Clustering strictness" value={strictness} onChange={setStrictness} options={[{ value: 'broad', label: 'Broad' }, { value: 'balanced', label: 'Balanced' }, { value: 'strict', label: 'Strict' }]} />
        <label className="flex items-center gap-2 text-sm text-slate-400">Minimum cluster size <Field type="number" min="2" max="10" value={minSize} onChange={(event) => setMinSize(event.target.value)} className="w-20 py-2" /></label>
      </div>
      <StatGrid columns="md:grid-cols-3"><Stat label="Unique keywords" value={keywords.length} /><Stat label="Suggested clusters" value={grouped.length} accent="emerald" /><Stat label="Needs review" value={ungrouped.length} accent="cyan" /></StatGrid>
      {grouped.length > 0 && <div className="mt-6 grid gap-4 md:grid-cols-2">{grouped.map((cluster, index) => (
        <Panel key={cluster.items.join('|')} title={`Cluster ${index + 1} · ${cluster.items.length} keywords`}>
          <ul className="space-y-2 text-sm text-slate-300">{cluster.items.map((keyword) => <li key={keyword} className="rounded-lg bg-white/5 px-3 py-2">{keyword}</li>)}</ul>
        </Panel>
      ))}</div>}
      {keywords.length > 0 && grouped.length === 0 && <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">No groups meet this setting. Try Broad similarity, lower the minimum size, or add more related phrases.</p>}
      <div className="mt-5"><CopyButton value={output.trim()} label="Copy clusters" /></div>
      <p className="mt-4 text-sm leading-6 text-slate-500">These are word-overlap suggestions, not live SERP clusters. Confirm that every phrase in a cluster expects the same kind of page.</p>
    </>
  );
}

const INTENT_RULES = [
  { intent: 'Local', pattern: /\b(near me|nearby|local|open now|directions|in [a-z][a-z\s]+)\b/i, page: 'Local landing page' },
  { intent: 'Transactional', pattern: /\b(buy|book|download|coupon|discount|deal|hire|order|price|pricing|quote|service|subscribe)\b/i, page: 'Product or service page' },
  { intent: 'Commercial', pattern: /\b(best|top|review|reviews|vs|versus|alternative|compare|comparison|recommended)\b/i, page: 'Comparison or review page' },
  { intent: 'Informational', pattern: /\b(how|what|why|when|where|who|guide|tutorial|ideas|examples|checklist|tips|meaning)\b/i, page: 'Guide or answer page' },
  { intent: 'Navigational', pattern: /\b(login|sign in|official|website|dashboard|support|contact)\b/i, page: 'Brand or destination page' },
];

const classifyIntent = (keyword) => {
  const matches = INTENT_RULES.filter((rule) => rule.pattern.test(keyword));
  if (!matches.length) return { intent: 'Ambiguous', confidence: 'Low', page: 'Inspect live results' };
  return { ...matches[0], confidence: matches.length === 1 ? 'High' : 'Medium' };
};

export function SearchIntentClassifier() {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const rows = useMemo(() => unique(input.split(/\r?\n/)).map((keyword) => ({ keyword, ...classifyIntent(keyword) })), [input]);
  const shown = rows.filter((row) => filter === 'All' || row.intent === filter);
  const output = shown.map((row) => `${row.keyword}\t${row.intent}\t${row.confidence}\t${row.page}`).join('\n');

  return (
    <>
      <Label htmlFor="intent-input">Keywords <span className="text-slate-500">(one per line)</span></Label>
      <TextArea id="intent-input" className="mt-2 min-h-52" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'how to start a podcast\nbest podcast microphone\nbuy podcast microphone\npodcast studio near me'} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-auto" aria-label="Filter classified keywords">
          {['All', ...INTENT_RULES.map((rule) => rule.intent), 'Ambiguous'].map((item) => <option key={item}>{item}</option>)}
        </Select>
        <CopyButton value={output} label="Copy results" />
      </div>
      {rows.length > 0 && <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3">Keyword</th><th className="p-3">Intent</th><th className="p-3">Confidence</th><th className="p-3">Suggested page</th></tr></thead>
          <tbody>{shown.map((row) => <tr key={row.keyword} className="border-t border-white/5"><td className="p-3 font-medium text-white">{row.keyword}</td><td className="p-3 text-indigo-300">{row.intent}</td><td className="p-3 text-slate-400">{row.confidence}</td><td className="p-3 text-slate-400">{row.page}</td></tr>)}</tbody>
        </table>
      </div>}
      <p className="mt-4 text-sm text-slate-500">Ambiguous and mixed-intent queries need a live search-result check.</p>
    </>
  );
}

const sentenceCase = (value) => value ? value[0].toUpperCase() + value.slice(1) : '';

export function SeoContentBriefGenerator() {
  const [keyword, setKeyword] = useState('');
  const [audience, setAudience] = useState('');
  const [intent, setIntent] = useState('Informational');
  const [depth, setDepth] = useState('Standard');
  const [generated, setGenerated] = useState(false);

  const brief = useMemo(() => {
    const topic = clean(keyword).toLowerCase();
    const reader = clean(audience) || 'people researching this topic';
    if (!topic) return '';
    const optionalSections = depth === 'Quick' ? [] : [`- Common ${topic} mistakes and how to avoid them`, `- ${sentenceCase(topic)} examples and practical use cases`];
    if (depth === 'Comprehensive') optionalSections.push(`- How to compare ${topic} options`, `- Advanced ${topic} tips`, `- Next steps and useful resources`);
    const angle = intent === 'Commercial' ? `Help ${reader} compare options and choose confidently.` : intent === 'Transactional' ? `Help ${reader} take the next step with clear requirements and expectations.` : `Give ${reader} a complete, practical answer without unnecessary filler.`;
    return [
      `SEO CONTENT BRIEF: ${sentenceCase(topic)}`,
      '', `Primary keyword: ${topic}`, `Audience: ${reader}`, `Search intent: ${intent}`, `Content depth: ${depth}`, `Recommended angle: ${angle}`,
      '', 'TITLE OPTIONS', `- ${sentenceCase(topic)}: A Practical Guide`, `- How to Get Started With ${sentenceCase(topic)}`, `- ${sentenceCase(topic)} Explained: Steps, Tips, and Mistakes`,
      '', 'PROPOSED OUTLINE', `- What is ${topic}?`, `- Who is ${topic} for?`, `- How ${topic} works`, `- How to get started with ${topic}`, ...optionalSections, `- Frequently asked questions about ${topic}`,
      '', 'QUESTIONS TO ANSWER', `- How much does ${topic} cost?`, `- How long does ${topic} take?`, `- What do beginners need to know about ${topic}?`, `- What are the alternatives to ${topic}?`,
      '', 'ON-PAGE CHECKLIST', '- Match the title and introduction to one clear intent.', '- Add first-hand examples, original data, or expert evidence.', '- Use the keyword naturally; do not target a density percentage.', '- Link to relevant supporting pages and one logical next step.', '- Write a unique title, description, and concise URL slug.', '- Verify facts and update time-sensitive details before publishing.',
    ].join('\n');
  }, [keyword, audience, intent, depth]);

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField id="brief-keyword" label="Primary keyword" value={keyword} onChange={(event) => { setKeyword(event.target.value); setGenerated(false); }} placeholder="e.g. bookkeeping for freelancers" />
        <LabelledField id="brief-audience" label="Target audience" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="e.g. first-time freelancers" />
      </Grid>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Select value={intent} onChange={(event) => setIntent(event.target.value)} className="w-auto" aria-label="Content search intent"><option>Informational</option><option>Commercial</option><option>Transactional</option></Select>
        <Segmented ariaLabel="Content depth" value={depth} onChange={setDepth} options={['Quick', 'Standard', 'Comprehensive']} />
        <Button onClick={() => setGenerated(true)} disabled={!clean(keyword)}>Generate brief</Button>
      </div>
      {generated && <><Label htmlFor="brief-output">Editable content brief</Label><TextArea id="brief-output" className="mt-2 min-h-[32rem]" value={brief} onChange={() => {}} readOnly /><div className="mt-4"><CopyButton value={brief} label="Copy content brief" /></div></>}
    </>
  );
}

const parseKeywordMap = (input) => input.split(/\r?\n/).map((line, index) => {
  const parts = line.includes('\t') ? line.split('\t') : line.split('|');
  return { line: index + 1, url: clean(parts[0] || ''), keyword: clean(parts.slice(1).join(' ') || '') };
}).filter((row) => row.url && row.keyword);

export function KeywordCannibalizationChecker() {
  const [input, setInput] = useState('');
  const [strictness, setStrictness] = useState('balanced');
  const rows = useMemo(() => parseKeywordMap(input), [input]);
  const threshold = strictness === 'strict' ? 0.8 : 0.6;
  const conflicts = useMemo(() => {
    const found = [];
    rows.forEach((left, index) => rows.slice(index + 1).forEach((right) => {
      if (left.url === right.url) return;
      const score = similarity(left.keyword, right.keyword);
      if (score >= threshold) found.push({ left, right, score, exact: left.keyword.toLowerCase() === right.keyword.toLowerCase() });
    }));
    return found.sort((a, b) => b.score - a.score);
  }, [rows, threshold]);
  const output = conflicts.map((item) => `${item.exact ? 'Exact' : 'Related'}\t${Math.round(item.score * 100)}%\t${item.left.url}\t${item.left.keyword}\t${item.right.url}\t${item.right.keyword}`).join('\n');

  return (
    <>
      <Label htmlFor="cannibal-input">URL and primary keyword <span className="text-slate-500">(one pair per line, separated by | or a tab)</span></Label>
      <TextArea id="cannibal-input" className="mt-2 min-h-60" value={input} onChange={(event) => setInput(event.target.value)} placeholder={'/email-guide | email marketing guide\n/email-tips | email marketing tips\n/newsletter-tools | best newsletter software'} />
      <div className="mt-5"><Segmented ariaLabel="Conflict matching strictness" value={strictness} onChange={setStrictness} options={[{ value: 'balanced', label: 'Balanced' }, { value: 'strict', label: 'Strict' }]} /></div>
      <StatGrid columns="md:grid-cols-3"><Stat label="Valid page mappings" value={rows.length} /><Stat label="Potential conflicts" value={conflicts.length} accent={conflicts.length ? 'cyan' : 'emerald'} /><Stat label="Exact target duplicates" value={conflicts.filter((item) => item.exact).length} /></StatGrid>
      {conflicts.length > 0 && <div className="mt-6 space-y-3">{conflicts.map((item) => <Panel key={`${item.left.line}-${item.right.line}`} title={`${item.exact ? 'Exact target' : 'Related targets'} · ${Math.round(item.score * 100)}% overlap`}><p className="break-all text-sm text-slate-400">{item.left.url} — <span className="text-white">{item.left.keyword}</span></p><p className="mt-2 break-all text-sm text-slate-400">{item.right.url} — <span className="text-white">{item.right.keyword}</span></p></Panel>)}</div>}
      {rows.length > 1 && !conflicts.length && <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">No strong overlaps were found at this setting.</p>}
      <div className="mt-5"><CopyButton value={output} label="Copy conflict report" /></div>
    </>
  );
}

const estimatedPixels = (value) => Math.round(Array.from(value).reduce((total, character) => total + (/\s/.test(character) ? 4 : /[MW@%]/.test(character) ? 11 : /[ilI1.,']/i.test(character) ? 4 : 7.2), 0));

export function SeoTitleMetaChecker() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('https://example.com/page');
  const [keyword, setKeyword] = useState('');
  const titlePixels = estimatedPixels(title);
  const keywordPresent = clean(keyword) ? title.toLowerCase().includes(clean(keyword).toLowerCase()) : null;
  const checks = [
    { label: 'Title width', pass: titlePixels >= 250 && titlePixels <= 580, detail: `${title.length} characters · about ${titlePixels}px` },
    { label: 'Description length', pass: description.length >= 120 && description.length <= 160, detail: `${description.length} characters` },
    { label: 'Primary keyword in title', pass: keywordPresent !== false, detail: keywordPresent === null ? 'Add a keyword to check' : keywordPresent ? 'Found naturally' : 'Not found' },
    { label: 'No repeated title words', pass: !title.toLowerCase().split(/\W+/).filter((word) => word.length > 3).some((word, index, words) => words.indexOf(word) !== index), detail: 'Avoid accidental repetition' },
  ];

  return (
    <>
      <Grid className="md:grid-cols-2">
        <LabelledField id="meta-title" label="SEO title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A clear title that matches the page" />
        <LabelledField id="meta-keyword" label="Primary keyword" hint="optional" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="e.g. freelance bookkeeping" />
      </Grid>
      <div className="mt-4"><LabelledField id="meta-url" label="Display URL" value={url} onChange={(event) => setUrl(event.target.value)} /></div>
      <div className="mt-4"><Label htmlFor="meta-description">Meta description</Label><TextArea id="meta-description" className="mt-2 min-h-32" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the benefit of this page accurately and give the searcher a reason to click." /></div>
      <Panel title="Desktop search preview">
        <div className="max-w-2xl bg-white p-5 font-sans">
          <p className="truncate text-sm text-emerald-800">{url || 'https://example.com/page'}</p>
          <p className="mt-1 truncate text-xl text-[#1a0dab]">{title || 'Your SEO title will appear here'}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-700">{description || 'Your meta description preview will appear here as you type.'}</p>
        </div>
      </Panel>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{checks.map((check) => <div key={check.label} className={`rounded-xl border p-4 ${check.pass ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-amber-400/20 bg-amber-400/10'}`}><strong className={check.pass ? 'text-emerald-300' : 'text-amber-200'}>{check.pass ? 'Pass' : 'Review'} · {check.label}</strong><p className="mt-1 text-sm text-slate-400">{check.detail}</p></div>)}</div>
      <p className="mt-4 text-sm text-slate-500">Pixel width is estimated from character shapes. Search engines may rewrite or display different metadata for each query.</p>
    </>
  );
}
