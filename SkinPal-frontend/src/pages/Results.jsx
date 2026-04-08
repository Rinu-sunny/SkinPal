import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, ArrowRight, Activity } from 'lucide-react'
import { getLastAnalysis } from '../session'

function SeverityLabel({level}){
  const sevMap = {high: 'Critical', medium: 'Moderate', low: 'Mild'}
  const colors = {
    high: '#D32F2F',
    medium: '#F57C00',
    low: '#43A047'
  }
  return <span className="severity-label" style={{color: colors[level]}}>{sevMap[level] || level}</span>
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

export default function Results(){
  const { state } = useLocation()
  const navigate = useNavigate()
  const fallbackAnalysis = getLastAnalysis()
  
  const analysis = state?.analysis || fallbackAnalysis || {
    skin_type: 'normal',
    preview: null,
    scores: {
      acne_prone: 0.2,
      dry: 0.15,
      oily: 0.25,
      normal: 0.4,
    },
  }

  const issues = Object.entries(analysis.scores || {}).map(([name, confidence]) => {
    const score = Number(confidence) || 0
    let severity = 'low'
    if (score >= 0.6) severity = 'high'
    else if (score >= 0.3) severity = 'medium'

    return {
      name: name.replace('_', ' '),
      confidence: score,
      severity,
    }
  }).sort((a, b) => b.confidence - a.confidence)

  return (
    <div className="container results">
      <div className="page-header">
        <h2>Analysis Report</h2>
        <p>Based on your latest scan</p>
      </div>

      <div className="results-card">
        <div className="analysis-row">
          <div className="badge-icon">
            <User size={28} />
          </div>
          <div className="analysis-info">
            <h4 className="analysis-label">SKIN TYPE</h4>
            <span className="analysis-value">{analysis.skin_type}</span>
          </div>
        </div>

        {/* Removed redundant preview here as captured image is usually enough, but keeping if it exists */}
        {analysis.preview && (
          <div className="preview-container">
             <img src={analysis.preview} alt="analyzed face" />
          </div>
        )}

        <h3 className="concerns-title" style={{marginTop: '24px', marginBottom: '16px'}}>
          <Activity size={20} color="#F57C00" /> Skin Analysis Breakdown
        </h3>
        
        {/* Horizontal Bar Chart */}
        <div style={{ padding: '1rem 0', marginBottom: '24px' }}>
          {Object.entries(analysis.scores || {}).map(([skinType, score]) => {
            const percentage = Math.round(score * 100)
            const severity = getSeverity(score)
            const color = getSeverityColor(severity)
            
            return (
              <div key={skinType} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', textTransform: 'capitalize', fontSize: '14px' }}>
                    {skinType.replace('_', ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      {percentage}%
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '0.3rem 0.6rem',
                      backgroundColor: color,
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      minWidth: '45px',
                      textAlign: 'center'
                    }}>
                      {severity}
                    </span>
                  </div>
                </div>
                
                {/* Horizontal Bar */}
                <div style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '12px',
                    transition: 'width 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {percentage > 10 && `${percentage}%`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {analysis.tips && analysis.tips.length > 0 && (
          <div className="tips-section" style={{marginTop: '24px', padding: '16px', background: '#F5F5F5', borderRadius: '8px'}}>
            <h3 style={{marginTop: 0, marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333'}}>💡 Skincare Tips</h3>
            <ul style={{margin: 0, paddingLeft: '20px', lineHeight: '1.6'}}>
              {analysis.tips.map((tip, i) => (
                <li key={i} style={{marginBottom: '8px', color: '#555', fontSize: '14px'}}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="btn-cta cta-button-results" onClick={()=>navigate('/recommendations')}>
        View Recommended Routine <ArrowRight size={20} />
      </button>
    </div>
  )
}

