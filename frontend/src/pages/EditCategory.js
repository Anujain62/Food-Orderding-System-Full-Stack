import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

const EditCategory = () => {
 const [categoryName, setCategoryName] = useState('')
 const { id } = useParams()
 const adminUser = localStorage.getItem('adminUser')
 const navigate = useNavigate()
 useEffect(() => {
  if (!adminUser) {
   navigate('/admin-login')
   return
  }

 }, [])

 useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/category/${id}/`)
   .then(res => res.json())
   .then(data => {
    setCategoryName(data.category_name)
   })
   .catch(err => console.error(err))
 }, [id])

 const handleUpdate = (e) => {
  e.preventDefault()
  if (window.confirm("Are you sure, you want to delete this category?")) {
   fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_name: categoryName })
   })
    .then(res => res.json())
    .then(data => {
     toast.success(data.message)
     setTimeout(() => {
      navigate('/manage-category')
     }, 2000)
    })
    .catch(err => console.error(err))
  }
 }

 return (
  <AdminLayout>
   <ToastContainer position='top-right' autoClose={2000} />
   <div className='row'>

    <div className='col-md-8'>
     <div className='shadow-sm p-4 rounded'>
      <h4 className='mb-4'> <i className='fas fa-pen-square text-primary me-2'></i> Edit Food Category</h4>

      <form onSubmit={handleUpdate}>
       <div className='mb-3'>
        <label className='form-label'><FaUser className='me-1 icon-fix' />Category Name</label>
        <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type='text' className='form-control' placeholder='Enter category name' required />
       </div>

       <button type='submit' className='btn btn-primary mt-2'> <i className='fas fa-save me-2'></i> Update Category</button>
      </form>

     </div>
    </div>

    <div className='col-md-4 d-flex justify-content-center align-item-center'>
     <i className='fas fa-utensils' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
    </div>

   </div>
  </AdminLayout>

 )
}

export default EditCategory  