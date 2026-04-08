import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import { getSession } from './session'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Capture from './pages/Capture'
import Results from './pages/Results'
import Recommendations from './pages/Recommendations'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App(){
  const location = useLocation()
  const session = getSession()
  const isAuthenticated = Boolean(session?.user_id)
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/'

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
