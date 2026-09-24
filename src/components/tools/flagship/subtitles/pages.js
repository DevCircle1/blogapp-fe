import { twoPointSync } from '../../../../lib/subtitles/transform.js';

export const HUB_PATH = '/tools/subtitle-converter';
export const SRT_VTT_PATH = '/tools/srt-to-vtt';
export const VTT_SRT_PATH = '/tools/vtt-to-srt';
export const SRT_TXT_PATH = '/tools/srt-to-txt';
export const ASS_SRT_PATH = '/tools/ass-to-srt';
export const SYNC_PATH = '/tools/subtitle-sync';
export const MERGE_PATH = '/tools/subtitle-merge';

const convertMeta = (from, to) => `Convert ${from} to ${to} instantly in your browser. Handles encoding problems that break other converters. Free, no upload, no sign-up.`;

const RELATED = [
  { to: '/tools/word-counter', label: 'Word Counter', description: 'Count the words in a transcript you extracted.' },
  { to: '/tools/text-diff-checker', label: 'Text Diff', description: 'Compare two versions of a transcript.' },
  { to: '/tools/json-studio', label: 'JSON Studio', description: 'Format and validate JSON for caption APIs.' },
];

const SIBLINGS = [
  { to: HUB_PATH, label: 'Subtitle converter (all formats)' },
  { to: SRT_VTT_PATH, label: 'SRT to VTT' },
  { to: VTT_SRT_PATH, label: 'VTT to SRT' },
  { to: ASS_SRT_PATH, label: 'ASS to SRT' },
  { to: SRT_TXT_PATH, label: 'SRT to TXT' },
  { to: SYNC_PATH, label: 'Subtitle sync' },
  { to: MERGE_PATH, label: 'Merge subtitles' },
];

const PRIVACY_FAQ = { q: 'Is my subtitle file uploaded?', a: 'No. The file is read and converted in your browser and is never sent to a server. The site records only an anonymous count of the format pair and a rough size bucket, never the subtitle text.' };
const ENCODING_FAQ = { q: 'Why do accented or non-Latin letters look wrong?', a: 'Because the file is not UTF-8. Many subtitle files are saved in Windows-1252, Windows-1251, Shift-JIS, GBK and other encodings, and reading them as UTF-8 produces garbled text. This tool detects the encoding, shows what it chose, and lets you pick another from a list; the file you download is UTF-8.' };

const ENCODING = {
  heading: 'Encoding problems, handled',
  paragraphs: ['Most “broken” subtitle files are not broken: they are saved in an encoding other than UTF-8, so accented letters, Cyrillic, Greek, Arabic or Asian characters turn into question marks or garbage in tools that assume UTF-8. This converter detects the file’s encoding (from a byte-order mark, a UTF-8 validity check, or statistical detection) and shows you what it chose. If the text looks wrong, choose a different encoding from the list and the file is read again. Whatever the input, the file you download is UTF-8, which every modern player understands.'],
};

const common = {
  category: 'Video · Subtitles',
  applicationCategory: 'MultimediaApplication',
  related: RELATED,
  siblingsHeading: 'Subtitle tools',
};

const FORMAT_TABLE = {
  headers: ['Format', 'Timestamp syntax', 'Notes'],
  rows: [
    ['SRT (SubRip)', '00:00:20,000 --> 00:00:24,400', 'Numbered cues, comma before the milliseconds, plain text with a few basic tags.'],
    ['WebVTT', '00:00:20.000 --> 00:00:24.400', 'Starts with a WEBVTT line, a period before the milliseconds, optional cue settings and styling. The format HTML5 video uses.'],
    ['ASS / SSA', '0:00:20.00', 'Centiseconds, a [Script Info] header, styles and Dialogue lines. Supports fonts, colours, positioning and effects.'],
    ['SBV (YouTube)', '0:00:20.000,0:00:24.400', 'Start and end on one line separated by a comma. YouTube’s older caption format.'],
  ],
};

