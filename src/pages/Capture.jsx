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
        <p>Capture or upload a clear photo of your face</p>
      </div>

      {preview ? (
        <div className='capture-preview'>
           <img src={preview} alt='preview'/>
           <button onClick={handleAnalyze} className='btn-cta capture-analyze-btn' disabled={loading}>
             {loading ? 'Analyzing...' : <><CheckCircle size={20} /> Analyze Photo</>}
           </button>
        </div>
      ) : (
        <>
          <div className='capture-dropzone' onClick={()=>inputRef.current.click()}>
            <div className='capture-icon-placeholder'>
              <Image size={32} color='#E65100' />
            </div>
            <strong className='capture-title'>Tap to upload a photo</strong>
            <span className='capture-subtitle'>JPG, PNG supported</span>
          </div>

          <div className='capture-actions'>
            <button className='btn-secondary capture-btn' onClick={()=>inputRef.current.click()}>
              <Camera size={24} color='#2E86AB' /> Camera
            </button>
            <button className='btn-secondary capture-btn' onClick={()=>inputRef.current.click()}>
              <Upload size={24} color='#43A047' /> Gallery
            </button>
          </div>
        </>
      )}
      
      <input ref={inputRef} type='file' onChange={handleFile} accept='image/*' hidden />

      <section className='guidelines'>
        <h4>Photo Guidelines</h4>
        <div className='guidelines-grid'>
          <div className='guideline-card'>
            <div className='guideline-point'>
              <Sun size={16} color='#F57C00' />
              <span>Good lighting</span>
            </div>
            <div className='guideline-point'>
              <Eye size={16} color='#2E86AB' />
              <span>Face centered</span>
            </div>
            <div className='guideline-point'>
              <Droplets size={16} color='#43A047' />
              <span>No makeup</span>
            </div>
            <div className='guideline-point'>
              <Ruler size={16} color='#D32F2F' />
              <span>Arm's length</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
