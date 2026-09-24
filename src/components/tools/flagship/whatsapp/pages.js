export const ANALYZER_PATH = '/tools/whatsapp-chat-analyzer';
export const STATS_PATH = '/tools/whatsapp-chat-statistics';
export const WRAPPED_PATH = '/tools/whatsapp-wrapped';
export const GUIDE_PATH = '/blog/how-to-export-whatsapp-chat';

const META = 'Upload your WhatsApp chat export for message counts, activity heatmaps, emoji stats and reply times. Runs in your browser — nothing is uploaded.';
const NOT_AFFILIATED = 'WhatsApp is a trademark of Meta Platforms, Inc. This tool is independent and is not affiliated with or endorsed by WhatsApp or Meta.';

const RELATED = [
  { to: '/tools/word-counter', label: 'Word Counter', description: 'Count words and characters in any text.' },
  { to: '/tools/case-converter', label: 'Text Case Converter', description: 'Change the case of text in one click.' },
  { to: '/tools/percentage-calculator', label: 'Percentage Calculator', description: 'Turn message counts into shares and percentages.' },
];

const SIBLINGS = [
  { to: ANALYZER_PATH, label: 'WhatsApp chat analyzer' },
  { to: STATS_PATH, label: 'WhatsApp chat statistics' },
  { to: WRAPPED_PATH, label: 'WhatsApp wrapped' },
  { to: GUIDE_PATH, label: 'How to export a WhatsApp chat' },
];

const EXPORT_STEPS = [
  'iPhone: open the chat, tap the contact or group name at the top, scroll down and tap Export Chat, then choose Without Media. Save the resulting .zip to Files or send it to yourself.',
  'Android: open the chat, tap the three-dot menu, choose More, then Export chat, and pick Without media. Save the .txt file to Drive or Files, or send it to yourself.',
  'Drop the .txt file (or the .zip from an iPhone) onto the box above. You do not need to unzip it.',
];

const FAQS = [
  { q: 'Is my chat uploaded to a server?', a: 'No. The file is read by code running in your browser, in a background thread, and it never leaves your device. The site records only an anonymous counter with a rough size bucket (for example “1k–10k messages”), a participant count and the detected date format — never any message text, names or numbers.' },
  { q: 'How do I export a WhatsApp chat?', a: 'Open the chat, use Export Chat (iPhone: tap the contact name; Android: the three-dot menu, then More), and choose Without Media. You get a text file — or a zip on iPhone — that you can drop straight onto this page. The guide linked below has the steps for both phones.' },
  { q: 'Which date formats does it understand?', a: 'The exports used by iPhone and Android in most languages: day/month/year, month/day/year and year-month-day, with 12-hour or 24-hour clocks. It tests the formats against the start of the file and picks the best match. If a date could be read either way, it tells you which it chose and lets you switch.' },
  { q: 'How large a chat can it handle?', a: 'It streams the file rather than loading it whole, so very large chats — millions of lines — work without freezing the page. Reading a 50 MB group export takes a few seconds on a modern laptop.' },
  { q: 'What does “median reply time” mean?', a: 'For each person, the middle value of how long they took to respond after the other person wrote. The median is used because a single reply the next morning would distort an average. Gaps over twelve hours are treated as a new conversation, not a reply.' },
  { q: 'Can it tell me if someone likes me?', a: 'No, and it does not try. Message counts and reply times describe habits, not feelings, and scoring a relationship from them would be unfounded. The tool sticks to what can be counted.' },
];

const common = {
  category: 'Fun · Chat',
  applicationCategory: 'UtilitiesApplication',
  description: META,
  related: RELATED,
  siblingsHeading: 'WhatsApp tools',
  disclaimer: NOT_AFFILIATED,
};

const MEANING = {
  heading: 'What the WhatsApp chat statistics mean',
  list: [
    'Messages, words and words per message — who writes more, and who writes longer messages.',
    'Activity heatmap — the hour and weekday grid shows when the chat is alive; a bright evening band means you talk after work.',
    'Starts chats — how often each person sends the first message after a gap of more than four hours.',
    'Median reply time — the typical wait for a response, using the median so one slow reply does not skew it.',
    'Longest silence and streak — the biggest gap between messages and the most consecutive days with at least one.',
    'Top words, phrases and emoji — the most-used words after filtering common filler words in English and Roman Urdu.',
  ],
};

