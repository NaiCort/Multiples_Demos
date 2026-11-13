import AltitudeProfile from "../components/AltitudeProfile"
import Foto from "../components/Foto"
import LoteSheet from "../components/LoteSheet"
import { findItem } from "../data/carta"
import { LOTES } from "../data/lotes"

const PROCESOS = [
  [
    "Lavado",
    "Se quita la pulpa y el grano se lava antes de secarlo. Da tazas limpias, con acidez clara.",
  ],
  [
    "Honey",
    "Se seca con parte de la miel de la cereza pegada al grano. Más dulzor y cuerpo que el lavado.",
  ],
  [
    "Natural",
    "La cereza se seca entera, con la fruta. Notas de fruta madura y más cuerpo; también más riesgo.",
  ],
]

export default function Origen({ onChoose }) {
  return (
    <>
      <section className="l-page-head" aria-labelledby="l-origen-titulo">
        <h1 id="l-origen-titulo" tabIndex={-1}>
          Origen
        </h1>
        <p className="l-lead">
          Cuatro fincas de la región cafetalera alrededor de Xalapa. En cada ficha decimos quién
          cultivó el café, a qué altura y cuánto le pagamos por kilo.
        </p>
        <div className="l-head-photos l-head-photos-two">
          <Foto id="cerezas" priority sizes="(min-width: 720px) 50vw, 100vw" />
          <Foto id="secado" priority sizes="(min-width: 720px) 50vw, 100vw" />
        </div>
        <figure className="l-profile-figure">
          <div
            className="l-profile-scroll"
            tabIndex={0}
            aria-label="Perfil de altitud de los lotes"
          >
            <AltitudeProfile lotes={LOTES} />
          </div>
          <figcaption>
            Altitud de cada lote sobre la misma ladera. A más altura, la cereza madura más despacio
            y la taza suele ser más ácida y compleja.{" "}
            <span className="l-mobile-only">Desliza la gráfica para ver los cuatro lotes.</span>
          </figcaption>
        </figure>
      </section>

      {LOTES.map((lote) => (
        <section
          key={lote.id}
          id={lote.id}
          className="l-section l-origin-lot"
          aria-label={`Lote ${lote.nombre}`}
        >
          <LoteSheet lote={lote} headingId={`${lote.id}-titulo`} />
          <div className="l-actions">
            <button
              type="button"
              className="l-button l-button-cherry"
              onClick={() => onChoose(findItem(`bolsa-${lote.id}`))}
            >
              Comprar bolsa de {lote.nombre}
            </button>
            <button
              type="button"
              className="l-button l-button-line"
              onClick={() => onChoose(findItem("v60"), { lote: lote.id })}
            >
              Probarlo en gotero V60
            </button>
          </div>
        </section>
      ))}

      <section className="l-section l-reading" aria-labelledby="l-leer-titulo">
        <h2 id="l-leer-titulo">Cómo leer la ficha</h2>
        <figure className="l-roast-figure">
          <Foto id="tuestes" sizes="(min-width: 960px) 50vw, 100vw" />
          <figcaption>
            Del grano verde al tueste oscuro: la misma escala que colorea el relieve de cada ficha.
          </figcaption>
        </figure>
        <dl>
          <div>
            <dt>Puntaje de cata</dt>
            <dd>
              Calificación de 0 a 100 que se da al probar el café con un protocolo común. Desde 80
              puntos se considera café de especialidad.
            </dd>
          </div>
          <div>
            <dt>Pagado al productor</dt>
            <dd>
              Lo que Ladera pagó por cada kilo de café verde, antes de tostarlo. En esta demo las
              cifras son de ejemplo.
            </dd>
          </div>
          {PROCESOS.map(([nombre, texto]) => (
            <div key={nombre}>
              <dt>{nombre}</dt>
              <dd>{texto}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
