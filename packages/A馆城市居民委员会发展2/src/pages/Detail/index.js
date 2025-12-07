import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';
import page1Img from '../../assets/page1.jpg';
import leftYesImg from '../../assets/left-yes.png';
import rightYesImg from '../../assets/right-yes.png';
import leftNoneImg from '../../assets/left-none.png';
import rightNoneImg from '../../assets/right-none.png';

const list = [
  {
    name: '初步建立阶段（1949-1956年）',
    summary: '1.基层群众性自治组织初步形成。新中国成立前后，一些城市建立街委员会、闾委员会等基层管理机构，出现防护队、防盗队和居民组等名称各异的群众性组织。这些群众性组织联系、发动、组织和团结群众开展基层工作的优势，是政府机构和其他组织所难以替代的。1949年10月23日，在杭州上城区上羊市街社区成立新中国第一个居民委员会。\n（1）阐述成立过程：1949年10月11日，杭州市召开第一次各区局长联席会议，中共杭州市委书记江华决定，要在12月底前全面废除保甲制度，建立居民委员会和居民小组，并选定上城区、下城区、江干区先行开展试点。试点工作迅速推进。10月23日晚，上城区上羊市街250名居民代表在西牌楼小学集会，由时任上城区区公所田奎荣区长[[]]主持选举。通过民主选举产生第一届上羊市街居民委员会，居民陈福林当选居委会主任。新中国第一个居民委员会——上羊市街居民委员会成立，标志着保甲制度的终结，也标志着基层民主自治正式走上历史舞台，是我国基层社会管理制度的重要转折点。12月1日，杭州市人民政府正式印发《关于取消保甲制度建立居民委员会的工作指示》，对居委会的性质、产生方式及职能作出明确规定。\n（2）补充历史人物介绍：江华、田奎荣、陈福林等历史人物，以及历任社区书记、主任，共同书写了居民自治的历史篇章。江华市长推动废除保甲制度，为居民委员会建设指明了方向；田奎荣区长主持选举，为新中国首个居民委员会的诞生作出了贡献；人力车夫陈福林当选首任居民委员会主任，开启了居民自治探索性实践。此后，历任社区书记、主任薪火相传，守正创新，探索打造“邻里值班室”，创新形成“六民工作法”，推动建立“邻里圆桌会”，不断续写党建引领居民自治的历史新篇章。\n——杭州市市长江华\n江华，原名虞上聪，曾用名黄春圃，湖南江华瑶族自治县人，是中国共产党优秀党员、无产阶级革命家，曾任中共中央顾问委员会常务委员、最高人民法院院长。作为杭州市首任市长，他在基层管理上贡献突出：推动废除保甲制，建立居民委员会，实现全市覆盖，承担户籍管理、治安维护等职能，使居民委员会成为联系群众、服务群众的重要纽带；借“冬防运动”开展户口清查，助力剿匪反特，肃清反动势力，稳定社会秩序；注重民主建设，推动基层民主实践，开展爱国卫生运动、救济与教育普及等民生工作，为杭州基层政权巩固和后续发展奠定基础。\n——上城区区长田奎荣\n田奎荣，山东曲阜人，早年受私塾教育，青年投身革命，抗战胜利后任中共滕县县委委员、县武装部部长。1949年随军南下解放杭州，后历任上城区首任区长、杭州市建设局局长、西湖区委书记等职。任上城区区长时，他积极推动基层管理改革，响应市政府号召率先废除保甲制，于1949年10月主持选举产生新中国第一个居民委员会，明确其为居民自我管理的无产阶级基层组织。他要求原保长交权，终结旧制，并指导居民委员会建章立制，为基层民主建设提供范例，其工作对杭州及全国基层治理改革意义重大。\n——新中国第一个居民委员会首任主任陈福林\n陈福林，浙江杭州市上城区人，早年为人力车夫、工厂工人。1949年10月23日，24岁的他高票当选上羊市街居民委员会主任，成为新中国首位居民委员会主任。任职期间，他带领居民委员会成员完成多项开创性工作：协助政府完成户口清查、肃清潜伏特务、夜巡抓流窜人员保治安等任务；建立公共卫生设施、盖公厕改善卫生；组织抗洪救灾募捐、动员青年参军援朝，组织募捐支援灾区，慰问军烈属；公债推销、稳定粮价，助力完成公债任务。他以自己的行动有效地推动了保甲制度向民主自治转型，有力诠释了担当作为，他的奉献精神和工作态度为后来的居民委员会工作者树立了榜样。\n2.基层群众性自治组织逐步推广。1952年6月，华东军政委员会召开会议，讨论关于10万人口以上城市建立居民委员会的试行方案。同年8月，公安部颁布《治安保卫暂行条例》，第一次将“居民委员会”写入国家行政规章。居民委员会制度的正式确立。1953年6月，彭真向毛泽东主席与中共中央递交了《关于城市街道办事处、居民委员会组织和经费问题的报告》，建立在各城市区以下和不设区的市以下，同时建立“城市街道办事处”和“城市居民委员会”。1954年12月，第一届全国人大常委会第四次会议颁布《城市居民委员会组织条例》，第一次用法律的形式确定了居民委员会的性质、地位和作用。',
    iamges: []
  },
  {
    name: '探索与曲折发展（1957-1978年）',
    summary: '1.居民委员会的全面建立。到1956年底，全国各个城市普遍建立了居民委员会。居民委员会积极组织居民维持治安秩序、化解矛盾纠纷、发展地方经济、协助政府工作，有效促进了社会主义革命和社会主义建设。居民委员会得到进一步巩固和发展。\n2.居民委员会制度的曲折发展。1958年，在三面红旗（总路线、大跃进、人民公社）的大背景下，居民委员会的工作任务和职责被改变，法律性质也发生变化，主要任务是大办工业和商业，大炼钢铁。1963年以后的十几年时间，受“左”倾错误影响，居民委员会工作逐渐转向以阶级斗争为主，违背了群众自治原则。',
    iamges: []
  },
  {
    name: '恢复与拓展阶段（1979-2011年）',
    summary: '1.居民委员会制度的恢复（1979-2000年）。1978年改革开放后，居民委员会进入了恢复、整顿、全面发展时期，回归群众自治本质。1980年，国家重新颁布了《城市居民委员会组织条例》，再次将居民委员会建设纳入法制化轨道。1982年颁布的《中华人民共和国宪法》，首次以根本大法的形式明确了居民委员会的性质、任务和作用。1989年，第七届全国人民代表大会常务委员会第十一次会议通过了《中华人民共和国城市居民委员会组织法》，这是对《城市居民委员会组织条例》的修改完善，条例上升为法律，该法律对居民委员会的性质、组织、规模、职责、工作原则等作出了明确规定。\n2.居民委员会的功能拓展（2000-2012年）。2000年，中共中央办公厅、国务院办公厅转发《民政部关于在全国推进城市社区建设的意见》，明确对原有街道办事处、居民委员会所辖区域作适当调整，以调整后的居民委员会辖区作为社区地域，并冠名社区，建立社区居民委员会。2004年，中共中央办公厅转发了中组部《关于加强和改进街道社区党的建设工作的意见》，明确社区党支部的主要职责。随着社区建设深入开展，社区党组织和居民自治组织建设不断加强。2007年，中国共产党第十七次全国代表大会首次将基层群众自治制度列为中国特色社会主义民主政治制度的基本范畴之一,与人民代表大会制度、多党合作和政治协商制度、民族区域自治制度并列。',
    iamges: []
  },
  {
    name: '新时代转型完善阶段（2012年至今）',
    summary: '居民自治制度的不断完善。2012年，党的十八大再次强调了基层群众自治制度是我国基本政治制度，并第一次把社区治理写入党的纲领性文件。2017年，第十二届全国人民代表大会第五次会议通过的《中华人民共和国民法总则》赋予居民委员会基层群众自治组织法人资格，使其在从事民事活动、维护社区权益等方面有了明确的法律地位和行动依据。2018年，第十三届全国人大常委会第七次会议通过修改城市居民委员会组织法的决定，规定居民委员会每届任期五年，成员可以连选连任，这一调整有利于保持社区工作稳定性与连贯性，促进社区治理长效发展。',
    iamges: []
  },
];

