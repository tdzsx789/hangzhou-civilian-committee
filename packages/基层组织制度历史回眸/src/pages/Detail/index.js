import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import Modal from '../Modal';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import slides1 from '../../assets/slides1.png';
import back from '../../assets/back.png';
import slidesNanjing from '../../assets/nanjing.png';
import slidesGcd from '../../assets/gongchandang.png';
import njZhuangdingZhengshu from '../../assets/nanjing/zhuangding-training-certificate.jpg';
import njZhuangdingShu from '../../assets/nanjing/zhuangding-training-book.jpg';
import njXunlianZhuangdingTuan from '../../assets/nanjing/training-soldier-group.jpg';
import njWeixinminHuatiCao from '../../assets/nanjing/weixinminhui-baijia-drill.jpg';
import njMinguoShenfenzheng from '../../assets/nanjing/minguo-id.jpg';
import njMinguoSanshiNianJingchaju from '../../assets/nanjing/1941-tianjin-police-id.jpg';
import njMinguoJingcha from '../../assets/nanjing/minguo-police.jpg';
import njMinguoJiejing from '../../assets/nanjing/minguo-street-scene.jpg';
import njMinguoHuobi from '../../assets/nanjing/minguo-currency.jpg';
import njLazhuangdingGaoshi from '../../assets/nanjing/zhuangding-conscription-notice.jpg';
import njBaojiaZhuangdingTuanYuan from '../../assets/nanjing/baojia-soldier-card.jpg';
import nj1942XinjianZhengfuZhuangdingAnjiafei from '../../assets/nanjing/1942-nov-xinjing-anzjiafei-list.jpg';
import nj1942PaimuZhuangdingAnjiafei from '../../assets/nanjing/1942-jul-anzjiafei-receipt.jpg';
import gcdTudiGemingJiniance from '../../assets/gongchandang/land-reform-baxian-book.jpg';
import gcdNongminXiehuiJiuzhi from '../../assets/gongchandang/peasant-association-site.jpg';
import gcdMaoZedongTici from '../../assets/gongchandang/mao-soviet-inscription.jpg';
import gcdJiangxiJianNongminXiehuiHuizhang from '../../assets/gongchandang/jian-peasant-association-badge.jpg';
import gcd1949NanjingGuomindangGov from '../../assets/gongchandang/1949-nanjing-liberation-flag.jpg';
import gcd1933ZhonghuaSuWeiAiZuzhifa from '../../assets/gongchandang/1933-soviet-constitution-site.jpg';
import qitaXiashang from '../../assets/qita/夏商.jpg';
import qitaWangAnshi from '../../assets/qita/王安石画像.jpg';
import qitaQin from '../../assets/qita/秦.png';
import qitaNanSong from '../../assets/qita/南宋皇城图.jpg';
import qitaMingLiJia from '../../assets/qita/明朝里甲制.jpeg';
import qitaHan from '../../assets/qita/汉.jpg';
import qitaBeiWeiSanzhang from '../../assets/qita/北魏孝文帝三长制.jpg';
import qitaYuanCunShe from '../../assets/qita/元朝村社里甲制.jpg';
import qitaTangLiBao from '../../assets/qita/唐里保邻制.jpeg';
import qitaQingBaoJia from '../../assets/qita/清朝保甲制.webp';

