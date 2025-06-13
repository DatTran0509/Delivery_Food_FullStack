import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img src={assets.logo} alt='' />
                <p>Lorem Ipsum is simply dummpy of the printing and typesetting industry. Lorem Ipsum has been t he industry's standard dummy text ever since the 1500s, when an unkown printer took a gallery of type and scrambled it to make a type specimen book.</p>
                <div className='footer-social-icons' alt="">
                    <img src={assets.facebook_icon} alt='' />
                    <img src={assets.twitter_icon} alt='' />
                    <img src={assets.linkedin_icon} alt='' />
                </div>
            </div>

            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Deliery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            
            <div className='footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>0844376333</li>
                    <li>dat881070@gmail.com</li>
                </ul>
            </div>

        </div>  
        <hr />
        <p className='footer-copyright'>© 2025 Food Delivery - All rights reserved.</p>
    </div>
  )
}

export default Footer
