import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if(error) throw error
      setMessage('Redirecting...')
      // In a real app, redirection happens via listener or router
      window.location.href = '/dashboard' 
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
            <p>Login to continue your skin journey</p>
          </div>

          {message && <div className="error-message">{message}</div>}

          <form onSubmit={handleLogin}>
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

            <a href="#" className="forgot-link">Forgot password?</a>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
