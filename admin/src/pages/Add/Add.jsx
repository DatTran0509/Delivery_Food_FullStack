import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
  
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image.");
      setImage(false);
      return;
    }

    setImage(file);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate image
    if (!image) {
      toast.error("Please upload an image before submitting.");
      return;
    }

    // Validate other fields
    if (!data.name.trim() || !data.description.trim() || !data.price || !data.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('name', data.name.trim());
    formData.append('description', data.description.trim());
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });
      
      if (response.data.success) {
        // Reset form
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Salad',
        });
        setImage(false);
        
        toast.success(response.data.message || "Food added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Server error: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        toast.error(`Request error: ${error.message}`);
      }
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input 
            onChange={handleImageChange} 
            type="file" 
            id='image' 
            accept="image/*"
            hidden 
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Enter product name' 
            required 
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='Write content description' 
            required
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name='price' 
              placeholder='Enter product price' 
              step="0.01"
              min="0"
              required 
            />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
