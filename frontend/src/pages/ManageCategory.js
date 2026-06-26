import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'

const ManageCategory = () => {

  const [categories, setCategories] = useState([])
  const [allcategories, setAllCategories] = useState([])
  const adminUser = localStorage.getItem('adminUser')
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 7

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login')
      return
    }
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : data.categories || [])
        setAllCategories(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleSearch = (s) => {
    const keyword = s.toLowerCase()
    if (!keyword) {
      setCategories(allcategories)
    } else {
      const filtered = allcategories.filter((c) => c.category_name.toLowerCase().includes(keyword))
      setCategories(filtered)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure, you want to delete this category?")) {
      fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message)
          setCategories(categories.filter(cat => cat.id != id))
        })
        .catch(err => console.error(err))
    }
  }

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)
  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <AdminLayout>
      <ToastContainer position='top-right' autoClose={1000} />
      <div>
        <h3 className='text-center text-primary'> <i className='fas fa-list-alt me-1'></i> Manage Food Category</h3>
        <h5 className='text-end text-muted'>
          <i className='fas fa-database me-1'></i> Total Categories
          <span className='ms-2 badge bg-success'>{categories.length}</span>
        </h5>

        <div className='mb-3 d-flex justify-content-between'>
          <input onChange={(e) => handleSearch(e.target.value)} type='text' className='form-control w-50' placeholder='Search by category name...' />
          <CSVLink data={categories} className='btn btn-success' filename='category_list.csv'>
            <i className='fas fa-file-csv me-2'></i>  Export toCSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className='table-dark'>
            <tr>
              <th>S. No</th>
              <th>Category Name</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              currentCategories.map((cat, index) => (
                <tr key={cat.id || index}>
                  <td>{index + 1}</td>
                  <td>{cat.category_name}</td>
                  <td>{new Date(cat.creation_date).toLocaleString()}</td>
                  <td>
                    <Link to={`/edit_category/${cat.id}`} className='btn btn-sm btn-primary me-2'> <i className='fas fa-edit me-1'></i> Edit</Link>
                    <button onClick={() => handleDelete(cat.id)} className='btn btn-sm btn-danger'>
                      <i className='fas fa-trash-alt me-1'></i>Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <div className='mt-3 d-flex justify-content-center'>
          <nav>
            <ul className='pagination'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${page===currentPage? 'active' : '' }`}>
                  <button onClick={()=>handlePageChange(page)} className='page-link'>{page}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageCategory