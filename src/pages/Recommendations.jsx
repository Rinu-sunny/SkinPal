import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Sparkles, Shield, Clock, ChevronRight } from 'lucide-react'

export default function Recommendations(){
  const navigate = useNavigate()
  
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
        <span className='sub' style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>Personalized for your oily, acne-prone skin</span>
        <h2>Recommendations</h2>
      </div>

      <div className='rec-list'>
        {recs.map((rec, i) => (
          <div className='rec-card' key={i} style={{background:'#FFF', borderRadius:'16px', padding:'20px', marginBottom:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
            <div className='rec-header' style={{display:'flex', gap:'16px', marginBottom:'12px'}}>
              <div className='rec-icon' style={{width:'56px', height:'56px', background:rec.bg, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {getIcon(rec.iconKey, rec.color)}
              </div>
              <div className='rec-title' style={{flex:1}}>
                <span className='rec-tag' style={{fontSize:'10px', fontWeight:'700', color:rec.color, background:rec.bg, padding:'4px 8px', borderRadius:'6px', letterSpacing:'0.5px'}}>{rec.type}</span>
                <h4 style={{margin:'8px 0 0', fontSize:'16px', color:'#240808'}}>{rec.title}</h4>
              </div>
            </div>
            <p className='rec-desc' style={{fontSize:'13px', color:'#666', lineHeight:'1.5', margin:'0 0 16px'}}>{rec.desc}</p>
            <div className='rec-usage' style={{background:'#F9F9F9', padding:'12px', borderRadius:'8px', fontSize:'12px', color:'#555', display:'flex', gap:'8px'}}>
              <Clock size={14} color='#888' style={{marginTop:'2px'}} />
              <span><strong>How to use:</strong> {rec.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
