/**
 * Plain-data copy for ScreenResolutionTool.jsx, kept in a .js (not .jsx)
 * file so scripts/routes.mjs — a plain Node script with no JSX transform —
 * can import it too, and reuse this exact copy in the prerendered
 * /screen-resolution snapshot instead of maintaining a second copy that can
 * drift.
 */
export const SCREEN_RESOLUTION_INTRO = 'Your display has a fixed resolution, but the number that actually matters for web design is the viewport — the area inside the browser where the page is drawn. Those two figures are rarely the same, and on a high-density screen neither matches the physical pixel count, because the operating system scales the interface.';

export const SCREEN_RESOLUTION_EXTRA_PARAGRAPHS = [
  'This checker reports all of them side by side: viewport size, full screen resolution, the space available after the taskbar or dock, device pixel ratio, colour depth, and which CSS breakpoint your current width falls into. It is the fastest way to answer "what size is this screen" when filing a bug report or checking a responsive layout.',
];

export const SCREEN_RESOLUTION_STEPS = [
  'Read your live viewport size at the top of the page.',
  'Compare it with the full screen resolution to see how much space browser chrome takes.',
  'Check the device pixel ratio if images look soft on a high-density display.',
  'Resize the window to watch the CSS breakpoint change as the layout would.',
];

export const SCREEN_RESOLUTION_FAQS = [
  { q: 'What is the difference between screen resolution and viewport size?', a: 'Screen resolution is the full pixel size of your display. The viewport is the part of the browser actually showing the page, which is smaller because the address bar, bookmarks bar, scrollbars, and any open developer tools all take space. CSS media queries respond to the viewport, not the screen.' },
  { q: 'Why does my 4K monitor report a smaller resolution?', a: 'Because of device pixel ratio. Operating systems scale the interface on high-density displays, so a 3840-pixel-wide screen at 200% scaling reports 1920 CSS pixels. The pixel ratio figure above shows the multiplier being applied.' },
  { q: 'What screen sizes should I design for?', a: 'Test the common breakpoints rather than specific devices: around 360–430 px for phones, 768 px for tablets, 1280–1440 px for laptops, and 1920 px for desktop monitors. Resize this page to check how a layout behaves between them.' },
  { q: 'What is colour depth?', a: 'The number of bits used per pixel to store colour. 24-bit gives roughly 16.7 million colours and is the standard on virtually every modern display; 30-bit and above appears on HDR and professional monitors.' },
  { q: 'Does this tool send my screen information anywhere?', a: 'No. The values are read from your own browser with JavaScript and displayed on the page. Nothing is transmitted or stored.' },
];
