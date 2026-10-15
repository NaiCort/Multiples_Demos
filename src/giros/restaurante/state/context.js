import { createContext, useContext } from "react"
export const RestaurantContext = createContext(null)
export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (!context) throw new Error("Falta RestaurantProvider")
  return context
}
