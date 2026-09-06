import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Seo.jsx';
import { SITE_URL, SITE_NAME, breadcrumbSchema } from '../../../seo/siteMeta.js';

const PILLARS = [
  {
    title: 'Tools that do one thing well',
    body: 'Every tool solves a single, specific problem and opens straight to the interface — no landing page, no upsell, no account wall. If you searched for a percentage calculator, the percentage calculator is the first thing on the screen.',
  },
  {
    title: 'Your data stays on your device',
    body: 'The calculators, converters, and text utilities run as JavaScript in your own browser. A document you paste into the word counter, a token you paste into the JWT decoder, and a password you test in the strength checker are never transmitted to us.',
  },
  {
    title: 'The method, not just the number',
    body: 'Each tool explains the formula it applied and where it stops being reliable. A BMI figure comes with the reasons BMI misreads athletes; a crack-time estimate comes with the hardware assumption behind it. A number without its caveats is worse than no number.',
  },
];

const AboutUs = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <Seo
      title={`About ${SITE_NAME}`}
      description={`${SITE_NAME} publishes free browser-based calculators, converters, text utilities, and developer tools, plus practical guides. Learn who runs the site, how the tools work, and how it is funded.`}
      path="/about-us"
      schemas={[
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about-us' }]),
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${SITE_NAME}`,
          url: `${SITE_URL}/about-us`,
          mainEntity: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/3.png`,
            description: 'Publisher of free browser-based online tools, calculators, and practical guides.',
          },
        },
      ]}
    />

    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Talk &amp; Tool</h1>

        <div className="text-gray-700 leading-7 space-y-4">
          <p>
            Talk &amp; Tool is an independent website publishing free online calculators, unit converters, text
            utilities, and developer tools, alongside written guides that explain the ideas behind them. There are
            currently more than seventy tools on the site, and all of them are free to use without an account.
          </p>
          <p>
            The site exists because of a small, repeated annoyance: the everyday utilities people search for — a
            percentage, a loan repayment, a word count, a JSON document that will not parse — are usually buried
            under interstitials, sign-up prompts, and pages of filler before the actual tool appears. We wanted a
            place where the tool is at the top, the explanation is underneath for anyone who wants it, and nothing
            is gated.
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-6">What we care about</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-gray-600 leading-6 text-sm">{pillar.body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">What you will find here</h2>
        <ul className="space-y-3 text-gray-700 leading-7">
          <li>
            <strong className="text-gray-900">Calculators</strong> — percentages, averages, ratios, fractions, ages,
            GPA, and random numbers. <Link to="/tools" className="text-blue-600 hover:underline">Browse them all</Link>.
          </li>
          <li>
            <strong className="text-gray-900">Finance tools</strong> — loan and mortgage repayments, compound
            interest, sales tax, margins and markup, break-even points, and inflation.
          </li>
          <li>
            <strong className="text-gray-900">Health calculators</strong> — BMI, calories, macros, body composition,
            hydration, and pregnancy dates, each with its limitations stated plainly.
          </li>
          <li>
            <strong className="text-gray-900">Text utilities</strong> — word counting, case conversion, sorting,
            deduplicating, diffing, and cleaning text before it goes anywhere else.
          </li>
          <li>
            <strong className="text-gray-900">Developer tools</strong> — JSON, Base64, JWT, regex, hashing, colour
            conversion, CSS generators, and reference tables.
          </li>
          <li>
            <strong className="text-gray-900">Guides</strong> — longer written pieces on our{' '}
            <Link to="/blogs" className="text-blue-600 hover:underline">blog</Link>.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">How the site is funded</h2>
        <p className="text-gray-700 leading-7">
          Talk &amp; Tool is funded by advertising, which is what keeps every tool free and unmetered. We do not sell
          subscriptions and we do not sell your data — the tools process your input inside your own browser, so there
          is nothing about your usage for us to pass on. Our{' '}
          <Link to="/privacy-policy" className="text-blue-600 hover:underline">privacy policy</Link> sets out exactly
          what is collected and how to opt out of personalised advertising.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Accuracy and corrections</h2>
        <p className="text-gray-700 leading-7">
          Every calculator implements a published, checkable formula, and the formula is shown on the page so you can
          verify the result by hand. The health and finance tools are general information rather than professional
          advice, and each one says so where it matters. If you find a result that looks wrong, we would genuinely
          like to know:{' '}
          <Link to="/contact-us" className="text-blue-600 hover:underline">tell us about it</Link> and we will check
          and correct it.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Get in touch</h2>
          <p className="text-gray-700 leading-7">
            Suggestions for tools we should build, corrections, and business enquiries are all welcome through our{' '}
            <Link to="/contact-us" className="text-blue-600 hover:underline">contact page</Link>. If you are looking
            for help using something on the site, the{' '}
            <Link to="/help-center" className="text-blue-600 hover:underline">help centre</Link> covers the most
            common questions.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;
