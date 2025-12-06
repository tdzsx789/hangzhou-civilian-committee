import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
// 预加载所有图片
import bg1Img from './assets/bg1.jpg';
import coverImg from './assets/cover.jpg';
import startImg from './assets/start.png';
// 2007年图片
import img2007_1 from './assets/2007/qian-shanhu.png';
import img2007_2 from './assets/2007/group-photo-qian-shanhu.png';
import img2007_3 from './assets/2007/investigation-report-1952.png';
import img2007_4 from './assets/2007/cai-qi-visit-2007-06-05.png';
import img2007_5 from './assets/2007/he-guanxin-meeting-2007-06-28.png';
import img2007_6 from './assets/2007/zhan-chengfu-report-2007-08-04.png';
import img2007_7 from './assets/2007/ministry-meeting-2007-08-27.png';
import img2007_8 from './assets/2007/beijing-forum-2007-09-09.png';
// 2008年图片
import img2008_1 from './assets/2008/expert-forum-2008-06-13.png';
import img2008_2 from './assets/2008/beijing-expert-forum-2008-06-19.png';
import img2008_3 from './assets/2008/announcement-2008-06-28.png';
import img2008_4 from './assets/2008/chen-fulin-chen-daozhang-handshake.png';

const list = [
  {
    name: '一次质疑，掀开寻访历程（2004年）',
    summary: '2004年夏，在一次关于《中华人民共和国城市居民委员会组织法》的立法调研会上，有人提出“1950年初北方始建居民委员会”说法，杭州当即以1949年12月1日市政府颁发的《关于取消保甲制度建立居民委员会的工作指示》提出异议，指出杭州此前已有成文规定，现存文献亦未见更早记录。这一质疑引发国家部委与专家高度关注，要求杭州补充档案佐证。杭州市迅速成立由杭州市民政局、上城区民政局、档案馆等部门负责人员组成的7人专项小组，系统查阅新中国成立前后的政府公文、新闻报道及人物档案。由此拉开长达四年的全国寻访，试图厘清新中国居民委员会的真正起点。',
    images: []
  },
  {
    name: '一波三折，探究历史真相（2007年）',
    summary: '2007年初，一份1952年的《上城区柳翠井巷居民委员会的调查报告》被发现，受访老人回忆该组织诞生于1949年10月，舆论迅速升温。11月8日，民政部在北京又一次召开专家论证会，对全国各地上报的历史资料和社会各界提供的有关线索进行分析论证，排除了一些疑点，提出了根据"时间、名称、地域、性质、结构"五条认定标准进一步寻访的意见。并向全国发函征集线索，26个城市、10位个人及2个社会组织响应。经多轮专家论证、疑点排除，杭州最终锁定上羊市街居民委员会成立时间更早，且完全符合五条标准，遂于2008年5月再次报送完整材料。',
    images: [
      {name: '受访老人钱珊瑚', url: img2007_1},
      {name: '时任杭州市民政局局长邵胜，基层政权和社区建设处周伟华副处长，上城区民政局局长傅丽萍，副局长马丽华等同志与钱珊瑚老人一起合影。', url: img2007_2},
      {name: '杭州市民政局在杭州市人民政府历史档案中查到了1952年7月《上城区柳翠井巷居民区调查报告》。', url: img2007_3},
      {name: '2007年6月5日，时任杭州市长蔡奇到惠民苑社区调研，听取上城区关于建设新中国第一个居民委员会的工作汇报。', url: img2007_4},
      {name: '2007年6月28日，时任杭州市政府何关新副市长在柳翠井巷社区现场主持召开专题会议，对新中国第一个居民委会员柳翠井巷社区有关打造问题进行专题研究。', url: img2007_5},
      {name: '2007年8月4日，时任民政部基层政权和社区建设司司长詹成付（现任民政部副部长）在杭州市上城区听取新中国第一个居民委员会寻访工作情况汇报。', url: img2007_6},
      {name:'2007年8月27日，国家民政部在杭州召开城市社区建设座谈会，时任民政部部长李学举出席并听取新中国第一个居民委员会寻访情况汇报。',url: img2007_7},
      {name:'2007年9月9日，国家民政部在北京召开"新中国第一个居民委员会"论证会，杭州市在会上作了陈述报告。',url: img2007_8},
    ]
  },
  {
    name: '一锤定音，第一花落上城（2008年）',
    summary: '2008年6月，浙江省民政厅、杭州市民政局和上城区委、区政府联合召开论证会，确认上羊市街居民委员会为全省最早且完全符合认定条件的组织，并正式向中央申报。同月，民政部召开最终专家会，其他城市因无新的证据相继放弃，杭州成为唯一申报方。6月28日，民政部在杭州发布结论：1949年10月23日成立的杭州市上城区上羊市街居民委员会为"新中国第一个居民委员会"。这一认定不仅为当代中国城市基层群众自治找到了历史原点，也为新时代坚持和完善基层群众自治制度提供了最初范例。',
    images: [
      {name:'2008年6月13日，浙江省杭州市上城区召开"新中国第一个居民委员会"申报省、市专家论证会。',url: img2008_1},
      {name:'2008年6月19日，民政部在北京召开专家论证会，进行陈述、答辩、论证。',url: img2008_2},
      {name:'2008年6月28日，国家民政部在杭州宣布成立于1949年10月23日的杭州市上城区紫阳街道上羊市街居民委员会是新中国第一个居民委员会。',url: img2008_3},
      {name:'上羊市街居民委员会第一任主任陈福林（左）与第一任副主任陈道彰握手合影，共同追忆着当年上羊市街居民委员会成立时的情景。',url: img2008_4},
    ]
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // 预加载所有图片
  useEffect(() => {
    const images = [
      bg1Img, 
      coverImg, 
      startImg,
      img2007_1, img2007_2, img2007_3, img2007_4, img2007_5, img2007_6, img2007_7, img2007_8,
      img2008_1, img2008_2, img2008_3, img2008_4
    ];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  // 2分钟无交互自动返回Home页
  useEffect(() => {
    let autoReturnTimer = null;

    const resetTimer = () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      autoReturnTimer = setTimeout(() => {
        setCurrentPage('home');
      }, 300000); // 2分钟 = 300000毫秒
    };

    const handleTouchStart = () => {
      resetTimer();
    };

    // 初始化定时器
    resetTimer();

    // 监听 touchstart 事件
    document.addEventListener('touchstart', handleTouchStart);

    // 清理函数
    return () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div className="App">
      <div className={`page-container ${currentPage === 'home' ? 'active' : 'inactive'}`}>
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div className={`page-container ${currentPage === 'detail' ? 'active' : 'inactive'}`}>
        <Detail onBack={handleBack} list={list} />
      </div>
    </div>
  );
}

export default App;