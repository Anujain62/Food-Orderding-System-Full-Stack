import React, { useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { toast, ToastContainer } from 'react-toastify'
import { data, Link, redirect, useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'

const Login = () => {
 const [formData, setFormData] = useState({
  emailCon: '',
  password: ''
 })
 const navigate = useNavigate()

 const handleChange = (e) => {
  const { name, value } = e.target
  setFormData((prev) => ({
   ...prev, [name]: value
  }))
 }

 const handleSubmit = async (e) => {
  e.preventDefault()
  const { emailCon, password } = formData
  try {
   const response = await fetch('http://127.0.0.1:8000/api/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailCon, password })
   })
   const result = await response.json()
   if (response.status === 200) {
    toast.success(result.message || 'Login Successful')
    localStorage.setItem('userId', result.userId)
    localStorage.setItem('userName', result.userName)
    setFormData({
     emailCon: '',
     password: ''
    })
    setTimeout(() => {
     navigate('/')
    }, 2000)
   } else {
    toast.error(result.message || 'Invalid Credentials!')
   }
  } catch (error) {
   toast.error('Error connecting to server!')
  }
 }
 return (
  <PublicLayout>
   <ToastContainer position='top-center' autoClose={2000} />
   <div className='container py-5  text-primary'>
    <div className='row align-items-center'>
     <div className='col-md-6'>
      <h3 className=' text-center mb-4 mt-2'><FaSignInAlt className='me-1' />User Login</h3>
      <form className='card p-4 shadow' onSubmit={handleSubmit}>
       <div className='mb-3'>
        <input name='emailCon' type='text' className='form-control' value={formData.emailCon} onChange={handleChange} placeholder='Enter Email or Mobile Number' required />
       </div>
       <div className='mb-3'>
        <input name='password' type='password' className='form-control' value={formData.password} onChange={handleChange} placeholder='Password' required />
       </div>
       <div className='d-flex justify-content-between'>
        <button className='btn btn-primary'><FaSignInAlt className='me-2'/>Login</button>
       <button className='btn btn-outline-secondary' onClick={()=>{navigate('/register')}}><FaUserPlus className='me-2'/>Register</button>
       </div>
      </form>
     </div>
     <div className='col-md-6 d-flex align-item-center justify-content-center'>
      <div className='text-center'>
       <img className='img-fluid rounded-3 w-70' style={{ maxHeight: "450px" }} src='/images/login.png' />
       </div>
     </div>
    </div>
   </div>
  </PublicLayout>
 )
}

export default Login