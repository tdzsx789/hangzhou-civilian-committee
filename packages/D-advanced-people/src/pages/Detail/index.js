import React from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import listBg from '../../assets/list.png';

const list = [
  '北京市昌平区霍营街道华龙苑北里社区工作者－杜世雄－全国抗击新冠肺炎疫情优秀城乡社区工作者',
  '京市昌平区霍营街道华龙苑北里社区党支部书记、居委会主任－王翠娟－全国先进工作者、全国抗击新冠肺炎疫情先进个人、全国优秀城乡社区工作者',
  '北京市昌平区龙泽园街道龙泽苑社区党委书记、居委会主任、妇联主席－伊然－全国三八红旗手',
  '北京市东城区交道口街道福祥社区党委书记－李德青－全国抗击新冠肺炎疫情先进个人',
  '北京市房山区西潞街道苏庄三里社区党委书记－邵雪松－全国劳动模范',
  '北京市丰台区丰台街道游泳场北路党委书记、居委会主任－邓丽华－全国优秀城乡社区工作者',
  '北京市海淀区万寿路街道28号社区党委书记－贾秀杰－全国抗击新冠肺炎疫情先进个人',
  '北京市平谷区滨河街道滨河社区党总支书记－刘浩雪－全国优秀城乡社区工作者',
  '北京市平谷区峪口镇欢乐蜂场“妇”字号基地负责人－赵丽梅－全国三八红旗手',
  '北京市石景山区八角街道八角中里社区书记－李美红－全国抗击新冠肺炎疫情先进个人、党的二十大代表、全国三八红旗手',
  '北京市石景山区苹果园街道下庄社区工作者－崔传斌－全国抗击新冠肺炎疫情优秀城乡社区工作者',
];

function Detail({ name, gallery, onBack, onSelectDetail }) {
  const handleListClick = (index) => {
    if (!onSelectDetail) return;
    const targetMap = {
      1: 'info1',
      2: 'info2',
      3: 'info3',
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