const hub = {
  ...common,
  path: HUB_PATH,
  toolId: 'subtitle-converter',
  slug: 'subtitle-converter',
  title: 'Subtitle Converter — SRT, VTT, ASS, SBV, Free',
  description: 'Convert subtitle files between SRT, VTT, ASS and SBV in your browser, fix timing, merge languages and export a transcript. Free, no upload, no sign-up.',
  h1: 'Subtitle Converter',
  crumb: 'Subtitle Converter',
  appName: 'Subtitle Converter',
  lead: 'This subtitle converter changes subtitle files between SRT, WebVTT, ASS/SSA and SBV in your browser, fixes broken encodings, shifts and stretches timings, merges two languages into one file and exports a plain-text transcript. Nothing is uploaded.',
  sections: [
    {
      heading: 'Subtitle converter for SRT, VTT, ASS and SBV: formats compared',
      paragraphs: ['Subtitle formats differ mostly in how they write timestamps and how much styling they carry. Converting between them is mostly reformatting the times and headers — the parts that go wrong are encodings, malformed cues and features that the target format cannot express.'],
      table: FORMAT_TABLE,
    },
    {
      heading: 'What this tool does',
      list: [
        'Convert between SRT, WebVTT, ASS/SSA and SBV, or export plain text.',
        'Detect and fix text encoding, with a manual override.',
        'Shift, stretch or two-point sync timings, and preview them against your own video.',
        'Merge two subtitle files into a bilingual file.',
        'Edit any cue’s text or timing in the table.',
        'Find overlapping or inverted cues and report them, without changing anything until you say so.',
      ],
    },
    {
      heading: 'What can be lost in a conversion',
      list: [
        'Converting ASS to SRT or VTT removes colours, fonts, positioning and effects; the text, line breaks, italics, bold and underline remain.',
        'Converting VTT to SRT removes cue settings, styling blocks, voice tags and comments.',
        'Converting to SBV or plain text removes all inline formatting.',
        'Converting up to ASS or VTT adds a default style; there is nothing to recover that was never in the source.',
      ],
    },
    ENCODING,
  ],
  steps: ['Drop your subtitle file onto the box.', 'Check the detected format and encoding.', 'Edit, sync or merge if you need to.', 'Choose the output format and download.'],
  faqs: [
    { q: 'Which subtitle formats are supported?', a: 'SRT, WebVTT, ASS/SSA and SBV for input, and the same formats plus plain text for output.' },
    { q: 'How do I convert one subtitle format to another?', a: 'Drop the file, choose the format you want from the download list and click download. The tool detects the input format automatically.' },
    ENCODING_FAQ,
    { q: 'Will I lose formatting when I convert?', a: 'Only what the target format cannot express. Converting ASS to SRT drops colours and positioning; converting VTT to SRT drops cue settings and styling. Text and timing are preserved.' },
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== HUB_PATH),
};

const pair = ({
  path, slug, title, from, to, fromExt, h1, crumb, lead, primaryKeyword, mainSections, faqs, description,
}) => ({
  ...common,
  path,
  toolId: slug,
  slug,
  title,
  description: description || convertMeta(from, to),
  h1,
  crumb,
  appName: h1,
  lead,
  sections: [...mainSections, ENCODING],
  steps: [`Drop your ${fromExt} file onto the box.`, 'Check the cue count and the detected encoding.', `Choose ${to} as the download format.`, 'Download the converted file.'],
  faqs: [...faqs, ENCODING_FAQ, PRIVACY_FAQ],
  siblings: SIBLINGS.filter((s) => s.to !== path),
  primaryKeyword,
});

