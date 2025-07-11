import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("menu");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const handleScrollTo = (id, menuName) => {
        setMenu(menuName);
        if (window.location.pathname !== '/') {
            navigate('/', { state: { scrollToId: id } });
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt='logo' className='logo' /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <p onClick={() => handleScrollTo("explore-menu", "menu")} className={menu === "menu" ? "active" : ""}>menu</p>
                <p onClick={() => handleScrollTo("app-download", "mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</p>
                <p onClick={() => handleScrollTo("footer", "contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</p>
            </ul>
            <div className='navbar-right'>
                <img src={assets.search_icon} alt='' />
                <div className='navbar-search-icon'>
                    <Link to='/cart'><img src={assets.basket_icon} alt='' /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt='' />
                        <ul className='nav-profile-dropdown'>
                            <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
