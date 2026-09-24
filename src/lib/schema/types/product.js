import {
  currency, date, group, list, number, prune, select, text, textarea, url, asList, oneOrMany, numeric,
} from '../core.js';

const AVAILABILITY = ['InStock', 'OutOfStock', 'PreOrder', 'BackOrder', 'SoldOut', 'LimitedAvailability', 'OnlineOnly', 'Discontinued'];

export default {
  slug: 'product',
  pageSlug: 'product-schema-generator',
  name: 'Product',
  label: 'Product',
  previewKind: 'product',
  status: {
    richResult: 'eligible',
    googleNotes: 'Product markup can produce product snippets (rating, price and availability in the result) and merchant listing experiences. Merchant listings need a page where the product can be bought, and stricter fields.',
    docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/product-snippet',
    verifiedOn: '2026-09-24',
  },
  fields: [
    text('name', 'Product name', { required: true, placeholder: 'Trailblazer 40L Backpack' }),
    list('image', 'Image URLs', { recommended: true, itemType: 'url', help: 'One URL per line. Several images in different aspect ratios are recommended.' }),
    textarea('description', 'Description', { recommended: true }),
    text('sku', 'SKU', { recommended: true, placeholder: 'TB-40-GRN' }),
    text('brand', 'Brand name', { recommended: true, placeholder: 'Trailblazer' }),
    text('mpn', 'Manufacturer part number (MPN)'),
    text('gtin', 'GTIN (barcode)', { help: 'The barcode number: 8, 12, 13 or 14 digits.' }),
    group('offer', 'Offer', [
      number('price', 'Price', { placeholder: '89.00' }),
      currency('priceCurrency', 'Currency', { placeholder: 'USD', help: 'ISO 4217 code. Required for merchant listings.' }),
      select('availability', 'Availability', { options: AVAILABILITY }),
      date('priceValidUntil', 'Price valid until', { placeholder: '2026-12-31' }),
      url('url', 'Offer URL', { placeholder: 'https://example.com/products/trailblazer-40' }),
    ], { recommended: true, help: 'At least one of Offer, rating or review is required by Google for a product snippet.' }),
    group('rating', 'Aggregate rating', [
      number('ratingValue', 'Rating value', { placeholder: '4.6' }),
      number('reviewCount', 'Number of reviews', { placeholder: '132' }),
    ], { help: 'Only if the page shows real customer reviews for this product.' }),
  ],
  check: (v) => {
    const issues = [];
    const offer = v.offer || {};
    const hasOffer = offer.price !== undefined && offer.price !== '';
    const hasRating = v.rating && v.rating.ratingValue !== undefined && v.rating.ratingValue !== '';
    if (!hasOffer && !hasRating) issues.push({ level: 'error', path: 'offer', message: 'Google requires at least one of offers, aggregateRating or review for a product snippet. Add an offer or a rating.' });
    if (hasOffer && !offer.priceCurrency) issues.push({ level: 'warning', path: 'offer.priceCurrency', message: 'Currency is recommended for product snippets and required for merchant listings.' });
    if (hasRating && (Number(v.rating.ratingValue) < 1 || Number(v.rating.ratingValue) > 5)) issues.push({ level: 'warning', path: 'rating.ratingValue', message: 'A rating value is normally between 1 and 5.' });
    if (hasRating && !v.rating.reviewCount) issues.push({ level: 'error', path: 'rating.reviewCount', message: 'An aggregate rating needs a review count.' });
    return issues;
  },
  build: (v) => {
    const offer = v.offer || {};
    const rating = v.rating || {};
    return prune({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: v.name,
      image: oneOrMany(asList(v.image)),
      description: v.description,
      sku: v.sku,
      mpn: v.mpn,
      gtin: v.gtin,
      brand: v.brand ? { '@type': 'Brand', name: v.brand } : undefined,
      offers: offer.price !== undefined && offer.price !== '' ? {
        '@type': 'Offer',
        url: offer.url,
        price: numeric(offer.price),
        priceCurrency: offer.priceCurrency,
        priceValidUntil: offer.priceValidUntil,
        availability: offer.availability ? `https://schema.org/${offer.availability}` : undefined,
      } : undefined,
      aggregateRating: rating.ratingValue !== undefined && rating.ratingValue !== '' ? {
        '@type': 'AggregateRating', ratingValue: numeric(rating.ratingValue), reviewCount: numeric(rating.reviewCount),
      } : undefined,
    });
  },
  example: {
    name: 'Trailblazer 40L Backpack',
    image: ['https://example.com/img/trailblazer-40-front.jpg', 'https://example.com/img/trailblazer-40-side.jpg'],
    description: 'A 40-litre hiking backpack with a rain cover, padded hip belt and laptop sleeve.',
    sku: 'TB-40-GRN',
    brand: 'Trailblazer',
    mpn: 'TB40G',
    offer: {
      price: '89.00', priceCurrency: 'USD', availability: 'InStock', priceValidUntil: '2026-12-31', url: 'https://example.com/products/trailblazer-40',
    },
    rating: { ratingValue: '4.6', reviewCount: '132' },
  },
  copy: {
    keyword: 'product schema generator',
    lead: 'This product schema generator creates valid Product JSON-LD with price, currency, availability, brand and ratings, and tells you which fields Google requires for a product snippet and which it only recommends.',
    tableIntro: 'Google distinguishes product snippets, which suit review pages and any product page, from merchant listings, which need a page where the product can be bought and are stricter. The table shows the properties for both.',
    mistakes: [
      'Marking up a product with no offer, rating or review. Google requires at least one of the three for a product snippet, and a name alone is not enough.',
      'Putting a price in text form, such as “$89.00”, in the price property. Price is a plain number; the currency belongs in priceCurrency as an ISO 4217 code.',
      'Marking up prices or availability that differ from what the page shows. The values in the markup must match the visible page.',
      'Using aggregateRating on a product with no visible customer reviews, or copying ratings from another site.',
      'Leaving out availability, then wondering why the result shows no stock status. Use the full schema.org URL or the enumeration name, such as InStock.',
      'Marking up a category or listing page as a single Product. Each Product markup should describe one product on a page about that product.',
    ],
    notes: [
      'Product markup can make a search result show a rating, a price and stock status. Which of those appear depends on the fields you provide and on whether the page is a product review, an aggregator, or a page where the product can be bought.',
      'For a page where customers can buy, the merchant listing requirements apply: the offer needs a price and a currency as well as a name and image. Adding a GTIN, MPN and brand improves matching to Google’s product catalogue.',
    ],
    example: 'A backpack with two images, a brand, an in-stock offer and a rating of 4.6 from 132 reviews, as generated on this page, is shown below.',
    faqs: [
      { q: 'Which fields are required for Product schema?', a: 'For a product snippet, Google requires a name and at least one of offers, aggregateRating or review. Merchant listings additionally need a price and a currency on the offer.' },
      { q: 'How do I write the price?', a: 'As a plain number in price, such as 89.00, with the currency as a separate ISO 4217 code in priceCurrency, such as USD. Do not include the currency symbol in the price.' },
      { q: 'What availability values can I use?', a: 'Values from schema.org ItemAvailability, such as InStock, OutOfStock, PreOrder, BackOrder, SoldOut, LimitedAvailability, OnlineOnly and Discontinued. This generator outputs the full schema.org URL.' },
      { q: 'Can I add reviews to my own product?', a: 'You can add aggregateRating and reviews when the page shows genuine customer reviews of that product. Do not mark up reviews you wrote yourself or copied from elsewhere.' },
      { q: 'Does Product markup guarantee a rich result?', a: 'No. Google decides whether to show one. Valid markup makes you eligible; it does not guarantee a rating, price or availability line in the result.' },
    ],
  },
};