const srtToVtt = pair({
  path: SRT_VTT_PATH,
  slug: 'srt-to-vtt',
  title: 'SRT to VTT Converter — Free, No Upload',
  from: 'SRT',
  to: 'VTT',
  fromExt: '.srt',
  h1: 'SRT to VTT Converter',
  crumb: 'SRT to VTT Converter',
  lead: 'This SRT to VTT converter turns a SubRip subtitle file into WebVTT, the format HTML5 video players use, right in your browser. It rewrites the timestamps, adds the WEBVTT header, and fixes encoding problems that break other converters.',
  mainSections: [
    {
      heading: 'How to convert SRT to VTT',
      paragraphs: ['Drop the .srt file, leave the download format on WebVTT and download the .vtt. The converter does two things that matter: it changes the comma in each timestamp to a period, and it adds the WEBVTT header line the format requires. Cue numbers are kept as cue identifiers.'],
    },
    {
      heading: 'SRT vs VTT: what is actually different',
      paragraphs: [
        'An SRT timestamp reads 00:00:20,000 --> 00:00:24,400, with a comma before the milliseconds. WebVTT writes 00:00:20.000 --> 00:00:24.400, with a period, and the file must begin with the word WEBVTT. In VTT the hours are optional for cues under an hour, so 00:20.000 is also valid.',
        'WebVTT can also carry things SRT cannot: cue settings such as position and alignment, styling through a STYLE block and CSS, voice tags to mark who is speaking, and comments. Converting from SRT does not add any of these; it produces a plain, valid WebVTT file, which you can then style by hand if you need to.',
      ],
    },
    {
      heading: 'Which players and platforms use VTT',
      list: [
        'HTML5 video: the track element accepts only WebVTT, so an SRT file must be converted before it can be used on a web page.',
        'Streaming players and adaptive streaming (HLS and DASH) use WebVTT for text tracks.',
        'Most browsers, video.js, Plyr, JW Player and similar web players read .vtt directly.',
        'Desktop players such as VLC read both SRT and VTT.',
      ],
    },
    {
      heading: 'What is kept and what is not',
      paragraphs: ['Text, line breaks, timings, and the basic italic, bold and underline tags are kept. SRT has no cue positioning or styling of its own, so nothing is lost in this direction. HTML-style font tags are removed, because WebVTT does not support them.'],
    },
  ],
  faqs: [
    { q: 'How do I convert SRT to VTT?', a: 'Drop the SRT file here and download it as WebVTT. The tool changes the timestamp separators, adds the WEBVTT header and keeps the text and timings.' },
    { q: 'Why does my website need VTT instead of SRT?', a: 'The HTML5 track element only supports WebVTT, so browsers will not load an SRT file as a text track without conversion.' },
    { q: 'Will the timing change?', a: 'No. Only the way the times are written changes. Use the sync tool if you also need to shift or stretch the timing.' },
  ],
});

const vttToSrt = pair({
  path: VTT_SRT_PATH,
  slug: 'vtt-to-srt',
  title: 'VTT to SRT Converter — Free, In Your Browser',
  from: 'VTT',
  to: 'SRT',
  fromExt: '.vtt',
  h1: 'VTT to SRT Converter',
  crumb: 'VTT to SRT Converter',
  lead: 'This VTT to SRT converter turns a WebVTT caption file into the older SubRip format that most desktop players, TVs and editing tools accept. It runs in your browser, handles encoding problems and tells you what the conversion drops.',
  mainSections: [
    {
      heading: 'How to convert VTT to SRT',
      paragraphs: ['Drop the .vtt file and download it as SRT. The header, comments and style blocks are removed, each cue gets a number, and the period in every timestamp becomes a comma: 00:00:20.000 becomes 00:00:20,000.'],
    },
    {
      heading: 'What is lost when you convert WebVTT to SRT',
      list: [
        'Cue settings such as alignment, position, line and size have no SRT equivalent and are dropped.',
        'STYLE blocks and CSS classes are removed, so custom colours and fonts do not carry over.',
        'Voice tags like <v Ali> are removed, leaving the spoken text.',
        'NOTE comments and REGION definitions are dropped.',
        'Basic italic, bold and underline tags are kept, because most SRT players support them.',
      ],
    },
    {
      heading: 'Why you might need SRT instead of VTT',
      paragraphs: [
        'SRT is the most widely supported subtitle format. Media servers such as Plex and Kodi, smart TVs, video editors and many video platforms accept SRT, while some do not accept WebVTT. If you downloaded captions from a web video or a streaming manifest they are usually WebVTT, and converting them to SRT lets them work almost everywhere.',
        'The timestamp difference is small — WebVTT uses a period before the milliseconds and allows the hours to be left out, SRT uses a comma and always writes hours — but strict parsers reject a mismatch, which is why a rename from .vtt to .srt does not work.',
      ],
    },
  ],
  faqs: [
    { q: 'How do I convert VTT to SRT?', a: 'Drop the VTT file here and download it as SRT. The converter removes the WEBVTT header, numbers the cues and changes the timestamp separators.' },
    { q: 'Can I just rename the file from .vtt to .srt?', a: 'No. The two formats write timestamps differently and VTT has a header, so most players will not read a renamed file correctly.' },
    { q: 'What happens to positioning and styling?', a: 'They are dropped, because SRT cannot express them. The text, timings and basic italics, bold and underline are kept.' },
  ],
});

