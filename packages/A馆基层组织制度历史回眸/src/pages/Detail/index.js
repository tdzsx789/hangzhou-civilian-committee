import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import Modal from '../Modal';
import bg1Zh from '../../assets/bg1.jpg';
import bg1En from '../../assets_english/bg1.jpg';
import button1Zh from '../../assets/button1.png';
import button1En from '../../assets_english/button1.png';
import slides1Zh from '../../assets/slides1.png';
import slides1En from '../../assets_english/slides1.png';
import backZh from '../../assets/back.png';
import backEn from '../../assets_english/back.png';
import slidesNanjingZh from '../../assets/nanjing.png';
import slidesNanjingEn from '../../assets_english/nanjing.png';
import slidesGcdZh from '../../assets/gongchandang.png';
import slidesGcdEn from '../../assets_english/gongchandang.png';
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
import slideButtonZh from '../../assets/slideButton.png';
import slideButtonEn from '../../assets_english/slideButton.png';

export const imageListData = [
  {
    key: 'nj1942PaimuZhuangdingAnjiafei',
    url: nj1942PaimuZhuangdingAnjiafei,
    from: 'nanjing',
    name: {
      zh: '1942年7月，派募壮丁安家费收据',
      en: 'Receipt for the family settlement allowance of recruited conscripts, July 1942',
    },
  },
  {
    key: 'njMinguoSanshiNianJingchaju',
    url: njMinguoSanshiNianJingchaju,
    from: 'nanjing',
    name: {
      zh: '民国三十年天津警察局保甲干部身份证',
      en: 'Identity certificate for Bao-Jia cadres of Tianjin Police Bureau in 1941 (the 30th year of the Republic of China Era)',
    },
  },
  {
    key: 'njZhuangdingZhengshu',
    url: njZhuangdingZhengshu,
    from: 'nanjing',
    name: {
      zh: '壮丁训练证书证明单据',
      en: 'Certificate of conscript training and supporting documents',
    },
  },
  {
    key: 'njMinguoJiejing',
    url: njMinguoJiejing,
    from: 'nanjing',
    name: {
      zh: '民国街景',
      en: 'A street scene in the Republic of China Era',
    },
  },
  {
    key: 'njXunlianZhuangdingTuan',
    url: njXunlianZhuangdingTuan,
    from: 'nanjing',
    name: {
      zh: '训练壮丁团',
      en: 'Training group of conscripted soldiers',
    },
  },
  {
    key: 'nj1942XinjianZhengfuZhuangdingAnjiafei',
    url: nj1942XinjianZhengfuZhuangdingAnjiafei,
    from: 'nanjing',
    name: {
      zh: '1942年11月,新津县政府征收壮丁安家费商民缴纳款项数目花名册。',
      en: 'Roster of conscription allowance collected by Xinjin county, Nov 1942',
    },
  },
  {
    key: 'njMinguoShenfenzheng',
    url: njMinguoShenfenzheng,
    from: 'nanjing',
    name: {
      zh: '民国身份证',
      en: 'ID card in Republican China',
    },
  },
  {
    key: 'njMinguoHuobi',
    url: njMinguoHuobi,
    from: 'nanjing',
    name: {
      zh: '民国的货币',
      en: 'Currency in Republican China',
    },
  },
  {
    key: 'njZhuangdingShu',
    url: njZhuangdingShu,
    from: 'nanjing',
    name: {
      zh: '壮丁训练书',
      en: 'Training manual for conscripted soldiers',
    },
  },
  {
    key: 'njBaojiaZhuangdingTuanYuan',
    url: njBaojiaZhuangdingTuanYuan,
    from: 'nanjing',
    name: {
      zh: '民国时期保甲壮丁团员必携',
      en: 'Baojia conscript identity card in Republican era',
    },
  },
  {
    key: 'njWeixinminHuatiCao',
    url: njWeixinminHuatiCao,
    from: 'nanjing',
    name: {
      zh: '民国时期伪新民会保甲团在进行体操训练',
      en: 'Drill of Xinmin Association militia, Republican era',
    },
  },
  {
    key: 'njLazhuangdingGaoshi',
    url: njLazhuangdingGaoshi,
    from: 'nanjing',
    name: {
      zh: '拉壮丁告示',
      en: 'Notice of conscription',
    },
  },
  {
    key: 'gcdMaoZedongTici',
    url: gcdMaoZedongTici,
    from: 'gongchandang',
    name: {
      zh: '毛泽东同志为苏维埃政府题词：“苏维埃是工农劳苦群众自己管理自己生活的机关，是革命战争的组织者与领导者。”',
      en: 'Inscription by Comrade Mao Zedong for the Soviet Government: "The Soviet is an organ where the workers, peasants and other laboring masses manage their own lives independently and the organizer and leader of the revolutionary war."',
    },
  },
  {
    key: 'gcdTudiGemingJiniance',
    url: gcdTudiGemingJiniance,
    from: 'gongchandang',
    name: {
      zh: '土地革命时期重庆市巴县土地改革纪念册',
      en: 'Commemorative album of Land Reform in Baxian County, Chongqing during the Agrarian Revolution Period',
    },
  },
  {
    key: 'gcdNongminXiehuiJiuzhi',
    url: gcdNongminXiehuiJiuzhi,
    from: 'gongchandang',
    name: {
      zh: '农民协会是中国共产党首次在农村建立的基层政权组织。图为彭湃在广东省海丰县建立的农民协会旧址',
      en: `The Peasants' Association was the first grassroots political power organization established by the CPC in rural areas. The picture shows the site of the Peasants' Association founded by Peng Pai in Haifeng County, Guangdong Province`,
    },
  },
  {
    key: 'gcdJiangxiJianNongminXiehuiHuizhang',
    url: gcdJiangxiJianNongminXiehuiHuizhang,
    from: 'gongchandang',
    name: {
      zh: '江西省吉安农民协会会员徽章',
      en: 'Membership badge of Ji’an Peasant Association, Jiangxi',
    },
  },
  {
    key: 'gcd1933ZhonghuaSuWeiAiZuzhifa',
    url: gcd1933ZhonghuaSuWeiAiZuzhifa,
    from: 'gongchandang',
    name: {
      zh: '1933年12月，《中华苏维埃共和国地方苏维埃暂行组织法（草案）》对乡苏维埃这一组织形式作出规定。图为中华苏维埃共和国临时中央政府旧址',
      en: 'Provisional constitution of the Chinese Soviet Republic; former central government site',
    },
  },
];

