import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { apiAdminLogin } from '../api'
import '../styles.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!username || !password) {
        throw new Error('Please enter both username and password')
      }

      const response = await apiAdminLogin(username, password)
      
      // Store admin session in localStorage
      localStorage.setItem('admin_token', response.admin_token)
      localStorage.setItem('admin_username', response.admin_username)
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Left Panel: Hero Image + Logo Overlay */}
      <div className="auth-left">
        <div className="auth-logo-wrapper">
          <img src="/assets/skinpal-girl-illustration.png" className="logo-large" alt="SkinPal Logo" />
          <h1 className="logo-text">SKINPAL</h1>
          <p className="logo-sub">ADMIN PANEL</p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Manage products and system settings</p>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              border: '1px solid #f5c6cb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Logging In...' : 'Login to Admin Panel'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #eee',
            fontSize: '0.9rem',
            color: '#666',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>Admin access only</p>
          </div>

          <button
            type="button"
            className="btn-auth"
            style={{ 
              marginTop: '1rem',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd'
            }}
            onClick={() => navigate('/auth')}
          >
            Back to User Login
          </button>
        </div>
      </div>
    </div>
  )
}
