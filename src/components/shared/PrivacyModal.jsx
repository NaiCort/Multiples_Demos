import Modal from "./Modal"
import { contrastingText, dialogAccent } from "../../utils/colors"

export default function PrivacyModal({ isOpen, onClose, accentColor, fontFamily, radius = 16 }) {
  if (!isOpen) return null
  const accent = dialogAccent(accentColor)
  return (
    <Modal title="Privacidad de esta demostración" onClose={onClose} fontFamily={fontFamily} radius={radius}>
      <div className="space-y-3 text-sm leading-relaxed text-slate-300">
        <p>Utiliza datos ficticios. Los formularios, la reserva y la conversación de WhatsApp son simulaciones: sus datos permanecen en la memoria de esta página, no se envían a un servidor y se descartan al recargar o salir de la demo.</p>
        <p>El navegador puede recordar el tema visual mediante almacenamiento local. Si ese almacenamiento está bloqueado, la demo sigue funcionando.</p>
        <p>Las tipografías se solicitan a Google Fonts y las fotografías a Unsplash. Estos servicios y el alojamiento reciben las solicitudes necesarias para cargar la página.</p>
        <p>Las acciones “Contactar” y “Hablemos” llevan a los canales reales de Ian. Si decides utilizarlos, se aplican las condiciones del servicio que abras.</p>
        <p>Este texto explica el funcionamiento del prototipo. Un sitio de un negocio real necesitará su propio aviso según los datos y proveedores que utilice.</p>
      </div>
      <button type="button" onClick={onClose} className="w-full mt-5 py-3 text-sm font-medium rounded-lg"
        style={{ background: accent, color: contrastingText(accent) }}>Entendido</button>
    </Modal>
  )
}
