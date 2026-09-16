import { useMemo } from 'react';
import { I18nContext } from './i18n.js';
import { resolveCurrency, resolveIntl } from './locales.js';
import { setFormatLocale } from '../components/tools/impl/toolFormat.js';

export default function I18nProvider({ lang = 'en', bundle = null, children }) {
  const value = useMemo(() => ({
    lang,
    intl: resolveIntl(lang),
    currency: resolveCurrency(lang),
    dict: bundle?.dict || null,
    extras: bundle?.extras || {},
  }), [lang, bundle]);

  // num() and money() are plain helpers called throughout the tool code, so
  // the active locale is handed to them here instead of being threaded
  // through every call site. Set during render so the first paint is right.
  setFormatLocale(value.intl);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
