import React from 'react';
import './index.css';
import menuImgZh from '../../assets/menu.jpg';
import menuImgEn from '../../assets_english/menu.jpg';

function Menu({ onBack, onNavigateToDetail, language }) {
  const menuImg = language === 'zh' ? menuImgZh : menuImgEn;

  return (
    <div className="menu-page" style={{ backgroundImage: `url(${menuImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="menu-content">
        <div className="button1" onClick={() => onNavigateToDetail('select1')}></div>
        <div className="button2" onClick={() => onNavigateToDetail('page2')}></div>
        <div className="button3" onClick={() => onNavigateToDetail('page3')}></div>
        <div className="button4" onClick={() => onNavigateToDetail('page4')}></div>
      </div>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Menu;

