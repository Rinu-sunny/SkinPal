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
      <div className='profile-header'>
        <h2>Profile</h2>
      </div>

      <div className='profile-section'>
        <div className='avatar-large'>
          <User size={40} color='#FFF' />
        </div>
        <h3 className='profile-name'>{user.name}</h3>
        <p className='profile-email'>{user.email}</p>

        <div className='profile-stats-row'>
          <div className='stat-item'>
            <span className='stat-value'>{user.analyses}</span>
            <span className='stat-label'>ANALYSES</span>
          </div>
          <div className='stat-divider'></div>
          <div className='stat-item'>
            <span className='stat-value'>{user.weeks}</span>
            <span className='stat-label'>WEEKS</span>
          </div>
          <div className='stat-divider'></div>
          <div className='stat-item'>
            <span className='stat-value stat-progress'>{user.progress}</span>
            <span className='stat-label'>PROGRESS</span>
          </div>
        </div>
      </div>

      <div className='settings-container'>
        <div className='setting-item-row'>
          <div className='setting-icon setting-icon-notifications'>
            <Bell size={20} color='#E65100' />
          </div>
          <div className='label'>
            <strong className='setting-label-text'>Notifications</strong>
            <span className='setting-label-description'>Manage reminders</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
        <div className='setting-item-row'>
          <div className='setting-icon setting-icon-privacy'>
            <Shield size={20} color='#1E88E5' />
          </div>
          <div className='label'>
            <strong className='setting-label-text'>Privacy</strong>
            <span className='setting-label-description'>Data and security</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
        <div className='setting-item-row'>
          <div className='setting-icon setting-icon-help'>
            <HelpCircle size={20} color='#43A047' />
          </div>
          <div className='label'>
            <strong className='setting-label-text'>Help & Support</strong>
            <span className='setting-label-description'>FAQs and contact</span>
          </div>
          <div className='arrow'><ChevronRight size={20} color='#CCC' /></div>
        </div>
      </div>
      
      <button className='btn-logout-btn'>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  )
}
