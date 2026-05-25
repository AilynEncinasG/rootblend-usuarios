export type RootblendTheme = "claro" | "oscuro";

const ROOTBLEND_THEME_KEY = "rootblend_theme";

export function normalizeRootblendTheme(value: unknown): RootblendTheme {
  return value === "claro" ? "claro" : "oscuro";
}

export function applyRootblendTheme(theme: RootblendTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "claro" ? "light" : "dark";
  localStorage.setItem(ROOTBLEND_THEME_KEY, theme);
}

export function getStoredRootblendTheme(): RootblendTheme {
  return normalizeRootblendTheme(localStorage.getItem(ROOTBLEND_THEME_KEY));
}