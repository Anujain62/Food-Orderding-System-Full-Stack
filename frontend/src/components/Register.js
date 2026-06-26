import React, { useState } from 'react'
import PublicLayout from './PublicLayout'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const Register = () => {
 const [formData, setFormData] = useState({
  first_name: '',
  last_name: '',
  mobile: '',
  email: '',
  password: '',
  repeatpassword: ''
 })

 const navigate = useNavigate()

 const handleChange = (e) => {
  console.log(formData)
  const { name, value } = e.target
  setFormData((prev) => ({
   ...prev,
   [name]: value
  }))
 }

 const handleSubmit = async (e) => {
  e.preventDefault()
  const { first_name, last_name, mobile, email, password, repeatpassword } = formData
  if (password !== repeatpassword) {
   toast.error('Password and Confirm Password don not match!')
   return
  }
  try {
   const response = await fetch('http://127.0.0.1:8000/api/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, mobile, password }),
   })
   const result = await response.json()
   console.log(result)
   if (response.status === 201) {
    toast.success(result.message || 'You have successfully registered!')
    setFormData({
     first_name: '',
     last_name: '',
     mobile: '',
     email: '',
     password: '',
     repeatpassword: ''
    })
    setTimeout(()=>{
     navigate('/login')
    },2000)
   } else {
    toast.error(result.message || 'Somthing went wrong!')
   }
  } catch (error) {
   toast.error('Error connecting to server!')
  }
 }

 return (
  <PublicLayout>
   <ToastContainer position='top-center' autoClose={2000} />
   <div className='container py-5  text-primary'>
    <div className='row shadow-lg rounded-4'>
     <div className='col-md-6'>
      <h3 className=' text-center mb-4 mt-2'><i className='fas fa-user-plus me-2'></i>User Registration</h3>
      <form onSubmit={handleSubmit}>
       <div className='mb-3'>
        <input name='first_name' type='text' className='form-control' value={formData.first_name} onChange={handleChange} placeholder='First Name' required />
       </div>
       <div className='mb-3'>
        <input name='last_name' type='text' className='form-control' value={formData.last_name} onChange={handleChange} placeholder='Last Name' required />
       </div>
       <div className='mb-3'>
        <input name='email' type='email' className='form-control' value={formData.email} onChange={handleChange} placeholder='Email' required />
       </div>
       <div className='mb-3'>
        <input name='mobile' type='number' className='form-control' value={formData.mobile} onChange={handleChange} placeholder='Mobile Number' required />
       </div>
       <div className='mb-3'>
        <input name='password' type='password' className='form-control' value={formData.password} onChange={handleChange} placeholder='Password' required />
       </div>
       <div className='mb-3'>
        <input name='repeatpassword' type='password' className='form-control' value={formData.repeatpassword} onChange={handleChange} placeholder='Confirm Password' required />
       </div>
       <button className='btn btn-primary w-100 mb-3'><i className='fas fa-user-check me-2'></i>Submit</button>
      </form>
     </div>
     <div className='col-md-6 d-flex align-item-center justify-content-center'>
      <div className='p-4 text-center'>
       <img className='img-fluid' style={{ maxHeight: "400px" }} src='/images/registration.png' />
       <h5 className='mt-3'>Registration is fast, secure and free.</h5>
       <p className='text-muted small'>Join our food family and enjoy decilious food delivered to your door!</p>
      </div>
     </div>
    </div>
   </div>
  </PublicLayout>
 )
}

export default Register