export const imageList = [
  { name: '1942年7月，派募壮丁安家费收据。', url: nj1942PaimuZhuangdingAnjiafei, from: 'nanjing' },
  { name: '民国警察', url: njMinguoJingcha, from: 'nanjing' },
  { name: '壮丁训练证书——证书证明单据', url: njZhuangdingZhengshu, from: 'nanjing' },
  { name: '民国的街景', url: njMinguoJiejing, from: 'nanjing' },
  { name: '训练壮丁团', url: njXunlianZhuangdingTuan, from: 'nanjing' },
  { name: '1942年11月,新津县政府征收壮丁安家费商民缴纳款项数目花名册。', url: nj1942XinjianZhengfuZhuangdingAnjiafei, from: 'nanjing' },
  { name: '民国三十年天津警察局保甲干部身份证', url: njMinguoSanshiNianJingchaju, from: 'nanjing' },
  { name: '民国身份证', url: njMinguoShenfenzheng, from: 'nanjing' },
  { name: '民国的货币', url: njMinguoHuobi, from: 'nanjing' },
  { name: '壮丁训练书', url: njZhuangdingShu, from: 'nanjing' },
  { name: '民国时期保甲壮丁团员必携', url: njBaojiaZhuangdingTuanYuan, from: 'nanjing' },
  { name: '民国时期伪新民会保甲团在进行体操训练', url: njWeixinminHuatiCao, from: 'nanjing' },
  { name: '拉壮丁告示', url: njLazhuangdingGaoshi, from: 'nanjing' },
  { name: '农民协会是中国共产党首次在农村建立的基层社会组织。图为彭湃在广东省海丰县建立的农民协会旧址', url: gcdNongminXiehuiJiuzhi, from: 'gongchandang' },
  { name: '江西省吉安农民协会会员徽章', url: gcdJiangxiJianNongminXiehuiHuizhang, from: 'gongchandang' },
  { name: '土地革命时期重庆市巴县土地改革纪念册', url: gcdTudiGemingJiniance, from: 'gongchandang' },
  { name: '1933年12月，《中华苏维埃共和国地方苏维埃暂行组织法（草案）》对乡苏维埃这一组织形式作出规定。图为中华苏维埃共和国临时中央政府旧址', url: gcd1933ZhonghuaSuWeiAiZuzhifa, from: 'gongchandang' },
  { name: '毛泽东同志为苏维埃政府题词：“苏维埃是工农劳苦群众自己管理自己生活的机关，是革命战争的组织者与领导者。”', url: gcdMaoZedongTici, from: 'gongchandang' },
  { name: '1949年4月23日，南京国民党政府的覆灭，为新中国城市居民委员会制度的创立开辟了道路。图为解放军把胜利的红旗插上了蒋介石“总统府”的门楼上', url: gcd1949NanjingGuomindangGov, from: 'gongchandang' },
];

const nanjingList = imageList.filter((item) => item.from === 'nanjing');
const gongchandangList = imageList.filter((item) => item.from === 'gongchandang');
const qitaList = [
  { name: '邑', url: qitaXiashang, from: 'qita', left: 0, top: 397 },
  { name: '什伍制', url: qitaQin, from: 'qita', left: 420, top: 465 },
  { name: '乡亭里制', url: qitaHan, from: 'qita', left: 840, top: 398 },
  { name: '三长制', url: qitaBeiWeiSanzhang, from: 'qita', left: 1260, top: 397 },
  { name: '里保邻制', url: qitaTangLiBao, from: 'qita', left: 1680, top: 456 },
  { name: '王安石画像', url: qitaWangAnshi, from: 'qita', left: 2100, top: 465 },
  { name: '南宋皇城图', url: qitaNanSong, from: 'qita', left: 2434, top: 410 },
  { name: '元朝村社里甲制', url: qitaYuanCunShe, from: 'qita', left: 2820, top: 351 },
  { name: '明朝里甲制', url: qitaMingLiJia, from: 'qita', left: 3244, top: 408 },
  { name: '清朝保甲制', url: qitaQingBaoJia, from: 'qita', left: 3665, top: 409 },
];

function Detail({ name, gallery, onBack, active }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (active && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      setScrollLeft(0);
    }
  }, [active]);

  const openModal = (payload) => {
    setModalData(payload);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度倍数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1})` }}>
      <div
        className="back-button"
        onClick={onBack}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '200px',
          height: '112px',
          backgroundImage: `url(${back})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <img
          src={slides1}
          alt="历史图片1"
          className="slides-image clickable-image"
          onClick={() => openModal({ url: slides1, name: '历史图片1' })}
        />
        {qitaList.map((ele) => {
          return <div className="qita-item" style={{ position: 'absolute', left: ele.left, top: ele.top }} onClick={() => openModal(ele)}></div>
        })}
        <img
          src={slidesNanjing}
          alt="历史图片2"
          className="nanjing-image clickable-image"
          onClick={() => openModal({ url: slidesNanjing, name: '历史图片2' })}
        />
        <div className="nanjing-grid">
          {nanjingList.map((item) => (
            <div className="nanjing-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name}
                className="nanjing-thumb clickable-image"
                onClick={() => openModal(item)}
              />
              <div className="nanjing-caption">{item.name}</div>
            </div>
          ))}
        </div>
        <img
          src={slidesGcd}
          alt="历史图片3"
          className="gongchandang-image clickable-image"
          onClick={() => openModal({ url: slidesGcd, name: '历史图片3' })}
        />
        <div className="gongchandang-grid">
          {gongchandangList.map((item) => (
            <div className="gongchandang-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name}
                className="gongchandang-thumb clickable-image"
                onClick={() => openModal(item)}
              />
              <div className="gongchandang-caption">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button>
      {modalData && (
        <Modal image={modalData} onClose={closeModal} />
      )}
    </div>
  );
}

export default Detail;