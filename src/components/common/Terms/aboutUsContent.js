/**
 * Plain-data copy for AboutUs.jsx, kept in a .js (not .jsx) file so
 * scripts/routes.mjs — a plain Node script with no JSX transform — can
 * import it too, and reuse the exact copy in the prerendered /about-us
 * snapshot instead of maintaining a second copy that can drift.
 */
export const PILLARS = [
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
