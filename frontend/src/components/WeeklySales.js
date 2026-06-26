import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const WeeklySales = () => {
 const [data, setData] = useState([])
 useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/weekly_sales_summary/`)
   .then(res => res.json())
   .then(data => {
    setData(data)
   })
 }, [])

 return (
  <div className='card p-3 shadow' style={{ width: '100%', height: 350 }}>
   <h5 className='text-primary'>Weekly Sales</h5>
   <ResponsiveContainer width='100%' height='100%'>
    <BarChart data={data}>
     <CartesianGrid strokeDasharray='3 3' />
     <XAxis dataKey='week' />
     <YAxis />
     <Tooltip />
     <Bar dataKey='sales' fill='#198757' />
    </BarChart>
   </ResponsiveContainer>
  </div>
 )
}

export default WeeklySales

