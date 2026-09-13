export default function StatCard({ label, value, unit }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value ?? '—'}
        {value != null && unit ? <span className="stat-unit">{unit}</span> : null}
      </span>
    </div>
  )
}
