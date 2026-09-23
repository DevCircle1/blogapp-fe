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
const NotFound = lazyRoute(() => import('./components/common/NotFound.jsx'));

const page = (path, Component) => ({ path, Component, preload: Component.preload });

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
