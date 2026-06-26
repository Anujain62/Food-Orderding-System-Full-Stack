import React, { useEffect, useState } from 'react'
import { FaHome, FaSignInAlt, FaTruck, FaUserPlus, FaUserShield, FaUtensils } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css'
import { toast, ToastContainer } from 'react-toastify'
import { useWishlist } from '../context/WishListContext'
const Home = () => {

  const [foods, setFoods] = useState([])
  const [wishlist, setWishlist] = useState([])
  const userId = localStorage.getItem('userId')
  const { wishlistCount, setwishlistCount } = useWishlist()
  const [ratings, setRatings] = useState({})
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/random_foods/`)
      .then(res => res.json())
      .then(data => {
        setFoods(data)
      })
  }, [])

  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        .then(res => res.json())
        .then(data => {
          const wishlistIds = data.map(item => item.food_id)
          setWishlist(wishlistIds)
        })
    }
  }, [userId])


  useEffect(() => {
    const fetchAllRatings = async () => {
      const allRatings = {}
      for (let food of foods) {
        const res = await fetch(`http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`)
        const data = await res.json()
        allRatings[food.id] = data
      }
      setRatings(allRatings)
    }

    if (foods.length > 0) {
      fetchAllRatings()
    }
  }, [foods])


  const toggleWishlist = async (foodId) => {
    if (!userId) {
      toast.info("Please Login to use wishlist.")
      return
    }
    const isWishlisted = wishlist.includes(foodId)
    const endpoint = isWishlisted ? 'remove' : 'add'

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          food_id: foodId
        })
      })
      if (response.ok) {
        setWishlist(prev => isWishlisted ? prev.filter(id => id != foodId) : [...prev, foodId])

        const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        const data = await res.json()
        setwishlistCount(Array.isArray(data) ? data.length : 0)

        toast.success(isWishlisted ? 'Remove from wishlist' : 'Add to wishlist')
      } else {
        toast.error("Failed to update wishlist")
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <PublicLayout>
      <ToastContainer position='top-left' autoClose={2000} />
      <section className='hero py-5 text-center' style={{ backgroundImage: "url('/images/food1.png')" }}>
        <div style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "40px 20px", borderRadius: "10px", }}>
          <h1 className='display-5'>Quick & Hot Food, Delivered to You.</h1>
          <p className='lead'>Craving something tasty? Let's get it to your door!</p>
          <form method='GET' action="/search" className='d-flex mt-3' style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }} type='text' name='q' placeholder='I would like to eat...' className='form-control' />
            <button style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }} className='btn btn-warning px-4'>Search</button>
          </form>
        </div>
      </section>

      <section className='py-5'>
        <div className='container'>
          <h2 className='text-center mb-4'>Most Loved Dishes This Month
            <span className='badge bg-danger ms-2'>Top Picks</span>
          </h2>
          <div className='row mt-4'>

            {foods.length === 0 ? (
              <p className='text-center'>
                No foods found
              </p>
            ) : (
              foods.map((food, index) =>
                <div className='col-md-4 mb-4'>
                  <div className='card hovereffect'>
                    <div className='position-relative'>
                      <img className='card-img-top' src={`http://127.0.0.1:8000${food.image}`} style={{ height: '180px' }} />
                      <div className='position-absolute top-0 end-0 m-2 heart-anim'
                        style={{
                          cursor: 'pointer',
                          background: 'white',
                          fontSize: '18px',
                          padding: '2px',
                          borderRadius: '50%',
                        }}>
                        <i className={`${wishlist.includes(food.id) ? 'fas' : 'far'} fa-heart heart-anim text-danger`} onClick={() => toggleWishlist(food.id)}></i>
                      </div>

                    </div>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                      </h5>
                      <p className='card-text text-muted'>{food.item_description?.slice(0, 40)}...</p>


                      {ratings[food.id] && (
                        <div className='mb-2 rating-summary-wrapper position-relative' onMouseEnter={() => setHovered(food.id)} onMouseLeave={() => setHovered(null)}>
                          <div>
                            <span className='text-warning'>
                              {Array(Math.round(ratings[food.id].average)).fill().map((_, i) => (
                                <i key={i} className='fas fa-star'></i>
                              ))}
                              {Array(5 - Math.round(ratings[food.id].average)).fill().map((_, i) => (
                                <i key={i} className='far fa-star'></i>
                              ))}
                            </span>
                            <small className='text-muted ms-2'>{ratings[food.id].average} ({ratings[food.id].total_reviews} ratings)</small>
                          </div>
                          {hovered === food.id && ratings[food.id].breakdown && (
                            <div className='hover-popup p-3 border rounded shadow position-absolute bg-white'
                            style={{bottom:'100%', width:'80%', marginBottom:'10px',}}>
                              {[5,4,3,2,1].map((star)=>{
                                const count = ratings[food.id].breakdown[star] || 0
                                const percentage = ratings[food.id].total_reviews ? (count / ratings[food.id].total_reviews)*100 : 0
                                return (
                                  <div key={star} className='mb-1 d-flex align-items-center'>
                                    <small className='me-2' style={{width:"50px"}}>{star} star</small>
                                    <div className='progress flex-grow-1'>
                                      <div className='progress-bar bg-warning' style={{width: `${percentage}%`}}></div> 
                                    </div>
                                      <small className='ms-2'>{count}</small>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      <div className='d-flex justify-content-between align-items-center'>
                        <span className='fw-bold'>₹ {food.price}</span>
                        {food.is_available ? (
                          <Link to={`/food/${food.id}`} className='btn btn-outline-primary btn-sm'> <i className='fas fa-shopping-basket me-1'></i> Order Now</Link>
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
      </section>

      <section className='py-5 bg-dark text-white'>
        <div className='container text-center'>
          <h2>Ordering in 3 Simple Steps</h2>
          <div className='row mt-4'>
            <div className='col-md-4'>
              <h4>1. Pick a dish you love</h4>
              <p>Explore hundreds of mouth-watering options and choose what you crave!</p>
            </div>
            <div className='col-md-4'>
              <h4>2. Share your location</h4>
              <p>Tell us where you are, and we'll handle the rest.</p>
            </div>
            <div className='col-md-4'>
              <h4>3. Enjoy doorstep delivery</h4>
              <p>Relax while your meal arrives fast and fresh - pay when it's delivered!</p>
            </div>
          </div>
          <p>Pay easily with Cash on Delivery - hassle-free!</p>
        </div>
      </section>

      <section className='py-5 bg-warning text-center text-dark'>
        <h4>Ready to Satisfy Your Hunger?</h4>
        <Link to="/food-menu" className='btn btn-dark btn-lg'>Browse Full Menu</Link>
      </section>

    </PublicLayout>
  )
}

export default Home





