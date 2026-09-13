export async function fetchLogs() {
  const res = await fetch('/api/dashboard/records')
  if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`)
  return res.json()
}

export async function predict({ temperature_c, humidity_pct, distance_mm_day, tilt_deg }) {
  const res = await fetch('/api/predict/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ temperature_c, humidity_pct, distance_mm_day, tilt_deg }),
  })
  if (!res.ok) throw new Error(`Prediction failed: ${res.status}`)
  return res.json()
}
