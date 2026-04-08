import React, { useEffect, useMemo, useState } from 'react'
import { Droplets, Sparkles, Shield } from 'lucide-react'
import { apiProducts } from '../api'
import { getLastAnalysis } from '../session'

export default function Recommendations(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recs, setRecs] = useState([])

  const latestAnalysis = getLastAnalysis()
  const skinType = latestAnalysis?.skin_type || 'normal'

  // Categorize product based on type
  const categorizeProduct = (type) => {
    const typeStr = (type || '').toUpperCase()
    if (typeStr.includes('CLEAN') || typeStr.includes('WASH') || typeStr.includes('FACE')) return 'facewash'
    if (typeStr.includes('MOIST') || typeStr.includes('HYDRA')) return 'moisturizer'
    if (typeStr.includes('SUN') || typeStr.includes('SPF')) return 'sunscreen'
    return 'facewash' // default
  }

  const getCategoryEmoji = (category) => {
    switch(category){
      case 'facewash': return '🧴'
      case 'moisturizer': return '💧'
      case 'sunscreen': return '☀️'
      default: return '✨'
    }
  }

  const getCategoryColor = (category) => {
    switch(category){
      case 'facewash': return '#2E86AB'
      case 'moisturizer': return '#E65100'
      case 'sunscreen': return '#EF6C00'
      default: return '#666'
    }
  }

  const getCategoryBg = (category) => {
    switch(category){
      case 'facewash': return '#E3F2FD'
      case 'moisturizer': return '#FFF3E0'
      case 'sunscreen': return '#FFF8E1'
      default: return '#f5f5f5'
    }
  }

  useEffect(() => {
    let mounted = true

    async function loadProducts() {
      setLoading(true)
      setError('')
      try {
        const products = await apiProducts(skinType)
        if (!mounted) return

        const mapped = (products || []).map((p, i) => {
          const category = categorizeProduct(p.category || p.product_type || '')
          return {
            id: p.product_id || i,
            title: p.product_name || p.name || 'Recommended Product',
            type: (p.category || p.product_type || 'CARE').toUpperCase(),
            category: category,
            desc: p.description || 'Suitable for your current skin profile.',
            usage: p.usage_instructions || 'Use as directed on product label.',
          }
        })

        setRecs(mapped)
      } catch (err) {
        if (!mounted) return
        setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      mounted = false
    }
  }, [skinType])

  const fallbackRecs = useMemo(() => ([
    {
      id: 1,
      title: 'Gentle Balancing Cleanser',
      type: 'CLEANSER',
      category: 'facewash',
      desc: 'Helps clean skin without stripping natural moisture.',
      usage: 'Use morning and night on damp skin.',
    },
    {
      id: 2,
      title: 'Hydration Support Serum',
      type: 'MOISTURIZER',
      category: 'moisturizer',
      desc: 'Supports skin barrier and improves hydration balance.',
      usage: 'Apply after cleansing and before moisturizer.',
    },
  ]), [])

  const visibleRecs = recs.length ? recs : (loading ? [] : fallbackRecs)

  // Group recommendations by category
  const groupedRecs = useMemo(() => {
    const groups = {
      facewash: [],
      moisturizer: [],
      sunscreen: []
    }
    
    visibleRecs.forEach(rec => {
      const category = rec.category || categorizeProduct(rec.type)
      if (groups[category]) {
        groups[category].push(rec)
      }
    })
    
    return groups
  }, [visibleRecs])

  const categoryOrder = ['facewash', 'moisturizer', 'sunscreen']
  const categoryLabels = {
    facewash: 'Face Wash',
    moisturizer: 'Moisturizer',
    sunscreen: 'Sunscreen'
  }

  return (
    <div className='container recommendations'>
      <div className='dashboard-header'>
        <h2>Recommendations</h2>
        {loading && <span className='sub'>Loading products for {skinType} skin...</span>}
        {error && <span className='sub'>{error}</span>}
      </div>

      {!loading && !error && visibleRecs.length > 0 && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f5f9ff',
          borderRadius: '8px',
          borderLeft: '4px solid #5E9CCC'
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#333', textTransform: 'capitalize' }}>
            Best Products for <span style={{ fontWeight: '700', color: '#5E9CCC' }}>{skinType}</span> Skin
          </h3>
        </div>
      )}

      <div className='rec-list'>
        {categoryOrder.map(category => {
          const items = groupedRecs[category] || []
          if (items.length === 0) return null
          
          const emoji = getCategoryEmoji(category)
          const color = getCategoryColor(category)
          const label = categoryLabels[category]
          
          return (
            <div key={category} style={{ marginBottom: '2rem' }}>
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: `2px solid ${color}`
              }}>
                <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: color }}>
                  {label}
                </h3>
              </div>

              {/* Category Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {items.map(rec => {
                  const bg = getCategoryBg(category)
                  return (
                    <div className='rec-card-item' key={rec.id}>
                      <div className='rec-header-row'>
                        <div className='rec-icon-box' style={{background: bg}}>
                          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                        </div>
                        <div className='rec-title-wrapper'>
                          <h4 className='rec-title-text'>{rec.title}</h4>
                          <span className='rec-tag-badge' style={{color: color, background: bg}}>{rec.type}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
