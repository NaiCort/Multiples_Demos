export default function PatioSeal({ small = false }) {
  return <span className={`r-seal ${small ? "r-seal-small" : ""}`} aria-hidden="true"><span>COCINA DE BARRIO</span><strong>12</strong><span>BUEN COMER · DEMO</span></span>
}
