import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'


const Manageuser = () => {

 const [users, setusers] = useState([])
 const [allusers, setAllusers] = useState([])
 const adminuser = localStorage.getItem('adminUser')
 const navigate = useNavigate()
 useEffect(() => {
  if (!adminuser) {
   navigate('/admin-login')
   return
  }
  fetch('http://127.0.0.1:8000/api/users/')
   .then(res => res.json())
   .then(data => {
    setusers(data)
    setAllusers(data)
   })
   .catch(err => console.error(err))
 }, [])

 const handleSearch = (s) => {
  const keyword = s.toLowerCase()
  if (!keyword) {
   setusers(allusers)
  } else {
   const filtered = allusers.filter((u) => u.first_name.toLowerCase().includes(keyword) || u.last_name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword))
   setusers(filtered)
  }
 }

 const handleDelete = (id) => {
  if (window.confirm("Are you sure, you want to delete this user?")) {
   fetch(`http://127.0.0.1:8000/api/delete_user/${id}/`, {
    method: 'DELETE',
   })
    .then(res => res.json())
    .then(data => {
     toast.success(data.message)
     setusers(users.filter(user => user.id != id))
     setTimeout(()=>{
      navigate('/manage-users')
     },2000)
    })
    .catch(err => console.error(err))
  }
 }
 return (
  <AdminLayout>
   <ToastContainer position='top-right' autoClose={1000} />
   <div>
    <h3 className='text-center text-primary'> <i className='fas fa-list-alt me-1'></i>user List</h3>
    <h5 className='text-end text-muted'>
     <i className='fas fa-database me-1'></i> Total users
     <span className='ms-2 badge bg-success'>{users.length}</span>
    </h5>

    <div className='mb-3 d-flex justify-content-between'>
     <input onChange={(e) => handleSearch(e.target.value)} type='text' className='form-control w-50' placeholder='Search by name or email...' />
     <CSVLink data={users} className='btn btn-success' filename='users_list.csv'>
      <i className='fas fa-file-csv me-2'></i>  Export toCSV
     </CSVLink>
    </div>

    <table className='table table-bordered table-hover table-striped'>
     <thead className='table-dark'>
      <tr>
       <th>S. No</th>
       <th>First Name</th>
       <th>Last Name</th>
       <th>Mobile</th>
       <th>Email</th>
       <th>Action</th>
      </tr>
     </thead>

     <tbody>
      {
       users.map((user, index) => (
        <tr key={user.id || index}>
         <td>{index + 1}</td>
         <td>{user.first_name}</td>
         <td>{user.last_name}</td>
         <td>{user.mobile}</td>
         <td>{user.email}</td>
         <td>
          <button onClick={() => handleDelete(user.id)} className='btn btn-sm btn-danger'>
           <i className='fas fa-trash-alt me-1'></i>Delete
          </button>
         </td>
        </tr>
       ))
      }
     </tbody>

    </table>
   </div>
  </AdminLayout>
 )
}

export default Manageuser