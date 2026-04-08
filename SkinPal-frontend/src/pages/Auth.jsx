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
      if (isSignup) {
        // Wait for signup to complete AND check for errors
        const signupResponse = await apiSignup(email, password, name)
        if (!signupResponse || !signupResponse.user_id) {
          throw new Error(signupResponse?.error || 'Signup failed')
        }
      }

      const login = await apiLogin(email, password)
      setSession({
        user_id: login.user_id,
        access_token: login.access_token,
        email,
        name: isSignup ? name : undefined,
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
        </div>
      </div>
    </div>
  )
}
