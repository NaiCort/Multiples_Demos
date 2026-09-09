import { useId, useRef } from "react"
import useContactForm from "../../hooks/useContactForm"
import DemoConfirmation from "./DemoConfirmation"
import { contrastingText } from "../../utils/colors"

export default function DemoContactForm({ accentColor, fontFamily, variant = "calido" }) {
  const nombreRef = useRef(null)
  const form = useContactForm({ nombreRef })
  const id = useId()
  const radius = variant === "minimalista" ? 0 : variant === "naturaleza" ? 18 : 10
  const fieldStyle = { fontFamily, borderRadius: radius }
  const fields = [
    { key: "nombre", label: "Nombre de ejemplo", type: "text", placeholder: "Alex Ejemplo", maxLength: 100 },
    { key: "correo", label: "Correo de ejemplo", type: "email", placeholder: "alex@example.com", maxLength: 254 },
    { key: "motivo", label: "¿Qué información buscas?" },
    { key: "mensaje", label: "Mensaje de ejemplo", placeholder: "Prueba con una consulta ficticia sobre horarios.", maxLength: 1000 },
  ]
  return (
    <div style={{ fontFamily }}>
      <form hidden={form.status === "success"} className="demo-contact-form space-y-4" onSubmit={form.handleSubmit} noValidate aria-busy={form.status === "submitting"} aria-describedby={`${id}-notice`}>
        <p id={`${id}-notice`} className="text-sm text-white/85 leading-relaxed">Utiliza datos ficticios. Esta prueba no envía información. Evita escribir datos de salud o información personal.</p>
        <button type="button" onClick={form.fillExample} disabled={form.status === "submitting"} className="text-sm underline underline-offset-4 min-h-11 text-white">Rellenar con datos de ejemplo</button>
        {fields.map(field => {
          const props = {
            id: `${id}-${field.key}`, name: field.key, value: form.values[field.key],
            onChange: form.handleChange(field.key), disabled: form.status === "submitting",
            "aria-invalid": !!form.errors[field.key],
            "aria-describedby": form.errors[field.key] ? `${id}-${field.key}-error` : undefined,
            required: true, className: "demo-form-field", style: fieldStyle,
          }
          return <div key={field.key}>
            <label htmlFor={props.id} className="block text-white/85 text-sm mb-2">{field.label}</label>
            {field.key === "motivo" ? <select {...props}>
              <option value="">Selecciona una opción</option>
              <option value="servicios">Información de servicios</option>
              <option value="horarios">Disponibilidad de horarios</option>
              <option value="modalidades">Modalidades de atención</option>
            </select> : field.key === "mensaje" ? <textarea {...props} rows={4} maxLength={field.maxLength} placeholder={field.placeholder} /> :
              <input {...props} type={field.type} maxLength={field.maxLength} placeholder={field.placeholder} autoComplete="off" ref={field.key === "nombre" ? nombreRef : undefined} />}
            {form.errors[field.key] && <p id={`${id}-${field.key}-error`} className="text-sm text-[#ffd1d1] mt-2">{form.errors[field.key]}</p>}
          </div>
        })}
        <button type="submit" disabled={form.status === "submitting"} className="w-full px-5 py-3 text-sm font-medium"
          style={{ background: accentColor, color: contrastingText(accentColor), borderRadius: radius }}>
          {form.status === "submitting" ? "Simulando envío…" : "Simular envío"}
        </button>
        <p role="status" className="text-sm text-white/85">{form.status === "submitting" ? "Procesando el ejemplo, sin enviar datos." : ""}</p>
      </form>
      {form.status === "success" && <DemoConfirmation onReset={form.reset} onClose={form.reset} accentColor={accentColor} fontFamily={fontFamily} radius={radius} />}
    </div>
  )
}
