import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, AlertCircle, CheckCircle 
} from 'lucide-react'
import { 
  apiAdminGetAllProducts, 
  apiAdminCreateProduct, 
  apiAdminUpdateProduct, 
  apiAdminDeleteProduct
} from '../api'
import '../styles.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    skin_type: ''
  })

  // Check admin session
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      navigate('/admin/login')
    }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const productsData = await apiAdminGetAllProducts()
      // Sort products by product_id (serial number) in ascending order
      const sortedProducts = productsData.sort((a, b) => a.product_id - b.product_id)
      setProducts(sortedProducts)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    navigate('/admin/login')
  }

  function scrollToForm() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAddNew() {
    setFormData({ product_name: '', product_type: '', skin_type: '' })
    setEditingId(null)
    setShowAddForm(true)
    setTimeout(scrollToForm, 0)
  }

  function handleEdit(product) {
    setFormData({
      product_name: product.product_name,
      product_type: product.product_type,
      skin_type: product.skin_type
    })
    setEditingId(product.product_id)
    setTimeout(scrollToForm, 0)
  }

  function handleCancel() {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ product_name: '', product_type: '', skin_type: '' })
  }

  async function handleSave() {
    try {
      setError('')
      setSuccess('')

      if (!formData.product_name || !formData.product_type || !formData.skin_type) {
        setError('All fields are required')
        return
      }

      if (editingId) {
        // Update existing product
        await apiAdminUpdateProduct(
          editingId,
          formData.product_name,
          formData.product_type,
          formData.skin_type
        )
        setSuccess('Product updated successfully!')
      } else {
        // Create new product
        await apiAdminCreateProduct(
          formData.product_name,
          formData.product_type,
          formData.skin_type
        )
        setSuccess('Product created successfully!')
      }

      await loadData()
      handleCancel()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Operation failed')
    }
  }

  async function handleDelete(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setError('')
        await apiAdminDeleteProduct(productId)
        setSuccess('Product deleted successfully!')
        await loadData()
        setTimeout(() => setSuccess(''), 3000)
        scrollToForm()
      } catch (err) {
        setError(err.message || 'Failed to delete product')
      }
    }
  }

  const adminUsername = localStorage.getItem('admin_username')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Admin Dashboard</h1>
          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
            Logged in as: <strong>{adminUsername}</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: '0', marginBottom: '1rem' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Product Name
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="e.g., CeraVe Face Wash"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Product Type
              </label>
              <select
                value={formData.product_type}
                onChange={e => setFormData({ ...formData, product_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Product Type</option>
                <option value="facewash">Face Wash</option>
                <option value="sunscreen">Sunscreen</option>
                <option value="moisturizer">Moisturizer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Skin Type
              </label>
              <select
                value={formData.skin_type}
                onChange={e => setFormData({ ...formData, skin_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Skin Type</option>
                <option value="dry">Dry</option>
                <option value="acne">Acne</option>
                <option value="normal">Normal</option>
                <option value="oily">Oily</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2ed573',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <Save size={18} />
              {editingId ? 'Update Product' : 'Add Product'}
            </button>

            <button
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#bdc3c7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: '0', color: '#333' }}>Products ({products.length})</h2>
          {!showAddForm && !editingId && (
            <button
              onClick={handleAddNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1869ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <Plus size={18} />
              Add New Product
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No products found. Add one to get started!
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Product Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Skin Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.product_id} style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                }}>
                  <td style={{ padding: '1rem' }}>{product.product_id}</td>
                  <td style={{ padding: '1rem' }}>{product.product_name}</td>
                  <td style={{ padding: '1rem' }}>{product.product_type}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      {product.skin_type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#1869ff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#ff4757',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
