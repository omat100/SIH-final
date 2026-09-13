import { useEffect, useState } from 'react'
import RiskBadge from '../components/RiskBadge'
import ConfidenceBars from '../components/ConfidenceBars'
import { useLiveReading } from '../hooks/useLiveReading'
import { predict } from '../lib/api'

const DEFAULT_FORM = {
  temperature_c: 28,
  humidity_pct: 60,
  distance_mm_day: 3,
  tilt_deg: 1,
}

export default function Calibration() {
  const { reading, connected } = useLiveReading()
  const [livePrediction, setLivePrediction] = useState(null)
  const [liveError, setLiveError] = useState(null)

  const [form, setForm] = useState(DEFAULT_FORM)
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState(null)
  const [testLoading, setTestLoading] = useState(false)

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
          setLivePrediction(res)
          setLiveError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setLiveError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [reading])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleTest(e) {
    e.preventDefault()
    setTestLoading(true)
    setTestError(null)
    try {
      const parsed = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
      )
      const res = await predict(parsed)
      setTestResult(res)
    } catch (err) {
      setTestError(err.message)
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-header">
          <h2>Latest Reading</h2>
          <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {reading ? (
          <div className="latest-grid">
            <div className="latest-values">
              <div><span className="muted">Temperature</span><strong>{reading.temperature} °C</strong></div>
              <div><span className="muted">Humidity</span><strong>{reading.humidity} %</strong></div>
              <div><span className="muted">Distance</span><strong>{reading.distance} mm</strong></div>
              <div><span className="muted">Tilt</span><strong>{reading.tilt} °</strong></div>
            </div>
            <div className="latest-prediction">
              {liveError && <p className="error-text">Prediction failed: {liveError}</p>}
              {livePrediction && (
                <>
                  <div className="prediction-headline">
                    <RiskBadge label={livePrediction.label} />
                    <span className="muted">{livePrediction.confidence}% confidence</span>
                  </div>
                  <ConfidenceBars probabilities={livePrediction.probabilities} />
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="muted">Waiting for live sensor data…</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Parameter Calibration</h2>
        </div>
        <p className="muted">
          Manually set sensor values and run them through the model to test its behaviour.
        </p>

        <form className="calibration-form" onSubmit={handleTest}>
          <label>
            Temperature (°C)
            <input
              type="number"
              step="0.01"
              value={form.temperature_c}
              onChange={(e) => handleChange('temperature_c', e.target.value)}
            />
          </label>
          <label>
            Humidity (%)
            <input
              type="number"
              step="0.01"
              value={form.humidity_pct}
              onChange={(e) => handleChange('humidity_pct', e.target.value)}
            />
          </label>
          <label>
            Distance (mm/day)
            <input
              type="number"
              step="0.01"
              value={form.distance_mm_day}
              onChange={(e) => handleChange('distance_mm_day', e.target.value)}
            />
          </label>
          <label>
            Tilt (°)
            <input
              type="number"
              step="0.01"
              value={form.tilt_deg}
              onChange={(e) => handleChange('tilt_deg', e.target.value)}
            />
          </label>
          <button type="submit" disabled={testLoading}>
            {testLoading ? 'Running…' : 'Run Prediction'}
          </button>
        </form>

        {testError && <p className="error-text">{testError}</p>}
        {testResult && (
          <div className="test-result">
            <div className="prediction-headline">
              <RiskBadge label={testResult.label} />
              <span className="muted">{testResult.confidence}% confidence</span>
            </div>
            <ConfidenceBars probabilities={testResult.probabilities} />
          </div>
        )}
      </section>
    </div>
  )
}
