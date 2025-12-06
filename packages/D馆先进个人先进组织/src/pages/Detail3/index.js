import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import listBg2 from '../../assets/listBg2.png';
import listBg from '../../assets/list.png';
import backButton from '../../assets/backButton.png';

function Detail3({ name, gallery, onBack, onSelectDetail, data = [] }) {
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null);
  const provinceScrollRef = useRef(null);
  const childrenScrollRef = useRef(null);

  // 从Home页进入时，省市列表scroll清0
  useEffect(() => {
    if (provinceScrollRef.current) {
      provinceScrollRef.current.scrollTop = 0;
    }
  }, []);

  // 从省市列表点击到children列表时，children列表scroll归0
  useEffect(() => {
    if (selectedProvinceIndex !== null && childrenScrollRef.current) {
      childrenScrollRef.current.scrollTop = 0;
    }
  }, [selectedProvinceIndex]);

  const handleProvinceClick = (index) => {
    setSelectedProvinceIndex(index);
  };

  const handleChildClick = (childIndex) => {
    if (!onSelectDetail) return;
    // 传递当前 child 数据
    const child = children[childIndex];
    if (!child) return;
    onSelectDetail(child);
    // 注意：不重置 selectedProvinceIndex，这样返回时会保持在 children 列表
  };

  const selectedProvince = selectedProvinceIndex !== null ? data[selectedProvinceIndex] : null;
  const children = selectedProvince?.children || [];

  const handleBackClick = () => {
    // 如果当前在 children 列表，返回到省市列表
    if (selectedProvinceIndex !== null) {
      setSelectedProvinceIndex(null);
    } else {
      // 如果当前在省市列表，返回到 Home
      onBack();
    }
  };

  return (
    <div className="detail-page">
      <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      />
      <button
        type="button"
        className="back-province-btn back-top-btn"
        style={{ backgroundImage: `url(${backButton})` }}
        onClick={handleBackClick}
      />
      {/* 省市列表滚动容器 */}
      <div 
        ref={provinceScrollRef}
        className="list-scroll province-scroll"
        style={{ display: selectedProvinceIndex === null ? 'flex' : 'none' }}
      >
        {data.map((province, index) => (
          <button
            type="button"
            key={index}
            className="list-item"
            style={{ backgroundImage: `url(${listBg2})` }}
            onClick={() => handleProvinceClick(index)}
          >
            {province.name}
          </button>
        ))}
      </div>
      {/* Children 列表滚动容器 */}
      <div 
        ref={childrenScrollRef}
        className="list-scroll children-scroll"
        style={{ display: selectedProvinceIndex !== null ? 'flex' : 'none' }}
      >
        {children.map((child, index) => (
          <button
            type="button"
            key={index}
            className="child-item"
            style={{ backgroundImage: `url(${listBg})` }}
            onClick={() => handleChildClick(index)}
          >
            {child.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Detail3;