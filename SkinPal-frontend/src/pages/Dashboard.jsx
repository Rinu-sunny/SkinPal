import React, { useEffect, useMemo, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Droplets, Activity, Sun, Camera } from 'lucide-react'
import { apiProfile } from '../api'
import { getSession, getLastAnalysis } from '../session'

// Memoized breakdown component
const AnalysisBreakdown = memo(({ scores, getSeverity, getSeverityColor }) => {
  return (
    <section className="analysis-breakdown-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '600' }}>Latest Skin Analysis Breakdown</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(scores).map(([skinType, score]) => {
          const percentage = Math.round(score * 100)
          const severity = getSeverity(score)
          const color = getSeverityColor(severity)
          
          return (
            <div key={skinType}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{skinType.replace('_', ' ')}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: '500' }}>{percentage}%</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.4rem',
                    backgroundColor: color,
                    color: '#fff',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {severity}
                  </span>
                </div>
              </div>
              
              <div style={{
                width: '100%',
                height: '16px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: '8px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
})

AnalysisBreakdown.displayName = 'AnalysisBreakdown'

// Memoized tips component
const SkincareTips = memo(({ tips }) => {
  return (
    <section className="tips-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '12px', border: '1px solid #b3d9ff' }}>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sun size={18} color="#F57C00" /> Skincare Tips for Your Skin
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tips.map((tip, idx) => (
          <div key={idx} style={{
            padding: '0.75rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#333',
            borderLeft: '4px solid #F57C00'
          }}>
            <span style={{ fontWeight: '500' }}>•</span> {tip}
          </div>
        ))}
      </div>
    </section>
  )
})

SkincareTips.displayName = 'SkincareTips'

export default function Dashboard(){
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const session = getSession()
        if (!session?.user_id) return
        const data = await apiProfile(session.user_id)
        if (!mounted) return
        setHistory(data.history || [])
      } catch {
        if (!mounted) return
        setHistory([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const latest = history[0]
  const localLatest = getLastAnalysis()

  const skinData = useMemo(() => {
    const type = latest?.skin_type || localLatest?.skin_type || 'normal'
    const confidence = Number(latest?.confidence_score || localLatest?.confidence || 0.7)
    const health = Math.max(40, Math.min(98, Math.round(confidence * 100)))
    const hydration = Math.max(35, Math.min(95, Math.round(100 - Math.abs(55 - health))))

    return {
      type,
      desc: confidence >= 0.7 ? 'Stable skin pattern detected' : 'Keep monitoring for better trend accuracy',
      hydration,
      health,
      lastScan: latest?.analysis_date ? 'recently' : (localLatest ? 'just now' : 'not yet'),
    }
  }, [latest, localLatest])

  // Get skincare tips (max 4) from latest analysis
  const tips = useMemo(() => (latest?.skincare_tips || []).slice(0, 4), [latest?.skincare_tips])
  
  // Get scores breakdown from latest analysis
  const scores = useMemo(() => latest?.scores || {}, [latest?.scores])
  
  const getSeverity = useCallback((score) => {
    if (score >= 0.7) return 'critical'
    if (score >= 0.4) return 'moderate'
    return 'mild'
  }, [])

  const getSeverityColor = useCallback((severity) => {
    if (severity === 'critical') return '#E57373'
    if (severity === 'moderate') return '#FFB74D'
    return '#81C784'
  }, [])

  const handleNewAnalysis = useCallback(() => {
    navigate('/capture')
  }, [navigate])

  return (
    <div className="container dashboard">
      <header className="dashboard-header">
        <h2>Your Skin Today</h2>
      </header>

      {/* Main Skin Type Card - Beige Background */}
      <section className="skin-type-card">
        <div className="skin-type-icon skin-icon-white">
          <Sparkles size={24} color="#E65100" />
        </div>
        <div className="skin-type-label">SKIN TYPE</div>
        <h3 className="skin-type-val">{skinData.type}</h3>
        <p className="skin-type-desc">{skinData.desc}</p>
        
        <div className="last-analyzed">
          {loading ? 'Loading latest analysis...' : `Last analyzed ${skinData.lastScan}`}
        </div>
      </section>

      {/* Main CTA Button - Gradient */}
      <button className="btn-cta cta-button" onClick={handleNewAnalysis}>
        <Camera size={20} color="#240808" />
        Start New Analysis
      </button>

      {/* Skin Analysis Breakdown - Only if there's a latest analysis */}
      {latest && Object.keys(scores).length > 0 && (
        <AnalysisBreakdown scores={scores} getSeverity={getSeverity} getSeverityColor={getSeverityColor} />
      )}

      {/* Skincare Tips Section - Only if there are tips */}
      {latest && tips.length > 0 && (
        <SkincareTips tips={tips} />
      )}
    </div>
  )
}
