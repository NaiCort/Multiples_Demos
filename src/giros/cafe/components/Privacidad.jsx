import Modal from "../../../components/shared/Modal"

// Aviso de privacidad propio de Ladera: dice qué guarda esta demo y dónde.
export default function Privacidad({ onClose, onBorrar }) {
  return (
    <Modal
      title="Aviso de privacidad de esta demo"
      onClose={onClose}
      className="ladera-modal"
      radius={2}
    >
      <div className="l-privacy">
        <p>
          Ladera es un café ficticio. El nombre que escribes para el vaso o para la cata, el
          carrito, el pedido en curso, la tarjeta de visitas y la reserva de la cata se guardan solo
          en el almacenamiento local de este navegador, para que el recorrido siga al recargar. No
          se envían a ningún servidor ni se comparten entre dispositivos.
        </p>
        <p>
          No se piden teléfonos, correos, tarjetas ni datos fiscales, y no se cobra nada. WhatsApp
          es una conversación simulada que no sale de la página.
        </p>
        <p>
          Las fotografías y las tipografías se sirven desde este mismo sitio. El alojamiento recibe
          las solicitudes necesarias para cargar la página. «Contactar» y «Hablemos» llevan a los
          canales reales de Ian; si los usas, aplican las condiciones de ese servicio.
        </p>
        <p>
          Este texto explica el prototipo. Un café real necesita su propio aviso de privacidad
          conforme a la ley mexicana de protección de datos personales y a los datos que recabe.
        </p>
      </div>
      <div className="l-actions">
        <button type="button" className="l-button l-button-ink" onClick={onClose}>
          Entendido
        </button>
        <button type="button" className="l-button l-button-line" onClick={onBorrar}>
          Borrar mis datos de Ladera
        </button>
      </div>
    </Modal>
  )
}
