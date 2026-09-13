import { useRef, useState } from 'react'

const WIDTH = 400
const HEIGHT = 120
const PAD_X = 8
const PAD_TOP = 12
const PAD_BOTTOM = 20

export default function TrendChart({ title, data, color, unit }) {
  const svgRef = useRef(null)
  const [hoverIndex, setHoverIndex] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="trend-chart">
        <div className="trend-chart-title">{title}</div>
        <p className="muted">No data yet.</p>
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const plotWidth = WIDTH - PAD_X * 2
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

  const points = data.map((d, i) => {
    const x = PAD_X + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth)
    const y = PAD_TOP + plotHeight - ((d.value - min) / range) * plotHeight
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
  const baselineY = PAD_TOP + plotHeight
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(2)},${baselineY} L${points[0].x.toFixed(2)},${baselineY} Z`

  const last = points[points.length - 1]
  const hovered = hoverIndex != null ? points[hoverIndex] : null

  function handleMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH
    let nearest = 0
    let bestDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX)
      if (dist < bestDist) {
        bestDist = dist
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  function handleLeave() {
    setHoverIndex(null)
  }

  const active = hovered ?? last

  return (
    <div className="trend-chart">
      <div className="trend-chart-title">{title}</div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="trend-chart-svg"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD_X}
            x2={WIDTH - PAD_X}
            y1={PAD_TOP + plotHeight * f}
            y2={PAD_TOP + plotHeight * f}
            className="trend-grid-line"
          />
        ))}
        <line
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={baselineY}
          y2={baselineY}
          className="trend-axis-line"
        />
        <path d={areaPath} fill={color} opacity="0.12" stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PAD_TOP}
            y2={baselineY}
            className="trend-crosshair"
          />
        )}
        <circle cx={active.x} cy={active.y} r="4" fill={color} stroke="var(--bg)" strokeWidth="1.5" />
      </svg>
      <div className="trend-chart-footer">
        <span className="muted">
          {new Date(active.time).toLocaleTimeString()}
        </span>
        <strong style={{ color }}>
          {active.value}
          {unit}
        </strong>
      </div>
    </div>
  )
}
