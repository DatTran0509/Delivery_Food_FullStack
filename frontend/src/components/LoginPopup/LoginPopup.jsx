import React, { useContext, useEffect } from 'react'
import './LoginPopup.css'
import { useState } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import {toast} from 'react-toastify';
const LoginPopup = ({setShowLogin}) => {
    const [currState, setCurrState] = useState('Login');
    const {url, setToken} = useContext(StoreContext);

    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const onChangeHandler =(event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({
          ...data,
          [name]: value
      }));
    }

    const onLogin = async (event) => {
      event.preventDefault();
      let newUrl = url;
      if(currState === 'Login') {
        newUrl += '/api/user/login';
      } else {
        newUrl += '/api/user/register';
      }

      const response = await axios.post(newUrl, data);
      if(response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setShowLogin(false);
        toast.success(response.data.message);
        console.log("Login successful:", response.data.message);
      } else {
        toast.error(response.data.message);
        console.error("Login error:", response.data.message);
      }
      
    }
    
  return (
    <div className='login-popup' id='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin()} src={assets.cross_icon} alt=""/>
        </div>
        <div className="login-popup-inputs">
            {currState==='Login'?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your username' required />}
            {/* <input type="text" placeholder='Your name' required /> */}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required/>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use and privacy policy.</p>
        </div>
        {currState==='Login'
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
        :<p>Already have an account?<span onClick={()=>setCurrState("Login")}> Login here</span></p>
        }
    
      </form>
    </div>
  )
}

export default LoginPopup