const srtToTxt = pair({
  path: SRT_TXT_PATH,
  slug: 'srt-to-txt',
  title: 'SRT to TXT — Extract Subtitle Text as Transcript',
  from: 'SRT',
  to: 'TXT',
  fromExt: '.srt',
  description: 'Convert SRT to TXT instantly in your browser: extract subtitle text as a clean transcript, with or without timestamps. Free, no upload, no sign-up.',
  h1: 'SRT to Text Converter',
  primaryKeyword: 'srt to txt',
  crumb: 'SRT to Text Converter',
  lead: 'This SRT to TXT converter strips the cue numbers and timing from a subtitle file and gives you the spoken text as a clean transcript, with or without timestamps. It runs in your browser, so the subtitles never leave your device.',
  mainSections: [
    {
      heading: 'How to convert SRT to TXT',
      paragraphs: ['Drop the .srt file, choose Plain text as the format and download. Each cue becomes one line of the transcript: the number, the timing line and the blank separators are removed, and italic or bold tags are stripped. Tick “Include timestamps” to prefix every line with the time it starts.'],
    },
    {
      heading: 'Turning subtitles into a transcript',
      list: [
        'Blog posts and show notes: get the words of a video as text you can edit.',
        'Translation: hand translators clean text instead of a timed file, then bring the result back with the merge tool.',
        'Reading and study: language learners can read a whole episode without the video.',
        'Searching: search a transcript for a quote, then use the timestamps to find it in the video.',
      ],
    },
    {
      heading: 'What the text output looks like',
      paragraphs: ['Multi-line cues are joined into a single line, so a sentence split over two subtitle lines reads as one. Cues are kept one per line rather than merged into paragraphs, because a subtitle file does not say where sentences end. If you want flowing paragraphs, paste the result into an editor and join the lines.'],
    },
  ],
  faqs: [
    { q: 'How do I extract text from an SRT file?', a: 'Drop the file here and download it as plain text. The cue numbers and timing lines are removed and only the spoken text is kept.' },
    { q: 'Can I keep the timestamps?', a: 'Yes. Tick “Include timestamps” and each line starts with the time the cue begins, in hh:mm:ss.' },
    { q: 'Does it work with VTT or ASS files too?', a: 'Yes. Any supported subtitle format can be exported as plain text.' },
  ],
});

