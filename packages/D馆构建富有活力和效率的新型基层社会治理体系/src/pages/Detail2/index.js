import React, { useState } from 'react';
import './index.css';
import page2Img from '../../assets/page2.jpg';
import button1 from '../../assets/button1.png';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import image1 from '../../assets/images/wuzhen.JPG';
import image2 from '../../assets/images/图为北苑街道小志愿者服务队开展文明引导.jpg';
import image3 from '../../assets/images/shanghai.png';
import image4 from '../../assets/images/图为安远县开展防溺水宣传活动.jpg';
import image5 from '../../assets/images/图为蟠龙社区开展第六届红色经典咏流传红色诗歌大会，辖区内许多企事业单位响应参与.jpeg';
import image6 from '../../assets/images/图为政法干警走访帮教.jpg';
import image7 from '../../assets/images/hongshan.jpg';

const list = [
  {
    name: '浙江省嘉兴市桐乡市：\n“三治融合”实践样本',
    summary: `作为“三治融合”发源地，浙江省桐乡市通过党建引领、多元共治、数字赋能，构建起自治法治德治相结合的基层治理体系。
该市健全“市委－部门－镇街”三级联动机制，建强网格员三支队伍，明确六项工作机制。创新推行“一约两会三团”模式，设立970余家积分超市实现全覆盖，有效激发群众参与热情。聚焦小区、商圈等10个典型场景，实施23个示范项目，打造“桐安薪”数字平台，生成企业健康报告3万余份，预警欠薪风险1800余家。通过推动部门力量下沉、引导新就业群体“进网入格”，形成“只进一扇门、最多跑一地”的服务格局，实现了从发源地到示范地的转型升级，为县域治理现代化提供了实践样本。`,
    images: [
      {
        name: '图为桐乡市“乌镇管家”志愿服务队伍在景区内开展宣传活动',
        url: image1
      }
    ]
  },
  {
    name: '北京市通州区：\n“副中心有我”汇聚治理合力',
    summary: `北京城市副中心（通州区）创新构建“副中心有我”社会动员体系，通过党建引领、数字赋能、多元参与，有效激发基层治理新动能。
该体系建立“区－街乡－社区（村）－网格”四级动员机制，将5307个网格作为治理单元，打造线上线下融合的动员阵地。开发“副中心有我”小程序，结合1000余个实体站点，形成全覆盖服务网络。目前已开展理论宣讲、文明实践等8类3万余场活动，动员参与33.7万人，服务辐射超100万人。
全区注册志愿者达37.5万人，组建6445支服务队伍，年度服务时长230.83万小时。通过“热线+网格”治理模式，实现“小事不出网格、大事不出社区”，构建起人人参与、人人尽责、人人共享的基层治理新格局。
`,
    images: [
      {
        name: '图为北苑街道小志愿者服务队开展文明引导',
        url: image2
      }
    ]
  },
  {
    name: '上海市：\n“社区云”打造基层治理数字基座',
    summary: `上海市创新打造“新版社区云”数字化平台，通过“四个一”架构有效破解基层治理中的数据壁垒和重复劳动问题。
该平台整合15个市级部门系统，构建统一门户；汇聚514个基础数据项和733个条线数据项，形成覆盖268万个地址、1452万间房屋、2564万人口的“人房基础数据库”。通过创新综合走访模式，6个部门业务整合使重复走访减少24%；数据实时回流7.02亿条，日均共享169.6万条，支撑近40个特色场景建设。
平台工具累计调用超7亿次，消息中心、走访接待等功能成为基层最爱用的高频工具，实现了从“层层报表”到“一键直达”的工作变革，为基层减负增能提供了数字化解决方案。
`,
    images: [
      {
        name: '图为上海“新版社区云”',
        url: image3
      }
    ]
  },
  {
    name: '江西省赣州市安远县：\n建立党建引领“七彩社区”治理模式',
    summary: `江西省安远县创新推行党建引领“七彩社区”治理模式，通过构建“红色强基、橙色暖心”等七大主题板块，有效提升社区治理效能。
该县将城区划分为36个片区、60个网格，构建“社区管委会－居委会－网格－业委会－楼栋”五级治理体系。选派69名职级干部和60名事业编干部专职担任网格长（员），按照每年每网格15万元标准保障经费。创新“五个一”楼栋治理机制，业委会党员占比超50%。
同时，建立七色工作专班，开发“七彩社区”小程序畅通民情渠道，建设网格党群服务站推动服务下沉。该模式入选2024年全国城乡社区高质量发展典型案例，实现了从单一管理到多元共治的治理升级。`,
    images: [
      {
        name: '图为安远县开展防溺水宣传活动',
        url: image4
      }
    ]
  },
  {
    name: '广西壮族自治区南宁市良庆区：\n“嵌入式”社区绽放团结花',
    summary: `南宁市良庆区蟠龙社区立足自贸区核心区定位，在5.8平方公里辖区内服务2.7万常住人口（含10多个民族，少数民族占比30%），创新打造多民族“嵌入式”社区治理模式。
社区构建“党委－小区党支部－楼栋党小组－党员中心户”组织体系，选配9名“两委”干部（平均年龄37.8岁），与36家单位党建联建，组建300余人“老友帮帮团”，累计带动志愿服务超1万人次。建设1300平方米党群服务中心、4个小区站点和18个楼宇“微家”，划分13个网格精准服务，今年已办结群众诉求84件。
通过“三月三”民俗活动、非遗体验等促进交融，设立民族作品展区，常态化开展文化浸润。累计服务企业5800余家、群众3.5万人次，实现各族群众共居共融、共建共享。`,
    images: [
      {
        name: '图为蟠龙社区开展第六届红色经典咏流传红色诗歌大会，辖区内许多企事业单位响应参与',
        url: image5
      }
    ]
  },
  {
    name: '海南省乐东黎族自治县：\n“四访五帮”护航青少年成长',
    summary: `乐东黎族自治县创新建立“四访五帮”工作机制，通过政法干警走访帮教，有效预防和矫治未成年人不良行为。该机制累计开展走访2631人次，进行法治教育11647人次，实现精准帮扶。
帮教过程中，政法干警每月走访个人、家庭、学校、村居，建立“一人一册”档案，采取“一对一”帮扶。通过心理疏导、技能培训、家庭教育指导等综合措施，已帮助65名对象完成学业，42名考上中专或技校，50名重返校园，53名实现就业。
该县整合家庭、学校、社区力量，构建“五位一体”帮教格局，通过“五老”服务队、法律顾问结对等措施，形成了全社会共同参与青少年保护的良好局面，显著提升了未成年人的法治意识和行为规范。`,
    images: [
      {
        name: '图为政法干警走访帮教',
        url: image6
      }
    ]
  },
  {
    name: '新疆生产建设兵团第八师石河子市：\n“七彩红桥”连民心',
    summary: `红山街道25社区创新打造“七彩红桥”党建品牌，通过七大“红色”工程构建基层治理新格局。社区党委下设13个党支部，管理540名党员，联动6家共建单位，推动300余名在职党员参与志愿服务，形成“支部包片区、党小组包楼栋、党员包户”的网格体系。
该社区建立8个网格党支部、56个楼栋党小组，设立120个党员中心户，打造“红乐邻”红色物业，通过“居民点单、物业接单”模式解决民生问题。培育“乐林艺术团”“军垦芳华工作室”等文化团队，年均开展活动50余场，服务超万人次。建成红色先锋、蓝色春蕾、橙色暖心、银色助老四大驿站，提供全龄段服务。
“七彩红桥”品牌获中组部优秀创新案例，社区先后荣获全国先进社会组织等荣誉，实现了党建引领下治理效能与服务品质的双提升。`,
    images: [
      {
        name: '图为红山街道25社区开展“我和国旗合个影”系列活动',
        url: image7
      }
    ]
  },
]

