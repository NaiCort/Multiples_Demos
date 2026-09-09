import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

// El diálogo nativo mantiene el foco dentro, bloquea el fondo y admite Escape.
// Se monta solo mientras está abierto; su estado pertenece a cada apertura.
export default function Modal({ title, onClose, children, fontFamily, radius = 16, className = "" }) {
  const dialogRef = useRef(null)
  const headingRef = useRef(null)
  const titleId = useId()
  const backdropPress = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    headingRef.current?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby={titleId} className={`demo-modal ${className}`}
      style={{ fontFamily, borderRadius: radius }}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget) onClose()
        backdropPress.current = false
      }}>
      <div className="demo-modal-content">
        <div className="flex items-start justify-between gap-3 mb-5">
          <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-lg font-medium leading-snug">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar ventana" className="demo-icon-button shrink-0">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>, document.body
  )
}
