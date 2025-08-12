import React, { useContext, useEffect } from 'react'
import './Verify.css'
import {StoreContext} from '../../context/StoreContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const {url} = useContext(StoreContext)
    const navigate = useNavigate()

    console.log("Success:", success);
    console.log("Order ID:", orderId);
    
    const verifyPayment = async () => {
        try {
            const response = await axios.post(url+"/api/order/verify", {success, orderId});
            
            if(response.data.success && success === "true") {
                navigate("/myorders");
            } else {
                // Cart vẫn được giữ nguyên
                navigate("/cart");
            }
        } catch (error) {
            console.error("Verify error:", error);
            navigate("/cart");
        }
    }
    
    useEffect(() => {
        if (success && orderId) {
            verifyPayment();
        } else {
            navigate("/cart");
        }
    }, [])

    return (
        <div className='verify'>
            <div className="spinner">
                <p>
                    {success === "true" 
                        ? "Verifying your payment..." 
                        : "Processing cancellation..."
                    }
                </p>
            </div>
        </div>
    )
}

export default Verify
