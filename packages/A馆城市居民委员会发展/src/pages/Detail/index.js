import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Modal from '../Modal';
import detailBgImg from '../../assets/detailBg.jpg';
import selectImg from '../../assets/select.png';
import select1Img from '../../assets/step1.png';
import select2Img from '../../assets/step2.png';
import select3Img from '../../assets/step3.png';
import select4Img from '../../assets/step4.png';
import page2Img from '../../assets/page2.png';
import page3Img from '../../assets/page3.png';
import page4Img from '../../assets/page4.png';
import handImg from '../../assets/hand.png';
import pageSlides1Img from '../../assets/pageSlides1.png';
import pageSlides2Img from '../../assets/pageSlides2.png';
import pageSlides3Img from '../../assets/pageSlides3.png';

// 导入 chubujianli 文件夹的图片
import chubujianli1 from '../../assets/chubujianli/1952-east-china-military-administrative-committee-pilot-scheme.jpg';
import chubujianli2 from '../../assets/chubujianli/1952-guangzhou-jinhua-street-sanitation.jpg';
import chubujianli3 from '../../assets/chubujianli/1953-hangzhou-resident-grain-purchase-certificate.jpg';
import chubujianli4 from '../../assets/chubujianli/1953-pengzhen-proposal-urban-committees.jpg';
import chubujianli5 from '../../assets/chubujianli/1954-guangdong-water-residents-first-general-election.jpg';
import chubujianli6 from '../../assets/chubujianli/1954-shandong-zhangzhou-pilot-summary.jpg';
import chubujianli7 from '../../assets/chubujianli/1955-anshan-subsidy-regulation.jpg';
import chubujianli8 from '../../assets/chubujianli/1955-weifang-youth-education.jpg';
import chubujianli9 from '../../assets/chubujianli/shangcheng-district-chief-tian-kuirong.JPG';
import chubujianli10 from '../../assets/chubujianli/1954-shanghai-municipal-committee-lane-reorganization.jpg';
import chubujianli11 from '../../assets/chubujianli/shanghai-resident-committee-survey-report.jpg';
import chubujianli12 from '../../assets/chubujianli/1950s-shanghai-resident-committee-work.jpg';
import chubujianli13 from '../../assets/chubujianli/east-china-military-committee-finance-survey.jpg';
import chubujianli14 from '../../assets/chubujianli/urban-subdistrict-four-regulations.jpg';
import chubujianli15 from '../../assets/chubujianli/1956-hefei-residents-checking-voter-list.jpg';
import chubujianli16 from '../../assets/chubujianli/pengzhen-report-excerpt-mao-zedong.jpg';
import chubujianli17 from '../../assets/chubujianli/1949-hangzhou-mayor-jiang-hua.JPG';
import chubujianli18 from '../../assets/chubujianli/first-director-chen-fulin.jpg';
import chubujianli19 from '../../assets/chubujianli/harbin-honor-lamp-martyrs-families.jpg';

// 导入 quzhefazhan 文件夹的图片
import quzhefazhan1 from '../../assets/quzhefazhan/1957-chongqing-security-cadres-photo.jpg';
import quzhefazhan2 from '../../assets/quzhefazhan/1958-guangzhou-anti-superstition.jpg';
import quzhefazhan3 from '../../assets/quzhefazhan/1959-wuxi-resident-canteen.jpg';
import quzhefazhan4 from '../../assets/quzhefazhan/1959-lhasa-three-anti-policy.jpg';
import quzhefazhan5 from '../../assets/quzhefazhan/1959-anshan-13th-committee-photo.jpg';
import quzhefazhan6 from '../../assets/quzhefazhan/1962-hangzhou-shentang-approval.jpg';
import quzhefazhan7 from '../../assets/quzhefazhan/1963-nanjing-three-red-banners.jpg';
import quzhefazhan8 from '../../assets/quzhefazhan/1969-hohhot-criticism-campaign.jpg';
import quzhefazhan9 from '../../assets/quzhefazhan/1975-hohhot-resident-study.jpg';
import quzhefazhan10 from '../../assets/quzhefazhan/1977-hangzhou-labazhou.jpg';
import quzhefazhan11 from '../../assets/quzhefazhan/1977-chongqing-award-photo.jpg';
import quzhefazhan12 from '../../assets/quzhefazhan/1978-anhui-ningguo-photo.jpg';
import quzhefazhan13 from '../../assets/quzhefazhan/1978-chongqing-learn-from-lei-feng.jpg';
import quzhefazhan14 from '../../assets/quzhefazhan/1968-1978-yanji-work-photos.jpg';
import quzhefazhan15 from '../../assets/quzhefazhan/1978-third-plenum.jpg';
import quzhefazhan16 from '../../assets/quzhefazhan/1960s-harbin-committee-meeting.jpg';

