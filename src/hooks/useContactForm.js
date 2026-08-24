import { useState } from "react"

// Implementa el modelo de 5 estados documentado en Parte IV, sección 11
// del Documento Maestro: inicial -> foco/selección -> procesamiento -> resultado -> salida.
// Compartido por los 4 temas para que el formulario de contacto tenga
// exactamente la misma validación y el mismo comportamiento en todos ellos.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_VALUES = { nombre: "", correo: "", motivo: "", mensaje: "" }

function validate(values) {
  const errors = {}
  if (!values.nombre.trim() || values.nombre.trim().length < 2) {
    errors.nombre = "Escribe tu nombre."
  }
  if (!EMAIL_RE.test(values.correo.trim())) {
    errors.correo = "Escribe un correo válido."
  }
  if (!values.motivo) {
    errors.motivo = "Selecciona una opción."
  }
  if (!values.mensaje.trim() || values.mensaje.trim().length < 10) {
    errors.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres)."
  }
  return errors
}

export default function useContactForm({ nombreRef } = {}) {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("idle") // idle | submitting | success

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setValues(v => ({ ...v, [field]: value }))
    setErrors(er => (er[field] ? { ...er, [field]: null } : er))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status === "submitting") return

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setStatus("submitting")
    // Transición breve para que el envío no parezca ignorado (600-900ms, Parte IV sección 11)
    setTimeout(() => setStatus("success"), 750)
  }

  const reset = (focusFirst = false) => {
    setValues(EMPTY_VALUES)
    setErrors({})
    setStatus("idle")
    if (focusFirst) {
      requestAnimationFrame(() => nombreRef?.current?.focus())
    }
  }

  return { values, errors, status, handleChange, handleSubmit, reset }
}
