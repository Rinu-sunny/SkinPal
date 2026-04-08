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

      <div className='chart-card'>
        <h4 className='chart-title'>HEALTH SCORE TREND</h4>
        
        {/* Simple SVG Chart */}
        <div className='chart-container'>
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
        
        <div className='chart-dates'>
            <span>Jan 15</span>
            <span>Feb 28</span>
        </div>
      </div>

      <div className='history-list'>
        {scans.map((s,i)=>(
          <div className='history-item-card' key={i}>
            <div className='history-icon-box'>
              <Calendar size={20} />
            </div>
             <div className='history-content'>
               <div className='history-date-label'>{s.date}</div>
               <div className='history-detail-text'>{s.type} {'\u2022'} {s.concern} {'\u2022'} <span className={`history-score ${s.score > 80 ? 'history-score-good' : 'history-score-bad'}`}>{s.score}%</span></div>
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
