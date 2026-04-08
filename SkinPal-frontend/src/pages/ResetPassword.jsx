import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function ResetPassword(){
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pageLoaded, setPageLoaded] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // When user clicks password reset link from email, Supabase automatically sets session
    // We need to verify that session exists and is a recovery type
    const validateSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session validation - Error:', sessionError)
        console.log('Session validation - Has session:', !!session)
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Failed to load reset page. Please click the reset link in your email.')
          setPageLoaded(true)
          return
        }

        if (!session) {
          setError('Invalid or expired reset link. Please request a new password reset.')
          setPageLoaded(true)
          return
        }

        // Verify we have a valid user session
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          setError('Session validation failed. Please request a new password reset.')
          setPageLoaded(true)
          return
        }

        console.log('✓ Session is valid for user:', user.email)
        setPageLoaded(true)
      } catch (err) {
        console.error('Session validation error:', err)
        setError('Error validating reset link. Please request a new password reset.')
        setPageLoaded(true)
      }
    }

    // Give Supabase a moment to process the URL
    const timer = setTimeout(validateSession, 500)
    return () => clearTimeout(timer)
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

      // Update user password
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      setSuccess(true)
      setMessage('Password updated successfully! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/auth')
      }, 2000)
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
            <p>Verifying reset link...</p>
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

          {message && (
            <div style={{
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
              <CheckCircle size={20} />
              {message}
            </div>
          )}
          
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

          {!error && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}

          {error && (
            <button
              type="button"
              className="btn-auth"
              style={{ 
                marginTop: '1rem',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd'
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
