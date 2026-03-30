import React from 'react'
import { Droplets, Sparkles, Shield, Clock } from 'lucide-react'

export default function Recommendations(){
  const recs = [
    {
      title: 'Salicylic Acid Cleanser',
      type: 'CLEANSER',
      desc: 'Targets acne and unclogs pores by exfoliating deep inside the follicle.',
      usage: 'Use twice daily, morning and evening. Massage gently for 60 seconds.',
      iconKey: 'cleanser',
      color: '#2E86AB',
      bg: '#E3F2FD'
    },
    {
      title: 'Niacinamide 10% Serum',
      type: 'SERUM',
      desc: 'Minimizes enlarged pores, tightens lax pores, improves uneven skin tone.',
      usage: 'Apply 3-4 drops after cleansing. Pat gently into skin.',
      iconKey: 'serum',
      color: '#E65100',
      bg: '#FFF3E0'
    },
    {
      title: 'Oil-Free SPF 50 Sunscreen',
      type: 'SUN PROTECTION',
      desc: 'Non-comedogenic UV protection specifically formulated for oily skin.',
      usage: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
      iconKey: 'sun',
      color: '#EF6C00',
      bg: '#FFF8E1'
    }
  ]

  const getIcon = (key, color) => {
    switch(key){
      case 'cleanser': return <Droplets size={24} color={color} />
      case 'serum': return <Sparkles size={24} color={color} />
      case 'sun': return <Shield size={24} color={color} />
      default: return <Sparkles size={24} color={color} />
    }
  }

  return (
    <div className='container recommendations'>
      <div className='dashboard-header'>
        <h2>Recommendations</h2>
      </div>

      <div className='rec-list'>
        {recs.map((rec, i) => (
          <div className='rec-card-item' key={i}>
            <div className='rec-header-row'>
              <div className='rec-icon-box' style={{background:rec.bg}}>
                {getIcon(rec.iconKey, rec.color)}
              </div>
              <div className='rec-title-wrapper'>
                <h4 className='rec-title-text'>{rec.title}</h4>
                <span className='rec-tag-badge' style={{color:rec.color, background:rec.bg}}>{rec.type}</span>
              </div>
            </div>
            <p className='rec-description'>{rec.desc}</p>
            <div className='rec-usage-box'>
              <Clock size={14} color='#888' className='rec-usage-icon' />
              <span><strong>How to use:</strong> {rec.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
