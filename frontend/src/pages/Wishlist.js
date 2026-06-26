import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useWishlist } from '../context/WishListContext'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'

const Wishlist = () => {
 const [wishlist, setWishlist] = useState([])
 const { wishlistCount, setwishlistCount } = useWishlist()
 const userId = localStorage.getItem('userId')

 const fetchWishlist = async () => {
  if (userId) {
   const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
   const data = await res.json()
   setWishlist(data)
  }
 }

 const removeFromWishlist = async (foodId) => {
  try {
   const response = await fetch(`http://127.0.0.1:8000/api/wishlist/remove/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     user_id: userId,
     food_id: foodId
    })
   })
   if (response.ok) {

    const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
    const data = await res.json()
    setwishlistCount(Array.isArray(data) ? data.length : 0)

    toast.success('Remove from wishlist')
    fetchWishlist()
   } else {
    toast.error("Failed to update wishlist")
   }
  } catch (error) {
   toast.error("Failed to update wishlist")
  }
 }

 useEffect(() => {
  fetchWishlist()
 }, [userId])

 return (
  <PublicLayout>
   <ToastContainer position='top-right' autoClose={2000} />
   <div className='container py-5'>
    <h2 className='mb-4 text-center text-primary'>My Wishlist</h2>
    <div className='row mt-4'>

     {wishlist.length === 0 ? (
      <p className='text-center'>
       No foods found
      </p>
     ) : (
      wishlist.map((item, index) =>
       <div className='col-md-4 mb-4' key={item.index}>
        <div className='card hovereffect'>
         <div className='position-relative'>
          <img className='card-img-top' src={`http://127.0.0.1:8000${item.image}`} style={{ height: '180px' }} />
          <div className='position-absolute top-0 end-0 m-2 heart-anim'
           style={{
            cursor: 'pointer',
            background: 'white',
            fontSize: '18px',
            padding: '2px',
            borderRadius: '50%',
           }}>
           <i className={`fas fa-heart heart-anim text-danger`} onClick={() => removeFromWishlist(item.food_id)}></i>
          </div>

         </div>
         <div className='card-body'>
          <h5 className='card-title'>
           <Link to={`/food/${item.food_id}`}>{item.item_name}</Link>
          </h5>
          <p className='card-text text-muted'>{item.item_description?.slice(0, 40)}...</p>
          <div className='d-flex justify-content-between align-items-center'>
           <span className='fw-bold'>₹ {item.price}</span>
           {item.is_available ? (
            <Link to={`/food/${item.food_id}`} className='btn btn-outline-primary btn-sm'> <i className='fas fa-shopping-basket me-1'></i> Order Now</Link>
           ) : (
            <div title='This food item is not available right now. Please try again later!'>
             <button className='btn btn-outline-secondary btn-sm'> <i className='fas fa-times-circle me-1'></i> Currently Unavailable</button>
            </div>
           )}
          </div>
         </div>
        </div>
       </div>
      ))}

    </div>
   </div>
  </PublicLayout>
 )
}

export default Wishlist