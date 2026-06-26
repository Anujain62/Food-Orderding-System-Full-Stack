import React, { useState } from 'react'

const CancelOrderModel = ({show, handleCloseModel, orderNumber, payment_mode}) => {

 const [remark, setRemark] = useState('')
 const [message, setMessage] = useState('')
 const [error, setError] = useState('')

 const handleSubmit = async () =>{
  if(!remark.trim()){
   setError("Please provide a reason for cancellation!")
   return
  }
  try{
   const response = await fetch(`http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`,{
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({remark})
   })
   const result = await response.json()
   if(response.ok){
    let msg = result.message
    if(payment_mode === 'online'){
     msg += '\nSince you paid online, your amount will be refunded to your account within 24 hours'
    }
    setMessage(msg)
    setRemark('')
    setError('')
   }else{
    setError(result.message || 'Failed to cancel order')
   }
  }catch(err){
   setError('Something went to wrong')
  }
 }

 return (
  <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1">
   <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
     <div className="modal-header">
      <h5 className="modal-title">Cancel Order #{orderNumber}</h5>
      <button onClick={handleCloseModel} type="button" className="btn-close"></button>
     </div>
     <div className="modal-body">
      {message ? (
       <div className='alert alert-success'>{message}</div>
      ):(
       <>
       <label>Reason for cancellation</label>
       <textarea className='form-control' rows={4} value={remark} onChange={(e)=>setRemark(e.target.value)} placeholder='Enter reason here...'></textarea>
       {error && <div className='text-danger mt-2'>{error}</div>}
       </>
      )}
     </div>
     <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={handleCloseModel}>Close</button>
      <button type="button" className="btn btn-danger" onClick={handleSubmit}>Cancel Order</button>
     </div>
    </div>
   </div>
  </div>
 )
}

export default CancelOrderModel