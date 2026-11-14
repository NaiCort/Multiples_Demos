import { FOTOS } from "../data/fotos"

const LICENCIAS = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/deed.es",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/deed.es",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/deed.es",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/deed.es",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/deed.es",
}

export default function Creditos() {
  return (
    <section className="l-page-head l-credits" aria-labelledby="l-creditos-titulo">
      <h1 id="l-creditos-titulo" tabIndex={-1}>
        Créditos
      </h1>
      <p className="l-lead">
        Las fotografías vienen de Wikimedia Commons y se muestran reducidas, sin otros cambios.
        Ilustran el ambiente de un café; no muestran a Ladera, que es ficticio, ni lugares de
        Xalapa.
      </p>
      <ul className="l-credit-list">
        {Object.entries(FOTOS).map(([id, foto]) => (
          <li key={id}>
            <img
              src={foto.src.replace(".webp", "-640.webp")}
              alt=""
              width={96}
              height={72}
              loading="lazy"
            />
            <div>
              <p>{foto.alt}</p>
              <p className="l-credit-meta">
                <a href={foto.pagina} target="_blank" rel="noopener noreferrer">
                  {foto.autor}, en Wikimedia Commons
                </a>{" "}
                ·{" "}
                {LICENCIAS[foto.licencia] ? (
                  <a href={LICENCIAS[foto.licencia]} target="_blank" rel="noopener noreferrer">
                    {foto.licencia}
                  </a>
                ) : foto.licencia === "Public domain" ? (
                  "Dominio público"
                ) : (
                  foto.licencia
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="l-fiction">
        Tipografías Archivo y Source Serif 4, con licencia SIL Open Font License 1.1. El relieve de
        las fincas se genera en el navegador y no reproduce un terreno real.
      </p>
    </section>
  )
}
