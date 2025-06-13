import axios from "axios";
import { createContext, useEffect } from "react"
import React, { useState } from 'react'

export const StoreContext = createContext(null)
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    

    const addToCart = async (itemId) =>  {
        // Ensure itemID is converted to string for consistency
        const id = String(itemId);
        
        if(!cartItems[id]) {
            setCartItems((prev) => ({ ...prev, [id]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [id]: prev[id] + 1 }));
        }
        if (token){
            await axios.post(url+"/api/cart/add", {itemId: id}, {headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        const id = String(itemId);
        setCartItems((prev) => {
            const newCart = {...prev};
            if (newCart[id] > 1) {
                newCart[id] = newCart[id] - 1;
            } else {
                delete newCart[id]; // Remove item completely if count becomes 0
            }
            return newCart;
        });
        
        if (token){
            await axios.post(url+"/api/cart/remove", {itemId: id}, {headers:{token}})
        }
    }

    
    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);

    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        
        // Debug: Log cartItems và food_list
        // console.log("Calculating total for cartItems:", cartItems);
        // console.log("Available food_list:", food_list);
        
        for( const item in cartItems) {
            if(cartItems[item] > 0) {
                // console.log(`Processing cart item ID: ${item}, quantity: ${cartItems[item]}`);
                
                // Sử dụng cùng logic ID như các component khác
                let itemInfo = food_list.find((product) => {
                    const productId = String(product._id || product.id);
                    const cartItemId = String(item);
                    //console.log(`Comparing productId: ${productId} with cartItemId: ${cartItemId}`);
                    return productId === cartItemId;
                });
                
                if(itemInfo) {
                    const itemTotal = itemInfo.price * cartItems[item];
                    //console.log(`Found item: ${itemInfo.name}, price: ${itemInfo.price}, total: ${itemTotal}`);
                    totalAmount += itemTotal;
                } else {
                    console.warn(`Item with ID ${item} not found in food_list`);
                }
            }
        }
        
        // console.log("Final total amount:", totalAmount);
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url+"/api/food/list");
            //console.log("API Response:", response.data.data);
            // Debug: Kiểm tra cấu trúc dữ liệu
            if (response.data.data && response.data.data.length > 0) {
                //console.log("First food item:", response.data.data[0]);
                //console.log("ID field type:", typeof response.data.data[0].id);
            }
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}});
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("Failed to load cart data:", error);
        }
    }

    useEffect(() => {
        async function loadData(){
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider