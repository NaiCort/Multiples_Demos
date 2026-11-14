import { useState } from "react"
import { Navigation } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { LOCAL } from "../data/local"

// Indicaciones de ejemplo. El botón de mapas explica qué haría en un sitio real y no abre
// ningún lugar: Ladera no existe y un enlace real llevaría a un tercero.
export default function ComoLlegar() {
  const [open, setOpen] = useState(false)
  return (
    <section id="como-llegar" className="l-section l-directions" aria-labelledby="l-llegar-titulo">
      <h2 id="l-llegar-titulo">Cómo llegar</h2>
      <ol className="l-directions-list">
        {LOCAL.llegar.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>
      <button type="button" className="l-button l-button-line" onClick={() => setOpen(true)}>
        <Navigation size={17} aria-hidden="true" />
        Abrir en mapas
      </button>
      {open && (
        <Modal
          title="Abrir en mapas"
          onClose={() => setOpen(false)}
          className="ladera-modal"
          radius={2}
        >
          <p>
            En el sitio de un café real, este botón abriría su ubicación en la aplicación de mapas
            del teléfono, lista para pedir indicaciones. Ladera es ficticio, así que no se abre
            ningún mapa ni se consulta tu ubicación.
          </p>
          <div className="l-actions">
            <button type="button" className="l-button l-button-ink" onClick={() => setOpen(false)}>
              Entendido
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
