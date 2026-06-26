import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'

const ManageFood = () => {
  const [foods, setFoods] = useState([])
  const [allfoods, setAllFoods] = useState([])
  const adminUser = localStorage.getItem('adminUser')
  const navigate = useNavigate()
  useEffect(() => {
  if (!adminUser) {
   navigate('/admin-login')
   return
  }
    fetch('http://127.0.0.1:8000/api/foods/')
      .then(res => res.json())
      .then(data => {
        setFoods(Array.isArray(data) ? data : data.categories || [])
        setAllFoods(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleSearch = (s) => {
    const keyword = s.toLowerCase()
    if (!keyword) {
      setFoods(allfoods)
    } else {
      const filtered = allfoods.filter((c) => c.item_name.toLowerCase().includes(keyword))
      setFoods(filtered)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure, you want to delete this food item?")) {
      fetch(`http://127.0.0.1:8000/api/delete-food/${id}/`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message)
          setFoods(foods.filter(food => food.id != id))
        })
        .catch(err => console.error(err))
    }
  }

  return (
    <AdminLayout>
      <ToastContainer position='top-center' autoClose={2000} />
      <div>
        <h3 className='text-center text-primary'> <i className='fas fa-list-alt me-1'></i> Manage Food Items</h3>
        <h5 className='text-end text-muted'>
          <i className='fas fa-database me-1'></i> Total Categories
          <span className='ms-2 badge bg-success'>{foods.length}</span>
        </h5>

        <div className='mb-3 d-flex justify-content-between'>
          <input onChange={(e) => handleSearch(e.target.value)} type='text' className='form-control w-50' placeholder='Search by food item name...' />
          <CSVLink data={foods} className='btn btn-success' filename='food_list.csv'>
            <i className='fas fa-file-csv me-2'></i>  Export toCSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className='table-dark'>
            <tr>
              <th>S. No</th>
              <th>Category Name</th>
              <th>Food Item Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              foods.map((food, index) => (
                <tr key={food.id || index}>
                  <td>{index + 1}</td>
                  <td>{food.category_name}</td>
                  <td>{food.item_name}</td>
                  <td>
                    <Link to={`/edit_food/${food.id}`} className='btn btn-sm btn-primary me-2'> <i className='fas fa-edit me-1'></i> Edit</Link>
                    <button onClick={() => handleDelete(food.id)} className='btn btn-sm btn-danger'>
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

export default ManageFood