// 导入 huifu 文件夹的图片
import huifu1 from '../../assets/huifu/1979-weifang-office-meeting.jpg';
import huifu2 from '../../assets/huifu/1982-chengdu-advanced-committees.jpg';
import huifu3 from '../../assets/huifu/1982-constitution-revision.jpg';
import huifu4 from '../../assets/huifu/1989-urban-resident-committee-organization-law.jpg';
import huifu5 from '../../assets/huifu/1990-guangzhou-advanced-committees-award.jpg';
import huifu6 from '../../assets/huifu/2009-hangzhou-20th-anniversary-symposium.jpg';
import huifu7 from '../../assets/huifu/2009-beijing-sisters-station.jpg';
import huifu8 from '../../assets/huifu/2010-hangzhou-61st-anniversary.jpg';
import huifu9 from '../../assets/huifu/2010-intangible-cultural-heritage-station.jpg';
import huifu10 from '../../assets/huifu/2010-yichang-youth-activities.jpg';
import huifu11 from '../../assets/huifu/foshan-luohu-learn-from-lei-feng.jpg';
import huifu12 from '../../assets/huifu/hangzhou-elderly-canteen.jpg';

// 导入 xinshidai 文件夹的图片
import xinshidai1 from '../../assets/xinshidai/general-provisions-civil-law.jpg';
import xinshidai2 from '../../assets/xinshidai/2014-xining-fire-safety-drill.jpg';
import xinshidai3 from '../../assets/xinshidai/2017-dalian-civilized-sacrifice.jpg';
import xinshidai4 from '../../assets/xinshidai/2017-yichang-hundred-families-feast.jpg';
import xinshidai5 from '../../assets/xinshidai/2017-wuxi-free-medical-consultation.JPG';
import xinshidai6 from '../../assets/xinshidai/2018-yichang-owner-representatives-election.jpg';
import xinshidai7 from '../../assets/xinshidai/2022-hangzhou-community-backbone-project.jpeg';
import xinshidai8 from '../../assets/xinshidai/2023-hangzhou-parking-regulation.JPG';
import xinshidai9 from '../../assets/xinshidai/18th-national-congress-cpc.jpg';
import xinshidai10 from '../../assets/xinshidai/yulin-happy-love-supermarket.jpg';
import xinshidai11 from '../../assets/xinshidai/12th-npc-5th-session.jpg';

