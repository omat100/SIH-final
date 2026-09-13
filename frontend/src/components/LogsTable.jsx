export default function LogsTable({ rows, loading, error }) {
  if (loading) return <p className="muted">Loading logs…</p>
  if (error) return <p className="error-text">Failed to load logs: {error}</p>
  if (!rows || rows.length === 0) return <p className="muted">No records yet.</p>

  return (
    <div className="table-wrap">
      <table className="logs-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temp (°C)</th>
            <th>Humidity (%)</th>
            <th>Distance (mm)</th>
            <th>Tilt (°)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.time ? new Date(row.time).toLocaleString() : '—'}</td>
              <td>{row.temperature_c}</td>
              <td>{row.humidity_pct}</td>
              <td>{row.distance_mm}</td>
              <td>{row.tilt_deg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
