import React from 'react';
import './index.css';

function Detail({ name, gallery, onBack }) {
  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={onBack}>返回</button>
        <h1>新时代基层治理发展（2022年10月-至今）-竖屏1</h1>
        <p>B馆 - 详情页</p>
      </header>
      <div className="detail-content">
        <p>这里是详情页内容</p>
      </div>
    </div>
  );
}

export default Detail;