import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Camera, Sparkles, Calendar, User } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/capture', label: 'Analyze', icon: Camera },
  { path: '/recommendations', label: 'Tips', icon: Sparkles },
  { path: '/history', label: 'History', icon: Calendar },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Nav() {
  const loc = useLocation()

  if (loc.pathname === '/auth') return null

  const isActive = (path) => loc.pathname.startsWith(path)

  return (
    <>
      {/* Desktop Navbar */}
      <header className="nav-desktop">
        <div className="brand">SkinPal</div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Navbar */}
      <div className="mobile-nav" role="navigation" aria-label="mobile">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? 'active' : ''}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                color={active ? '#240808' : '#888'}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}