import {
  country, group, list, number, prune, repeater, select, text, url, phone, asList, oneOrMany, numeric,
} from '../core.js';

const TYPES = ['LocalBusiness', 'Restaurant', 'CafeOrCoffeeShop', 'Store', 'HairSalon', 'Dentist', 'AutoRepair', 'RealEstateAgent', 'LegalService', 'Plumber', 'Physician', 'GymOrHealthClub'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default {
  slug: 'local-business',
  pageSlug: 'local-business-schema-generator',
  name: 'LocalBusiness',
  label: 'Local Business',
  previewKind: 'local',
  status: {
    richResult: 'eligible',
    googleNotes: 'Google uses LocalBusiness markup for business details in the knowledge panel, alongside your Business Profile. It is not a standalone rich result, and it does not replace a Google Business Profile.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/local-business',
    verifiedOn: '2026-09-24',
  },
  fields: [
    select('businessType', 'Business type', { options: TYPES, help: 'Use the most specific type that fits. Google accepts any LocalBusiness subtype.' }),
    text('name', 'Business name', { required: true, placeholder: 'Green Leaf Café' }),
    group('address', 'Address', [
      text('streetAddress', 'Street address', { placeholder: '12 Main Boulevard' }),
      text('addressLocality', 'City', { placeholder: 'Lahore' }),
      text('addressRegion', 'State or region', { placeholder: 'Punjab' }),
      text('postalCode', 'Postal code', { placeholder: '54000' }),
      country('addressCountry', 'Country code', { placeholder: 'PK', help: 'Two-letter ISO 3166-1 code.' }),
    ], { required: true, help: 'Include as many address parts as you can.' }),
    phone('telephone', 'Telephone', { recommended: true, placeholder: '+92 42 1234567' }),
    url('url', 'Website URL', { recommended: true, placeholder: 'https://example.com/lahore', help: 'The page for this specific location.' }),
    list('image', 'Image URLs', { recommended: true, itemType: 'url', help: 'High-resolution photos of the business, one URL per line.' }),
    text('priceRange', 'Price range', { recommended: true, placeholder: '$$', maxLength: 99, help: 'For example $$ or $10–25.' }),
    text('servesCuisine', 'Cuisine served', { placeholder: 'Italian', help: 'Restaurants only.', showIf: (v) => ['Restaurant', 'CafeOrCoffeeShop'].includes(v.businessType) }),
    group('geo', 'Coordinates', [
      number('latitude', 'Latitude', { placeholder: '31.52037', help: 'At least five decimal places.' }),
      number('longitude', 'Longitude', { placeholder: '74.35875' }),
    ], { recommended: true }),
    repeater('hours', 'Opening hours', [
      select('day', 'Day', { options: DAYS }),
      text('opens', 'Opens', { placeholder: '09:00' }),
      text('closes', 'Closes', { placeholder: '17:30' }),
    ], { recommended: true, itemLabel: 'Opening time', help: 'One row per day. Add several rows if a business opens twice in a day.' }),
    list('sameAs', 'Profile URLs (sameAs)', { itemType: 'url', help: 'Social profiles and directory listings, one per line.' }),
  ],
  check: (v) => {
    const issues = [];
    (v.hours || []).forEach((row, i) => {
      ['opens', 'closes'].forEach((key) => {
        if (row[key] && !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(row[key])) issues.push({ level: 'error', path: `hours[${i}].${key}`, message: `Opening hours row ${i + 1}: “${row[key]}” should be a 24-hour time such as 09:00.` });
      });
      if ((row.opens || row.closes) && !row.day) issues.push({ level: 'error', path: `hours[${i}].day`, message: `Opening hours row ${i + 1} needs a day.` });
    });
    if (v.geo && (v.geo.latitude !== undefined && v.geo.latitude !== '')) {
      const dp = (String(v.geo.latitude).split('.')[1] || '').length;
      if (dp < 5) issues.push({ level: 'warning', path: 'geo.latitude', message: 'Latitude and longitude should have at least five decimal places to be precise.' });
    }
    return issues;
  },
  build: (v) => prune({
    '@context': 'https://schema.org',
    '@type': v.businessType || 'LocalBusiness',
    name: v.name,
    image: oneOrMany(asList(v.image)),
    url: v.url,
    telephone: v.telephone,
    priceRange: v.priceRange,
    servesCuisine: v.servesCuisine,
    address: { '@type': 'PostalAddress', ...(v.address || {}) },
    geo: v.geo && (v.geo.latitude !== '' || v.geo.longitude !== '') ? { '@type': 'GeoCoordinates', latitude: numeric(v.geo.latitude), longitude: numeric(v.geo.longitude) } : undefined,
    openingHoursSpecification: (v.hours || []).filter((row) => row.day).map((row) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: row.day, opens: row.opens, closes: row.closes,
    })),
    sameAs: oneOrMany(asList(v.sameAs)),
  }),
  example: {
    businessType: 'CafeOrCoffeeShop',
    name: 'Green Leaf Café',
    address: {
      streetAddress: '12 Main Boulevard', addressLocality: 'Lahore', addressRegion: 'Punjab', postalCode: '54000', addressCountry: 'PK',
    },
    telephone: '+92 42 1234567',
    url: 'https://example.com/lahore',
    image: ['https://example.com/photos/green-leaf-front.jpg'],
    priceRange: '$$',
    servesCuisine: 'Coffee and light meals',
    geo: { latitude: '31.52037', longitude: '74.35875' },
    hours: [
      { day: 'Monday', opens: '08:00', closes: '22:00' },
      { day: 'Tuesday', opens: '08:00', closes: '22:00' },
      { day: 'Saturday', opens: '09:00', closes: '23:00' },
    ],
    sameAs: ['https://www.instagram.com/example'],
  },
  copy: {
    keyword: 'local business schema generator',
    lead: 'This local business schema generator creates valid LocalBusiness JSON-LD for a shop, restaurant, clinic or service business: name, address, phone, coordinates and opening hours, checked as you type, with the required and recommended fields marked.',
    tableIntro: 'Google requires only a name and an address for LocalBusiness markup. Everything else is recommended, and the recommended fields are what make the business details complete and consistent with your Business Profile.',
    mistakes: [
      'Marking up a business at a location the page does not describe. Each location needs its own page with its own LocalBusiness markup, not one block for the whole chain on the home page.',
      'Adding aggregateRating or review markup to your own business page. Google treats self-serving reviews as ineligible, so leave them out unless the page is genuinely a review site.',
      'Writing opening hours in 12-hour format. Times must be 24-hour, such as 17:30, and days must be the full English day name.',
      'Using a generic LocalBusiness type when a more specific one exists — Restaurant, Dentist, HairSalon and many more inherit all the same fields.',
      'Coordinates with too few decimal places, which puts the pin in the wrong building. Use at least five.',
      'Marking up a phone number or address that differs from the Google Business Profile. Inconsistent details are a common reason a knowledge panel shows the wrong information.',
    ],
    notes: [
      'LocalBusiness markup describes a physical place that customers can visit or that serves a local area. Google uses it, together with a verified Business Profile, to show details such as address, opening hours and phone number in the knowledge panel and local results.',
      'The markup supports the profile; it does not replace it. If you have a physical location, claim your Google Business Profile first, and then make sure the details in your markup match it exactly. Where they disagree, the profile usually wins.',
    ],
    example: 'A café with opening hours, coordinates and a phone number, as generated on this page, is shown below. Note the separate OpeningHoursSpecification for each day and the 24-hour times.',
    faqs: [
      { q: 'Which properties are required for LocalBusiness schema?', a: 'Google requires name and address. Telephone, url, geo, opening hours, price range and images are recommended and make the listing more complete.' },
      { q: 'Do I need LocalBusiness schema if I have a Google Business Profile?', a: 'It is not required, but it is worth adding. The markup lets you state your details in a form Google can read on your own site, and it helps keep them consistent with the profile.' },
      { q: 'How do I mark up several locations?', a: 'Create a separate page for each location and put that location’s LocalBusiness markup on its page, each with its own address, phone number and hours.' },
      { q: 'Should I add reviews to my LocalBusiness markup?', a: 'Not for your own business. Google’s guidelines exclude self-serving reviews, so review markup on your own business page will not be shown and may be flagged.' },
      { q: 'How do I write opening hours in JSON-LD?', a: 'Use one OpeningHoursSpecification per day or group of days, with dayOfWeek as the English day name and opens and closes as 24-hour times. This generator builds them from the rows you add.' },
    ],
  },
};