const PRIVACY = {
  heading: 'Your chat stays on your device',
  paragraphs: [
    'A chat export is one of the most private files you own, so this analyzer is built so that it never needs to leave your phone or computer. The file is opened by JavaScript in your browser, streamed through a parser in a background thread and reduced to counters. The counters, not the messages, are what you see. There is no upload, no account and no server copy.',
    'The only thing the site records is an anonymous count that an analysis happened, with a rough size bucket, the number of participants and the date format detected. You can verify this by watching the network tab of your browser’s developer tools while you analyze a chat.',
  ],
};

const analyzer = {
  ...common,
  path: ANALYZER_PATH,
  toolId: 'whatsapp-chat-analyzer',
  slug: 'whatsapp-chat-analyzer',
  title: 'WhatsApp Chat Analyzer — Free, Private, In-Browser',
  h1: 'WhatsApp Chat Analyzer',
  crumb: 'WhatsApp Chat Analyzer',
  appName: 'WhatsApp Chat Analyzer',
  lead: 'This free WhatsApp chat analyzer turns an exported chat into statistics: who sends more messages, when you chat, your most-used words and emoji, who starts conversations and how fast each of you replies. It runs entirely in your browser — nothing is uploaded.',
  sections: [
    {
      heading: 'How to use the WhatsApp chat analyzer',
      paragraphs: ['Export the chat from WhatsApp without media, then drop the file onto the analyzer. There is a separate step-by-step guide for iPhone and Android.'],
      list: EXPORT_STEPS,
    },
    MEANING,
    PRIVACY,
    {
      heading: 'Share your results',
      paragraphs: ['The share card is a ready-made image in story or square size, with your headline numbers and the activity heatmap. It is drawn on your device and you can choose whether it shows names. It never contains any message text.'],
    },
  ],
  steps: ['Export your chat without media (see the guide).', 'Drop the .txt or .zip file onto the box.', 'Use the person filters and the date range to focus the stats.', 'Download the share card if you want to post it.'],
  faqs: FAQS,
  siblings: SIBLINGS.filter((s) => s.to !== ANALYZER_PATH),
};

const stats = {
  ...common,
  path: STATS_PATH,
  toolId: 'whatsapp-chat-statistics',
  slug: 'whatsapp-chat-statistics',
  title: 'WhatsApp Chat Statistics — Who Texts More?',
  h1: 'WhatsApp Chat Statistics',
  crumb: 'WhatsApp Chat Statistics',
  appName: 'WhatsApp Chat Statistics',
  lead: 'Get your WhatsApp chat statistics in seconds: a message count for each person, words per message, who starts the conversations and who texts more. Drop in an exported chat — it is analysed in your browser and never uploaded.',
  sections: [
    {
      heading: 'WhatsApp chat statistics: who texts more?',
      paragraphs: [
        'The headline number is the message count for each person, followed by words and words per message, because two people can send the same number of messages while one writes far more. The table also shows who starts conversations and each person’s median reply time, which together answer the question most people are really asking: who puts in more effort to keep the chat going?',
        'Use the participant chips and the date-range sliders to focus the numbers: compare a single year, or a busy month, without loading the file again.',
      ],
    },
    MEANING,
    PRIVACY,
  ],
  steps: ['Export your chat without media.', 'Drop the file onto the analyzer above.', 'Read the per-person table, then narrow the period with the sliders.'],
  faqs: [FAQS[1], FAQS[0], FAQS[4], FAQS[5], FAQS[3]],
  siblings: SIBLINGS.filter((s) => s.to !== STATS_PATH),
};

