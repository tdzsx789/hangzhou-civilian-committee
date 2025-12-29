import React, { useState, useRef, useEffect, useMemo } from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import listBg2 from '../../assets/listBg2.png';
import listBg from '../../assets/list.png';
import backButton from '../../assets/backButton.png';

function Detail({ name, gallery, onBack, onSelectDetail, onSelectOrgDetail, data = [], orgData = [], isActive, selectedProvinceName }) {
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(null);
  const childrenScrollRef = useRef(null);
  const orgChildrenScrollRef = useRef(null);

  const stripCnIndexPrefix = (s) => {
    const t = String(s || '');
    return t.replace(/^\s*(?:[一二三四五六七八九十零〇百千]+)[、\.．。]\s*/, '');
  };

  // 根据当前显示的是省市列表还是children列表来决定使用哪个容器
  useEffect(() => {
    const container = childrenScrollRef.current;
    if (!isActive || !container) {
      return undefined;
    }

    return () => {
    };
  }, [isActive]);

  // 按children数量从高到低排序
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const countA = a.children?.length || 0;
      const countB = b.children?.length || 0;
      return countB - countA; // 从高到低
    });
  }, [data]);

  const orgSortedData = useMemo(() => {
    return [...orgData].sort((a, b) => {
      const countA = a.children?.length || 0;
      const countB = b.children?.length || 0;
      return countB - countA;
    });
  }, [orgData]);

  useEffect(() => {
    const idxByName = selectedProvinceName ? sortedData.findIndex((p) => p.name === selectedProvinceName) : -1;
    const chosenIdx = idxByName !== -1 ? idxByName : (sortedData.length ? 0 : null);
    setSelectedProvinceIndex(chosenIdx);
  }, [selectedProvinceName, sortedData]);

  // 从省市列表点击到children列表时，children列表scroll归0
  useEffect(() => {
    if (selectedProvinceIndex !== null && childrenScrollRef.current) {
      childrenScrollRef.current.scrollTop = 0;
    }
  }, [selectedProvinceIndex]);

  useEffect(() => {
    if (orgChildrenScrollRef.current) {
      orgChildrenScrollRef.current.scrollTop = 0;
    }
  }, [selectedProvinceIndex]);





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

  const orgSelectedProvince = useMemo(() => {
    const targetName = selectedProvince?.name || selectedProvinceName;
    if (targetName) {
      const found = orgData.find(p => p.name === targetName);
      if (found) return found;
    }
    return orgSortedData[0] || null;
  }, [orgData, orgSortedData, selectedProvince, selectedProvinceName]);

  const orgChildren = orgSelectedProvince?.children || [];



  const handleBackClick = () => {
    onBack();
  };

  return (
    <div className="detail-page" style={{ display: 'flex', flexDirection: 'row' }}>
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
      {/* 左侧：先进个人 */}
      <div style={{ width: '700px', paddingRight: '20px' }}>
        <div className="detail-title" style={{ left: '25%' }}>党建引领基层治理领域先进个人</div>
        <div
          ref={childrenScrollRef}
          className="list-scroll children-scroll"
          style={{
            display: selectedProvinceIndex !== null ? 'flex' : 'none',
            width: '800px',
            left: '25%'
          }}
        >
          {children.map((child, index) => {
            const src = child.trueName || child.name || '';
            const partsFull = src.split('－');
            const display = partsFull.length > 1
              ? partsFull.slice(0, -1).join('－')
              : (() => {
                  const parts = src.split(/\s*-\s*/);
                  return parts.length > 1 ? parts.slice(0, -1).join(' - ') : src;
                })();
            const displayClean = stripCnIndexPrefix(display);
            return (
              <button
                type="button"
                key={index}
                className="child-item"
                style={{ backgroundImage: `url(${listBg})` }}
                onClick={() => handleChildClick(index)}
              >
                {displayClean}
              </button>
            );
          })}
        </div>
      </div>

      {/* 右侧：先进组织 */}
      <div style={{ width: '800px', paddingLeft: '20px' }}>
        <div className="detail-title" style={{ left: '75%' }}>党建引领基层治理领域先进先进组织</div>
        <div
          ref={orgChildrenScrollRef}
          className="list-scroll children-scroll"
          style={{
            display: orgSelectedProvince ? 'flex' : 'none',
            width: '800px',
            left: '75%'
          }}
        >
          {orgChildren.map((child, index) => (
            <button
              type="button"
              key={index}
              className="child-item"
              style={{ backgroundImage: `url(${listBg})` }}
              onClick={() => onSelectOrgDetail && onSelectOrgDetail(child)}
            >
              {stripCnIndexPrefix(child.name)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Detail;
