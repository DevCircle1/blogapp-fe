import { matchRoutes } from 'react-router-dom';
import { lazyRoute } from './lazyRoute.js';
import { LOCALIZED_LANGS } from './i18n/locales.js';
import { preloadLocaleBundle } from './i18n/loadBundle.js';

const RegisterForm = lazyRoute(() => import('./components/auth/RegisterForm/RegisterForm.jsx'));
const LoginForm = lazyRoute(() => import('./components/auth/LoginForm/LoginForm.jsx'));
const ForgetPassword = lazyRoute(() => import('./components/auth/ForgetPassowrdForm/ForgetPassword.jsx'));
const UpdatePassword = lazyRoute(() => import('./components/auth/UpdatePasswordForm/UpdatePassword.jsx'));
const ToolsPage = lazyRoute(() => import('./components/tools/ToolsPage.jsx'));
const IPAddressChecker = lazyRoute(() => import('./components/tools/ip.jsx'));
const ScreenResolutionTool = lazyRoute(() => import('./components/tools/ScreenResolutionTool.jsx'));
const TextToHtmlTool = lazyRoute(() => import('./components/tools/TextToHtmlTool.jsx'));
const WriteBlog = lazyRoute(() => import('./components/blogs/WriteBlogs.jsx'));
const BlogPostDetail = lazyRoute(() => import('./components/blogs/BlogPostDetail.jsx'));
const BlogCategories = lazyRoute(() => import('./components/blogs/BlogCategories.jsx'));
const CategoryBlogPosts = lazyRoute(() => import('./components/blogs/CategoryBlogPosts.jsx'));
const TermsAndConditions = lazyRoute(() => import('./components/common/Terms/Terms.jsx'));
const AboutUs = lazyRoute(() => import('./components/common/Terms/AboutUs.jsx'));
const ContactUs = lazyRoute(() => import('./components/common/Terms/ContactUs.jsx'));
const HelpCenter = lazyRoute(() => import('./components/common/Terms/HelpCenter.jsx'));
const PrivacyPolicy = lazyRoute(() => import('./components/common/Terms/PrivacyPolicy.jsx'));
const JobAlert = lazyRoute(() => import('./components/common/Terms/JobAlerts.jsx'));
const HomePage = lazyRoute(() => import('./components/common/Home/HomePage.jsx'));
const CodeShare = lazyRoute(() => import('./components/tools/CodeShare.jsx'));
const Q = lazyRoute(() => import('./components/tools/Q.jsx'));
const CreateQuestion = lazyRoute(() => import('./components/tools/CreateQuestion.jsx'));
const QuestionDetail = lazyRoute(() => import('./components/tools/QuestionDetail.jsx'));
const MyAnswers = lazyRoute(() => import('./components/tools/MyAnswers.jsx'));
const WordleGame = lazyRoute(() => import('./components/tools/WordleGame.jsx'));
const PremiumToolSuite = lazyRoute(() => import('./components/tools/PremiumToolSuite.jsx'));
const LocalizedToolPage = lazyRoute(() => import('./components/tools/localized/LocalizedToolPage.jsx'));
const LocalizedToolsHub = lazyRoute(() => import('./components/tools/localized/LocalizedToolsHub.jsx'));
const BankStatementPage = lazyRoute(() => import('./components/tools/flagship/bank/BankStatementPage.jsx'));
const LlmPage = lazyRoute(() => import('./components/tools/flagship/llm/LlmPage.jsx'));
const GscPage = lazyRoute(() => import('./components/tools/flagship/gsc/GscPage.jsx'));
const ResumePage = lazyRoute(() => import('./components/tools/flagship/resume/ResumePage.jsx'));
const TaxPage = lazyRoute(() => import('./components/tools/flagship/tax/TaxPage.jsx'));
const WhatsAppPage = lazyRoute(() => import('./components/tools/flagship/whatsapp/WhatsAppPage.jsx'));
const CsvPage = lazyRoute(() => import('./components/tools/flagship/csv/CsvPage.jsx'));
const SchemaPage = lazyRoute(() => import('./components/tools/flagship/schema/SchemaPage.jsx'));
const SubtitlePage = lazyRoute(() => import('./components/tools/flagship/subtitles/SubtitlePage.jsx'));
const ImagePage = lazyRoute(() => import('./components/tools/flagship/image/ImagePage.jsx'));
const NotFound = lazyRoute(() => import('./components/common/NotFound.jsx'));

const page = (path, Component) => ({ path, Component, preload: Component.preload });

const withPath = (path, Component) => ({ path, Component, props: { path }, preload: Component.preload });
const withView = (path, Component, view) => ({ path, Component, props: { view }, preload: Component.preload });

// A localized page also suspends on its language bundle, so that has to be in
// hand before hydrating too.
const localized = (path, Component, lang) => ({
  path,
  Component,
  props: { lang },
  preload: () => Promise.all([Component.preload(), preloadLocaleBundle(lang)]),
});

