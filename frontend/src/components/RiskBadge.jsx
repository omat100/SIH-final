const RISK_CLASS = {
  SAFE: 'risk-safe',
  WARNING: 'risk-warning',
  DANGER: 'risk-danger',
}

export default function RiskBadge({ label }) {
  if (!label) return null
  return <span className={`risk-badge ${RISK_CLASS[label] ?? ''}`}>{label}</span>
}
