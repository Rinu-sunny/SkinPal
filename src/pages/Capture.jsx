import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Camera, Upload, Sun, Eye, Droplets, Ruler, CheckCircle } from 'lucide-react'

export default function Capture(){
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef()

  function handleFile(e){
    const f = e.target.files[0]
    if(f){
      setFile(f)
      const reader = new FileReader()
      reader.onload = ()=> setPreview(reader.result)
      reader.readAsDataURL(f)
    }
  }

  async function handleAnalyze(){
    if(!file) return
    setLoading(true)
    setTimeout(()=>{
      navigate('/results', { state: { 
        analysis: { 
          skin_type: 'Combination', 
          preview,
          issues: [{name:'Acne',confidence:0.85,severity:'high'}] 
        } 
      }})
    }, 1500)
  }

  return (
    <div className='container capture'>
      <div className='capture-header'>
        <h2>Skin Analysis</h2>
        <p style={{color:'#888', fontSize:'14px'}}>Capture or upload a clear photo of your face</p>
      </div>

      {preview ? (
        <div className='preview-container' style={{marginBottom:'24px', borderRadius:'20px', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.08)'}}>
           <img src={preview} style={{width:'100%', display:'block'}} alt='preview'/>
           <button onClick={handleAnalyze} className='btn-cta' disabled={loading} style={{margin:'20px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
             {loading ? 'Analyzing...' : <><CheckCircle size={20} /> Analyze Photo</>}
           </button>
        </div>
      ) : (
        <>
          <div className='capture-area' onClick={()=>inputRef.current.click()} style={{
            background:'#FDFBF7', border:'2px dashed #E8D8C3', borderRadius:'24px', padding:'48px 20px', textAlign:'center', cursor:'pointer', marginBottom:'24px'
          }}>
            <div className='capture-icon-circle' style={{width:'64px', height:'64px', background:'#FFF', borderRadius:'50%', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
              <Image size={32} color='#E65100' />
            </div>
            <strong style={{display:'block', fontSize:'16px', color:'#240808', marginBottom:'4px'}}>Tap to upload a photo</strong>
            <span style={{fontSize:'12px', color:'#A1887F'}}>JPG, PNG supported</span>
          </div>

          <div className='action-row' style={{display:'flex', gap:'16px', marginBottom:'24px'}}>
            <button className='btn-secondary' onClick={()=>inputRef.current.click()} style={{flex:1, padding:'16px', border:'1px solid #E8D8C3', borderRadius:'16px', background:'#FFF', color:'#240808', fontWeight:'600', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
              <Camera size={24} color='#2E86AB' /> Camera
            </button>
            <button className='btn-secondary' onClick={()=>inputRef.current.click()} style={{flex:1, padding:'16px', border:'1px solid #E8D8C3', borderRadius:'16px', background:'#FFF', color:'#240808', fontWeight:'600', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
              <Upload size={24} color='#43A047' /> Gallery
            </button>
          </div>
        </>
      )}
      
      <input ref={inputRef} type='file' onChange={handleFile} accept='image/*' hidden />

      <section className='guidelines'>
        <h4 style={{fontSize:'14px', color:'#555', marginBottom:'16px'}}>Photo Guidelines</h4>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          <div className='guideline-item' style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666', background:'#FFF', padding:'12px', borderRadius:'12px'}}>
            <Sun size={16} color='#F57C00' /> Good lighting
          </div>
          <div className='guideline-item' style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666', background:'#FFF', padding:'12px', borderRadius:'12px'}}>
            <Eye size={16} color='#2E86AB' /> Face centered
          </div>
          <div className='guideline-item' style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666', background:'#FFF', padding:'12px', borderRadius:'12px'}}>
            <Droplets size={16} color='#43A047' /> No makeup
          </div>
          <div className='guideline-item' style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#666', background:'#FFF', padding:'12px', borderRadius:'12px'}}>
            <Ruler size={16} color='#D32F2F' /> Arm's length
          </div>
        </div>
      </section>
    </div>
  )
}
