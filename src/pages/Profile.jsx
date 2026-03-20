import React from 'react'
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react'

export default function Profile(){
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah@skinpal.com',
    analyses: 5,
    weeks: 6,
    progress: '+12%'
  }

  return (
    <div className='container profile-page'>
      <div className='page-header' style={{textAlign:'center', marginBottom:'24px'}}>
        <h2>Profile</h2>
      </div>

      <div className='profile-card' style={{textAlign:'center', marginBottom:'32px'}}>
        <div className='avatar-lg' style={{width:'88px', height:'88px', background:'linear-gradient(135deg, #E57373, #FFAB91)', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 16px rgba(229, 115, 115, 0.25)'}}>
          <User size={40} color='#FFF' />
        </div>
        <h3 className='profile-name' style={{margin:'0 0 4px', fontSize:'22px'}}>{user.name}</h3>
        <p className='profile-email' style={{margin:0, color:'#888', fontSize:'14px'}}>{user.email}</p>

        <div className='profile-stats' style={{display:'flex', justifyContent:'space-around', marginTop:'24px', background:'#FFF', padding:'20px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.04)'}}>
          <div className='stat' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <strong style={{fontSize:'20px', color:'#240808'}}>{user.analyses}</strong>
            <span style={{fontSize:'10px', color:'#999', letterSpacing:'1px', marginTop:'4px'}}>ANALYSES</span>
          </div>
          <div className='stat-divider' style={{width:'1px', background:'#EEE'}}></div>
          <div className='stat' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <strong style={{fontSize:'20px', color:'#240808'}}>{user.weeks}</strong>
            <span style={{fontSize:'10px', color:'#999', letterSpacing:'1px', marginTop:'4px'}}>WEEKS</span>
          </div>
          <div className='stat-divider' style={{width:'1px', background:'#EEE'}}></div>
          <div className='stat' style={{display:'flex', flexDirection:'column', alignItems:'center', color:'#D32F2F'}}>
            <strong style={{fontSize:'20px'}}>{user.progress}</strong>
            <span style={{fontSize:'10px', color:'#999', letterSpacing:'1px', marginTop:'4px'}}>PROGRESS</span>
          </div>
        </div>
      </div>

      <div className='settings-list' style={{background:'#FFF', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
        <div className='setting-item' style={{display:'flex', alignItems:'center', padding:'16px', borderBottom:'1px solid #f9f9f9', cursor:'pointer'}}>
          <div className='icon' style={{width:'40px', height:'40px', background:'#FFF3E0', borderRadius:'50%', marginRight:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Bell size={20} color='#E65100' />
          </div>
          <div className='label' style={{flex:1}}>
            <strong style={{display:'block', fontSize:'14px', marginBottom:'2px'}}>Notifications</strong>
            <span style={{fontSize:'12px', color:'#888'}}>Manage reminders</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
        <div className='setting-item' style={{display:'flex', alignItems:'center', padding:'16px', borderBottom:'1px solid #f9f9f9', cursor:'pointer'}}>
          <div className='icon' style={{width:'40px', height:'40px', background:'#E3F2FD', borderRadius:'50%', marginRight:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Shield size={20} color='#1E88E5' />
          </div>
          <div className='label' style={{flex:1}}>
            <strong style={{display:'block', fontSize:'14px', marginBottom:'2px'}}>Privacy</strong>
            <span style={{fontSize:'12px', color:'#888'}}>Data and security</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
        <div className='setting-item' style={{display:'flex', alignItems:'center', padding:'16px', cursor:'pointer'}}>
          <div className='icon' style={{width:'40px', height:'40px', background:'#E8F5E9', borderRadius:'50%', marginRight:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <HelpCircle size={20} color='#43A047' />
          </div>
          <div className='label' style={{flex:1}}>
            <strong style={{display:'block', fontSize:'14px', marginBottom:'2px'}}>Help & Support</strong>
            <span style={{fontSize:'12px', color:'#888'}}>FAQs and contact</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
      </div>
      
      <button className='btn-logout' style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', border:'1px solid #FFCDD2', color:'#D32F2F', background:'#FFF', padding:'16px', borderRadius:'12px', marginTop:'32px', fontWeight:'700', cursor:'pointer'}}>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  )
}
