import React, { use, useContext, useEffect } from 'react'
import './Verify.css'
import {StoreContext} from '../../context/StoreContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const {url} = useContext(StoreContext)
    const navigate = useNavigate()

    console.log("Success:", success);
    console.log("Order ID:", orderId);
    
    const verifyPayment = async () =>{
        const response = await axios.post(url+"/api/order/verify", {success, orderId});
        if(response.data.success){
            navigate("/myorders");
        }
        else{
            navigate("/")
        }
    }
    useEffect(() => {
        verifyPayment();
    },[])

  return (
    <div className='verify'>
        <div className="spinner">

        </div>
    </div>
  )
}

export default Verify