const SLIDE_WIDTH = 1840;
const SLIDE_GAP = 0;

function Detail({ name, gallery, onBack, isActive }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const summaryRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const trackOffset = -(currentIndex * (SLIDE_WIDTH + SLIDE_GAP));

  // 判断是否在第一个slide
  const isFirstSlide = currentIndex === 0;
  // 判断是否在最后一个slide
  const isLastSlide = currentIndex === list.length - 1;

  const handlePrev = () => {
    // 如果不是第一个，才能向左滑动
    if (!isFirstSlide) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    // 如果不是最后一个，才能向右滑动
    if (!isLastSlide) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSummaryMouseDown = (e) => {
    if (!summaryRef.current) return;
    setIsDragging(true);
    const rect = summaryRef.current.getBoundingClientRect();
    setStartY(e.clientY - rect.top);
    setScrollTop(summaryRef.current.scrollTop);
  };

  const handleSummaryMouseMove = useCallback(
    (e) => {
      if (!isDragging || !summaryRef.current) return;
      e.preventDefault();
      const rect = summaryRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const walk = (y - startY) * 1.5;
      summaryRef.current.scrollTop = scrollTop - walk;
    },
    [isDragging, startY, scrollTop]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const container = summaryRef.current;
    if (container) {
      container.addEventListener('mousemove', handleSummaryMouseMove);
      container.addEventListener('mouseup', stopDragging);
      container.addEventListener('mouseleave', stopDragging);

      return () => {
        container.removeEventListener('mousemove', handleSummaryMouseMove);
        container.removeEventListener('mouseup', stopDragging);
        container.removeEventListener('mouseleave', stopDragging);
      };
    }
  }, [handleSummaryMouseMove, stopDragging]);

  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isActive && summaryRef.current) {
      summaryRef.current.scrollTop = 0;
    }
  }, [isActive]);

  return (
    <div
      className="detail-page"
      style={{
        backgroundImage: `url(${page1Img})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="back-btn" onClick={onBack}></div>
      <div className="detail-card-carousel">
        <div className="card-viewport">
          <div
            className="card-track"
            style={{ transform: `translateX(${trackOffset}px)` }}
          >
            {list.map((item, index) => (
              <div
                key={item.name}
                className="detail-slide"
              >
                <div
                  className={`detail-card ${currentIndex === index ? 'active' : ''
                    }`}
                >
                  <span>{item.name}</span>
                </div>
                <div
                  className="detail-summary"
                  ref={currentIndex === index ? summaryRef : null}
                  onMouseDown={
                    currentIndex === index ? handleSummaryMouseDown : undefined
                  }
                >
                  {item.summary.split('\n').map((paragraph, pIndex) => 
                    paragraph.trim() ? <p key={pIndex}>{paragraph}</p> : <br key={pIndex} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <img
        src={isFirstSlide ? leftNoneImg : leftYesImg}
        alt="prev"
        className="carousel-btn-left"
        onClick={handlePrev}
      />
      <img
        src={isLastSlide ? rightNoneImg : rightYesImg}
        alt="next"
        className="carousel-btn-right"
        onClick={handleNext}
      />

    </div>
  );
}

export default Detail;