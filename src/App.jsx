import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Bienvenida from "./pages/Bienvenida"

// Raíz de la aplicación. Bienvenida se importa directamente porque es la ruta
// de entrada — siempre hace falta de inmediato, cargarla de forma diferida no
// ahorraría nada. Cada giro, en cambio, se carga con React.lazy(): un visitante
// que solo quiere ver un giro no debe descargar el código de los demás
// (Fase 4, Documento Maestro sección 9.0 — decisión del 24 de agosto de 2026).

const PsicologoApp = lazy(() => import("./giros/psicologo/PsicologoApp"))

// Fondo oscuro simple mientras carga el código de un giro, para no mostrar un
// parpadeo en blanco durante la carga diferida — coherente con el tono oscuro
// de la propia pantalla de bienvenida.
function RouteLoading() {
  return <div style={{ minHeight: "100vh", backgroundColor: "#0F1418" }} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/psicologo" element={<PsicologoApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
