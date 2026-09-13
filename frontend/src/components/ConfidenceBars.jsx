const RISK_CLASS = {
  SAFE: 'risk-safe',
  WARNING: 'risk-warning',
  DANGER: 'risk-danger',
}

export default function ConfidenceBars({ probabilities }) {
  if (!probabilities) return null
  const entries = Object.entries(probabilities)

  return (
    <div className="confidence-bars">
      {entries.map(([label, pct]) => (
        <div className="confidence-row" key={label}>
          <span className="confidence-label">{label}</span>
          <div className="confidence-track">
            <div
              className={`confidence-fill ${RISK_CLASS[label] ?? ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="confidence-pct">{pct.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  )
}
