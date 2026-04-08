import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, ArrowRight, Activity } from 'lucide-react'

function SeverityLabel({level}){
  const sevMap = {high: 'Critical', medium: 'Moderate', low: 'Mild'}
  const colors = {
    high: '#D32F2F',
    medium: '#F57C00',
    low: '#43A047'
  }
  return <span className="severity-label" style={{color: colors[level]}}>{sevMap[level] || level}</span>
}

export default function Results(){
  const { state } = useLocation()
  const navigate = useNavigate()
  
  // Use passed state or fallback demo data
  const analysis = state?.analysis || {
    skin_type: 'Combination',
    preview: null,
    issues: [
      {name:'Acne', confidence: 0.85, severity: 'high'},
      {name:'Redness', confidence: 0.42, severity: 'medium'},
      {name:'Texture', confidence: 0.20, severity: 'low'}
    ]
  }

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

        <h3 className="concerns-title">
          <Activity size={20} color="#F57C00" /> Concerns Identified
        </h3>
        
        <div className="issues-list">
          {analysis.issues.map((it, i)=> (
            <div key={i} className="issue-item">
              <div className="issue-name">{it.name}</div>
              <div className="progress">
                <div 
                  className="bar" 
                  style={{
                    height:'100%',
                    width: `${Math.round(it.confidence*100)}%`,
                    background: it.severity === 'high' ? '#D32F2F' : it.severity === 'medium' ? '#FF9800' : '#66BB6A',
                    borderRadius:'4px'
                  }}
                ></div>
              </div>
              <SeverityLabel level={it.severity} />
            </div>
          ))}
        </div>
      </div>

      <button className="btn-cta cta-button-results" onClick={()=>navigate('/recommendations')}>
        View Recommended Routine <ArrowRight size={20} />
      </button>
    </div>
  )
}
