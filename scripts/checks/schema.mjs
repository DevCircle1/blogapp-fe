/** Run: node scripts/checks/schema.mjs — every type's worked example must build cleanly and validate without errors. */
import { SCHEMA_TYPES } from '../../src/lib/schema/registry.js';
import { highlight, toJson, toNextSnippet, toScriptBlock, validate } from '../../src/lib/schema/core.js';

let failed = 0;
const check = (name, ok, extra = '') => { if (!ok) { failed += 1; console.error('FAIL', name, extra); } };

for (const type of SCHEMA_TYPES) {
  const built = type.build(type.example);
  const json = toJson(built);
  check(`${type.name} @type`, typeof built['@type'] === 'string');
  check(`${type.name} @context`, built['@context'] === 'https://schema.org');
  check(`${type.name} no undefined`, !json.includes('undefined'));
  check(`${type.name} round trips`, JSON.stringify(JSON.parse(json)) === JSON.stringify(built));
  const { errors, warnings } = validate(type, type.example, type.status);
  check(`${type.name} example has no errors`, errors.length === 0, JSON.stringify(errors));
  const nonEligibility = warnings.filter((w) => !w.eligibility);
  check(`${type.name} example has no warnings besides eligibility`, nonEligibility.length === 0, JSON.stringify(nonEligibility));
  // Empty input must produce errors for types with required fields, and never crash.
  const empty = validate(type, {}, type.status);
  check(`${type.name} empty input reports something`, empty.errors.length + empty.warnings.length > 0);
  type.build({});
  check(`${type.name} html block`, toScriptBlock(built).startsWith('<script type="application/ld+json">'));
  check(`${type.name} next snippet`, toNextSnippet(built).includes('dangerouslySetInnerHTML'));
  check(`${type.name} highlight covers the text`, highlight(json).map((t) => t.text).join('') === json);
  check(`${type.name} copy complete`, type.copy.mistakes.length >= 5 && type.copy.faqs.length === 5 && type.copy.notes.length >= 2);
  console.log(`${type.name}: ${Object.keys(built).length} top-level properties, ${json.length} chars`);
}

// Format validation.
import { FORMATS } from '../../src/lib/schema/core.js';
check('date ok', FORMATS.date('2026-03-18'));
check('date bad', !FORMATS.date('2026-02-30'));
check('datetime ok', FORMATS.datetime('2026-03-18T09:00:00+05:00'));
check('datetime bad', !FORMATS.datetime('18/03/2026'));
check('duration ok', FORMATS.duration('PT1H30M') && FORMATS.duration('P1DT2H'));
check('duration bad', !FORMATS.duration('1 hour') && !FORMATS.duration('PT') && !FORMATS.duration('P'));
check('url ok', FORMATS.url('https://example.com/a'));
check('url bad', !FORMATS.url('example.com') && !FORMATS.url('javascript:alert(1)'));
check('currency', FORMATS.currency('PKR') && !FORMATS.currency('pkr') && !FORMATS.currency('XYZ'));
check('phone', FORMATS.phone('+92 42 1234567') && !FORMATS.phone('abc'));

// The blank-input errors mention the right fields.
const faq = SCHEMA_TYPES[0];
check('faq needs a question', validate(faq, {}, faq.status).errors.some((e) => e.path === 'questions'));
const product = SCHEMA_TYPES[2];
check('product needs offer or rating', validate(product, { name: 'x' }, product.status).errors.some((e) => e.path === 'offer'));

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