const assToSrt = pair({
  path: ASS_SRT_PATH,
  slug: 'ass-to-srt',
  title: 'ASS to SRT Converter — Free Subtitle Conversion',
  from: 'ASS',
  to: 'SRT',
  fromExt: '.ass or .ssa',
  h1: 'ASS to SRT Converter',
  crumb: 'ASS to SRT Converter',
  lead: 'This ASS to SRT converter turns Advanced SubStation Alpha subtitles, including SSA files, into plain SRT that any player, TV or editor can read. It runs in your browser and tells you exactly what styling the conversion removes.',
  mainSections: [
    {
      heading: 'How to convert ASS to SRT',
      paragraphs: ['Drop the .ass or .ssa file and download it as SRT. The converter reads the [Events] section, takes the Dialogue lines in time order, turns \\N into line breaks and converts the centisecond timestamps 0:00:20.00 into SRT’s 00:00:20,000. Italic, bold and underline overrides become the equivalent tags.'],
    },
    {
      heading: 'What is lost converting ASS to SRT',
      list: [
        'Fonts, sizes, colours and outlines are removed, because SRT has no styles.',
        'Positioning such as {\\an8} for top-of-screen lines is dropped: every line appears at the bottom.',
        'Karaoke timing, fades, movement and other effects are removed.',
        'Vector drawings and typesetting used for signs are dropped, leaving no text for them.',
        'Times are kept to the millisecond, but ASS only has centisecond precision to begin with.',
      ],
    },
    {
      heading: 'ASS, SSA and SRT compared',
      paragraphs: [
        'SSA and its successor ASS were designed for styled subtitles, and are common in fansubbed anime. A file has a [Script Info] header, a [V4+ Styles] section defining fonts and colours, and an [Events] section of Dialogue lines that name a style. That power is the reason the files do not play everywhere: many TVs, media boxes and web players ignore or reject ASS.',
        'SRT is plain by comparison, which is why it is the safe choice for compatibility. If you want to keep the styling for players that support it, keep the ASS file as well and use the SRT as the fallback.',
      ],
    },
  ],
  faqs: [
    { q: 'How do I convert ASS to SRT?', a: 'Drop the ASS or SSA file here and download it as SRT. The text and timing are kept; styling is removed.' },
    { q: 'Can I convert SSA files too?', a: 'Yes. SSA and ASS use the same Dialogue structure, and both are read.' },
    { q: 'Why are some signs and songs missing?', a: 'In ASS they are often drawn as vector graphics or effects rather than text, so there is no text to carry into SRT.' },
  ],
});

/* --------------------------------------------------------------- sync page */

// A worked example computed with the same function the tool uses, so the numbers on the page cannot drift from the tool.
const example = twoPointSync(
  [{ index: 1, start: 65000, end: 68000, text: '' }, { index: 2, start: 5510000, end: 5513000, text: '' }],
  72000,
  5720000,
);
const exampleScale = example.scale.toFixed(5);
const exampleOffset = (example.offset / 1000).toFixed(2);

