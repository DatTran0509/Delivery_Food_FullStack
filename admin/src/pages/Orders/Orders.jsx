import React from 'react'
import './Orders.css'
import {toast} from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { assets } from '../../assets/assets'
const Orders = ({url}) => {
    const [orders, setOrders] = useState([])
    const  fetchAllOrders = async() => {
        const response = await axios.get(url + "/api/order/list");
        if (response.data.success){
            setOrders(response.data.data);
            console.log(response.data.data);
        }
        else{
            toast.error("Failed to fetch orders. Please try again later.");
        }
    }
    const statusHandler = async (event, orderId) => {
        const response = await axios.post(url + "/api/order/status",{
            orderId: orderId,
            status: event.target.value
        })
        if (response.data.success){
            await fetchAllOrders();
        }
    }
    useEffect(() => {
        fetchAllOrders();
    }
    , []);
  return (
    <div>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
            <div key={index} className="order-item">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <div>
                    <p className='order-item-food'>
                        {order.items.map((item, index) => {
                            if(index === order.items.length - 1) {
                                return item.name + " x " + item.quantity;
                            }
                            return item.name + " x " + item.quantity + ", ";
                        })}
                    </p>
                    <p className='order-item-name'>{order.address.firstName} + {order.address.lastName}</p>
                    <p className='order-item-address'>
                        <p>{order.address.street+", "}</p>
                        <p>{order.address.city + ", " + order.address.state + ", " + order.address.country+", " +order.address.zipcode} </p>
                    </p>
                    <p className="order-item-phone">{order.address.phone}</p>
                </div>
                <p>Items: {order.items.length}</p>
                <p>Totoal cost: ${order.amount}</p>
                <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='order-item-status'>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Deliveried">Deliveried</option>
                </select>

            </div>
        ))}
      </div>

    </div>
  )
}

export default Orders
