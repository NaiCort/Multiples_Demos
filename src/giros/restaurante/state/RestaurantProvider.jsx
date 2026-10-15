import { useEffect, useReducer, useState } from "react"
import { RestaurantContext } from "./context"
import { useStorageStatus, markStorageUnavailable } from "./storageStatus"
import { initialState, restaurantReducer, restoreState, serializeState, STORAGE_KEY } from "./model"
function load() {
  try { return restoreState(localStorage.getItem(STORAGE_KEY), Date.now()) } catch { return initialState() }
}
export default function RestaurantProvider({ children }) {
  const [state, rawDispatch] = useReducer(restaurantReducer, undefined, load)
  const [now, setNow] = useState(() => Date.now())
  const storageAvailable = useStorageStatus()
  const visitId = state.visit?.id
  const dispatch = action => { if (action.type === "start") setNow(action.visit.startedAt); if (action.type === "confirm-order") setNow(action.now); rawDispatch(action) }
  useEffect(() => {
    try {
      if (state.pointId === "xalapa" && !state.visit && !state.profile.member && !state.profile.history.length && state.widget.x === 1 && state.widget.y === 1 && !state.widget.compact) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, serializeState(state))
    } catch { markStorageUnavailable() }
  }, [state])
  useEffect(() => {
    if (!visitId) return
    const tick = () => { const time = Date.now(); setNow(time); rawDispatch({ type: "tick", now: time }) }
    const interval = window.setInterval(tick, 1000)
    window.addEventListener("focus", tick)
    document.addEventListener("visibilitychange", tick)
    return () => { clearInterval(interval); window.removeEventListener("focus", tick); document.removeEventListener("visibilitychange", tick) }
  }, [visitId])
  const cartDispatch = action => dispatch({ type: "cart", action })
  return <RestaurantContext.Provider value={{ state, dispatch, cartDispatch, now, storageAvailable }}>{children}</RestaurantContext.Provider>
}