// 图片数据数组，包含 name、url、from
const galleryImages = [
  // chubujianli 文件夹
  { name: '1952年华东军政委员会制定了第一个行政大区试点方案——《关于10万人口以上城市建立居民委员会试行方案（草案）》。', url: chubujianli1, from: 'chubujianli' },
  { name: '1952年广州市金华街干部群众组织起来整治街内卫生。', url: chubujianli2, from: 'chubujianli' },
  { name: '1953年居民委员会发放的杭州居民购粮证。', url: chubujianli3, from: 'chubujianli' },
  { name: '1953年彭真同志向中共中央建议在各城市区以下和不设区的市以下同时建立城市街道办事处、城市居民委员会两个组织。图为彭真同志。', url: chubujianli4, from: 'chubujianli' },
  { name: '1954年，广东省珠江区水上居民参加全国第一次普选', url: chubujianli5, from: 'chubujianli' },
  { name: '1954年山东省张周市（现淄博市张店区、周村区）建立居民委员会试点工作总结。', url: chubujianli6, from: 'chubujianli' },
  { name: '1955年7月28日辽宁省鞍山市出台《居民委员会生活补助费使用办法》的文件。', url: chubujianli7, from: 'chubujianli' },
  { name: '1955年山东省潍坊市潍城区南关西南关居民委员会开展青少年教育活动。', url: chubujianli8, from: 'chubujianli' },
  { name: '上城区区公所区长田奎荣', url: chubujianli9, from: 'chubujianli' },
  { name: '上海市委关于一九五四年全市进行里弄整顿工作的决定。', url: chubujianli10, from: 'chubujianli' },
  { name: '上海市居民委员会调查综合报告', url: chubujianli11, from: 'chubujianli' },
  { name: '五十年代初上海市居民委员会工作的照片（上海市黄浦区宝兴里家庭妇女捐寒衣救济灾民。上海市黄浦区宝兴里居民委员会工作剪影。上海市老闸区汇中里、曲江里居民委会慰问军烈属。', url: chubujianli12, from: 'chubujianli' },
  { name: '华东军政委员会民政部关于《城市居民委员会经费收支情况调查摘要》。', url: chubujianli13, from: 'chubujianli' },
  { name: '城市街道办事处四个条例的单行本照片。', url: chubujianli14, from: 'chubujianli' },
  { name: '居民群众积极参加居民委员会选举，行使当家作主权利。图为1956年安徽省合肥市居民群众核对选民榜情景。', url: chubujianli15, from: 'chubujianli' },
  { name: '彭真同志向毛泽东和中共中央递交"城市应建立街道办事处和居民委员会"报告的节录。', url: chubujianli16, from: 'chubujianli' },
  { name: '时任1949年杭州市人民政府市长江华', url: chubujianli17, from: 'chubujianli' },
  { name: '第一任主任陈福林', url: chubujianli18, from: 'chubujianli' },
  { name: '黑龙江省哈尔滨街道居民委员会在新年期间，给朝鲜战场上的烈士家属家门口挂光荣灯。', url: chubujianli19, from: 'chubujianli' },

  // quzhefazhan 文件夹
  { name: '1957年1月重庆市崇义街道九、十居民委员会全体治安干部合影。', url: quzhefazhan1, from: 'quzhefazhan' },
  { name: '1958年，广东省广州市广九街五居民委员会开展破除封建迷信活动，群众自觉交缴香炉。', url: quzhefazhan2, from: 'quzhefazhan' },
  { name: '1959年江苏省无锡市和平区居民食堂。', url: quzhefazhan3, from: 'quzhefazhan' },
  { name: '1959年西藏自治区拉萨市西城区干部向雪居民委员会宣传三反双减（反叛乱、反乌拉、反奴役和减租减息）政策。', url: quzhefazhan4, from: 'quzhefazhan' },
  { name: '1959年辽宁省鞍山市第十三居民委员会全体干部合影留念。', url: quzhefazhan5, from: 'quzhefazhan' },
  { name: '1962年11月浙江省杭州市拱墅区人民委员会关于同意建立沈塘新村居民委员会的批复。', url: quzhefazhan6, from: 'quzhefazhan' },
  { name: '1963年江苏省南京市举办歌颂三面红旗群众歌咏会场景。', url: quzhefazhan7, from: 'quzhefazhan' },
  { name: '1969年内蒙古自治区呼和浩特市长和廊居民委员会开展批修整风活动。', url: quzhefazhan8, from: 'quzhefazhan' },
  { name: '1975年内蒙古自治区呼和浩特市长和廊居民委员会组织居民学习。', url: quzhefazhan9, from: 'quzhefazhan' },
  { name: '1977年浙江省杭州市上羊市街居民委员会成员免费向居民赠送腊八粥。', url: quzhefazhan10, from: 'quzhefazhan' },
  { name: '1977年重庆市西城四所居民委员会干部获奖留影。', url: quzhefazhan11, from: 'quzhefazhan' },
  { name: '1978年安徽省宁国县河力镇先代会西津居民委员会全体代表合影。', url: quzhefazhan12, from: 'quzhefazhan' },
  { name: '1978年重庆市敦仁街道麻柳嘴居委会组织居民开展学雷锋打扫卫生活动（呈组图摆放）。', url: quzhefazhan13, from: 'quzhefazhan' },
  { name: '一组反映1968年至1978年吉林省延吉市新兴街道民安居民委员会的工作照片。①1968年新兴人民公社革命委员会成立。②1(001)', url: quzhefazhan14, from: 'quzhefazhan' },
  { name: '党的十一届三中全会，实现了新中国成立以来党的历史的伟大转折，中国进入了改革开放和社会主义现代化建设的新时期。图为1978(001)', url: quzhefazhan15, from: 'quzhefazhan' },
  { name: '黑龙江省哈尔滨市六十年代初居民委员会代表开会情景。', url: quzhefazhan16, from: 'quzhefazhan' },

  // huifu 文件夹
  { name: '1979年山东省潍坊市潍城区城关街道增福堂居民委员会办公会议。', url: huifu1, from: 'huifu' },
  { name: '1982年四川省成都市西城区（现青羊区）召开居民委员会先进集体、先进个人代表大会。', url: huifu2, from: 'huifu' },
  { name: '1982年重新修订颁布的宪法中，首次以根本大法的形式明确了居民委员会的性质任务和作用。图为1982年宪法。', url: huifu3, from: 'huifu' },
  { name: '1989年12月26日，第七届全国人民代表大会常务委员会第十一次会议通过《中华人民共和国城市居民委员会组织法》', url: huifu4, from: 'huifu' },
  { name: '1990年，广州市先进居委会、居委会先进工作者表彰大会', url: huifu5, from: 'huifu' },
  { name: '2009年12月21日，纪念《中华人民共和国城市居民委员会组织法》颁布实施满二十周年座谈会在浙江省杭州市召开。', url: huifu6, from: 'huifu' },
  { name: '2009年12月25日，北京市"心系姐妹、情牵一线 ---- 96156\'姐妹驿站\'公益服务热线开通仪式"。', url: huifu7, from: 'huifu' },
  { name: '2010年10月28日，新中国第一个居民委员会成立61周年纪念大会暨上羊市街社区第七届邻居节隆重举行', url: huifu8, from: 'huifu' },
  { name: '2010年11月10日，"非遗"文化社区体验站共建活动仪式在中国社区建设展示中心举行。', url: huifu9, from: 'huifu' },
  { name: '2010年5月3日，湖北省宜昌市西陵区廖家台社区组织开展青少年活动。', url: huifu10, from: 'huifu' },
  { name: '广东省佛山市南海区罗湖社区举行学雷锋便民活动', url: huifu11, from: 'huifu' },
  { name: '杭州市下城区积极推进社区老年食堂建设，图为武林街道"金叟园"社区老年食堂。', url: huifu12, from: 'huifu' },

  // xinshidai 文件夹
  { name: '《民法总则》', url: xinshidai1, from: 'xinshidai' },
  { name: '2014年11月5日，青海省西宁市城北区建设巷社区联合小桥大街小学开展消防安全演练活动', url: xinshidai2, from: 'xinshidai' },
  { name: '2017年1月25日，辽宁省大连市中山区青泥洼桥街道双合社区组织开展文明祭祀活动，居民、未成年人在"移风易俗，平安是福"展板上签名承诺。', url: xinshidai3, from: 'xinshidai' },
  { name: '2017年3月6日，湖北省宜昌市西陵区举行"百家宴活动。', url: xinshidai4, from: 'xinshidai' },
  { name: '2017年5月24日江苏省无锡市惠山区钱桥街道钱桥社区开展义诊活动', url: xinshidai5, from: 'xinshidai' },
  { name: '2018年2月27日，湖北省宜昌市夷陵区东平湖社区平湖国际小区以楼栋为单元由全体业主投票选举产生35名业主代表。', url: xinshidai6, from: 'xinshidai' },
  { name: '2022年5月19日，上羊市街社区居民骨干项目启动', url: xinshidai7, from: 'xinshidai' },
  { name: '2023年2月23日，上羊市街社区居民共同商议袁井巷小区停车管理规定', url: xinshidai8, from: 'xinshidai' },
  { name: '中国共产党第十八次全国代表大会', url: xinshidai9, from: 'xinshidai' },
  { name: '广西壮族自治区玉林市玉州区南江街道玉铁社区联合志愿者举办幸福爱心超市扶贫直播活动', url: xinshidai10, from: 'xinshidai' },
  { name: '第十二届全国人民代表大会第五次会议', url: xinshidai11, from: 'xinshidai' },
];

