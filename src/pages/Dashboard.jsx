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
        
        {/* Inner Stats Row */}
        <div className="health-stats-row">
          <div className="health-card-stat">
            <div className="health-stat-label">
              <Droplets size={16} color="#2E86AB" /> Hydration
            </div>
            <div className="health-stat-value">{skinData.hydration}%</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${skinData.hydration}%`, background:'#2E86AB'}}></div>
            </div>
          </div>
          <div className="health-card-stat">
            <div className="health-stat-label">
              <Activity size={16} color="#43A047" /> Health
            </div>
            <div className="health-stat-value">{skinData.health}%</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${skinData.health}%`, background:'#43A047'}}></div>
            </div>
          </div>
        </div>
        
        <div className="last-analyzed">
          Last analyzed {skinData.lastScan}
        </div>
      </section>

      {/* Main CTA Button - Gradient */}
      <button className="btn-cta cta-button" onClick={()=>navigate('/capture')}>
        <Camera size={20} color="#240808" />
        Start New Analysis
      </button>

      {/* Tip Section */}
      <section className="tip-card">
        <h4 className="tip-title">
          <Sun size={18} color="#F57C00" /> Daily Skincare Tip
        </h4>
        <p className="tip-text">{tip}</p>
      </section>
    </div>
  )
}
