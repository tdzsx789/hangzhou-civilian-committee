import React from 'react';
import './index.css';
// import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore }) {
  return (
    <div className="home-page" onClick={onLearnMore} style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    </div>
  );
}

export default Home;