const qitaListData = [
  {
    key: 'qitaXiashang',
    url: qitaXiashang,
    from: 'qita',
    left: 0,
    top: 397,
    name: {
      zh: '邑',
      en: 'The Yi settlements from the Xia and Shang Dynasties to the Western Zhou Dynasty',
    },
  },
  {
    key: 'qitaQin',
    url: qitaQin,
    from: 'qita',
    left: 420,
    top: 465,
    name: {
      zh: '什伍制',
      en: 'The Shi-Wu System from the Spring and Autumn Period to the Qin Dynasty',
    },
  },
  {
    key: 'qitaHan',
    url: qitaHan,
    from: 'qita',
    left: 840,
    top: 398,
    name: {
      zh: '乡亭里制',
      en: 'The Xiang-Ting-Li System of the Han Dynasty',
    },
  },
  {
    key: 'qitaBeiWeiSanzhang',
    url: qitaBeiWeiSanzhang,
    from: 'qita',
    left: 1260,
    top: 397,
    name: {
      zh: '三长制',
      en: 'The Three-Chief System of Emperor Xiaowen of the Northern Wei Dynasty',
    },
  },
  {
    key: 'qitaTangLiBao',
    url: qitaTangLiBao,
    from: 'qita',
    left: 1680,
    top: 456,
    name: {
      zh: '里保邻制',
      en: 'The Li-Bao-Lin System of the Tang Dynasty',
    },
  },
  {
    key: 'qitaWangAnshi',
    url: qitaWangAnshi,
    from: 'qita',
    left: 2100,
    top: 465,
    name: {
      zh: '王安石画像',
      en: 'Portrait of Wang Anshi',
    },
  },
  {
    key: 'qitaNanSong',
    url: qitaNanSong,
    from: 'qita',
    left: 2434,
    top: 410,
    name: {
      zh: '南宋皇城图',
      en: 'Map of the imperial city, Southern Song',
    },
  },
  {
    key: 'qitaYuanCunShe',
    url: qitaYuanCunShe,
    from: 'qita',
    left: 2820,
    top: 351,
    name: {
      zh: '元朝村社里甲制',
      en: 'The Village-She and Li-Jia System of the Yuan Dynasty',
    },
  },
  {
    key: 'qitaMingLiJia',
    url: qitaMingLiJia,
    from: 'qita',
    left: 3244,
    top: 408,
    name: {
      zh: '明朝里甲制',
      en: 'The Li-Jia System of the Ming Dynasty',
    },
  },
  {
    key: 'qitaQingBaoJia',
    url: qitaQingBaoJia,
    from: 'qita',
    left: 3665,
    top: 409,
    name: {
      zh: '清朝保甲制',
      en: 'The Bao-Jia System of the Qing Dynasty',
    },
  },
];

