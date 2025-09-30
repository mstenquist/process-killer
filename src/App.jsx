import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

function App() {
  const [ports, setPorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [error, setError] = useState(null)
  const [showSkull, setShowSkull] = useState(false)

  const fetchPorts = async () => {
    try {
      const response = await fetch('/api/ports')
      const data = await response.json()
      setPorts(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError('Error loading port information')
      setLoading(false)
      console.error('Error fetching ports:', err)
    }
  }

  useEffect(() => {
    fetchPorts()
  }, [])

  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(fetchPorts, 5000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const killProcess = async (pid, buttonElement) => {
    if (!pid) return false

    try {
      const response = await fetch(`/api/kill/${pid}`, {
        method: 'POST'
      })
      const result = await response.json()

      if (result.success) {
        toast.success(`Process ${pid} killed successfully`)
        setShowSkull(true)
        setTimeout(() => {
          setShowSkull(false)
        }, 1000)
        setTimeout(() => {
          fetchPorts()
        }, 2000)
        return true
      } else {
        toast.error(`Failed to kill process: ${result.error}`)
        return false
      }
    } catch (err) {
      console.error('Error killing process:', err)
      toast.error('Error killing process. Please try again.')
      return false
    }
  }

  const stats = {
    total: ports.length,
    active: ports.filter(p => p.inUse).length,
    available: ports.filter(p => !p.inUse).length
  }

  return (
    <>
      <Toaster position="top-right" />
      {showSkull && (
        <div className="skull-overlay">
          💀
        </div>
      )}
      <div className="container">
        <div className="header">
        <div className="header-content">
          <h1>⚡ Process Killer</h1>
          <p>Monitor and manage your development ports with ease</p>
        </div>
        <div className="header-stats">
          {!loading && (
            <div className="stats">
              <div className="stat">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Ports</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.active}</div>
                <div className="stat-label">In Use</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.available}</div>
                <div className="stat-label">Available</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <button className="refresh-btn" onClick={fetchPorts}>
          🔄 Refresh Ports
        </button>
        <div className="auto-refresh">
          <input
            type="checkbox"
            id="autoRefresh"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <label htmlFor="autoRefresh">Auto-refresh (5s)</label>
        </div>
      </div>

      <div id="content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading port information...</p>
          </div>
        ) : error ? (
          <div className="loading">
            <p>❌ {error}</p>
            <p style={{ marginTop: '10px', color: '#6c757d' }}>Make sure the server is running</p>
          </div>
        ) : (
          <div className="ports-grid">
            {ports.map(port => (
              <PortCard key={port.port} port={port} onKill={killProcess} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

function Tooltip({ children, text }) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useState(null)

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect()
    // Only show if text is truncated
    if (e.target.scrollWidth > e.target.clientWidth) {
      setShow(true)
    }
  }

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setShow(false)
  }

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {show && (
        <div
          className="sticky-tooltip visible"
          style={{
            left: `${position.x + 10}px`,
            top: `${position.y - 35}px`,
          }}
        >
          {text}
        </div>
      )}
    </>
  )
}

function PortCard({ port, onKill }) {
  const [killed, setKilled] = useState(false)

  const handleKill = async (e) => {
    if (!port.pid) return
    const success = await onKill(port.pid, e.target)
    if (success) {
      setKilled(true)
    }
  }

  return (
    <div className={`port-card ${port.inUse ? 'in-use' : 'available'}`}>
      <div className="port-header">
        <div className="port-number">
          <div className="port-tooltip">
            <a href={`http://localhost:${port.port}`} target="_blank" rel="noreferrer" className="port-link">
              :{port.port}
            </a>
            <div className="tooltip-content">
              <div className="tooltip-header">http://localhost:{port.port}</div>
              <div className="tooltip-loading">Loading preview...</div>
              <iframe
                src={`http://localhost:${port.port}`}
                sandbox="allow-scripts allow-same-origin"
                style={{ display: 'none' }}
                title={`Port ${port.port} preview`}
              />
            </div>
          </div>
        </div>
        <div className={`port-status ${port.inUse ? 'in-use' : 'available'}`}>
          {port.inUse ? 'In Use' : 'Available'}
        </div>
      </div>
      <div className="port-details">
        <div className="port-detail">
          <span className="label">PID:</span>
          <span className="value">
            {port.pid || 'N/A'}
          </span>
        </div>
        <div className="port-detail">
          <span className="label">Name:</span>
          <Tooltip text={port.process || 'N/A'}>
            <span className="value">
              {port.process || 'N/A'}
            </span>
          </Tooltip>
        </div>
      </div>
      <button
        className="kill-btn"
        disabled={!port.inUse || killed}
        onClick={handleKill}
        style={killed ? {
          background: '#2c3e50',
          color: 'white',
          transform: 'scale(0.95)'
        } : {}}
      >
        {killed ? '🪓 Process Killed' : port.inUse ? '💀 Kill Process' : '✅ Available'}
      </button>
    </div>
  )
}

export default App