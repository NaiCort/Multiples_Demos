import { BrowserRouter, Routes, Route } from "react-router-dom"
import Bienvenida from "./pages/Bienvenida"
import PsicologoApp from "./PsicologoApp"

// Raíz de la aplicación (Fase 3 del Documento Maestro). Antes, este archivo
// contenía directamente la lógica de la demo de Psicólogo; ahora solo define
// las rutas. Esa lógica vive en PsicologoApp.jsx, montada en /psicologo.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/psicologo" element={<PsicologoApp />} />
      </Routes>
    </BrowserRouter>
  )
}
