import React, { useEffect, useState } from 'react'
import { FaCogs, FaHeart, FaHome, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTruck, FaUser, FaUserCircle, FaUserPlus, FaUserShield, FaUtensils } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/layout.css'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishListContext'

const PublicLayout = ({ children }) => {

 const [isLoggedIn, setLoggedIn] = useState(false)
 const [userName, setUserName] = useState('')
 const { cartCount, setCartCount } = useCart()
 const { wishlistCount, setwishlistCount } = useWishlist()

 const navigate = useNavigate()
 const userId = localStorage.getItem('userId')
 const name = localStorage.getItem('userName')
 const location = useLocation()

 const fetchCartCount = async () => {
  if (userId) {
   const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}`)
   const data = await res.json()
   setCartCount(data.length)
  }
 }

 const fetchWishlistCount = async () => {
  if (userId) {
   const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
    const data = await res.json()
    setwishlistCount(Array.isArray(data) ? data.length : 0)
  }
 }

 useEffect(() => {
  if (userId) {
   setLoggedIn(true)
   setUserName(name)
   fetchCartCount()
   fetchWishlistCount()
  }
 }, [userId])

 const handleLogout = () => {
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  setLoggedIn(false)
  setCartCount(0)
  setwishlistCount(0)
  navigate('/login')
 }

 return (
  <div>
   <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
    <div className='container'>
     <Link className='navbar-brand fw-bold' to='#'> <FaUtensils className='me-1' /> Food Ordering System</Link>

     <button
      className='navbar-toggler'
      type='button'
      data-bs-toggle='collapse'
      data-bs-target='#navbarSupportedContent'
      aria-controls='navbarSupportedContent'
      aria-expanded='false'
      aria-label='Toggle navigation'
     >
      <span className='navbar-toggler-icon'></span>
     </button>

     <div className='collapse navbar-collapse' id='navbarSupportedContent'>
      <ul className='navbar-nav ms-auto'>
       <li className='nav-item mx-1'>
        <Link to='/' className={`nav-link ${location.pathname==='/' ? 'active-nav-link' : ''} p-1`} aria-current='page'> <FaHome className='me-1' /> Home</Link>
       </li>
       <li className='nav-item mx-1'>
        <Link className={`nav-link ${location.pathname==='/food-menu' ? 'active-nav-link' : ''} p-1`} to='/food-menu'><FaUtensils className='me-1' /> Menu</Link>
       </li>
       <li className='nav-item mx-1'>
        <Link className={`nav-link ${location.pathname==='/track' ? 'active-nav-link' : ''} p-1`} to='/track'><FaTruck className='me-1' /> Track</Link>
       </li>
       {!isLoggedIn ? (
        <>
         <li className='nav-item mx-1'>
          <Link className={`nav-link ${location.pathname==='/register' ? 'active-nav-link' : ''} p-1`} to='/register'><FaUserPlus className='me-1' /> Register</Link>
         </li>
         <li className='nav-item mx-1'>
          <Link className={`nav-link ${location.pathname==='/login' ? 'active-nav-link' : ''} p-1`} to='/login'><FaSignInAlt className='me-1' /> Login</Link>
         </li>
         <li className='nav-item mx-1'>
          <Link to='/admin-login' className={`nav-link ${location.pathname==='/admin-login' ? 'active-nav-link' : ''} p-1`}><FaUserShield className='me-1' /> Admin</Link>
         </li>
        </>
       ) : (
        <>
         <li className='nav-item mx-1'>
          <Link className={`nav-link ${location.pathname==='/my-orders' ? 'active-nav-link' : ''} p-1`} to='/my-orders'><FaUser className='me-1' />My Orders</Link>
         </li>
         <li className='nav-item mx-1'>
          <Link className={`nav-link ${location.pathname==='/cart' ? 'active-nav-link' : ''} p-1`} to='/cart'><FaShoppingCart className='me-1' />Card
           {cartCount > 0 && (
            <span className='badge bg-light text-dark ms-1'>({cartCount})</span>
           )}
          </Link>
         </li>
         <li className='nav-item mx-1'>
          <Link to='/wishlist' className={`nav-link ${location.pathname==='/wishlist' ? 'active-nav-link' : ''} p-1`}><FaHeart className='me-1' />Wishlist
           {wishlistCount > 0 && (
            <span className='badge bg-light text-dark ms-1'>({wishlistCount})</span>
           )}
          </Link>
         </li>
         <li className='nav-item dropdown'>
          <a className='p-1 nav-link dropdown-toggle text-capitalize' href='#' id='navbarDropdown' role='button' data-bs-toggle="dropdown"> <FaUserCircle className='me-1' /> {userName}</a>
          <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
           <li><Link className={`dropdown-item ${location.pathname === '/profile' ? 'active-dropdown' : ''}`} to='/profile'><FaUser className='me-1' /> Profile</Link></li>
           <li><Link className={`dropdown-item ${location.pathname === '/changepassword' ? 'active-dropdown' : ''}`} to='/changepassword'><FaCogs className='me-1' /> Settings</Link></li>
           <li><hr className='dropdown-divider' /></li>
           <li><button className='dropdown-item' onClick={handleLogout}> <FaSignOutAlt className='me-1' />Logout</button></li>
          </ul>
         </li>
        </>
       )}
      </ul>
     </div>
    </div>
   </nav>

   <div>{children}</div>

   <footer className='text-center py-3 mt-5'>
    <div className='container'>
     <p>&copy; 2026 Food Ordering System. All rights reserved</p>
    </div>
   </footer>
  </div>
 )
}

export default PublicLayout

