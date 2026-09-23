import {
  createContext, createElement, Fragment, useContext, useMemo, useSyncExternalStore,
} from 'react';
import { makeFormatters } from '../components/tools/impl/toolFormat.js';

/**
 * Tool UI strings are keyed by their English source text, so the English
 * pages need no dictionary at all and a missing translation degrades to
 * readable English rather than a bare key. scripts/check-i18n.mjs finds every
 * key and reports any a language is missing.
 */
export const I18nContext = createContext({
  lang: 'en',
  intl: undefined,
  currency: 'USD',
  dict: null,
  extras: {},
});

/**
 * Marks a string for translation where it is declared (option lists,
 * lookup tables) so the checker can find it; it is translated later, at
 * render time, with t().
 */
export const msg = (key) => key;

/**
 * Replaces {name} placeholders. Returns a plain string when every value is
 * text, or a list of keyed fragments when a value is a React element — which
 * lets a translation move an emphasised figure to wherever its grammar needs.
 */
export const interpolate = (template, vars) => {
  if (!vars) return template;
  const parts = template.split(/\{(\w+)\}/).map((part, index) => (
    index % 2 ? (vars[part] ?? `{${part}}`) : part
  ));
  if (parts.every((part) => typeof part === 'string' || typeof part === 'number')) return parts.join('');
  return parts.map((part, index) => createElement(Fragment, { key: index }, part));
};

export const useI18n = () => useContext(I18nContext);

export const useT = () => {
  const { dict } = useContext(I18nContext);
  return (key, vars) => interpolate(dict?.[key] ?? key, vars);
};

const neverChanges = () => () => {};

/**
 * Locale for numbers and dates, plus num()/money() bound to it. The language
 * versions name their locale explicitly. The English pages have always used
 * the visitor's own browser locale (intl is undefined), which a static build
 * cannot know and hydration must not guess: the server and the hydrating
 * render use en-US so the markup matches, and the browser locale takes over
 * straight after (useSyncExternalStore switches from the server snapshot to
 * the client one without a mismatch).
 */
export const useFormat = () => {
  const { intl } = useContext(I18nContext);
  const browserLocale = useSyncExternalStore(neverChanges, () => undefined, () => 'en-US');
  const locale = intl ?? browserLocale;
  return useMemo(() => ({ locale, ...makeFormatters(locale) }), [locale]);
};

/** Locale-specific tool behaviour: defaults, stop words, keyword templates. */
export const useExtras = () => useContext(I18nContext).extras;
