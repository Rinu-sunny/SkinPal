import React from 'react'
import { Calendar, ChevronRight } from 'lucide-react'

export default function History(){
  // Mock data matching the screenshot dates and scores
  const scans = [
    {date: 'Feb 28, 2026', type: 'Oily', concern: 'Acne', score: 76},
    {date: 'Feb 20, 2026', type: 'Combination', concern: 'Dryness', score: 80},
    {date: 'Feb 10, 2026', type: 'Oily', concern: 'Enlarged Pores', score: 72},
    {date: 'Jan 30, 2026', type: 'Normal', concern: 'Pigmentation', score: 88},
  ]

  return (
    <div className='container history-page'>
      <div className='dashboard-header'>
        <h2>Analysis History</h2>
        <span className='sub'>Track your skin progress over time</span>
      </div>

      <div className='chart-card' style={{background:'#FFF', borderRadius:'20px', padding:'24px', marginBottom:'24px', boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
        <h4 style={{fontSize:'11px', color:'#999', letterSpacing:'1px', marginBottom:'16px'}}>HEALTH SCORE TREND</h4>
        
        {/* Simple SVG Chart */}
        <div style={{height:'120px', padding:'10px 0'}}>
          <svg width='100%' height='100%' viewBox='0 0 400 100' preserveAspectRatio='none'>
             {/* Simple Line */}
             <path 
               d='M10,80 C80,70 150,75 220,60 S300,50 390,30' 
               fill='none' 
               stroke='#E57373' 
               strokeWidth='3' 
               strokeLinecap='round'
             />
             {/* Data Points */}
             <circle cx='10' cy='80' r='5' fill='#fff' stroke='#E57373' strokeWidth='2'/>
             <circle cx='120' cy='72' r='5' fill='#fff' stroke='#E57373' strokeWidth='2'/>
             <circle cx='240' cy='55' r='5' fill='#fff' stroke='#E57373' strokeWidth='2'/>
             <circle cx='390' cy='30' r='5' fill='#fff' stroke='#E57373' strokeWidth='2'/>
          </svg>
        </div>
        
        <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'11px', color:'#999'}}>
            <span>Jan 15</span>
            <span>Feb 28</span>
        </div>
      </div>

      <div className='history-list'>
        {scans.map((s,i)=>(
          <div className='history-item' key={i} style={{background:'#FFF', padding:'16px', borderRadius:'16px', marginBottom:'12px', display:'flex', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.02)'}}>
            <div className='history-icon-box' style={{width:'48px', height:'48px', background:'#FFEBEE', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'16px', color:'#D32F2F'}}>
              <Calendar size={20} />
            </div>
             <div className='history-content' style={{flex:1}}>
               <div className='history-date' style={{fontWeight:'600', fontSize:'14px', marginBottom:'4px'}}>{s.date}</div>
               <div className='history-detail' style={{fontSize:'12px', color:'#888'}}>{s.type} {'\u2022'} {s.concern} {'\u2022'} <span style={{color: s.score > 80 ? '#43A047' : '#D32F2F', fontWeight:'600'}}>{s.score}%</span></div>
            </div>
            <div className='history-arrow'>
              <ChevronRight size={20} color='#CCC' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
