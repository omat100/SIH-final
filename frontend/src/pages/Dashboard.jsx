import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import LogsTable from '../components/LogsTable'
import TrendChart from '../components/TrendChart'
import { useLiveReading } from '../hooks/useLiveReading'
import { fetchLogs } from '../lib/api'

export default function Dashboard() {
  const { reading, connected } = useLiveReading()
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [logsError, setLogsError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchLogs()
        if (!cancelled) setLogs(data)
      } catch (err) {
        if (!cancelled) setLogsError(err.message)
      } finally {
        if (!cancelled) setLogsLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const chronological = useMemo(
    () => [...logs].sort((a, b) => new Date(a.time) - new Date(b.time)),
    [logs]
  )

  const trendFor = (field) =>
    chronological.map((row) => ({ time: row.time, value: row[field] }))

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>Live Sensor Dashboard</h2>
          <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="stat-grid">
          <StatCard label="Temperature" value={reading?.temperature} unit="°C" />
          <StatCard label="Humidity" value={reading?.humidity} unit="%" />
          <StatCard label="Distance" value={reading?.distance} unit="mm" />
          <StatCard label="Tilt" value={reading?.tilt} unit="°" />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Trends</h2>
        </div>
        <div className="trend-grid">
          <TrendChart title="Temperature" data={trendFor('temperature_c')} color="var(--chart-series-1)" unit="°C" />
          <TrendChart title="Humidity" data={trendFor('humidity_pct')} color="var(--chart-series-2)" unit="%" />
          <TrendChart title="Distance" data={trendFor('distance_mm')} color="var(--chart-series-3)" unit="mm" />
          <TrendChart title="Tilt" data={trendFor('tilt_deg')} color="var(--text-h)" unit="°" />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Logs</h2>
        </div>
        <LogsTable rows={logs} loading={logsLoading} error={logsError} />
      </section>
    </div>
  )
}
