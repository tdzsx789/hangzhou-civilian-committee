import React, { useState, useRef, useEffect, useMemo } from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import listBg2 from '../../assets/listBg2.png';
import listBg from '../../assets/list.png';
import backButton from '../../assets/backButton.png';

function Detail({ name, gallery, onBack, onSelectDetail, data = [] }) {
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null);
  const provinceScrollRef = useRef(null);
  const childrenScrollRef = useRef(null);

  // 按children数量从高到低排序
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const countA = a.children?.length || 0;
      const countB = b.children?.length || 0;
      return countB - countA; // 从高到低
    });
  }, [data]);

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

  // 根据排序后的索引找到对应的省份（通过name匹配原始data中的索引）
  const selectedProvince = useMemo(() => {
    if (selectedProvinceIndex === null) return null;
    const sortedProvince = sortedData[selectedProvinceIndex];
    if (!sortedProvince) return null;
    // 在原始data中找到对应的省份
    return data.find(p => p.name === sortedProvince.name) || null;
  }, [selectedProvinceIndex, sortedData, data]);

  const children = selectedProvince?.children || [];

  // 计算所有省市的children总数
  const totalChildrenCount = data.reduce((sum, province) => sum + (province.children?.length || 0), 0);

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
      {/* 标题 */}
      <div className="detail-title">
        {selectedProvinceIndex === null ? (
          // `省市列表（${totalChildrenCount}）`
          `省市列表`
        ) : (
          `${selectedProvince?.name || ''}引领基层治理领域先进个人`
        )}
      </div>
      {/* 省市列表滚动容器 */}
      <div 
        ref={provinceScrollRef}
        className="list-scroll province-scroll"
        style={{ display: selectedProvinceIndex === null ? 'flex' : 'none' }}
      >
        {sortedData.map((province, index) => (
          <button
            type="button"
            key={province.name}
            className="list-item"
            style={{ backgroundImage: `url(${listBg2})` }}
            onClick={() => handleProvinceClick(index)}
          >
            {province.name}（{province.children?.length || 0}）
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
            {child.trueName}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Detail;