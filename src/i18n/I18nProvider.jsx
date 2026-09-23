import { useMemo } from 'react';
import { I18nContext } from './i18n.js';
import { resolveCurrency, resolveIntl } from './locales.js';

export default function I18nProvider({ lang = 'en', bundle = null, children }) {
  const value = useMemo(() => ({
    lang,
    intl: resolveIntl(lang),
    currency: resolveCurrency(lang),
    dict: bundle?.dict || null,
    extras: bundle?.extras || {},
  }), [lang, bundle]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