function Detail({ name, gallery, onBack, active, language }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalData, setModalData] = useState(null);

  const bg1Img = language === 'zh' ? bg1Zh : bg1En;
  const backImg = language === 'zh' ? backZh : backEn;
  const button1Img = language === 'zh' ? button1Zh : button1En;
  const slides1Img = language === 'zh' ? slides1Zh : slides1En;
  const slidesNanjingImg = language === 'zh' ? slidesNanjingZh : slidesNanjingEn;
  const slidesGcdImg = language === 'zh' ? slidesGcdZh : slidesGcdEn;
  const slideButtonImg = language === 'zh' ? slideButtonZh : slideButtonEn;

  const localizedImageList = imageListData.map((item) => ({
    ...item,
    name: item.name[language],
  }));

  const nanjingList = localizedImageList.filter((item) => item.from === 'nanjing');
  const gongchandangList = localizedImageList.filter((item) => item.from === 'gongchandang');
  const qitaList = qitaListData.map((item) => ({
    ...item,
    name: item.name[language],
  }));

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

  const handleJumpTo7835 = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 6850;
    }
  };

  const getCaptionStyle = (text) => {
    let length = 0;
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 255) {
        length += 1;
      } else {
        length += 0.6;
      }
    }
    
    // 容器宽度 312px，字体 16px，一行大约容纳 19.5 个汉字
    // 考虑到标点符号等，取 19 作为阈值
    if (length <= 19) {
      return { textAlign: 'center', textIndent: '0' };
    } else {
      return { textAlign: 'justify', textIndent: '2em' };
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1Img})` }}>
      <div
        className="back-button"
        onClick={onBack}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '200px',
          height: '112px',
          backgroundImage: `url(${backImg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div
        className="jump-button"
        onClick={handleJumpTo7835}
        style={{
          position: 'absolute',
          left: '1300px',
          top: '100px',
          width: '487px',
          height: '48px',
          backgroundImage: `url(${slideButtonImg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          cursor: 'pointer',
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
          src={slides1Img}
          alt={language === 'zh' ? '历史图片1' : 'Historical Image 1'}
          className="slides-image clickable-image"
          onClick={() =>
            openModal({
              url: slides1Img,
              name: language === 'zh' ? '历史图片1' : 'Historical Image 1',
            })
          }
        />
        {qitaList.map((ele) => {
          return <div key={ele.url} className="qita-item" style={{ position: 'absolute', left: ele.left, top: ele.top }} onClick={() => openModal(ele)}></div>
        })}
        <img
          src={slidesNanjingImg}
          alt={language === 'zh' ? '历史图片2' : 'Historical Image 2'}
          className="nanjing-image clickable-image"
          onClick={() =>
            openModal({
              url: slidesNanjingImg,
              name: language === 'zh' ? '历史图片2' : 'Historical Image 2',
            })
          }
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
              <div className="nanjing-caption" style={getCaptionStyle(item.name)}>{item.name}</div>
            </div>
          ))}
        </div>
        <img
          src={slidesGcdImg}
          alt={language === 'zh' ? '历史图片3' : 'Historical Image 3'}
          className="gongchandang-image clickable-image"
          onClick={() =>
            openModal({
              url: slidesGcdImg,
              name: language === 'zh' ? '历史图片3' : 'Historical Image 3',
            })
          }
        />
        <div className="gongchandang-grid">
          {(() => {
            const first = gongchandangList[0];
            const secondAndThird = gongchandangList.slice(1, 3);
            const rest = gongchandangList.slice(3);

            return (
              <>
                <div className="special-layout-column">
                  {/* 第一张图 */}
                  {first && (
                    <div className="wide-wrapper">
                      <div className="gongchandang-item" key={first.url}>
                        <img
                          src={first.url}
                          alt={first.name}
                          className="gongchandang-thumb clickable-image"
                          onClick={() => openModal(first)}
                        />
                        <div className="gongchandang-caption" style={getCaptionStyle(first.name)}>
                          {first.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 第二、三张图 */}
                  <div className="sub-row">
                    {secondAndThird.map((item) => (
                      <div className="gongchandang-item" key={item.url}>
                        <img
                          src={item.url}
                          alt={item.name}
                          className="gongchandang-thumb clickable-image"
                          onClick={() => openModal(item)}
                        />
                        <div className="gongchandang-caption" style={getCaptionStyle(item.name)}>
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 其余图片 */}
                {rest.map((item) => (
                  <div className="gongchandang-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="gongchandang-thumb clickable-image"
                      onClick={() => openModal(item)}
                    />
                    <div className="gongchandang-caption" style={getCaptionStyle(item.name)}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>
      <button className="slide-button" style={{ backgroundImage: `url(${button1Img})` }}></button>
      {modalData && (
        <Modal image={modalData} onClose={closeModal} />
      )}
    </div>
  );
}

export default Detail;