const wrapped = {
  ...common,
  path: WRAPPED_PATH,
  toolId: 'whatsapp-wrapped',
  slug: 'whatsapp-wrapped',
  title: 'WhatsApp Wrapped — Your Year in Chats',
  h1: 'WhatsApp Wrapped',
  crumb: 'WhatsApp Wrapped',
  appName: 'WhatsApp Wrapped',
  lead: 'WhatsApp Wrapped is your year in chats: total messages, your busiest day, your longest streak, your most-used emoji and the hours you chat most. Drop in an exported chat, pick the year and download a share card. Everything happens in your browser.',
  sections: [
    {
      heading: 'Make your WhatsApp Wrapped',
      paragraphs: [
        'Export a chat, drop it in and choose a year with the period buttons under the chat. The numbers, heatmap and top words update to that year, and the share card reflects the same period. It works for a single conversation or a group.',
        'The card is made in two sizes: a tall one for stories and a square one for posts. You choose whether names appear, and it never shows message text.',
      ],
    },
    MEANING,
    PRIVACY,
  ],
  steps: ['Export the chat without media.', 'Drop the file onto the analyzer.', 'Pick the year with the period buttons.', 'Download the story or square card and share it.'],
  faqs: [FAQS[1], FAQS[0], FAQS[2], FAQS[3], FAQS[5]],
  siblings: SIBLINGS.filter((s) => s.to !== WRAPPED_PATH),
};

const guide = {
  ...common,
  path: GUIDE_PATH,
  toolId: 'how-to-export-whatsapp-chat',
  slug: 'how-to-export-whatsapp-chat',
  title: 'How to Export a WhatsApp Chat (iPhone & Android)',
  description: 'Step-by-step: export a WhatsApp chat to a text file on iPhone or Android, without media, then analyze it free in your browser without uploading it.',
  h1: 'How to Export a WhatsApp Chat',
  crumb: 'How to export a WhatsApp chat',
  category: 'Guide · WhatsApp',
  parent: { name: 'WhatsApp Chat Analyzer', path: ANALYZER_PATH },
  appName: 'How to Export a WhatsApp Chat',
  lead: 'How to export a WhatsApp chat: open the conversation, choose Export Chat and pick Without Media; WhatsApp gives you a text file you can save, email or analyze. This guide has the exact steps for iPhone and Android, plus what to do if the option is missing.',
  sections: [
    {
      heading: 'How to export a WhatsApp chat on iPhone',
      list: [
        'Open WhatsApp and the chat you want to export (a person or a group).',
        'Tap the contact or group name at the top of the chat.',
        'Scroll to the bottom of the info screen and tap Export Chat.',
        'Choose Without Media. This keeps the file small and is all the analyzer needs.',
        'The share sheet opens. Choose Save to Files, Mail, or another app. You receive a .zip file containing a text file named _chat.txt.',
      ],
    },
    {
      heading: 'How to export a WhatsApp chat on Android',
      list: [
        'Open WhatsApp and the chat you want to export.',
        'Tap the three-dot menu in the top right corner.',
        'Tap More, then Export chat.',
        'Choose Without media.',
        'Pick where to send it: Drive, Files, Gmail or another app. You receive a .txt file.',
      ],
    },
    {
      heading: 'If you cannot find Export Chat',
      list: [
        'Update WhatsApp to the current version, then look again in the chat menu (Android) or the contact info screen (iPhone).',
        'Export is done chat by chat; there is no single button that exports everything.',
        'WhatsApp limits how much of a very long chat can be exported, so an old chat may contain only the most recent messages.',
        'Business or archived chats can be exported the same way once opened.',
      ],
    },
    {
      heading: 'Analyze your exported chat',
      paragraphs: ['Once you have the file, drop it onto the WhatsApp chat analyzer. It reads .txt files and the .zip from an iPhone, works in your browser, and does not upload anything. You get message counts, an activity heatmap, top words and emoji, reply times and a share card.'],
    },
  ],
  steps: [],
  faqs: [
    { q: 'Should I export with or without media?', a: 'Without media. The statistics use only the text and timestamps, and the export is far smaller and faster. Media files are also not needed by the analyzer.' },
    { q: 'Where does the exported file go?', a: 'Wherever you choose in the share sheet: your Files app, Drive, email or another app. WhatsApp does not keep a copy of the export for you.' },
    { q: 'Does exporting notify the other person?', a: 'No. Exporting a chat does not send them a notification.' },
    FAQS[0],
  ],
  siblings: SIBLINGS.filter((s) => s.to !== GUIDE_PATH),
  related: [{ to: ANALYZER_PATH, label: 'WhatsApp Chat Analyzer', description: 'Drop your exported chat in and see your statistics.' }, ...RELATED.slice(0, 2)],
};

export const WHATSAPP_PAGES = [analyzer, stats, wrapped, guide];
