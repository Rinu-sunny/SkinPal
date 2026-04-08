import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiForgotPassword } from '../api'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (!email) {
        throw new Error('Please enter your email address')
      }

      const response = await apiForgotPassword(email)
      setSubmitted(true)
      setMessage('Password reset link sent! Check your email.')
      setEmail('')
    } catch(err) {
      setError(err.message || 'Failed to send reset link')
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
          <p className="logo-sub">BECAUSE EVERY SKIN IS UNIQUE</p>
        </div>
      </div>

      {/* Right Panel: Forgot Password Form */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {message && (
            <div className="success-message" style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              border: '1px solid #c3e6cb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Mail size={20} />
              {message}
            </div>
          )}
          
          {error && (
            <div className="error-message" style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>{error}</div>
          )}

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: '#666' }}>
                A password reset link has been sent to your email. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="Enter your registered email" 
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

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
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
