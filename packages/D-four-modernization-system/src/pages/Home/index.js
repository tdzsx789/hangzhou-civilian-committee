import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore }) {
  return (
    <div className="home-page" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <header className="home-header">
        <h1>提高社会化、法治化、智能化、专业化水平，构建富有活力和效率的新型基层社会治理体系</h1>
        <p>D馆</p>
      </header>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;