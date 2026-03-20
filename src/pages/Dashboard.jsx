import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Droplets, Activity, Sun, Camera } from 'lucide-react'

export default function Dashboard(){
  const navigate = useNavigate()

  // Match the data from the screenshot
  const skinData = {
    type: 'Combination',
    desc: 'Mild dryness detected',
    hydration: 68,
    health: 82,
    lastScan: '2 days ago'
  }

  const tip = 'Double cleanse at night to remove makeup and impurities.'

  return (
    <div className="container dashboard">
      <header className="dashboard-header">
        <span className="sub" style={{display:'flex', alignItems:'center', gap:'6px', color:'#AAA'}}>
          Good morning <Sparkles size={14} color="#FFA726" />
        </span>
        <h2>Your Skin Today</h2>
      </header>

      {/* Main Skin Type Card - Beige Background */}
      <section className="skin-type-card">
        <div className="skin-type-icon" style={{background:'#FFF'}}>
          <Sparkles size={24} color="#E65100" />
        </div>
        <div className="skin-type-label">SKIN TYPE</div>
        <h3 className="skin-type-val">{skinData.type}</h3>
        <p className="skin-type-desc">{skinData.desc}</p>
        
        {/* Inner Stats Row */}
        <div className="health-row" style={{marginTop:'24px', display:'flex', gap:'16px'}}>
          <div className="health-card" style={{flex:1, background:'#FFF', padding:'16px', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
            <div className="health-label" style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'#888', marginBottom:'8px'}}>
              <Droplets size={16} color="#2E86AB" /> Hydration
            </div>
            <div className="health-val" style={{fontSize:'24px', fontWeight:'700', color:'#240808', fontFamily:'Playfair Display, serif'}}>{skinData.hydration}%</div>
            <div className="mini-progress" style={{height:'6px', background:'#f0f0f0', borderRadius:'4px', overflow:'hidden'}}>
              <div className="mini-bar" style={{width: `${skinData.hydration}%`, height:'100%', background:'#2E86AB'}}></div>
            </div>
          </div>
          <div className="health-card" style={{flex:1, background:'#FFF', padding:'16px', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
            <div className="health-label" style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'#888', marginBottom:'8px'}}>
              <Activity size={16} color="#43A047" /> Health
            </div>
            <div className="health-val" style={{fontSize:'24px', fontWeight:'700', color:'#240808', fontFamily:'Playfair Display, serif'}}>{skinData.health}%</div>
            <div className="mini-progress" style={{height:'6px', background:'#f0f0f0', borderRadius:'4px', overflow:'hidden'}}>
              <div className="mini-bar" style={{width: `${skinData.health}%`, height:'100%', background:'#43A047'}}></div>
            </div>
          </div>
        </div>
        
        <div style={{textAlign:'right', fontSize:'11px', color:'#A1887F', marginTop:'16px'}}>
          Last analyzed {skinData.lastScan}
        </div>
      </section>

      {/* Main CTA Button - Gradient */}
      <button className="btn-cta" onClick={()=>navigate('/capture')} style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'12px'}}>
        <Camera size={20} color="#240808" />
        Start New Analysis
      </button>

      {/* Tip Section */}
      <section className="tip-banner" style={{background:'#FFF', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.03)', marginTop:'24px'}}>
        <h4 style={{color:'#F57C00', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px', margin:0, marginBottom:'8px'}}>
          <Sun size={18} color="#F57C00" /> Daily Skincare Tip
        </h4>
        <p style={{color:'#666', fontSize:'14px', lineHeight:'1.5', margin:0}}>{tip}</p>
      </section>
    </div>
  )
}
