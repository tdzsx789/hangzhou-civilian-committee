import React from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import listBg from '../../assets/list.png';

const list = [
  '天津市滨海新区塘沽街道办事处－全国民族团结进步示范街道',
  '天津市东丽区张贵庄街道詹滨西里社区－全国文明单位、全国先进基层群众性自治组织、全国示范性老年友好型社区、全国科普示范社区',
  '天津市和平区南市街道新世界花园社区－全国示范性老年友好型社区、全国综合减灾示范社区',
  '天津市和平区劝业场街道兆丰路社区－全国示范性老年友好型社区',
  '天津市和平区新兴街道朝阳里社区－全国先进基层党组织、全国示范性老年友好型社区、全国文明单位、全国学雷锋活动示范点',
  '天津市河北区建昌街道三和社区－全国示范性老年友好型社区',
  '天津市河北区望海楼街道昆璞里社区－全国综合减灾示范社区',
  '天津市河东区大直沽街道汇贤里社区－全国抗击新冠肺炎疫情先进集体',
  '天津市河西区大营门街道敬重里社区－全国示范性老年友好型社区',
  '天津市河西区下瓦房街道富裕广场社区－全国民主法治示范村（社区）',
  '天津市河西区友谊路街道谊景村社区－全国先进基层党组织、全国示范性老年友好型社区',
  '天津市南开区华苑街道长华里社区－全国和谐社区建设示范社区',
  '天津市南开区体育中心街道时代奥城社区－全国先进基层党组织、全国抗击新冠肺炎疫情先进集体',
  '天津市南开区向阳路街道昔阳里社区－全国和谐社区建设示范社区、全国文明单位',
  '天津市南开区学府街道新园村社区－全国和谐社区建设示范社区',
  '天津市南开区长虹街道盛达园社区－全国和谐社区建设示范社区',
  '天津市宁河区芦台街道华翠社区－全国示范性老年友好型社区',
  '天津市宁河区芦台街道商业道社区－全国综合减灾示范社区、全国示范性老年友好型社区',
  '天津市宁河区芦台街道顺驰兴业社区－全国示范性老年友好型社区',
  '天津市宁河区芦台街道愉悦港湾社区－全国示范性老年友好型社区',
  '天津市西青区赤龙南街道佳和荣庭社区－全国示范性老年友好型社区',
  '天津市西青区李七庄街道邓店社区－全国民主法治示范村（社区）',
  '天津市西青区辛口镇新惠园社区－全国示范性老年友好型社区',
  '天津市西青区杨柳青镇御河墅社区－全国示范性老年友好型社区',
  '天津允公律师事务所－全国三八红旗集体'
];

function Detail({ name, gallery, onBack, onSelectDetail }) {
  const handleListClick = (index) => {
    if (!onSelectDetail) return;
    const targetMap = {
      0: 'info1',
      1: 'info2',
    };
    const key = targetMap[index];
    if (!key) return;
    onSelectDetail(key);
  };

  return (
    <div className="detail-page">
      <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      />
      <div className="list-scroll">
        {list.map((item, index) => (
          <button
            type="button"
            key={index}
            className="list-item"
            style={{ backgroundImage: `url(${listBg})` }}
            onClick={() => handleListClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Detail;