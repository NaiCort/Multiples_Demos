import { FOTOS } from "../data/fotos"

// Fotografía local con medidas fijas para no mover la página al cargar.
export default function Foto({ id, priority = false, className = "", sizes = "100vw" }) {
  const foto = FOTOS[id]
  const small = Math.round(foto.w * Math.min(1, 640 / Math.max(foto.w, foto.h)))
  return (
    <img
      className={`l-foto ${className}`}
      src={foto.src}
      srcSet={`${foto.src.replace(".webp", "-640.webp")} ${small}w, ${foto.src} ${foto.w}w`}
      alt={foto.alt}
      width={foto.w}
      height={foto.h}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  )
}
