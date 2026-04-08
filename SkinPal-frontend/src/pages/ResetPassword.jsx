import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword(){
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    // Check if we have a valid session from Supabase
    // This is handled automatically when user clicks the reset link
    setPageLoaded(true)
  }, [])

  async function handleResetPassword(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (!password || !confirmPassword) {
        throw new Error('Please enter and confirm your password')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // This would require a backend endpoint to update password with Supabase
      // For now, we'll show a message to check Supabase settings
      setMessage('Password update feature requires Supabase email configuration. Please check your Supabase project settings.')
      
      setTimeout(() => {
        navigate('/auth')
      }, 3000)
    } catch(err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!pageLoaded) {
    return (
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-logo-wrapper">
            <img src="/assets/skinpal-girl-illustration.png" className="logo-large" alt="SkinPal Logo" />
            <h1 className="logo-text">SKINPAL</h1>
            <p className="logo-sub">BECAUSE EVERY SKIN IS UNIQUE</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="login-card">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      {/* Left Panel: Hero Image + Logo Overlay */}
      <div className="auth-left">
        <div className="auth-logo-wrapper">
          <img src="/assets/skinpal-girl-illustration.png" className="logo-large" alt="SkinPal Logo" />
          <h1 className="logo-text">SKINPAL</h1>
          <p className="logo-sub">BECAUSE EVERY SKIN IS UNIQUE</p>
        </div>
      </div>

      {/* Right Panel: Reset Password Form */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h1>Create New Password</h1>
            <p>Enter your new password below</p>
          </div>

          {message && <div className="success-message" style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>{message}</div>}
          
          {error && <div className="error-message" style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>{error}</div>}

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Enter new password (min 6 characters)" 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Updating password...' : 'Reset Password'}
            </button>

            <button
              type="button"
              className="btn-auth"
              style={{ marginTop: '10px' }}
              onClick={() => navigate('/auth')}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
