import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, expect, vi } from "vitest"

const roots = new Map()
afterEach(async () => {
  for (const [root, container] of roots) {
    await act(async () => root.unmount())
    container.remove()
  }
  roots.clear()
})
export async function render(element) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)
  roots.set(root, container)
  await act(async () => root.render(element))
  return {
    container,
    rerender: async next => { await act(async () => root.render(next)) },
    unmount: async () => { await act(async () => root.unmount()); container.remove(); roots.delete(root) },
  }
}
export function button(text, scope = document) {
  const node = [...scope.querySelectorAll("button")].find(item => item.textContent.trim() === text || item.getAttribute("aria-label") === text)
  expect(node, `Botón: ${text}`).toBeTruthy()
  return node
}
export async function click(node) {
  expect(node).toBeTruthy()
  await act(async () => node.click())
}
export async function advance(ms) {
  await act(async () => vi.advanceTimersByTime(ms))
}
export async function enter(node, value) {
  const prototype = node.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : node.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(node, value)
    node.dispatchEvent(new Event(node.tagName === "SELECT" ? "change" : "input", { bubbles: true }))
  })
}
