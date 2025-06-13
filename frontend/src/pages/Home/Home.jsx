import React, { useEffect, useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const [category, setCategory] = useState('All');
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollToId) {
            const el = document.getElementById(location.state.scrollToId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100); // đợi 1 chút để component render xong
            }
        }
    }, [location]);

    return (
        <div>
            <Header />
            <div id="explore-menu">
                <ExploreMenu category={category} setCategory={setCategory} />
            </div>
            <FoodDisplay category={category} />
            <div id="app-download">
                <AppDownload />
            </div>
            <div id="footer"></div> {/* vị trí cuộn xuống phần contact */}
        </div>
    );
};

export default Home;
