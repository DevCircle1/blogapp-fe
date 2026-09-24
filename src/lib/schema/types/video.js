import {
  checkbox, datetime, duration, list, number, prune, repeater, text, textarea, url, asList, oneOrMany, numeric,
} from '../core.js';

export default {
  slug: 'video',
  pageSlug: 'video-schema-generator',
  name: 'VideoObject',
  label: 'Video',
  previewKind: 'video',
  status: {
    richResult: 'eligible',
    googleNotes: 'VideoObject markup can make a video eligible for video rich results, key moments and a LIVE badge for livestreams. Google requires a name, a thumbnail and an upload date.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/video',
    verifiedOn: '2026-09-24',
  },
  fields: [
    text('name', 'Video title', { required: true, placeholder: 'How to repot a houseplant' }),
    list('thumbnailUrl', 'Thumbnail URLs', { required: true, itemType: 'url', help: 'One URL per line. The thumbnail must be crawlable and indexable.' }),
    datetime('uploadDate', 'Upload date', { required: true, tzRecommended: true, placeholder: '2026-05-02T08:00:00+05:00' }),
    textarea('description', 'Description', { recommended: true, help: 'Unique for each video.' }),
    url('contentUrl', 'Video file URL', { recommended: true, placeholder: 'https://example.com/media/repotting.mp4', help: 'The actual video file.' }),
    url('embedUrl', 'Embed player URL', { recommended: true, placeholder: 'https://example.com/embed/repotting', help: 'A player for the video, not the page it is on.' }),
    duration('duration', 'Duration', { recommended: true, placeholder: 'PT4M30S' }),
    datetime('expires', 'Expiry date', { tzRecommended: true, help: 'If the video will stop being available.' }),
    number('watchCount', 'View count', { help: 'Total views, as an integer.' }),
    checkbox('isLive', 'This is a livestream'),
    datetime('liveStart', 'Livestream start', { tzRecommended: true, help: 'For a livestream.', showIf: (v) => v.isLive }),
    datetime('liveEnd', 'Livestream end', { tzRecommended: true, showIf: (v) => v.isLive }),
    repeater('clips', 'Key moments (clips)', [
      text('name', 'Label', { placeholder: 'Loosening the roots' }),
      number('startOffset', 'Starts at (seconds)', { placeholder: '65' }),
      number('endOffset', 'Ends at (seconds)', { placeholder: '120' }),
      url('url', 'Link to this moment', { placeholder: 'https://example.com/video?t=65' }),
    ], { itemLabel: 'Clip', help: 'Optional. Lets Google show key moments.' }),
  ],
  check: (v) => {
    const issues = [];
    if (!v.contentUrl && !v.embedUrl) issues.push({ level: 'warning', path: 'contentUrl', message: 'Give at least a contentUrl or an embedUrl so Google can find and play the video.' });
    if (v.isLive && !v.liveStart) issues.push({ level: 'warning', path: 'liveStart', message: 'A livestream needs a start time to be eligible for the LIVE badge.' });
    (v.clips || []).forEach((clip, i) => {
      if (clip.name && (clip.startOffset === '' || clip.startOffset === undefined)) issues.push({ level: 'error', path: `clips[${i}].startOffset`, message: `Clip ${i + 1} needs a start time in seconds.` });
      if (clip.name && (clip.endOffset === '' || clip.endOffset === undefined)) issues.push({ level: 'error', path: `clips[${i}].endOffset`, message: `Clip ${i + 1} needs an end time in seconds.` });
    });
    return issues;
  },
  build: (v) => prune({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.name,
    description: v.description,
    thumbnailUrl: oneOrMany(asList(v.thumbnailUrl)),
    uploadDate: v.uploadDate,
    contentUrl: v.contentUrl,
    embedUrl: v.embedUrl,
    duration: v.duration,
    expires: v.expires,
    interactionStatistic: v.watchCount ? { '@type': 'InteractionCounter', interactionType: { '@type': 'WatchAction' }, userInteractionCount: numeric(v.watchCount) } : undefined,
    publication: v.isLive ? { '@type': 'BroadcastEvent', isLiveBroadcast: true, startDate: v.liveStart, endDate: v.liveEnd } : undefined,
    hasPart: (v.clips || []).filter((c) => c.name).map((c) => ({
      '@type': 'Clip', name: c.name, startOffset: numeric(c.startOffset), endOffset: numeric(c.endOffset), url: c.url,
    })),
  }),
  example: {
    name: 'How to repot a houseplant',
    thumbnailUrl: ['https://example.com/img/repot-thumb.jpg'],
    uploadDate: '2026-05-02T08:00:00+05:00',
    description: 'A four-minute walkthrough of repotting a root-bound houseplant.',
    contentUrl: 'https://example.com/media/repotting.mp4',
    embedUrl: 'https://example.com/embed/repotting',
    duration: 'PT4M30S',
    watchCount: '12450',
    clips: [
      {
        name: 'Loosening the roots', startOffset: '65', endOffset: '120', url: 'https://example.com/video/repotting?t=65',
      },
      {
        name: 'Potting it up', startOffset: '120', endOffset: '210', url: 'https://example.com/video/repotting?t=120',
      },
    ],
  },
  copy: {
    keyword: 'video schema generator',
    lead: 'This video schema generator builds valid VideoObject JSON-LD with title, thumbnail, upload date, duration and optional key moments or a livestream badge, and checks every ISO 8601 value against Google’s video requirements.',
    tableIntro: 'Google requires three properties for a video — a name, a thumbnail and an upload date — and recommends a description, content and embed URLs, duration, expiry, view counts and clips for key moments.',
    mistakes: [
      'Pointing embedUrl at the page the video lives on. It must be the URL of a player for the video, such as the embed address.',
      'A thumbnail that Google cannot crawl or index, for instance one blocked by robots.txt or behind a login.',
      'Reusing the same title and description for every video on the site. Each video needs its own unique text.',
      'A duration in plain text. Use an ISO 8601 duration such as PT4M30S for four and a half minutes.',
      'An upload date that is a date only, with no time zone. Give the date and time with an offset.',
      'Key-moment clips whose start and end times are in minutes instead of seconds, or that overlap the wrong part of the video.',
    ],
    notes: [
      'A video can appear in Google’s results with a thumbnail and duration, in the dedicated Videos results, and, with clips or a table of contents, with key moments that jump to a point in the video. VideoObject markup is how you describe the video to Google when it cannot work it out from the page alone.',
      'For a livestream, adding a BroadcastEvent with isLiveBroadcast and the start and end time makes the video eligible for a LIVE badge. The generator adds this when you tick the livestream box.',
    ],
    example: 'A four-and-a-half-minute video with a file and embed URL, a view count and two key moments, as generated on this page, is shown below.',
    faqs: [
      { q: 'Which properties are required for VideoObject?', a: 'A name, a thumbnail URL and an upload date. Description, content URL, embed URL, duration, expiry, interaction statistics and clips are recommended.' },
      { q: 'What is the difference between contentUrl and embedUrl?', a: 'contentUrl points at the actual video file. embedUrl points at a player for the video. Provide whichever you have; both are recommended.' },
      { q: 'How do I write the duration?', a: 'As an ISO 8601 duration: PT30S for thirty seconds, PT4M30S for four and a half minutes, PT1H2M for an hour and two minutes.' },
      { q: 'How do I get key moments?', a: 'Add Clip entries with a label, a start and end offset in seconds and a URL that jumps to that moment. Google may also detect key moments on its own.' },
      { q: 'How do I mark up a livestream?', a: 'Tick the livestream option and give the start and end times. The generator adds a BroadcastEvent so that Google can show a LIVE badge.' },
    ],
  },
};
