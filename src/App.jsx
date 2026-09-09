import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { MotionConfig } from "framer-motion"
import Bienvenida from "./pages/Bienvenida"
import NotFound from "./pages/NotFound"
import RouteErrorBoundary from "./components/shared/RouteErrorBoundary"

const PsicologoApp = lazy(() => import("./giros/psicologo/PsicologoApp"))

function RouteLoading() {
  return <div className="route-message" role="status">Cargando demo…</div>
}
function RoutePosition() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }) }, [pathname])
  return null
}
export default function App() {
  return <BrowserRouter>
    <MotionConfig reducedMotion="user">
      <RoutePosition />
      <RouteErrorBoundary>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/psicologo" element={<PsicologoApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </MotionConfig>
  </BrowserRouter>
}
