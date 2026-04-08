import React, { useEffect, useMemo, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { apiProfile } from '../api'
import { clearSession, getSession } from '../session'

// Memoized calendar day cell component
const CalendarDay = memo(({ day, hasAnalysis, isToday, handleDayHover, handleDayLeave }) => {
  if (!day) {
    return (
      <div
        style={{
          aspectRatio: '1',
          backgroundColor: 'transparent',
          borderRadius: '2px'
        }}
      />
    )
  }

  return (
    <div
      style={{
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hasAnalysis ? 'rgba(124, 179, 66, 0.7)' : '#fff',
        borderRadius: '3px',
        border: isToday ? '2px solid rgba(124, 179, 66, 0.9)' : '1px solid #e0e0e0',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        fontWeight: '600',
        fontSize: '0.5rem',
        color: hasAnalysis ? '#fff' : '#333'
      }}
      title={`${day.dateStr}: ${day.count} analysis`}
      onMouseEnter={() => handleDayHover(hasAnalysis)}
      onMouseLeave={() => handleDayLeave(hasAnalysis)}
    >
      {day.day}
    </div>
  )
})

CalendarDay.displayName = 'CalendarDay'

// Memoized calendar grid component
const CalendarGrid = memo(({ getMonthCalendar, handleDayHover, handleDayLeave }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.15rem',
      padding: '0.25rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      marginBottom: '0.4rem'
    }}>
      {getMonthCalendar.map((day, idx) => (
        <CalendarDay
          key={day ? day.dateStr : `empty-${idx}`}
          day={day}
          hasAnalysis={day?.count > 0}
          isToday={day?.isToday || false}
          handleDayHover={handleDayHover}
          handleDayLeave={handleDayLeave}
        />
      ))}
    </div>
  )
})

CalendarGrid.displayName = 'CalendarGrid'

export default function Profile(){
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoverStyles, setHoverStyles] = useState({})

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const session = getSession()
        if (!session?.user_id) return
        const data = await apiProfile(session.user_id)
        if (!mounted) return
        setProfile(data.user || null)
        setHistory(data.history || [])
      } catch {
        if (!mounted) return
        setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      mounted = false
    }
  }, [])

  // Get unique dates from history
  const dateCounts = useMemo(() => {
    const counts = {}
    history.forEach(item => {
      if (item.analysis_date) {
        const date = new Date(item.analysis_date)
        const dateStr = date.toDateString()
        counts[dateStr] = (counts[dateStr] || 0) + 1
      }
    })
    return counts
  }, [history])

  // Generate calendar for current month
  const getMonthCalendar = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const calendarDays = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toDateString()
      const today = new Date()
      
      calendarDays.push({
        day,
        date,
        dateStr,
        count: dateCounts[dateStr] || 0,
        isToday: dateStr === today.toDateString()
      })
    }
    
    return calendarDays
  }, [currentMonth, dateCounts])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }, [currentMonth])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }, [currentMonth])

  const handleDayHover = useCallback((hasAnalysis) => {
    if (hasAnalysis) {
      setHoverStyles({ boxShadow: '0 2px 6px rgba(124, 179, 66, 0.4)', transform: 'scale(1.08)' })
    } else {
      setHoverStyles({ backgroundColor: '#f5f5f5', color: '#333' })
    }
  }, [])

  const handleDayLeave = useCallback((hasAnalysis) => {
    if (!hasAnalysis) {
      setHoverStyles({ backgroundColor: '#fff', color: '#333' })
    } else {
      setHoverStyles({ boxShadow: 'none', transform: 'scale(1)' })
    }
  }, [])

  const user = useMemo(() => {
    const session = getSession()
    const displayName = profile?.name || session?.name || 'SkinPal User'
    const displayEmail = profile?.email || session?.email || 'unknown@skinpal.local'
    return {
      name: displayName,
      email: displayEmail,
    }
  }, [profile])

  function handleSignOut() {
    clearSession()
    navigate('/auth')
  }

  return (
    <div className='container profile-page'>
      <div className='profile-header' style={{
        marginBottom: '1rem'
      }}>
        <h2 style={{
          color: '#3E2723',
          marginBottom: '0.25rem'
        }}>Profile</h2>
      </div>

      {/* User Details Section */}
      <div className='profile-section' style={{
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <div className='avatar-large' style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#BCAAA4',
          borderRadius: '50%'
        }}>
          <User size={30} color='#3E2723' />
        </div>
        <h3 className='profile-name' style={{
          margin: '0.25rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#3E2723'
        }}>{user.name}</h3>
        <p className='profile-email' style={{
          margin: '0.25rem 0 0',
          fontSize: '0.8rem',
          color: '#A0826D'
        }}>{user.email}</p>
      </div>

      {/* Calendar Section */}
      {!loading && history.length > 0 && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.75rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '2px solid rgba(124, 179, 66, 0.5)',
          boxShadow: '0 2px 6px rgba(124, 179, 66, 0.15)'
        }}>
          {/* Calendar Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            gap: '0.25rem',
            padding: '0.4rem',
            backgroundColor: 'rgba(124, 179, 66, 0.7)',
            borderRadius: '4px'
          }}>
            <button
              onClick={handlePrevMonth}
              style={{
                padding: '0.2rem 0.35rem',
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.65rem',
                color: 'rgba(124, 179, 66, 0.7)',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff'
              }}
            >
              ←
            </button>
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', color: '#fff' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
            </div>
            <button
              onClick={handleNextMonth}
              style={{
                padding: '0.2rem 0.35rem',
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.65rem',
                color: 'rgba(124, 179, 66, 0.7)',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff'
              }}
            >
              →
            </button>
          </div>

          {/* Weekday Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.15rem',
            marginBottom: '0.15rem',
            padding: '0.25rem',
            backgroundColor: 'rgba(124, 179, 66, 0.1)',
            borderRadius: '4px'
          }}>
            {weekdayNames.map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '0.5rem',
                  fontWeight: '700',
                  color: 'rgba(124, 179, 66, 0.7)',
                  padding: '0.1rem 0'
                }}
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <CalendarGrid 
            getMonthCalendar={getMonthCalendar}
            handleDayHover={handleDayHover}
            handleDayLeave={handleDayLeave}
          />

          {/* Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.55rem',
            padding: '0.35rem 0.25rem',
            backgroundColor: 'rgba(124, 179, 66, 0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(124, 179, 66, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: '14px',
                height: '14px',
                backgroundColor: 'rgba(124, 179, 66, 0.7)',
                borderRadius: '2px',
                border: '1px solid rgba(124, 179, 66, 0.9)'
              }} />
              <span style={{ fontWeight: '600', color: '#333' }}>Yes (Analysis)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: '14px',
                height: '14px',
                backgroundColor: '#fff',
                borderRadius: '2px',
                border: '1px solid #e0e0e0'
              }} />
              <span style={{ fontWeight: '600', color: '#333' }}>No (No Analysis)</span>
            </div>
          </div>
        </div>
      )}
      
      <button className='btn-logout-btn' onClick={handleSignOut} style={{
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#fff',
        color: '#3E2723',
        border: '2px solid #BCAAA4',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#BCAAA4'
        e.target.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#fff'
        e.target.style.color = '#3E2723'
      }}
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  )
}
