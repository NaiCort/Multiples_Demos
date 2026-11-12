import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { clock, stepIndex } from "../state/guia"

// Temporizador de preparación: cuenta de verdad y marca cada vertido. Se monta de nuevo
// al cambiar de método o de tazas, así que su estado pertenece a una sola preparación.
export default function BrewTimer({ guia, receta }) {
  const [accumulated, setAccumulated] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const running = startedAt !== null
  const elapsed = Math.min(guia.fin, (accumulated + (running ? now - startedAt : 0)) / 1000)
  const done = elapsed >= guia.fin
  const index = stepIndex(receta.pasos, elapsed)
  const paso = receta.pasos[index]
  const started = running || accumulated > 0
  const resultRef = useRef(null)

  useEffect(() => {
    if (!running || done) return undefined
    const timer = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(timer)
  }, [running, done])
  useEffect(() => {
    if (done) resultRef.current?.focus({ preventScroll: true })
  }, [done])

  const start = () => {
    const at = Date.now()
    setNow(at)
    setStartedAt(at)
  }
  const pause = () => {
    setAccumulated((value) => value + (Date.now() - startedAt))
    setStartedAt(null)
  }
  const reset = () => {
    setAccumulated(0)
    setStartedAt(null)
  }

  return (
    <div className="l-timer">
      <div className="l-timer-readout">
        <span role="timer" aria-label={`Tiempo ${clock(elapsed)} de ${clock(guia.fin)}`}>
          <strong className="l-num">{clock(elapsed)}</strong>
          <span className="l-num"> / {clock(guia.fin)}</span>
        </span>
        <span className="l-timer-water">
          {started ? (
            <>
              Agua en total: <strong className="l-num">{paso.agua} g</strong>
            </>
          ) : (
            `Ten listos ${receta.cafe} g de café y ${receta.agua} g de agua.`
          )}
        </span>
      </div>
      <div className="l-timer-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${elapsed / guia.fin})` }} />
        {receta.pasos.map((step) => (
          <i key={step.at} style={{ left: `${(step.at / guia.fin) * 100}%` }} />
        ))}
      </div>
      <ol className="l-steps">
        {receta.pasos.map((step, i) => (
          <li
            key={step.at}
            className={
              started && (done || i < index)
                ? "is-done"
                : started && i === index
                  ? "is-current"
                  : ""
            }
            aria-current={started && !done && i === index ? "step" : undefined}
          >
            <span className="l-num">{clock(step.at)}</span>
            <span>{step.texto}</span>
          </li>
        ))}
      </ol>
      <p className="l-sr-only" aria-live="polite">
        {started && !done ? `Paso ${index + 1}: ${paso.texto}` : ""}
      </p>
      {done ? (
        <div className="l-timer-done" tabIndex={-1} ref={resultRef}>
          <p>
            <strong>Listo.</strong> Prueba antes de cambiar nada: si sabe amargo o seco, muele más
            grueso; si sabe agrio o aguado, más fino.
          </p>
          <button type="button" className="l-button l-button-line" onClick={reset}>
            <RotateCcw size={17} aria-hidden="true" />
            Preparar otra vez
          </button>
        </div>
      ) : (
        <div className="l-actions">
          {running ? (
            <button type="button" className="l-button l-button-ink" onClick={pause}>
              <Pause size={17} aria-hidden="true" />
              Pausar
            </button>
          ) : (
            <button type="button" className="l-button l-button-ink" onClick={start}>
              <Play size={17} aria-hidden="true" />
              {started ? "Continuar" : "Iniciar temporizador"}
            </button>
          )}
          {started && (
            <button type="button" className="l-button l-button-line" onClick={reset}>
              <RotateCcw size={17} aria-hidden="true" />
              Reiniciar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
