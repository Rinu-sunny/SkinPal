import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiLogin, apiSignup } from '../api'
import { setSession } from '../session'

export default function Auth(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let loginData = null
      
      if (isSignup) {
        // Sign up and potentially get immediate login
        try {
          const signupResponse = await apiSignup(email, password, name)
          if (!signupResponse || !signupResponse.user_id) {
            throw new Error(signupResponse?.error || 'Signup failed')
          }
          
          // If signup returned a token, use it directly
          if (signupResponse.access_token && signupResponse.auto_logged_in) {
            loginData = {
              user_id: signupResponse.user_id,
              access_token: signupResponse.access_token
            }
            console.log('✅ Auto-logged in after signup')
          }
        } catch (signupErr) {
          // If signup fails because email exists, suggest login instead
          if (signupErr.message && signupErr.message.toLowerCase().includes('already registered')) {
            throw new Error(`${signupErr.message} Would you like to try logging in instead?`)
          }
          throw signupErr
        }
      }
      
      // If we don't have login data from signup, do a separate login call
      if (!loginData) {
        loginData = await apiLogin(email, password)
      }
      
      if (!loginData || !loginData.user_id) {
        throw new Error('Login failed - no user_id returned')
      }

      setSession({
        user_id: loginData.user_id,
        access_token: loginData.access_token,
        email: email,
        name: isSignup ? name : email.split('@')[0],
      })
      navigate('/dashboard')
    } catch(err) {
      setMessage(err.message)
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

      {/* Right Panel: Clean Form */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>{isSignup ? 'Create an account to start your skin journey' : 'Login to continue your skin journey'}</p>
          </div>

          {message && <div className="error-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
              />
              {!isSignup && (
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  style={{
                    marginTop: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#E65100',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.9rem',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (isSignup ? 'Creating account...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
            </button>

            <button
              type="button"
              className="btn-auth"
              style={{ marginTop: '10px' }}
              onClick={() => {
                setIsSignup((value) => !value)
                setMessage('')
              }}
              disabled={loading}
            >
              {isSignup ? 'I already have an account' : 'Create new account'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #eee',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
              Admin?
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              style={{
                background: 'none',
                border: '1px solid #1869ff',
                color: '#1869ff',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              Go to Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
