import { useEffect, useState } from 'react'
import { socket } from '../lib/socket'

export function useLiveReading() {
  const [reading, setReading] = useState(null)
  const [connected, setConnected] = useState(socket.connected)

  useEffect(() => {
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onData = (data) => setReading({ ...data, receivedAt: new Date().toISOString() })

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('sensor_data', onData)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('sensor_data', onData)
    }
  }, [])

  return { reading, connected }
}
