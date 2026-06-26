

import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'

const AddCategory = () => {

 const [categoryName, setCategoryName] = useState('')

 const handleSubmit = async (e) => {
  e.preventDefault()
  try {

   const response = await fetch('http://127.0.0.1:8000/api/add-category/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_name: categoryName })
   })

   const data = await response.json();
   if (response.status === 201) {
    toast.success(data.message);
    setCategoryName('')
   } else {
    toast.error("Something went wrong!")
   }
  } catch (error) {
   console.error(error)
   toast.error("Error connecting to server!")
  }
 }

 return (
  <AdminLayout>
   <ToastContainer position='top-right' autoClose={2000} />
   <div className='row'>

    <div className='col-md-8'>
     <div className='shadow-sm p-4 rounded'>
      <h4 className='mb-4'> <i className='fas fa-plus-circle text-primary me-2'></i> Add Category</h4>

      <form onSubmit={handleSubmit}>
       <div className='mb-3'>
        <label className='form-label'><FaUser className='me-1 icon-fix' />Category Name</label>
        <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type='text' className='form-control' placeholder='Enter category name' required />
       </div>

       <button type='submit' className='btn btn-primary w-100 mt-2'> <i className='fas fa-plus me-2'></i> Add Category</button>
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

export default AddCategory