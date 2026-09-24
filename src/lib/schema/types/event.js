import {
  country, currency, datetime, group, list, number, prune, select, text, textarea, url, asList, oneOrMany, numeric,
} from '../core.js';

export default {
  slug: 'event',
  pageSlug: 'event-schema-generator',
  name: 'Event',
  label: 'Event',
  previewKind: 'event',
  status: {
    richResult: 'eligible',
    googleNotes: 'Event markup can make an event eligible for an event experience in Google Search, with dates, venue and ticket links. Google requires a name, a start date and a location.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/event',
    verifiedOn: '2026-09-24',
  },
  fields: [
    text('name', 'Event name', { required: true, placeholder: 'Lahore Web Summit 2026' }),
    datetime('startDate', 'Start date and time', { required: true, tzRecommended: true, placeholder: '2026-09-18T10:00:00+05:00' }),
    datetime('endDate', 'End date and time', { recommended: true, tzRecommended: true, placeholder: '2026-09-19T18:00:00+05:00', help: 'Required for events that run over several days.' }),
    select('attendance', 'Attendance mode', { options: ['OfflineEventAttendanceMode', 'OnlineEventAttendanceMode', 'MixedEventAttendanceMode'], recommended: true }),
    select('status', 'Event status', { options: ['EventScheduled', 'EventCancelled', 'EventPostponed', 'EventRescheduled', 'EventMovedOnline'], recommended: true }),
    text('venueName', 'Venue name', { placeholder: 'Expo Center Lahore', help: 'Required for events with a physical location.' }),
    group('address', 'Venue address', [
      text('streetAddress', 'Street address', { placeholder: 'Abdul Haque Road' }),
      text('addressLocality', 'City', { placeholder: 'Lahore' }),
      text('addressRegion', 'State or region', { placeholder: 'Punjab' }),
      text('postalCode', 'Postal code', { placeholder: '54770' }),
      country('addressCountry', 'Country code', { placeholder: 'PK' }),
    ]),
    url('onlineUrl', 'Online event URL', { help: 'For online or mixed events: where people join.' }),
    textarea('description', 'Description', { recommended: true }),
    list('image', 'Image URLs', { recommended: true, itemType: 'url', help: 'At least 720 pixels wide; 1920 is recommended.' }),
    group('offer', 'Tickets', [
      url('url', 'Ticket URL', { placeholder: 'https://example.com/tickets' }),
      number('price', 'Price', { placeholder: '25' }),
      currency('priceCurrency', 'Currency', { placeholder: 'USD' }),
      select('availability', 'Availability', { options: ['InStock', 'SoldOut', 'PreOrder', 'LimitedAvailability'] }),
    ], { recommended: true }),
    text('performer', 'Performer or speaker'),
    text('organizerName', 'Organizer name', { recommended: true }),
    url('organizerUrl', 'Organizer website'),
  ],
  check: (v) => {
    const issues = [];
    const physical = v.attendance !== 'OnlineEventAttendanceMode';
    if (physical && !v.venueName) issues.push({ level: 'error', path: 'venueName', message: 'A physical event needs a venue name; Google requires location.name and location.address.' });
    if (physical && !(v.address && v.address.streetAddress && v.address.addressLocality)) issues.push({ level: 'error', path: 'address', message: 'A physical event needs a venue address with at least a street and city.' });
    if (v.attendance && v.attendance !== 'OfflineEventAttendanceMode' && !v.onlineUrl) issues.push({ level: 'error', path: 'onlineUrl', message: 'An online or mixed event needs the URL where people join.' });
    if (v.startDate && v.endDate && FORMATS_OK(v.startDate) && FORMATS_OK(v.endDate) && new Date(v.endDate) < new Date(v.startDate)) issues.push({ level: 'error', path: 'endDate', message: 'The end date is before the start date.' });
    if (!v.startDate || !/T\d{2}:\d{2}/.test(v.startDate)) issues.push({ level: 'warning', path: 'startDate', message: 'Google asks for both a date and a time for the start of an event.' });
    return issues;
  },
  build: (v) => {
    const offer = v.offer || {};
    const online = v.onlineUrl ? { '@type': 'VirtualLocation', url: v.onlineUrl } : undefined;
    const place = v.venueName || (v.address && Object.values(v.address).some(Boolean)) ? { '@type': 'Place', name: v.venueName, address: { '@type': 'PostalAddress', ...(v.address || {}) } } : undefined;
    return prune({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: v.name,
      startDate: v.startDate,
      endDate: v.endDate,
      eventAttendanceMode: v.attendance ? `https://schema.org/${v.attendance}` : undefined,
      eventStatus: v.status ? `https://schema.org/${v.status}` : undefined,
      location: v.attendance === 'MixedEventAttendanceMode' ? [place, online].filter(Boolean) : v.attendance === 'OnlineEventAttendanceMode' ? online : place,
      description: v.description,
      image: oneOrMany(asList(v.image)),
      offers: offer.url || offer.price ? {
        '@type': 'Offer', url: offer.url, price: numeric(offer.price), priceCurrency: offer.priceCurrency, availability: offer.availability ? `https://schema.org/${offer.availability}` : undefined,
      } : undefined,
      performer: v.performer ? { '@type': 'Person', name: v.performer } : undefined,
      organizer: v.organizerName ? { '@type': 'Organization', name: v.organizerName, url: v.organizerUrl } : undefined,
    });
  },
  example: {
    name: 'Lahore Web Summit 2026',
    startDate: '2026-09-18T10:00:00+05:00',
    endDate: '2026-09-19T18:00:00+05:00',
    attendance: 'OfflineEventAttendanceMode',
    status: 'EventScheduled',
    venueName: 'Expo Center Lahore',
    address: {
      streetAddress: 'Abdul Haque Road', addressLocality: 'Lahore', addressRegion: 'Punjab', postalCode: '54770', addressCountry: 'PK',
    },
    description: 'Two days of talks and workshops on web performance, accessibility and search.',
    image: ['https://example.com/img/summit-1920.jpg'],
    offer: {
      url: 'https://example.com/tickets', price: '25', priceCurrency: 'USD', availability: 'InStock',
    },
    performer: 'Amina Rahman',
    organizerName: 'Example Events',
    organizerUrl: 'https://example.com',
  },
  copy: {
    keyword: 'event schema generator',
    lead: 'This event schema generator creates valid Event JSON-LD for concerts, conferences, workshops and online events: name, start date, location, tickets and status, checked as you type against Google’s event requirements.',
    tableIntro: 'Google requires three properties for event markup — a name, a start date and a location — and recommends several more, including an end date, status, image, tickets and organizer.',
    mistakes: [
      'Using a date without a time. Google needs the start date and time so that it can list the event at the right hour.',
      'Leaving out the venue name or address for a physical event. Location needs both a name and a postal address.',
      'Not updating eventStatus. A cancelled or postponed event must be marked EventCancelled or EventPostponed; and when an event is rescheduled you keep the new startDate and add previousStartDate.',
      'Marking up an event that is not actually held: promotions, sales, discounts and non-events do not qualify.',
      'Pointing the ticket URL to a page that does not let people buy tickets. The offer URL must lead directly to purchase.',
      'Ignoring time zones. A start time with a UTC offset removes any doubt about when the event happens in the local time of the venue.',
    ],
    notes: [
      'Event markup lets Google show your event, with its date, venue and ticket link, in an event experience in Search. It is aimed at real events with a defined time and place — concerts, classes, festivals, conferences — not promotions or sales.',
      'Online events are supported as well. Mark the attendance mode as online and give a VirtualLocation with the URL where attendees join; a mixed event lists both a Place and a VirtualLocation.',
    ],
    example: 'A two-day conference with a physical venue, a ticket offer, a speaker and an organiser, as generated on this page, is shown below.',
    faqs: [
      { q: 'Which properties are required for Event schema?', a: 'A name, a start date (with time) and a location, which for a physical event needs a venue name and address. Everything else is recommended.' },
      { q: 'How do I mark up an online event?', a: 'Set the attendance mode to OnlineEventAttendanceMode and use a VirtualLocation with the URL where people join. For a hybrid event use MixedEventAttendanceMode with both a Place and a VirtualLocation.' },
      { q: 'What do I do if an event is cancelled or postponed?', a: 'Keep the markup and change eventStatus to EventCancelled or EventPostponed. If it is rescheduled, set EventRescheduled, keep the new startDate and add previousStartDate.' },
      { q: 'Can I mark up recurring events?', a: 'Create a separate Event for each occurrence, each with its own start date. Do not list several dates in one Event.' },
      { q: 'Will my event definitely appear in Google?', a: 'No. Valid markup makes it eligible, but Google decides what to show.' },
    ],
  },
};

function FORMATS_OK(v) { return !Number.isNaN(Date.parse(v)); }