const sync = {
  ...common,
  path: SYNC_PATH,
  toolId: 'subtitle-sync',
  slug: 'subtitle-sync',
  title: 'Subtitle Sync Online — Fix Out-of-Sync Subtitles',
  description: 'Fix out-of-sync subtitles online: shift timing, correct a frame-rate mismatch or sync two points, and preview against your video. Free, no upload.',
  h1: 'Subtitle Sync & Timing Fixer',
  primaryKeyword: 'subtitle sync online',
  crumb: 'Subtitle Sync',
  appName: 'Subtitle Sync & Timing Fixer',
  lead: 'Use this subtitle sync online tool to fix out-of-sync subtitles: shift every line by a fixed amount, stretch the timings to correct a frame-rate mismatch, or give the true time of the first and last line and let the tool work out both. Preview against your own video, then download. Nothing is uploaded.',
  sections: [
    {
      heading: 'Subtitle sync online: how to fix out-of-sync subtitles',
      paragraphs: [
        'Drop your subtitle file, then open the Sync tab. Before choosing a method, work out what kind of error you have: play the start of the video and note whether the subtitles are early or late, then jump to the end and check again. If the error is the same at both ends, it is a fixed offset and a shift will fix it. If it grows or shrinks over the film, it is a rate mismatch and needs a stretch or a two-point sync.',
        'Whichever you use, load your video in the preview tab to check the result before you download. The video is played from your own disk and is never uploaded.',
      ],
    },
    {
      heading: 'Fix a fixed delay with a shift',
      paragraphs: ['A fixed error usually means the video and the subtitles were cut from different versions: one has a studio logo or a longer intro that the other lacks. Enter the offset in seconds — positive to show subtitles later, negative to show them earlier — and every cue moves by that amount. Times that would fall below zero are held at zero, and the tool tells you how many were affected.'],
    },
    {
      heading: 'Fix drift with a frame-rate stretch',
      paragraphs: [
        'If the subtitles start in sync and slowly drift, the file was timed for a different frame rate. The classic case is film at 23.976 frames per second against a version sped up to 25 for PAL television: the video runs about 4.2% faster, so every time in the subtitles must be multiplied by the ratio between the two rates. The presets cover 23.976 to 25, 25 to 23.976, 29.97 to 30, 30 to 29.97, 24 to 25 and 25 to 24, and you can enter any ratio yourself.',
        'You can find a ratio from any two matching points: divide the time between two dialogue lines in the video by the time between the same two lines in the file.',
      ],
    },
    {
      heading: 'Two-point sync: fix offset and drift at once',
      paragraphs: [
        'Two-point sync is the most useful method when you do not know what is wrong. Play the video, note the true time at which the first line is spoken and the true time of the last, and enter both. The tool solves for the stretch and the offset that map the file’s first and last cue onto those times, and applies the same correction to every cue in between. It shows you the values it derived.',
        `Worked example: the first line is spoken at 00:01:12 but the file shows it at 00:01:05, and the last line is spoken at 01:35:20 while the file shows it at 01:31:50. The tool derives a scale of ${exampleScale} and an offset of ${exampleOffset} seconds, so every cue start is multiplied by ${exampleScale} and then moved by ${exampleOffset} seconds.`,
      ],
    },
    {
      heading: 'Why not just use your player’s subtitle delay?',
      paragraphs: ['Players such as VLC let you nudge the subtitle delay while playing, which is fine for a single sitting. But it changes only playback, it does not fix the file, and it cannot correct a drift that changes over the film. Fixing the file itself means it plays correctly on every device — a TV, a phone, a media server — without adjusting anything.'],
    },
    {
      heading: 'Other checks this tool does for you',
      list: [
        'Overlapping cues, and cues that end before they start, are reported, and fixed only when you click the button.',
        'Encoding is detected, so accented and non-Latin characters survive.',
        'You can edit the text or timing of any single cue in the table.',
        'Every change can be undone.',
      ],
    },
  ],
  steps: ['Drop your subtitle file onto the box.', 'Check whether the error is a fixed delay or grows over time.', 'Use Shift, Stretch or Two-point sync on the Sync tab.', 'Check it against your video on the preview tab, then download.'],
  faqs: [
    { q: 'How do I fix subtitles that are out of sync?', a: 'Work out whether the error is constant or grows. A constant error is fixed with a shift by a number of seconds; a growing error needs a frame-rate stretch or a two-point sync using the true times of the first and last lines.' },
    { q: 'How do I sync subtitles that drift over time?', a: 'Use the frame-rate stretch if you know the two frame rates, or two-point sync if you do not: enter when the first and last lines really occur and the tool works out the correction.' },
    { q: 'What is the 23.976 to 25 fps problem?', a: 'Film is often 23.976 frames per second, but PAL video runs at 25. The video plays about 4.2% faster, so the subtitles have to be compressed by the same ratio to stay in step.' },
    { q: 'Can I preview the subtitles against my video?', a: 'Yes. Open the video preview, choose a video from your computer and the current subtitles are drawn over it. The video is played locally and is not uploaded.' },
    { q: 'Does it change my original file?', a: 'No. Your file is read in the browser and the corrected version is a new download. You can undo every change before downloading.' },
    PRIVACY_FAQ,
  ],
  related: RELATED,
  siblings: SIBLINGS.filter((s) => s.to !== SYNC_PATH),
};

