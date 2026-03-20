import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, ArrowRight, Activity } from 'lucide-react'

function SeverityLabel({level}){
  const sevMap = {high: 'Critical', medium: 'Moderate', low: 'Mild'}
  const colorClass = level === 'high' ? 'sev high' : level === 'medium' ? 'sev medium' : 'sev low'
  return <span className={colorClass} style={{
    color: level === 'high' ? '#D32F2F' : level === 'medium' ? '#F57C00' : '#43A047',
    fontWeight: '700', fontSize:'12px', textTransform:'uppercase'
  }}>{sevMap[level] || level}</span>
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
      <div className="page-header" style={{textAlign:'center', marginBottom:'24px'}}>
        <h2>Analysis Report</h2>
        <p style={{color:'#888', fontSize:'14px'}}>Based on your latest scan</p>
      </div>

      <div className="card" style={{background:'#FFF', padding:'24px', borderRadius:'20px', boxShadow:'0 8px 24px rgba(0,0,0,0.04)', marginBottom:'24px'}}>
        <div className="analysis-row" style={{marginBottom:'24px', display:'flex', alignItems:'center', gap:'16px'}}>
          <div className="badge-icon" style={{width:'56px', height:'56px', background:'#E3F2FD', color:'#1976D2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <User size={28} />
          </div>
          <div className="analysis-info">
            <h4 style={{fontSize:'12px', textTransform:'uppercase', color:'#888', margin:0, letterSpacing:'1px'}}>SKIN TYPE</h4>
            <span style={{fontSize:'24px', color:'#2E2E2E', fontWeight:'700', fontFamily:'Playfair Display, serif'}}>{analysis.skin_type}</span>
          </div>
        </div>

        {/* Removed redundant preview here as captured image is usually enough, but keeping if it exists */}
        {analysis.preview && (
          <div className="preview-container" style={{marginBottom:'24px', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
             <img src={analysis.preview} alt="analyzed face" style={{width:'100%', display:'block'}} />
          </div>
        )}

        <h3 style={{fontSize:'18px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
          <Activity size={20} color="#F57C00" /> Concerns Identified
        </h3>
        
        <div className="issues-list">
          {analysis.issues.map((it, i)=> (
            <div key={i} className="progress-container" style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <div className="issue-name" style={{minWidth:'80px', fontWeight:'500', fontSize:'14px', color:'#555'}}>{it.name}</div>
              <div className="progress" style={{flex:1, height:'8px', background:'#F0F0F0', borderRadius:'4px', overflow:'hidden'}}>
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

      <button className="btn-cta" onClick={()=>navigate('/recommendations')} style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'
      }}>
        View Recommended Routine <ArrowRight size={20} />
      </button>
    </div>
  )
}
