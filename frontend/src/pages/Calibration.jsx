import { useState } from 'react'
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

const FIELDS = [
  { key: 'temperature_c', label: 'Temperature (°C)' },
  { key: 'humidity_pct', label: 'Humidity (%)' },
  { key: 'distance_mm_day', label: 'Distance (mm/day)' },
  { key: 'tilt_deg', label: 'Tilt (°)' },
]

export default function Calibration() {
  const { reading } = useLiveReading()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState(null)
  const [testLoading, setTestLoading] = useState(false)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function loadLiveValues() {
    if (!reading) return
    setForm({
      temperature_c: reading.temperature,
      humidity_pct: reading.humidity,
      distance_mm_day: reading.distance,
      tilt_deg: reading.tilt,
    })
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
          <h2>Parameter Calibration</h2>
          <button type="button" className="ghost-button" onClick={loadLiveValues} disabled={!reading}>
            Load live values
          </button>
        </div>
        <p className="muted">
          Set sensor values manually and run them through the model to see how it responds — useful
          for probing thresholds or testing edge cases the live stream hasn't hit yet.
        </p>

        <form className="calibration-form" onSubmit={handleTest}>
          {FIELDS.map(({ key, label }) => (
            <label key={key}>
              {label}
              <input
                type="number"
                step="0.01"
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </label>
          ))}
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