const selectList = [
  { name: '初步建立阶段', period: '1949-1956年', top: 442, selectKey: 'select1' },
  { name: '探索与曲折发展阶段', period: '1957-1978年', top: 597, selectKey: 'page2' },
  { name: '恢复与拓展阶段', period: '1979-2011年', top: 752, selectKey: 'page3' },
  { name: '新时代转型完善阶段', period: '2012年至今', top: 907, selectKey: 'page4' },
]

const selectParams = {
  select1: {
    left: 444, top: 101, url: select1Img, downButtonLeft: 1252, downButtonTop: 900, upButtonTop: 253, upButtonRight: 50
  },
  select2: {
    left: 444, top: 101, url: select2Img, downButtonLeft: 987, downButtonTop: 910, upButtonTop: 253, upButtonRight: 50
  },
  select3: {
    left: 444, top: 101, url: select3Img, downButtonLeft: 1252, downButtonTop: 822,
  },
  select4: {
    left: 444, top: 101, url: select4Img, downButtonLeft: 987, downButtonTop: 972,
  },
  page2: {
    left: 444, top: 101, url: page2Img
  },
  page3: {
    left: 444, top: 101, url: page3Img
  },
  page4: {
    left: 444, top: 101, url: page4Img
  },
}

function Detail({ name, gallery, onBack, index = 'select1' }) {
  const [selectedSelectKey, setSelectedSelectKey] = useState(index);
  const [showHand, setShowHand] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const galleryContainerRef = useRef(null);
  const page2Container1Ref = useRef(null);
  const page2Container2Ref = useRef(null);
  const page3ContainerRef = useRef(null);

  useEffect(() => {
    setSelectedSelectKey(index);
  }, [index]);

  // 当进入 select1、select2、page2、page3 或 page4 时显示 hand，6秒后隐藏
  useEffect(() => {
    if (selectedSelectKey === 'select1' || selectedSelectKey === 'select2' ||
      selectedSelectKey === 'page2' || selectedSelectKey === 'page3' || selectedSelectKey === 'page4') {
      setShowHand(true);
      const timer = setTimeout(() => {
        setShowHand(false);
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowHand(false);
    }
  }, [selectedSelectKey]);

  // 监听滚动事件，拖拽滚动时隐藏 hand
  useEffect(() => {
    const containers = [];

    if (selectedSelectKey === 'select1' || selectedSelectKey === 'select2') {
      if (galleryContainerRef.current) {
        containers.push(galleryContainerRef.current);
      }
    } else if (selectedSelectKey === 'page2') {
      if (page2Container1Ref.current) {
        containers.push(page2Container1Ref.current);
      }
      if (page2Container2Ref.current) {
        containers.push(page2Container2Ref.current);
      }
    } else if (selectedSelectKey === 'page3' || selectedSelectKey === 'page4') {
      if (page3ContainerRef.current) {
        containers.push(page3ContainerRef.current);
      }
    }

    const handleScroll = () => {
      setShowHand(false);
    };

    containers.forEach(container => {
      container.addEventListener('scroll', handleScroll);
    });

    return () => {
      containers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [selectedSelectKey]);

  const selectedItem = selectList.find(item => item.selectKey === selectedSelectKey) || selectList[0];
  const currentImageParam = selectParams[selectedSelectKey];

  // 判断文字是否可能换行（估算：324px宽度，16px字体，大约可容纳15-18个中文字符）
  const isMultiLine = (text) => {
    // 粗略估算：如果文字长度超过18个字符，可能换行
    return text.length > 18;
  };

  // 根据 selectKey 获取对应的图片列表
  const getImagesBySelectKey = (selectKey) => {
    if (selectKey === 'select1' || selectKey === 'select2') {
      return galleryImages.filter(img => img.from === 'chubujianli');
    }
    if (selectKey === 'page2') {
      return galleryImages.filter(img => img.from === 'quzhefazhan');
    }
    if (selectKey === 'page3') {
      return galleryImages.filter(img => img.from === 'huifu');
    }
    if (selectKey === 'page4') {
      return galleryImages.filter(img => img.from === 'xinshidai');
    }
    return [];
  };

  const handleSelectClick = (selectKey) => {
    if (selectKey !== selectedSelectKey) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedSelectKey(selectKey);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handleDownButtonClick = () => {
    let newKey;
    if (selectedSelectKey === 'select1') {
      newKey = 'select2';
    } else if (selectedSelectKey === 'select2') {
      newKey = 'select1';
    } else if (selectedSelectKey === 'select3') {
      newKey = 'select4';
    } else if (selectedSelectKey === 'select4') {
      newKey = 'select3';
    }
    
    if (newKey && newKey !== selectedSelectKey) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedSelectKey(newKey);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handleBackClick = () => {
    if (selectedSelectKey === 'select3' || selectedSelectKey === 'select4') {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedSelectKey('select1');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else {
      onBack();
    }
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div className={`detail-page ${isTransitioning ? 'page-transitioning' : ''}`} style={{ backgroundImage: `url(${detailBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="select-image" style={{ top: `${selectedItem.top}px` }}>
        <img src={selectImg} alt="select" />
        <div className="select-text">
          <div className="select-text-line1">{selectedItem.name}</div>
          <div className="select-text-line2">{selectedItem.period}</div>
        </div>
      </div>
      {currentImageParam && (
        <img
          src={currentImageParam.url}
          alt={'currentImageParam'}
          style={{
            position: 'absolute',
            left: `${currentImageParam.left}px`,
            top: `${currentImageParam.top}px`,
            pointerEvents: 'none'
          }}
        />
      )}
      {currentImageParam && currentImageParam.upButtonTop && (
        <div
          className="upButton"
          onClick={() => handleSelectClick('select3')}
          style={{
            position: 'absolute',
            width: '100px',
            height: '35px',
            top: `${currentImageParam.upButtonTop}px`,
            right: `${currentImageParam.upButtonRight}px`,
          }}
        />
      )}
      {currentImageParam && currentImageParam.downButtonLeft && (
        <div
          className='downButton'
          onClick={handleDownButtonClick}
          style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            left: `${currentImageParam.downButtonLeft}px`,
            top: `${currentImageParam.downButtonTop}px`,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        />
      )}
      {(selectedSelectKey === 'select1' || selectedSelectKey === 'select2') && (
        <div
          ref={galleryContainerRef}
          style={{
            position: 'absolute',
            left: '444px',
            top: '460px',
            width: '1420px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="slides-container"
        >
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page2') && (
        // <>
        //   <div
        //     ref={page2Container1Ref}
        //     style={{
        //       position: 'absolute',
        //       left: '444px',
        //       top: '470px',
        //       width: '688px',
        //       height: '327px',
        //       overflowX: 'auto',
        //       overflowY: 'hidden',
        //       scrollbarWidth: 'none',
        //       msOverflowStyle: 'none',
        //     }}
        //     className="slides-container"
        //   >
        //     <img
        //       src={pageSlides1Img}
        //       alt="pageSlides1"
        //       style={{
        //         height: '100%',
        //         width: 'auto'
        //       }}
        //     />
        //   </div>
        //   <div
        //     ref={page2Container2Ref}
        //     style={{
        //       position: 'absolute',
        //       left: '1172px',
        //       top: '470px',
        //       width: '688px',
        //       height: '418px',
        //       overflowX: 'auto',
        //       overflowY: 'hidden',
        //       scrollbarWidth: 'none',
        //       msOverflowStyle: 'none',
        //     }}
        //     className="slides-container"
        //   >
        //     <img
        //       src={pageSlides2Img}
        //       alt="pageSlides2"
        //       style={{
        //         height: '100%',
        //         width: 'auto'
        //       }}
        //     />
        //   </div>
        // </>
        <div className="gellery-scroll-wrap2" ref={page2Container1Ref}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page3') && (
        // <>
        //   <div
        //     ref={page3ContainerRef}
        //     style={{
        //       position: 'absolute',
        //       left: '444px',
        //       top: '600px',
        //       width: '688px',
        //       height: '403px',
        //       overflowX: 'auto',
        //       overflowY: 'hidden',
        //       scrollbarWidth: 'none',
        //       msOverflowStyle: 'none',
        //     }}
        //     className="slides-container"
        //   >
        //     <img
        //       src={pageSlides3Img}
        //       alt="pageSlides1"
        //       style={{
        //         height: '100%',
        //         width: 'auto'
        //       }}
        //     />
        //   </div>
        // </>
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 630 }}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page4') && (
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 470 }}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'select1' || selectedSelectKey === 'select2' ||
        selectedSelectKey === 'page2' || selectedSelectKey === 'page3' || selectedSelectKey === 'page4') && showHand && (
          <img
            src={handImg}
            alt="hand"
            className={selectedSelectKey === 'page3' ? 'hand-swipe-animation-page3' : 'hand-swipe-animation'}
            style={{
              position: 'absolute',
              // left: selectedSelectKey === 'page3' ? '1000px' : '1400px',
              left: 1400,
              top: selectedSelectKey === 'page3' ? '820px' : '690px'
            }}
          />
        )}
      <div className="back-btn2" onClick={handleBackClick}></div>
      {selectList.map((ele, i) => {
        return <div key={i} className={`selectButton${i + 1}`} onClick={() => handleSelectClick(ele.selectKey)}></div>
      })}
      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
}

export default Detail;