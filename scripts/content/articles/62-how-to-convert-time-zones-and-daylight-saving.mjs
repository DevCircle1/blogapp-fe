export default {
  slug: 'how-to-convert-time-zones-and-daylight-saving',
  title: 'How to Convert Time Zones (and Handle Daylight Saving)',
  category: 'technology',
  theme: 'dev',
  tags: ['how to convert time zones', 'est to pst', 'time zone difference', 'daylight saving time', 'utc offset', 'schedule meeting across time zones'],
  description: 'Convert any time between time zones with the UTC method, see the offsets for EST, PST, GMT, IST and PKT, and avoid the daylight saving mistakes that break meetings.',
  cover: {
    kicker: 'Go through UTC and the sums are always easy',
    visual: { type: 'formula', title: '9:00 AM NEW YORK (JAN)', lines: ['UTC−5  →  14:00 UTC', '+ 5:00  →  19:00 Karachi', '+ 5:30  →  19:30 Mumbai', '+ 9:00  →  23:00 Tokyo'] },
  },
  infographic: {
    type: 'table',
    title: 'Common time zones against UTC',
    subtitle: 'Standard-time offsets. Zones marked * move one hour east in summer.',
    columns: ['Zone', 'Standard offset', 'Summer offset'],
    widths: [440, 308, 308],
    rows: [
      ['Pacific (Los Angeles)*', 'UTC−8', 'UTC−7'], ['Eastern (New York)*', 'UTC−5', 'UTC−4'],
      ['UK (London)*', 'UTC+0', 'UTC+1'], ['Central Europe (Paris, Berlin)*', 'UTC+1', 'UTC+2'],
      ['Pakistan (Karachi)', 'UTC+5', 'no change'], ['India (Mumbai, Delhi)', 'UTC+5:30', 'no change'],
      ['China (Beijing)', 'UTC+8', 'no change'], ['Japan (Tokyo)', 'UTC+9', 'no change'],
      ['Australia East (Sydney)*', 'UTC+10', 'UTC+11 (Oct to Apr)'],
    ],
    alt: 'Table of common time zones with their standard-time and daylight-saving offsets from UTC',
    caption: 'Pakistan, India, China and Japan do not use daylight saving, so only the other end of the call moves.',
    footer: 'Convert any time: talkandtool.com/tools/time-zone-converter',
  },
  html: `
<p>To convert a time between time zones, turn it into UTC first, then add the other zone's offset. 9:00 AM in New York in January is UTC−5, so it is 14:00 UTC; add 5 hours for Pakistan to get 7:00 PM, or 5 hours 30 minutes for India to get 7:30 PM. Going through UTC means you never have to work out the difference between two zones directly, and it is how every calendar app does it. The only thing that goes wrong is daylight saving, which is why the date matters as much as the time.</p>

{{infographic}}

<h2>Step 1: find the offset for the date you mean</h2>
<p>A time zone's offset from UTC is not a single number. New York is UTC−5 in winter and UTC−4 in summer. London is UTC+0 in winter and UTC+1 in summer, so the gap between the two is five hours for most of the year but four hours for a few weeks in spring and autumn. Always look up the offset on the actual date of the event.</p>

<h2>Step 2: convert to UTC</h2>
<p>If the offset is negative (west of Greenwich), add it: 3 PM Pacific standard time is 15:00 + 8 = 23:00 UTC. If it is positive (east of Greenwich), subtract it: 3 PM in Berlin in January is 15:00 − 1 = 14:00 UTC.</p>

<h2>Step 3: convert from UTC to the target zone</h2>
<p>Do the opposite: add a positive offset, subtract a negative one. 14:00 UTC in Tokyo (UTC+9) is 23:00. 23:00 UTC in New York in winter (UTC−5) is 18:00.</p>

<h2>Worked example: a call between New York, London and Karachi</h2>
<p>You want 10:00 AM in New York on a January Tuesday.</p>
<ul>
<li>New York is UTC−5, so 10:00 + 5 = 15:00 UTC.</li>
<li>London is UTC+0, so 15:00.</li>
<li>Karachi is UTC+5, so 20:00 that evening.</li>
</ul>
<p>The same call in July: New York is UTC−4, so 10:00 + 4 = 14:00 UTC. London is UTC+1, so 15:00. Karachi does not use daylight saving, so it is 19:00. The New York clock time stayed fixed, but Karachi moved an hour earlier, which is exactly the kind of drift that catches teams out. The <a href="/tools/time-zone-converter">time zone converter</a> applies the right offset for any date you choose.</p>

<h2>Half-hour and quarter-hour zones</h2>
<p>Not every zone is a whole number of hours from UTC. India is UTC+5:30, Sri Lanka UTC+5:30, Nepal UTC+5:45, Iran UTC+3:30, Afghanistan UTC+4:30, and parts of Australia UTC+9:30. When you convert, keep the minutes: 9:00 AM UTC is 2:30 PM in India, not 2:00 PM.</p>

<h2>Daylight saving: three rules worth remembering</h2>
<ul>
<li><strong>Different countries change on different dates.</strong> The US moves its clocks on the second Sunday of March and the first Sunday of November. Most of Europe changes on the last Sunday of March and October. For about three weeks a year the gap between the two shifts by an hour.</li>
<li><strong>Many places do not change at all.</strong> Pakistan, India, China, Japan and most of Africa and Asia stay on one offset all year, so only the other end of the conversion moves.</li>
<li><strong>The southern hemisphere is reversed.</strong> Australia and New Zealand put their clocks forward in October and back in April, so their summer is the northern winter.</li>
</ul>
<p>On the night the clocks go forward, an hour does not exist (2:30 AM never happens), and on the night they go back, an hour happens twice. Schedule events away from those hours.</p>

<h2>Scheduling meetings that suit everyone</h2>
<p>Most teams define working hours as roughly 9 AM to 5 PM local time. When you convert a proposed time into each person's zone, check that it lands inside or close to that window, and rotate the inconvenient slot rather than always asking the same people to stay up late. Always write the time with its zone and date in invitations ("10:00 AM New York time, Tuesday 14 January"), and prefer calendar invites that convert automatically. If you also need to count the days to the event, <a href="/blogs/article/days-between-two-dates">how to calculate days between two dates</a> covers it, and the <a href="/tools/countdown-timer">countdown timer</a> gives you a live count.</p>

<h2>Time zones in code and spreadsheets</h2>
<p>If you store timestamps, store them in UTC and convert only when you display them. Use named zones such as America/New_York rather than fixed offsets like −5, because a named zone carries its daylight saving rules with it. The <a href="/tools/timestamp-converter">timestamp converter</a> shows a Unix timestamp as a date in any zone. In a spreadsheet, convert with a plain addition of the hour difference (for example <code>=A1+TIME(5,0,0)</code>), but remember it will be wrong across a daylight saving change unless you adjust it.</p>

<h2>Frequently asked questions</h2>
<h3>How do I convert EST to PST?</h3>
<p>Subtract three hours. Both zones change to daylight saving on the same dates, so the gap is always three hours: noon in New York is 9 AM in Los Angeles.</p>
<h3>What is the time difference between the UK and Pakistan?</h3>
<p>Five hours in winter and four hours in British summer time, because Pakistan does not change its clocks.</p>
<h3>What is UTC?</h3>
<p>Coordinated Universal Time is the global reference that clocks are measured against. It does not observe daylight saving, and for everyday purposes it matches GMT.</p>
<h3>Is GMT the same as UTC?</h3>
<p>For everyday use, yes. GMT is a time zone that the UK uses in winter, while UTC is the standard scientists and systems use as the reference.</p>
<h3>Why does the date change when I convert?</h3>
<p>A time late in the day in one zone can already be tomorrow in a zone far east. A 9 PM call in New York in winter is already 11 AM the next day in Tokyo.</p>
`,
};
