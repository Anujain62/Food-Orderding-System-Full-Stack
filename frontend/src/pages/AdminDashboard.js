import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import '../styles/adminDashboard.css'
import SalesBarChart from '../components/SalesBarChart'
import TopSellingProducts from '../components/TopSellingProducts'
import WeeklySales from '../components/WeeklySales'
import WeeklyUserChart from '../components/WeeklyUserChart'

const AdminDashboard = () => {
  const adminUser = localStorage.getItem('adminUser')
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({
    total_orders: 0,
    new_orders: 0,
    confirmed_orders: 0,
    food_preparing: 0,
    food_pickup: 0,
    food_delivered: 0,
    cancelled_orders: 0,
    total_users: 0,
    total_categories: 0,
    today_sales: 0,
    week_sales: 0,
    month_sales: 0,
    year_sales: 0,
    total_reviews: 0,
    total_wishlists: 0,
  })

  const cardData = [
    { title: "Total Orders", key: 'total_orders', color: 'primary', icon: 'fas fa-shopping-cart' },
    { title: "New Orders", key: 'new_orders', color: 'secondary', icon: 'fas fa-cart-plus' },
    { title: "Confirmed Orders", key: 'confirmed_orders', color: 'info', icon: 'fas fa-check-circle' },
    { title: "Food Being Prepared", key: 'food_preparing', color: 'warning', icon: 'fas fa-utensils' },
    { title: "Food Pickup", key: 'food_pickup', color: 'dark', icon: 'fas fa-motorcycle' },
    { title: "Food delivered", key: 'food_delivered', color: 'success', icon: 'fas fa-truck' },
    { title: "Cancelled Orders", key: 'cancelled_orders', color: 'danger', icon: 'fas fa-times-circle' },
    { title: "Total users", key: 'total_users', color: 'primary', icon: 'fas fa-users' },
    { title: "Today's Sales", key: 'today_sales', color: 'info', icon: 'fas fa-coins' },
    { title: "This Week's Sales", key: 'week_sales', color: 'secondary', icon: 'fas fa-calendar-week' },
    { title: "This Month's Sales", key: 'month_sales', color: 'dark', icon: 'fas fa-calendar-alt' },
    { title: "This Year's Sales", key: 'year_sales', color: 'success', icon: 'fas fa-calendar' },
    { title: "Total Categories", key: 'total_categories', color: 'warning', icon: 'fas fa-list' },
    { title: "Total Wishlists", key: 'total_wishlists', color: 'secondary', icon: 'fas fa-heart' },
    { title: "Total Reviews", key: 'total_reviews', color: 'primary', icon: 'fas fa-star' },
  ]

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login')
      return
    }
    fetch(`http://127.0.0.1:8000/api/dashboard_matrics/`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data)
        console.log(data)
      })
  }, [adminUser, navigate])

  return (
    <AdminLayout>
      <div className='row g-3'>
        <div className='col-md-3 '>
          <div className='card bg-light text-white d-flex justify-content-between align-items-center'>
            <i className='fas fa-concierge-bell fa-2x text-danger mt-2'></i>
            <p className='text-dark fw-bold text-center'>Food Ordering
              <br />
              <span className='text-danger'>System</span>
            </p>
          </div>
        </div>

        {cardData.map((item, i) => (
          <div className='col-md-3' key={item.key}>
            <div className={`card card-hover bg-${item.color} text-white`}>
              <div className='card-body d-flex justify-content-between align-items-center'>
                
                <div>
                  <h5 className='card-title'>{item.title}</h5>
                  <h2>{(item.title.includes('Sales'))? `₹ ${metrics[item.key]}` : metrics[item.key]}</h2>
                </div>
                <i className={`${item.icon} fa-2x`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='row mt-4'>
        <div className='col-md-6 mb-4'>
          <SalesBarChart/>
        </div>
        <div className='col-md-6 mb-4'>
          <TopSellingProducts/>
        </div>
      </div>

      <div className='row mt-4'>
        <div className='col-md-6 mb-4'>
          <WeeklySales/>
        </div>
        <div className='col-md-6 mb-4'>
          <WeeklyUserChart/>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