const mergePage = {
  ...common,
  path: MERGE_PATH,
  toolId: 'subtitle-merge',
  slug: 'subtitle-merge',
  title: 'Merge Subtitles — Create Bilingual Subtitle Files',
  description: 'Merge two subtitle files into one bilingual file: stacked or interleaved, in SRT, VTT or ASS. Ideal for language learning. Free, no upload.',
  h1: 'Merge Subtitles (Bilingual)',
  primaryKeyword: 'merge subtitles',
  crumb: 'Merge Subtitles',
  appName: 'Merge Subtitles',
  lead: 'Merge subtitles from two files into one bilingual subtitle file: the second language stacked under the first in each cue, or the two sets of cues interleaved. It runs in your browser and works with SRT, VTT, ASS and SBV.',
  sections: [
    {
      heading: 'How to merge subtitles into a bilingual file',
      paragraphs: ['Drop the first subtitle file, open the Merge tab, choose the second file and pick a mode. Both files are read with their own detected encodings, so mixing, say, an English UTF-8 file with a Russian Windows-1251 file works. Then download the result in any format.'],
    },
    {
      heading: 'Stacked vs interleaved',
      list: [
        'Stacked puts each cue of the second file under the cue of the first it overlaps most in time, on a second line in a smaller size. It suits language learning, because both languages are on screen together.',
        'Interleaved keeps every cue from both files with its own timing and sorts them together. Players will show overlapping cues at the same time, and it works best when both files were timed to the same video.',
        'In stacked mode, cues from the second file that overlap nothing in the first are kept as their own cues so no text is lost.',
      ],
    },
    {
      heading: 'Bilingual subtitles for language learning',
      paragraphs: [
        'Watching with two subtitle lines — your target language and your own — lets you read along, look up what you missed and build vocabulary without pausing. The two files must be timed to the same cut of the video; if the second one is late or early, sync it first with the subtitle sync tool.',
        'How the smaller second line is drawn depends on the format. ASS supports it directly, WebVTT uses a STYLE rule that the converter adds, and SRT uses a font size tag that not every player honours; if your player ignores it, the two lines simply appear at the same size.',
      ],
    },
    {
      heading: 'Where merged files work',
      list: ['VLC, mpv and MPC-HC read merged SRT and ASS files.', 'Web players with WebVTT support show the merged track, including the smaller second line.', 'Some TVs and media boxes show both lines at the same size.'],
    },
  ],
  steps: ['Drop the first subtitle file onto the box.', 'Open the Merge tab and choose the second file.', 'Pick stacked or interleaved and click Merge.', 'Download the bilingual file in the format you need.'],
  faqs: [
    { q: 'How do I combine two subtitle files?', a: 'Load one file, open the Merge tab, choose the second and click Merge. The result can be downloaded as SRT, VTT, ASS or SBV.' },
    { q: 'Do the two files need matching timing?', a: 'They should be timed to the same version of the video. If one is off, correct it first with the sync tool, then merge.' },
    { q: 'Can the two languages have different encodings?', a: 'Yes. Each file’s encoding is detected separately.' },
    { q: 'Why is the second line not smaller in my player?', a: 'Not every player supports size changes in SRT. ASS and WebVTT handle it best; in others both lines show at the same size.' },
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== MERGE_PATH),
};

export const SUBTITLE_PAGES = [hub, srtToVtt, vttToSrt, srtToTxt, assToSrt, sync, mergePage];

export const SUBTITLE_CONFIG = {
  [HUB_PATH]: { mode: 'converter', from: null, to: 'srt' },
  [SRT_VTT_PATH]: { mode: 'convert', from: 'srt', to: 'vtt' },
  [VTT_SRT_PATH]: { mode: 'convert', from: 'vtt', to: 'srt' },
  [SRT_TXT_PATH]: { mode: 'convert', from: 'srt', to: 'txt' },
  [ASS_SRT_PATH]: { mode: 'convert', from: 'ass', to: 'srt' },
  [SYNC_PATH]: { mode: 'sync', from: null, to: 'srt' },
  [MERGE_PATH]: { mode: 'merge', from: null, to: 'srt' },
};
