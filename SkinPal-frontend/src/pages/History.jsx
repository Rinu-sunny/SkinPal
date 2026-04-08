import React, { useEffect, useState, useMemo } from 'react'
import { Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { apiProfile } from '../api'
import { getSession } from '../session'
import '../styles.css'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function History(){
  const [history, setHistory] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [deleteIndividualId, setDeleteIndividualId] = useState(null)
  const limit = 10

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      try {
        setIsLoading(true)
        const session = getSession()
        if (!session?.user_id) return
        
        const profile = await apiProfile(session.user_id, { limit, offset: 0 })
        if (!mounted) return
        
        setHistory(profile.history || [])
        setOffset(0)
        setHasMore((profile.history || []).length >= limit)
      } catch (error) {
        console.error('Load history error:', error)
        if (!mounted) return
        setHistory([])
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadHistory()
    return () => {
      mounted = false
    }
  }, [])

  const loadMore = async () => {
    try {
      const session = getSession()
      if (!session?.user_id) return
      
      const newOffset = offset + limit
      const profile = await apiProfile(session.user_id, { limit, offset: newOffset })
      const newItems = profile.history || []
      
      setHistory(prev => [...prev, ...newItems])
      setOffset(newOffset)
      setHasMore(newItems.length >= limit)
    } catch (error) {
      console.error('Load more error:', error)
    }
  }

  const deleteIndividualAnalysis = async (analysisId) => {
    try {
      setIsDeleting(true)
      const session = getSession()
      if (!session?.user_id) return

      const response = await fetch('http://localhost:5000/api/delete-analysis/' + analysisId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: session.user_id })
      })

      const responseData = await response.json()
      
      if (response.ok) {
        // Remove from history state
        setHistory(prev => prev.filter(item => item.analysis_id !== analysisId))
        setDeleteIndividualId(null)
      } else {
        console.error('Delete error response:', responseData)
        alert('Failed to delete analysis: ' + (responseData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting analysis: ' + error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getSeverity = (score) => {
    if (score >= 0.7) return 'critical'
    if (score >= 0.4) return 'moderate'
    return 'mild'
  }

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#E57373'
    if (severity === 'moderate') return '#FFB74D'
    return '#81C784'
  }

  // Calculate analyses this week
  const getAnalysesThisWeek = useMemo(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)

    return history.filter(item => {
      if (!item.analysis_date) return false
      const analysisDate = new Date(item.analysis_date)
      return analysisDate >= startOfWeek
    }).length
  }, [history])

  const handleDeleteHistory = async () => {
    try {
      setIsDeleting(true)
      const session = getSession()
      if (!session?.user_id) return

      const response = await fetch('http://localhost:5000/api/delete-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: session.user_id })
      })

      if (response.ok) {
        setHistory([])
        setShowDeleteModal(false)
      } else {
        alert('Failed to delete history')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting history: ' + error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const getLastAnalysisScores = () => {
    if (history.length === 0) return null
    const last = history[0]
    return last.scores || null
  }

  return (
    <div className='container history-page'>
      <div className='dashboard-header'>
        <h2>Analysis History</h2>
        <span className='sub'>Track your skin progress and personalized recommendations</span>
      </div>

      {/* Delete Button - Show only if history exists */}
      {history.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ee5a52'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
          >
            <Trash2 size={18} />
            Delete All History
          </button>
        </div>
      )}

      {/* Streak Calendar View */}
      {history.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Total Analyses */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Total Analyses
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#FF6F00' }}>
              {history.length}
            </div>
          </div>

          {/* Analyses This Week */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              This Week
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4CAF50' }}>
              {getAnalysesThisWeek}
            </div>
          </div>
        </div>
      )}

      <div className='history-list'>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p>No analysis history yet. Start by capturing your first skin analysis!</p>
          </div>
        ) : (
          <>
            {history.map((item, i) => {
              const isExpanded = expandedId === item.analysis_id
              const date = item.analysis_date ? new Date(item.analysis_date).toLocaleDateString() : 'Unknown date'
              const score = Math.round((Number(item.confidence_score) || 0) * 100)
              const tips = item.skincare_tips || []
              const itemScores = item.scores || {}
              const topScore = Object.values(itemScores).length > 0 ? Math.max(...Object.values(itemScores)) : item.confidence_score
              const severity = getSeverity(topScore)
              const severityColor = getSeverityColor(severity)
              
              return (
                <div key={i} className='history-item-card' style={{ cursor: 'pointer' }} onClick={() => toggleExpand(item.analysis_id)}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%' }}>
                    {/* Image Thumbnail */}
                    {item.image && (
                      <div style={{
                        minWidth: '80px',
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#f0f0f0'
                      }}>
                        <img 
                          src={item.image} 
                          alt="Skin analysis" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className='history-content' style={{ flex: 1 }}>
                      <div className='history-date-label' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} />
                        {date}
                      </div>
                      <div className='history-detail-text'>
                        <strong>{item.skin_type || 'Unknown'}</strong> {'\u2022'} 
                        <span className={`history-score ${score > 80 ? 'history-score-good' : 'history-score-bad'}`}>
                          {' '}{score}%
                        </span>
                        {' '}{'\u2022'}{' '}
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.4rem',
                          backgroundColor: severityColor,
                          color: '#fff',
                          borderRadius: '10px',
                          textTransform: 'uppercase'
                        }}>
                          {severity}
                        </span>
                      </div>
                    </div>
                    
                    {/* Expand Icon and Delete Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteIndividualId(item.analysis_id)
                        }}
                        style={{
                          padding: '0.4rem 0.6rem',
                          backgroundColor: 'transparent',
                          color: '#ff6b6b',
                          border: '1px solid #ff6b6b',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ffe6e6'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent'
                        }}
                        title="Delete this analysis"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #eee',
                      width: '100%'
                    }}>
                      {/* Skin Type Breakdown */}
                      {Object.keys(itemScores).length > 0 && (
                        <>
                          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600' }}>Skin Type Analysis:</h4>
                          <div style={{ marginBottom: '1rem' }}>
                            {Object.entries(itemScores).map(([skinType, scoreVal]) => {
                              const pct = Math.round(scoreVal * 100)
                              const sev = getSeverity(scoreVal)
                              const sevColor = getSeverityColor(sev)
                              
                              return (
                                <div key={skinType} style={{ marginBottom: '0.75rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{skinType.replace('_', ' ')}</span>
                                    <span>{pct}%</span>
                                  </div>
                                  <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                  }}>
                                    <div style={{
                                      width: `${pct}%`,
                                      height: '100%',
                                      backgroundColor: sevColor,
                                      borderRadius: '4px'
                                    }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}

                      {/* Tips */}
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Skincare Tips:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tips.length > 0 ? (
                          tips.map((tip, tipIdx) => (
                            <div key={tipIdx} style={{
                              padding: '0.75rem',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              color: '#555',
                              borderLeft: '3px solid #E57373'
                            }}>
                              • {tip}
                            </div>
                          ))
                        ) : (
                          <p style={{ color: '#999', fontSize: '0.85rem' }}>No tips available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            
            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={loadMore}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#5E9CCC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#4A7BA7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#5E9CCC'}
                >
                  Load More History
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#333' }}>Delete All History?</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              This will permanently delete all {history.length} analysis records and uploaded images. This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#e0e0e0',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  opacity: isDeleting ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHistory}
                disabled={isDeleting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  opacity: isDeleting ? 0.6 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Delete Confirmation Modal */}
      {deleteIndividualId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#333' }}>Delete This Analysis?</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              This will permanently delete this analysis record and its associated image. This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteIndividualId(null)}
                disabled={isDeleting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#e0e0e0',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  opacity: isDeleting ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteIndividualAnalysis(deleteIndividualId)}
                disabled={isDeleting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  opacity: isDeleting ? 0.6 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


