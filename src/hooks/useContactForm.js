import { useEffect, useRef, useState } from "react"

const EMPTY_VALUES = { nombre: "", correo: "", motivo: "", mensaje: "" }
const MOTIVOS = ["servicios", "horarios", "modalidades"]
export default function useContactForm({ nombreRef } = {}) {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("idle")
  const timer = useRef(null)
  const busy = useRef(false)
  const pendingFocus = useRef(false)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (status === "idle" && pendingFocus.current) {
      nombreRef?.current?.focus()
      pendingFocus.current = false
    }
  }, [status, nombreRef])

  const handleChange = field => event => {
    if (busy.current) return
    const value = event.target.value
    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => ({ ...previous, [field]: undefined }))
  }
  const handleSubmit = event => {
    event.preventDefault()
    if (busy.current) return
    const nextErrors = {}
    if (values.nombre.trim().length < 2) nextErrors.nombre = "Escribe un nombre de ejemplo de al menos 2 caracteres."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim())) nextErrors.correo = "Escribe un correo válido de ejemplo."
    if (!MOTIVOS.includes(values.motivo)) nextErrors.motivo = "Selecciona una opción."
    if (values.mensaje.trim().length < 10) nextErrors.mensaje = "Escribe un mensaje de ejemplo de al menos 10 caracteres."
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError)?.focus()
      return
    }
    busy.current = true
    setStatus("submitting")
    timer.current = setTimeout(() => { busy.current = false; setStatus("success") }, 750)
  }
  const reset = () => {
    clearTimeout(timer.current)
    busy.current = false
    pendingFocus.current = true
    setValues(EMPTY_VALUES)
    setErrors({})
    setStatus("idle")
  }
  const fillExample = () => {
    if (busy.current) return
    setValues({ nombre: "Alex Ejemplo", correo: "alex@example.com", motivo: "horarios", mensaje: "Este es un mensaje ficticio para probar el formulario." })
    setErrors({})
  }
  return { values, errors, status, handleChange, handleSubmit, reset, fillExample }
}
