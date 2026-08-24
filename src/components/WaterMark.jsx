export default function WaterMark() {
  return (
    <div className="fixed bottom-3 left-3 z-50 pointer-events-none select-none">
      <p
        className="text-xs font-medium opacity-50 tracking-wide"
        style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        Demo · Ian Habid Aldana Martínez
      </p>
    </div>
  )
}