import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

const EditFood = () => {
 const { id } = useParams()
 const adminUser = localStorage.getItem('adminUser')
 const navigate = useNavigate()
 const [categories, setCategories] = useState([])
 const [formData, setFormData] = useState({
  category: '',
  item_name: '',
  price: '',
  item_description: '',
  image: '',
  item_quantity: '',
  is_available: true
 })

 useEffect(() => {
  if (!adminUser) {
   navigate('/admin-login')
   return
  }
  fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`)
   .then(res => res.json())
   .then(data => {
    setFormData(data)
   })
   .catch(err => console.error(err))

  fetch(`http://127.0.0.1:8000/api/categories/`)
   .then(res => res.json())
   .then(data => {
    setCategories(data)
   })
   .catch(err => console.error(err))

 }, [id])

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
   ...prev, [name]: value
  }))
 }

 const handleFileChange = (e) => {
  setFormData((prev) => ({
   ...prev, image: e.target.files[0]
  }))
 }

 const handleSubmit = async (e) => {
  e.preventDefault()
  const data = new FormData()
  data.append('category', formData.category)
  data.append('item_name', formData.item_name)
  data.append('item_description', formData.item_description)
  data.append('item_quantity', formData.item_quantity)
  data.append('price', formData.price)
  data.append('image', formData.image)
  data.append('is_available', formData.is_available?'true':'false')
  try {
   const response = await fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`, {
    method: 'PUT',
    body: data,
   })

   const result = await response.json();

   if (response.status === 200) {
    toast.success(result.message);
    setTimeout(()=>{
     navigate('/manage-food')
    },2000)
   } else {
    toast.error(result.message || 'Something went wrong')
   }
  } catch (error) {
   toast.error("Error connecting to server!")
  }
 }


 return (
  <AdminLayout>
   <ToastContainer position='top-right' autoClose={2000} />
   <div className='row'>

    <div className='col-md-8'>
     <div className='shadow-sm p-4 rounded'>
      <h4 className='mb-4'> <i className='fas fa-pen-square text-primary me-2'></i> Edit Food Item</h4>

      <form onSubmit={handleSubmit} encType='multipart/form-data'>
       <div className='mb-3'>
        <label className='form-label'>Food Category</label>

        <select onChange={handleChange} name='category' value={formData.category} className='form-select' required>
         <option value="">Select Category</option>
         {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.category_name}</option>
         ))}
        </select>

       </div>

       <div className='mb-3'>
        <label className='form-label'>Food Item Name</label>
        <input value={formData.item_name} onChange={handleChange} name='item_name' type='text' className='form-control' placeholder='Enter Food Item Name' required />
       </div>

       <div className='mb-3'>
        <label className='form-label'>Description</label>
        <textarea value={formData.item_description} onChange={handleChange} name='item_description' className='form-control' placeholder='Enter Description' required />
       </div>

       <div className='mb-3'>
        <label className='form-label'>Quantity</label>
        <input value={formData.item_quantity} onChange={handleChange} name='item_quantity' type='text' className='form-control' placeholder='e.g. 2pcs/ Large ' required />
       </div>

       <div className='mb-3'>
        <label className='form-label'>Price(₹)</label>
        <input value={formData.price} onChange={handleChange} step='.01' name='price' type='number' className='form-control' placeholder='Enter Price of item' required />
       </div>

       <div className='mb-3 form-check form-switch'>
        <input type='checkbox' name='is_available' onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} checked={formData.is_available} className='form-check-input'/>
        <label className='form-check-label'>
         {formData.is_available ? "Available" : "No available"}
        </label>
       </div>

       <div className='mb-3'>
        <label className='form-label'>Image</label>
        <div className='row'>
         <div className='col-md-6'>
          <input onChange={handleFileChange} name='image' type='file' accept='image/*' className='form-control' />
         </div>
         <div className='col-md-6'>
          {formData.image && (
           <img src={`http://127.0.0.1:8000/${formData.image}`} className='img-fluid' style={{maxHeight:'100px',padding:'4px', border:'1px solid', borderRadius:'5px'}} />
          )}
         </div>
        </div>
       </div>

       <button type='submit' className='btn btn-primary w-100 mt-2'> <i className='fas fa-plus me-2'></i> Update Food Item</button>
      </form>

     </div>
    </div>

    <div className='col-md-4 d-flex justify-content-center align-item-center'>
     <i className='fas fa-pizza-slice' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
    </div>

   </div>
  </AdminLayout>
 )
}

export default EditFood