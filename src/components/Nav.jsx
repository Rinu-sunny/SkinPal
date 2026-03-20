import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Camera, Sparkles, Calendar, User } from 'lucide-react'

export default function Nav(){
  const loc = useLocation()
  if(loc.pathname === '/auth') return null
  
  const isActive = (path) => loc.pathname === path ? 'active' : ''
  const color = (active) => active ? '#240808' : '#888'

  return (
    <>
      <header className="nav-desktop">
        <div className="brand">SkinPal</div>
        <nav>
          <Link className={isActive('/dashboard')} to="/dashboard">Dashboard</Link>
          <Link className={isActive('/capture')} to="/capture">Analyze</Link>
          <Link className={isActive('/recommendations')} to="/recommendations">Routine</Link>
          <Link className={isActive('/history')} to="/history">History</Link>
          <Link className={isActive('/profile')} to="/profile">Profile</Link>
        </nav>
      </header>

      <div className="mobile-nav" role="navigation" aria-label="mobile">
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <Home size={20} strokeWidth={1.5} color={color(isActive('/dashboard'))} />
          <span>Home</span>
        </Link>
        <Link to="/capture" className={isActive('/capture')}>
          <Camera size={20} strokeWidth={1.5} color={color(isActive('/capture'))} />
          <span>Analyze</span>
        </Link>
        <Link to="/recommendations" className={isActive('/recommendations')}>
          <Sparkles size={20} strokeWidth={1.5} color={color(isActive('/recommendations'))} />
          <span>Tips</span>
        </Link>
        <Link to="/history" className={isActive('/history')}>
          <Calendar size={20} strokeWidth={1.5} color={color(isActive('/history'))} />
          <span>History</span>
        </Link>
        <Link to="/profile" className={isActive('/profile')}>
          <User size={20} strokeWidth={1.5} color={color(isActive('/profile'))} />
          <span>Profile</span>
        </Link>
      </div>
    </>
  )
}