function Detail2({ name, gallery, onBack, currentIndex = 0 }) {
  const [index, setIndex] = useState(currentIndex);
  const allList = list;
  const currentItem = allList[index] || allList[0];
  const firstImage = currentItem?.images?.[0];
  const isFirst = index === 0;
  const isLast = index === allList.length - 1;

  const handlePrev = () => {
    if (!isFirst) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex(index + 1);
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page2Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>

      {currentItem && (
        <>
          {/* 标题 */}
          <div className="card-title">
            {currentItem.name.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < currentItem.name.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* 正文 */}
          <div className="card-summary">
            {currentItem.summary.split('\n').map((line, index) => (
              <p key={index}>
                {line}
              </p>
            ))}
          </div>

          {/* 图片和注释 */}
          {firstImage && firstImage.url && (
            <>
              <div
                className="card-image"
                style={{ backgroundImage: `url(${firstImage.url})` }}
              ></div>
              {firstImage.name && (
                <div className="card-image-caption">
                  {firstImage.name}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 左切换按钮 */}
      <button
        className={`nav-button nav-button-left ${isFirst ? 'disabled' : ''}`}
        onClick={handlePrev}
        disabled={isFirst}
        style={{ backgroundImage: `url(${leftArrow})` }}
      ></button>

      {/* 右切换按钮 */}
      <button
        className={`nav-button nav-button-right ${isLast ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={isLast}
        style={{ backgroundImage: `url(${rightArrow})` }}
      ></button>

      {/* <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button> */}
    </div>
  );
}

export default Detail2;