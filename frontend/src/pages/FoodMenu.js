import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { Link } from 'react-router-dom'
import Slider from 'rc-slider'
import '../styles/home.css'
import 'rc-slider/assets/index.css'
import { useWishlist } from '../context/WishListContext'
import { toast } from 'react-toastify'

const FoodMenu = () => {
  const [foods, setFoods] = useState([])
  const [filteredFoods, setFilteredFoods] = useState([])
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)

  const [currentPage, setCurrentPage] = useState(1)
  const foodsPerPage = 9

  const userId = localStorage.getItem('userId')
  const [wishlist, setWishlist] = useState([])
  const { wishlistCount, setwishlistCount } = useWishlist()
  const [ratings, setRatings] = useState({})
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/`)
      .then(res => res.json())
      .then(data => {
        setFoods(data)
        setFilteredFoods(data)
      })

    fetch(`http://127.0.0.1:8000/api/categories/`)
      .then(res => res.json())
      .then(data => {
        setCategories(data)
      })

    fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
      .then(res => res.json())
      .then(data => {
        const wishlistIds = data.map(item => item.food_id)
        setWishlist(wishlistIds)
      })
  }, [])

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

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters(search, selectedCategory)
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    applyFilters(search, category)
  }

  const applyFilters = (searchTerm, category) => {
    let result = foods
    if (searchTerm) {
      result = result.filter(food => food.item_name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (category != 'All') {
      result = result.filter(food => food.category_name == category)
    }
    result = result.filter(food => food.price >= minPrice && food.price <= maxPrice)
    setFilteredFoods(result)
    setCurrentPage(1)
  }

  const indexOfLastFood = currentPage * foodsPerPage
  const indexOfFirstFood = indexOfLastFood - foodsPerPage
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood)
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)


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

      <div className='container py-5'>

        <h2 className='text-center text-primary'>Find Your Delicious Food Here...</h2>
        <div className='row'>
          <div className='col-md-8'>
            <form onSubmit={handleSearch}>
              <div className='input-group'>
                <input type='text' className='form-control' placeholder='Search your favourite food' value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className='btn btn-primary' type='submit'><i className='fas fa-search'></i></button>
              </div>
            </form>
          </div>
          <div className='col-md-4'>
            <select className='form-select' value={selectedCategory} onChange={handleCategoryChange}>
              <option value='All'>All Categories</option>
              {
                categories.map((cat, index) => (
                  <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className='row mb-4'>
          <div className='col-md-12'>
            <label className='form-label fw-bold my-2 text-primary'>Filter by Price: ₹{minPrice} - {maxPrice} </label>
            <Slider
              range
              min={0}
              max={500}
              defaultValue={[minPrice, maxPrice]}
              onChange={(value) => {
                setMinPrice(value[0])
                setMaxPrice(value[1])
                applyFilters(search, selectedCategory)
              }}
            >
            </Slider>
          </div>
        </div>

        <div className='row mt-4'>
          {foods.length === 0 ? (
            <p className='text-center'>
              No foods found
            </p>
          ) : (
            currentFoods.map((food, index) =>
              <div className='col-md-4 mb-4'>
                <div className='card hovereffect'>
                  {/* <img className='card-img-top' src={`http://127.0.0.1:8000${food.image}`} style={{ height: '180px' }} /> */}

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
                            style={{ bottom: '100%', width: '80%', marginBottom: '10px', }}>
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = ratings[food.id].breakdown[star] || 0
                              const percentage = ratings[food.id].total_reviews ? (count / ratings[food.id].total_reviews) * 100 : 0
                              return (
                                <div key={star} className='mb-1 d-flex align-items-center'>
                                  <small className='me-2' style={{ width: "50px" }}>{star} star</small>
                                  <div className='progress flex-grow-1'>
                                    <div className='progress-bar bg-warning' style={{ width: `${percentage}%` }}></div>
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

        {totalPages > 1 && (
          <nav className='mt-4 d-flex justify-content-center'>
            <ul className='pagination'>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className='page-link' onClick={() => paginate(1)}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className='page-link' onClick={() => paginate(currentPage - 1)}>Prev</button>
              </li>
              <li className='page-item disabled'>
                <button className='page-link'>Page {currentPage} of {totalPages}</button>
              </li>
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className='page-link' onClick={() => paginate(currentPage + 1)}>Next</button>
              </li>
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className='page-link' onClick={() => paginate(totalPages)}>Last</button>
              </li>
            </ul>
          </nav>
        )}

      </div>
    </PublicLayout>
  )
}

export default FoodMenu