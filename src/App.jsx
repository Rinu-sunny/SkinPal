import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Capture from './pages/Capture'
import Results from './pages/Results'
import Recommendations from './pages/Recommendations'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App(){
  const location = useLocation()
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/'

  return (
    <div className="app-root">
      {!isAuthPage && <Nav />}
      <main className={!isAuthPage ? "page-content" : ""}>
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/capture" element={<Capture/>} />
          <Route path="/results" element={<Results/>} />
          <Route path="/recommendations" element={<Recommendations/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/" element={<Navigate to="/auth" replace/>} />
        </Routes>
      </main>
    </div>
  )
}
