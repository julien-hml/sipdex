const DEFAULT_ERROR_KEY = "errors.default"

// Most specific translation key for an API error code: a feature-scoped message
// first (`errors.<scope>.<CODE>`), then a global one (`errors.<CODE>`), then the
// generic fallback.
export const getErrorMessageKey = (
  scope: string,
  code: string,
  hasMessage: (key: string) => boolean,
) =>
  [`errors.${scope}.${code}`, `errors.${code}`].find(hasMessage) ??
  DEFAULT_ERROR_KEY
