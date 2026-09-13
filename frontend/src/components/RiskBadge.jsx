const RISK = {
  SAFE: { className: 'risk-safe', icon: '✓' },
  WARNING: { className: 'risk-warning', icon: '⚠' },
  DANGER: { className: 'risk-danger', icon: '✕' },
}

export default function RiskBadge({ label, size = 'md' }) {
  if (!label) return null
  const risk = RISK[label] ?? { className: '', icon: '' }
  return (
    <span className={`risk-badge ${risk.className} risk-badge-${size}`}>
      <span aria-hidden="true">{risk.icon}</span>
      {label}
    </span>
  )
}