export const APP_ROUTES = [
  page('/', HomePage),
  page('/login', LoginForm),
  page('/signup', RegisterForm),
  page('/forget-password', ForgetPassword),
  page('/update-password', UpdatePassword),
  page('/blogs', BlogCategories),
  page('/blogs/category/:categorySlug', CategoryBlogPosts),
  page('/blogs/article/:slug', BlogPostDetail),
  page('/write-blogs', WriteBlog),
  page('/tools', ToolsPage),
  // Flagship tools with their own page trees; these sit ahead of the generic /tools/:toolSlug.
  page('/tools/bank-statement-converter', BankStatementPage),
  page('/tools/bank-statement-converter/:bank', BankStatementPage),
  withView('/tools/llm-token-counter', LlmPage, 'counter'),
  withView('/tools/llm-token-counter/:model', LlmPage, 'counter'),
  withView('/tools/llm-api-cost-calculator', LlmPage, 'cost'),
  withView('/tools/llm-price-comparison', LlmPage, 'compare'),
  withPath('/tools/content-decay-checker', GscPage),
  withPath('/tools/striking-distance-keywords', GscPage),
  withPath('/tools/gsc-ctr-analyzer', GscPage),
  withPath('/tools/ats-resume-checker', ResumePage),
  page('/tools/ats-resume-checker/:role', ResumePage),
  withPath('/tools/resume-keyword-scanner', ResumePage),
  withPath('/tools/resume-parser-test', ResumePage),
  withPath('/tools/is-my-resume-ats-friendly', ResumePage),
  withView('/tools/salary-tax-calculator-pakistan', TaxPage, 'salary'),
  withView('/tools/salary-tax-calculator-pakistan/:year', TaxPage, 'salary'),
  withView('/tools/income-tax-slabs-pakistan', TaxPage, 'slabs'),
  withView('/tools/gross-to-net-salary-pakistan', TaxPage, 'net'),
  withPath('/tools/whatsapp-chat-analyzer', WhatsAppPage),
  withPath('/tools/whatsapp-chat-statistics', WhatsAppPage),
  withPath('/tools/whatsapp-wrapped', WhatsAppPage),
  withPath('/blog/how-to-export-whatsapp-chat', WhatsAppPage),
  withPath('/tools/csv-viewer', CsvPage),
  withPath('/tools/merge-csv-files', CsvPage),
  withPath('/tools/split-csv', CsvPage),
  withPath('/tools/csv-deduplicate', CsvPage),
  withPath('/tools/csv-to-excel', CsvPage),
  withPath('/tools/excel-cant-open-large-csv', CsvPage),
  withPath('/tools/schema-markup-generator', SchemaPage),
  withPath('/tools/faq-schema-generator', SchemaPage),
  withPath('/tools/local-business-schema-generator', SchemaPage),
  withPath('/tools/product-schema-generator', SchemaPage),
  withPath('/tools/article-schema-generator', SchemaPage),
  withPath('/tools/event-schema-generator', SchemaPage),
  withPath('/tools/recipe-schema-generator', SchemaPage),
  withPath('/tools/howto-schema-generator', SchemaPage),
  withPath('/tools/breadcrumb-schema-generator', SchemaPage),
  withPath('/tools/organization-schema-generator', SchemaPage),
  withPath('/tools/video-schema-generator', SchemaPage),
  withPath('/tools/job-posting-schema-generator', SchemaPage),
  withPath('/tools/subtitle-converter', SubtitlePage),
  withPath('/tools/srt-to-vtt', SubtitlePage),
  withPath('/tools/vtt-to-srt', SubtitlePage),
  withPath('/tools/srt-to-txt', SubtitlePage),
  withPath('/tools/ass-to-srt', SubtitlePage),
  withPath('/tools/subtitle-sync', SubtitlePage),
  withPath('/tools/subtitle-merge', SubtitlePage),
  withPath('/tools/image-converter', ImagePage),
  withPath('/tools/heic-to-jpg', ImagePage),
  withPath('/tools/heic-to-jpg-without-uploading', ImagePage),
  withPath('/tools/heic-to-png', ImagePage),
  withPath('/tools/raw-to-jpg', ImagePage),
  withPath('/tools/cr2-to-jpg', ImagePage),
  withPath('/tools/nef-to-jpg', ImagePage),
  withPath('/tools/arw-to-jpg', ImagePage),
  withPath('/tools/dng-to-jpg', ImagePage),
  page('/tools/:toolSlug', PremiumToolSuite),
  page('/check-ip', IPAddressChecker),
  page('/screen-resolution', ScreenResolutionTool),
  page('/text-to-html', TextToHtmlTool),
  page('/terms-and-conditions', TermsAndConditions),
  page('/about-us', AboutUs),
  page('/contact-us', ContactUs),
  page('/help-center', HelpCenter),
  page('/privacy-policy', PrivacyPolicy),
  page('/job-alert', JobAlert),
  page('/codes', CodeShare),
  page('/codes/:id', CodeShare),
  page('/ask-anything', Q),
  page('/create', CreateQuestion),
  page('/q/:id', QuestionDetail),
  page('/my-answers', MyAnswers),
  page('/word-game', WordleGame),
  // Language versions of the tool catalogue: /es, /es/<localized-slug>, …
  ...LOCALIZED_LANGS.map((lang) => localized(`/${lang}`, LocalizedToolsHub, lang)),
  ...LOCALIZED_LANGS.map((lang) => localized(`/${lang}/:toolSlug`, LocalizedToolPage, lang)),
  page('*', NotFound),
];

/** Loads whatever chunks the page at this path needs, so it can be hydrated without suspending. */
export const preloadRoute = async (pathname) => {
  const matches = matchRoutes(APP_ROUTES, pathname);
  await matches?.at(-1)?.route.preload();
};
