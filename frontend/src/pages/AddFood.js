import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'


const AddFood = () => {

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    price: '',
    item_description: '',
    image: null,
    item_quantity: ''
  })
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        setCategories(Array.isArray(data) ? data : data.categories || [])
      })
      .catch(err => console.error(err))
  }, [])

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
    const data = new FormData()     //for sending combined data (text + image)
    data.append('category', formData.category)
    data.append('item_name', formData.item_name)
    data.append('item_description', formData.item_description)
    data.append('item_quantity', formData.item_quantity)
    data.append('price', formData.price)
    data.append('image', formData.image)
    try {

      const response = await fetch('http://127.0.0.1:8000/api/add-food-item/', {
        method: 'POST',
        body: data,
      })

      const result = await response.json();
      console.log(response.status, result)

      if (response.status === 201) {
        toast.success(result.message);
        setFormData({
          category: '',
          item_name: '',
          price: '',
          item_description: '',
          image: null,
          item_quantity: ''
        });
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
            <h4 className='mb-4'> <i className='fas fa-plus-circle text-primary me-2'></i> Add Food Item</h4>

            {/* encType - it is used when we wants to submit multiple type inputs like image, text etc */}
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

              <div className='mb-3'>
                <label className='form-label'>Image</label>
                <input onChange={handleFileChange} name='image' type='file' accept='image/*' className='form-control' required />
              </div>

              <button type='submit' className='btn btn-primary w-100 mt-2'> <i className='fas fa-plus me-2'></i> Add Food Item</button>
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

export default AddFood