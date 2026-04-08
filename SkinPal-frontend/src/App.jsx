import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import { getSession } from './session'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'
import Capture from './pages/Capture'
import Results from './pages/Results'
import Recommendations from './pages/Recommendations'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App(){
  const location = useLocation()
  const [session, setSessionState] = useState(() => getSession())

  // Re-read session whenever localStorage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setSessionState(getSession())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Also update session when navigating (for same-tab navigation)
  useEffect(() => {
    setSessionState(getSession())
  }, [location.pathname])

  const isAuthenticated = Boolean(session?.user_id)
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/forgot-password' || location.pathname === '/reset-password' || location.pathname === '/admin/login' || location.pathname === '/admin/dashboard' || location.pathname === '/'

  return (
    <div className="app-root">
      {!isAuthPage && <Nav />}
      <main className={!isAuthPage ? "page-content" : ""}>
        <Routes>
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth/>}
          />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword/>}
          />
          <Route
            path="/reset-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword/>}
          />
          <Route
            path="/admin/login"
            element={<AdminLogin/>}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard/>}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard/> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/capture"
            element={isAuthenticated ? <Capture/> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/results"
            element={isAuthenticated ? <Results/> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/recommendations"
            element={isAuthenticated ? <Recommendations/> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <History/> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile/> : <Navigate to="/auth" replace />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace/>} />
        </Routes>
      </main>
    </div>
  )
}
