import { Component } from "react"

export default class RouteErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="route-message" id="contenido">
      <h1 className="text-2xl">No pudimos cargar esta página</h1>
      <p>Puede haber una nueva versión o un problema de conexión.</p>
      <button type="button" onClick={() => window.location.reload()}>Volver a intentar</button>
      <a href="/">Volver al portafolio</a>
    </main>
    return this.props.children
  }
}
