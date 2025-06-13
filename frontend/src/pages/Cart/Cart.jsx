import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './Cart.css'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const {cartItems, food_list, removeFromCart, getTotalCartAmount, url} = useContext(StoreContext);
    const navigate = useNavigate();
    
    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {food_list.map((item, index) => {
                    // Sử dụng cùng logic ID như trong FoodDisplay
                    const itemId = String(item._id || item.id);
                    
                    // Kiểm tra xem item có trong cart không
                    if(cartItems[itemId] > 0){
                        return(
                            <div key={itemId}> {/* Thêm key cho div wrapper */}
                                <div className='cart-items-title cart-items-item'>
                                    <img src={url+"/images/"+item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>${item.price}</p>
                                    <p>{cartItems[itemId]}</p>
                                    <p>${(item.price * cartItems[itemId]).toFixed(2)}</p>
                                    <p onClick={()=>removeFromCart(itemId)} className='cross'>x</p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                    return null; // Trả về null thay vì undefined
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount().toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + 2).toFixed(2)}</b>
                        </div>
                    </div>
                    <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div className='cart-promocode'>
                    <div>
                        <p>If you have a promo code, Enter it here.</p>
                        <div className='cart-promocode-input'>
                            <input type="text" placeholder='Enter promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart