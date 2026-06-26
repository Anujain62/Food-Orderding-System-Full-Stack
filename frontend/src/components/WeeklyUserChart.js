import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const WeeklyUserChart = () => {
 const [data, setData] = useState([])
 useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/weekly_user_registration/`)
   .then(res => res.json())
   .then(data => {
    setData(data)
   })
 }, [])

 return (
  <div className='card p-3 shadow' style={{ width: '100%', height: 350 }}>
   <h5 className='text-primary'>Weekly New Users</h5>
   <ResponsiveContainer width='100%' height='100%'>
    <LineChart data={data}>
     <CartesianGrid strokeDasharray='3 3' />
     <XAxis dataKey='week' />
     <YAxis />
     <Tooltip />
     <Line type='monotone' dataKey='new_users' fill='#198757' />
    </LineChart>
   </ResponsiveContainer>
  </div>
 )
}

export default WeeklyUserChart