export const THEME_STORAGE_KEY = "demo-psicologo-theme"
export const THEME_NAMES = ["calido", "minimalista", "clinico", "naturaleza"]
export function readTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    return THEME_NAMES.includes(saved) ? saved : "calido"
  } catch {
    return "calido"
  }
}
export function saveTheme(theme) {
  if (!THEME_NAMES.includes(theme)) return
  try { window.localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* La preferencia es opcional. */ }
}
