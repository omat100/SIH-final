import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import LogsTable from '../components/LogsTable'
import TrendChart from '../components/TrendChart'
import RiskBadge from '../components/RiskBadge'
import ConfidenceBars from '../components/ConfidenceBars'
import { useLiveReading } from '../hooks/useLiveReading'
import { fetchLogs, fetchSource, predict } from '../lib/api'

const SOURCE_LABEL = {
  esp32: 'ESP32 Hardware',
  generator: 'Simulated Data',
}

export default function Dashboard() {
  const { reading, connected } = useLiveReading()
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [logsError, setLogsError] = useState(null)
  const [source, setSource] = useState(null)
  const [risk, setRisk] = useState(null)
  const [riskError, setRiskError] = useState(null)

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

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchSource()
        if (!cancelled) setSource(data.source)
      } catch {
        // non-critical — leave badge hidden
      }
    }

    load()
    const interval = setInterval(load, 15000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!reading) return
    let cancelled = false

    predict({
      temperature_c: reading.temperature,
      humidity_pct: reading.humidity,
      distance_mm_day: reading.distance,
      tilt_deg: reading.tilt,
    })
      .then((res) => {
        if (!cancelled) {
          setRisk(res)
          setRiskError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setRiskError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [reading])

  const chronological = useMemo(
    () => [...logs].sort((a, b) => new Date(a.time) - new Date(b.time)),
    [logs]
  )

  const trendFor = (field) =>
    chronological.map((row) => ({ time: row.time, value: row[field] }))

  return (
    <div className="page">
      <section className={`panel hero-panel${risk ? ` hero-${risk.label.toLowerCase()}` : ''}`}>
        <div className="hero-top">
          <h2>Current Risk</h2>
          <div className="hero-badges">
            <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
            {source && <span className="source-badge">{SOURCE_LABEL[source] ?? source}</span>}
          </div>
        </div>

        {risk ? (
          <>
            <div className="hero-body">
              <RiskBadge label={risk.label} size="lg" />
              <span className="hero-confidence">{risk.confidence}% confidence</span>
            </div>
            <ConfidenceBars probabilities={risk.probabilities} />
          </>
        ) : riskError ? (
          <p className="error-text">Prediction failed: {riskError}</p>
        ) : (
          <p className="muted">Waiting for live sensor data…</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Live Readings</h2>
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
