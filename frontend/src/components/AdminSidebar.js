import React, { useState } from 'react'
// import '../styles/admin.css'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaEdit, FaThLarge, FaUsers, FaChevronUp, FaList, FaFile, FaSearch, FaStar, FaCommentAlt } from 'react-icons/fa'

const AdminSidebar = () => {

 const [openMenus, setOpenMenus] = useState({
  category: false,
  food: false,
  orders: false
 })

 const toggleMenu = (menu) => {
  setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }))
 }

 return (
  <div className='bg-dark text-white sidebar'>

   <div className='text-center p-3 border-bottom'>
    <img src='/images/admin.png' className='img-fluid rounded-circle mb-2' width='70' alt='Admin Image' />
    <h6 className='mb-0'>Admin</h6>
   </div>

   <div className='list-group list-group-flush '>
    <Link to='/admin-dashboard' className='list-group-item list-group-item-action bg-dark text-white border-0'> <FaThLarge/> Dashboard</Link>

    <div className='list-group list-group-flush '>
     <Link to='/manage-users' className='list-group-item list-group-item-action bg-dark text-white'> <FaUsers/> Reg Users</Link>
    </div>

    <button onClick={() => toggleMenu('category')} className='list-group-item list-group-item-action bg-dark text-white border-0 '>
     <FaEdit className='me-2'/>Food Category {openMenus.category? <FaChevronUp/> : <FaChevronDown/>}
    </button>

    {openMenus.category && (
     <div className='ps-4'>
      <Link to='/add-category' className='list-group-item list-group-item-action bg-dark text-white border-0' >Add Category</Link>
      <Link to='/manage-category' className='list-group-item list-group-item-action bg-dark text-white border-0'> Manage Category</Link>
     </div>
    )}


    <button onClick={() => toggleMenu('food')} className='list-group-item list-group-item-action bg-dark text-white border-0'>
     <FaEdit className='me-2'/>Food Menu {openMenus.food? <FaChevronUp/> : <FaChevronDown/>}
    </button>

    {openMenus.food && (
     <div className='ps-4'>
      <Link to='/add-food' className='list-group-item list-group-item-action bg-dark text-white border-0'>Add Food</Link>
      <Link to='/manage-food' className='list-group-item list-group-item-action bg-dark text-white border-0'> Manage Food</Link>
     </div>
    )}

    <button onClick={() => toggleMenu('orders')} className='list-group-item list-group-item-action bg-dark text-white border-0'>
     <FaList className='me-2'/>Orders {openMenus.orders? <FaChevronUp/> : <FaChevronDown/>}
    </button>

    {openMenus.orders && (
     <div className='ps-4'>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-not-confirmed'>Not Confirmed</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-confirmed'> Confirmed</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-being-prepared'> Being Prepared</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-pickup'> Food Pickup</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-delivered'> Delivered</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/order-cancelled'> Cancelled</Link>
      <Link className='list-group-item list-group-item-action bg-dark text-white border-0' to='/all-order'>All Orders</Link>
     </div>
    )}

    <div className='list-group list-group-flush '>
     <Link className='list-group-item list-group-item-action bg-dark text-white' to='/order-report'> <FaFile className='me-2'/> B/w Dates Report</Link>
    </div>

    <div className='list-group list-group-flush '>
     <Link className='list-group-item list-group-item-action bg-dark text-white' to='/search-order'> <FaSearch className='me-2'/> Search</Link>
    </div>

    <div className='list-group list-group-flush '>
     <Link className='list-group-item list-group-item-action bg-dark text-white' to='/manage-reviews'> <FaCommentAlt className='me-2'/> Manage Reviews</Link>
    </div>

   </div>

  </div>
 )
}

export default AdminSidebar