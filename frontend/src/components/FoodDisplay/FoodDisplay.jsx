import React from 'react'
import './FoodDisplay.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext);
    
    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className='food-display-list'>
                {food_list.map((item) => {
                    // Sử dụng _id nếu dùng MongoDB, hoặc id nếu dùng SQL database
                    const itemId = item._id || item.id;
                    
                    return (
                        <FoodItem 
                            key={itemId}
                            id={itemId}
                            name={item.name}
                            price={item.price}
                            description={item.description}
                            image={item.image}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default FoodDisplay