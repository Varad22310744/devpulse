import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Report from './pages/Report'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on every page load
  useEffect(() => {
    // Check token in URL first (after OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/dashboard');
    }

    // Use stored token
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    axios.get(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
      })
  }, [])

  // Show nothing while checking login status
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#8b949e'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      {/* Home — redirect to dashboard if already logged in */}
      <Route
        path='/'
        element={user ? <Navigate to='/dashboard' /> : <Home />}
      />

      {/* Dashboard — redirect to home if not logged in */}
      <Route
        path='/dashboard'
        element={user ? <Dashboard user={user} /> : <Navigate to='/' />}
      />

      {/* Report — redirect to home if not logged in */}
      <Route
        path='/report'
        element={user ? <Report user={user} /> : <Navigate to='/' />}
      />

      {/* Any unknown URL → home */}
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App