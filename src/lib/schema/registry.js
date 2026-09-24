import faq from './types/faq.js';
import localBusiness from './types/localbusiness.js';
import product from './types/product.js';
import article from './types/article.js';
import event from './types/event.js';
import recipe from './types/recipe.js';
import howto from './types/howto.js';
import breadcrumb from './types/breadcrumb.js';
import organization from './types/organization.js';
import video from './types/video.js';
import jobPosting from './types/jobposting.js';

/** Every schema type definition. Adding a type is one new file in ./types plus one line here. */
export const SCHEMA_TYPES = [faq, localBusiness, product, article, event, recipe, howto, breadcrumb, organization, video, jobPosting];

export const typeByPageSlug = (pageSlug) => SCHEMA_TYPES.find((type) => type.pageSlug === pageSlug);
export const typeBySlug = (slug) => SCHEMA_TYPES.find((type) => type.slug === slug);
