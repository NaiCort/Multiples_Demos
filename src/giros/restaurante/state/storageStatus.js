import { useSyncExternalStore } from "react"
const listeners = new Set()
let available = true
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
export function markStorageUnavailable() { if (available) { available = false; listeners.forEach(listener => listener()) } }
export const useStorageStatus = () => useSyncExternalStore(subscribe, () => available, () => true)
