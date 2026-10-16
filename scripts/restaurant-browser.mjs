import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { chromium } from "playwright"

const require = createRequire(import.meta.url)
export const dialog = page => page.getByRole("dialog")
export const button = (scope, name) => scope.getByRole("button", { name, exact: true })
export const close = async page => { await page.keyboard.press("Escape"); await dialog(page).waitFor({ state: "detached" }) }
export const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem("patio12-demo-v1")))
export async function audit(page) {
  await page.waitForFunction(() => [...document.querySelectorAll(".r-page-content, .r-menu-results, .r-gallery-image, .r-cart-count, .r-notice-card")].every(el => el.getAnimations().every(animation => animation.playState !== "running")))
  await page.waitForFunction(() => [...document.querySelectorAll('[style*="opacity"]')].every(el => { const opacity = Number(getComputedStyle(el).opacity); return opacity === 0 || opacity >= .999 }))
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } })).violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })))
  assert.deepEqual(violations, [], "Accesibilidad automatizada")
}
export async function bounds(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1, null, { timeout: 2000 })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Desborde horizontal")
  if (await dialog(page).count()) assert(await dialog(page).evaluate(el => el.scrollWidth <= el.clientWidth + 1), "Desborde dentro del diálogo")
  if (await page.locator(".r-timer").count()) await page.waitForFunction(() => { const b = document.querySelector(".r-timer").getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= document.documentElement.clientWidth + 1 && b.bottom <= innerHeight + 1 })
}
export async function nav(page, name) {
  const desktop = page.locator(".r-desktop-nav")
  const href = await desktop.getByRole("link", { name, exact: true, includeHidden: true }).getAttribute("href")
  if (await desktop.isVisible()) await desktop.getByRole("link", { name, exact: true }).click()
  else { await button(page, "Abrir menú").click(); await dialog(page).getByRole("link", { name, exact: true }).click() }
  await page.waitForFunction(to => location.pathname === to && document.querySelector('.r-desktop-nav a[aria-current="page"]')?.getAttribute("href") === to, href)
  await page.locator("main h1").waitFor()
}
export async function decodeImages(page) {
  for (const img of await page.locator("main img").all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(el => el.decode()) }
}
export async function suite(name, execute) {
  const managed = process.env.DEMO_START_PREVIEW === "1"
  const base = process.env.DEMO_BASE_URL || (managed ? "http://127.0.0.1:4173" : "http://127.0.0.1:5173")
  const output = path.resolve(process.env.DEMO_TEST_OUTPUT || `test-results/${name}`)
  const results = []
  let server, browser
  await fs.mkdir(output, { recursive: true })
  try {
    if (managed) {
      server = spawn(process.execPath, [path.join(path.dirname(require.resolve("vite/package.json")), "bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" })
      let ready = false
      for (let i = 0; i < 100; i++) { try { if ((await fetch(base)).ok) { ready = true; break } } catch { /* Esperar servidor. */ } await new Promise(resolve => setTimeout(resolve, 100)) }
      assert(ready, "No inició la vista previa")
    }
    browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ["--hide-scrollbars"], ...(process.env.DEMO_BROWSER_EXECUTABLE ? { executablePath: process.env.DEMO_BROWSER_EXECUTABLE } : {}), ...(process.env.DEMO_BROWSER_CHANNEL ? { channel: process.env.DEMO_BROWSER_CHANNEL } : {}), ...(process.getuid?.() === 0 ? { args: ["--no-sandbox"] } : {}) })
    const run = async (scenario, options, verify) => {
      if (process.env.DEMO_SCENARIO && !new RegExp(process.env.DEMO_SCENARIO).test(scenario)) return
      const context = await browser.newContext({ reducedMotion: "reduce", ...options })
      if (process.env.DEMO_TEST_FIXTURES) {
        const root = process.env.DEMO_TEST_FIXTURES, index = JSON.parse(await fs.readFile(path.join(root, "index.json"), "utf8"))
        await context.route("https://**/*", async route => { const entry = index[route.request().url()]; if (entry) return route.fulfill({ contentType: entry.type, body: await fs.readFile(path.join(root, entry.file)) }); return route.continue() })
      }
      const page = await context.newPage(), errors = [], submissions = [], mapRequests = [], brokenLocal = []
      page.setDefaultTimeout(12_000)
      page.on("pageerror", error => errors.push(error.message))
      page.on("request", request => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) submissions.push(request.url()); if (request.url().includes("tiles.openfreemap.org")) mapRequests.push(request.url()) })
      page.on("response", response => { if (response.url().startsWith(base) && response.status() >= 400) brokenLocal.push(response.url()) })
      try {
        const detail = await verify({ page, context, mapRequests })
        assert.deepEqual(errors, [], "Errores JavaScript"); assert.deepEqual(submissions, [], "La demo no debe enviar pedidos reales"); assert.deepEqual(brokenLocal, [], "Recursos locales inexistentes")
        results.push({ scenario, status: "passed", ...detail }); console.log(`Aprobado: ${scenario}`)
      } catch (error) { results.push({ scenario, status: "failed", error: error.message }); await page.screenshot({ path: path.join(output, "fallo.png") }).catch(() => {}); await fs.writeFile(path.join(output, "fallo-dom.json"), JSON.stringify(await page.evaluate(() => ({ url: location.href, width: innerWidth, scroll: document.documentElement.scrollWidth, nodes: [...document.querySelectorAll("body *")].filter(el => { const b = el.getBoundingClientRect(); return b.width && (b.right > innerWidth + 1 || b.left < -1) }).slice(0,30).map(el => ({ tag: el.tagName, cls: el.className.baseVal || el.className, text: el.textContent.slice(0,100), rect: el.getBoundingClientRect().toJSON() })) })), null, 2)); throw error }
      finally { await context.close() }
    }
    await execute({ run, base, output })
  } finally { await browser?.close(); server?.kill(); await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2)) }
  console.log(`${results.length} escenarios aprobados. Resultados: ${output}`)
}
