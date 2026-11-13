import { Plus } from "lucide-react"
import Foto from "../components/Foto"
import { CATEGORIAS } from "../data/carta"
import { LOTE_SEMANA, pesos } from "../data/lotes"

export default function Carta({ onChoose }) {
  return (
    <>
      <section className="l-page-head" aria-labelledby="l-carta-titulo">
        <h1 id="l-carta-titulo" tabIndex={-1}>
          La carta
        </h1>
        <p className="l-lead">
          Pide desde aquí y recoge en barra a la hora que elijas. Esta semana el espresso es de{" "}
          {LOTE_SEMANA.nombre}, {LOTE_SEMANA.municipio}.
        </p>
        <div className="l-head-photos">
          <Foto id="espresso" priority sizes="(min-width: 960px) 40vw, 100vw" />
          <Foto id="goteo" sizes="(min-width: 960px) 30vw, 50vw" />
          <Foto id="tostador" sizes="(min-width: 960px) 30vw, 50vw" />
        </div>
        <nav className="l-jump" aria-label="Secciones de la carta">
          {CATEGORIAS.map((categoria) => (
            <a key={categoria.id} href={`#${categoria.id}`}>
              {categoria.nombre}
            </a>
          ))}
        </nav>
      </section>
      {CATEGORIAS.map((categoria) => (
        <section
          key={categoria.id}
          id={categoria.id}
          className="l-section l-menu-section"
          aria-labelledby={`${categoria.id}-titulo`}
        >
          <div className="l-menu-heading">
            <h2 id={`${categoria.id}-titulo`}>{categoria.nombre}</h2>
            <p>{categoria.nota}</p>
          </div>
          <ul className="l-menu">
            {categoria.items.map((item) => (
              <li key={item.id}>
                <div>
                  <h3>{item.nombre}</h3>
                  <p>{item.desc}</p>
                </div>
                <span className="l-price l-num">
                  {item.opciones.includes("peso") ? "250 g · " : ""}
                  {pesos(item.precio)}
                </span>
                <button
                  type="button"
                  className="l-add"
                  aria-label={`Agregar ${item.nombre}`}
                  onClick={() => onChoose(item)}
                >
                  <Plus size={16} aria-hidden="true" />
                  <span>Agregar</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="l-section l-fiction">
        Precios de ejemplo en MXN. Pago al recoger, en caja: esta demo no cobra ni envía pedidos.
      </p>
    </>
  )
}
