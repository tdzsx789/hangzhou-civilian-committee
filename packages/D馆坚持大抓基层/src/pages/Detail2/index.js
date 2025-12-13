import React, { useState } from 'react';
import './index.css';
import page2Img from '../../assets/page2.jpg';
import button1 from '../../assets/button1.png';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
// list3 图片导入
import list3Image1 from '../../assets/images3/shenka.jpg';
import list3Image2 from '../../assets/images3/图为加吉博洛镇治渠街社区石榴红微心愿集中圆梦主题党日活动.png';
import list3Image3 from '../../assets/images3/hongchuanqihang.jpg';
import list3Image4 from '../../assets/images3/图为非公企业党委参与志愿服务.JPG';
import list3Image5 from '../../assets/images3/图为市民参与现场志愿服务展台活动.png';
import list3Image6 from '../../assets/images3/图为桂城创熟嘉年华现场各社区邻里文化展示.JPG';
import list3Image7 from '../../assets/images3/licangqu.jpg';
import list3Image8 from '../../assets/images3/图为长山花园社区党委第一书记吴亚琴带领大家共同创建美好社区.jpg';
import list3Image9 from '../../assets/images3/yiheduoquan.png';
import list3Image10 from '../../assets/images3/图为北京市朝阳区双井街道百子园南社区工作者询问居民需求.jpg';

const list3 = [
  {
    name: '北京市：\n“接诉即办”探索超大城市治理新路',
    summary: `北京市深化党建引领“接诉即办”改革，构建“书记抓、抓书记”的党建引领责任体系，形成市、区、街道、社区四级联动指挥机制。建立“全周期管理”闭环，整合64条政务热线，实行精准派单、分级响应（最快2小时处置），并以响应率、解决率、满意率“三率”考评驱动效能提升。推动“每月一题”主动治理，针对高频共性难题出台400余项政策，完成1800余项任务，实现从被动响应到主动治理的深化。
2019年启动改革以来，12345热线累计受理诉求1.5亿件，解决率、满意率分别从53%、65%大幅提升至97%。“有事打12345”成为北京市民共识，改革显著提升了群众获得感，塑造了“人民城市人民建”的超大城市治理范例。`,
    images: [
      {
        name: '图为北京市朝阳区双井街道百子园南社区工作者询问居民需求',
        url: list3Image10
      }
    ]
  },
  {
    name: '天津市北辰区：\n“一核多圈、多委合一”探索党建引领基层治理新实践',
    summary: `天津市北辰区创新构建“一核多圈、多委合一”工作体系，通过三大举措推动基层治理提质增效，实现了从“单打独斗”到“众人划桨”、从“有心无力”到“一呼百应”的治理新格局。
建强“主心骨”，提升组织力。全区121个村、166个社区全部实现党组织书记“一肩挑”，基层战斗堡垒更加坚固。实施赋能减负，清理挂牌579块，社区事务减少130余项，推动资源力量下沉。
扩大“朋友圈”，增强聚合力。深化街道党建联建共建工作，形成85项“资源清单”。185个党组织、4500余名在职党员到社区报到，2024年以来解决民生问题1.5万余件。孵化培育社会组织100余个，服务群众5000余人次。
用好“金钥匙”，提升服务力。创新“家门口协商”议事平台，80%以上社区（村）实现全年“无诉”“无访”。建立红色物业“365”工作机制，提供“五红服务”，实现服务全天候不断线。
`,
    images: [
      {
        name: '图为“一核多圈、多委合一”基本架构',
        url: list3Image9
      }
    ]
  },
  {
    name: '吉林省长春市宽城区：\n“六治融合”重塑老旧社区',
    summary: `长春市长山花园社区面对3100户、近7000人的治理规模，创新实践“党建引领、六治融合”模式，成功从“老旧散”蝶变为“花园式”典范，构建起共建共治共享的新格局，荣获百余项国家级及省市级荣誉，成为基层治理的生动范本。
党建领治构建社区四级网络，一次性接收194名退休党员，将组织触角延伸到每家每户。居民自治推行“四议工作法”和“三长”联动机制，引导居民共同商议解决楼道粉刷、停车位规划等事务。服务善治聚焦“一老一小一难”，打造共享养老、青少年七大保护体系等，已成功帮扶超1000人再就业。平安法治整合司法资源多方力量零距离化解矛盾，社区连续十四年实现“九零”目标。文化德治通过“一站三堂”、“红马甲道德银行”等活动评选身边好人，塑造“人人为我，我为人人”的社区风尚。社会共治联合10余家单位成立党建联盟，共建社区金融服务站，月流水超400万元，变“独角戏”为“大合唱”。`,
    images: [
      {
        name: '图为长山花园社区党委第一书记吴亚琴带领大家共同创建美好社区',
        url: list3Image8
      }
    ]
  },
  {
    name: '山东省青岛市李沧区：\n“三放两化”夯实基层治理',
    summary: `青岛市李沧区通过党建引领“三放两化”模式，推动管理、资源、服务下沉，以精细化、精准化服务提升基层治理效能。
该区构建起“街道党工委－社区党委－网格党支部－楼栋党小组－党员中心户”五级组织链条，实施“强基赋能”工程推动力量下沉。同时创新服务供给，建设覆盖11个街道的社区邻里中心，推广“一窗受理、全科服务”模式，并通过“红色物业”“商圈党建”等拓展治理领域。
这一改革实现了治理重心有效下移，形成了党组织统一领导、多元力量协同、群众广泛参与的基层治理新格局，切实提升了服务精准度和居民幸福感。`,
    images: [
      {
        name: '图为李沧区物业行业党委组织“红管家”党员先锋服务队开展志愿服务',
        url: list3Image7
      }
    ]
  },
  {
    name: '广东省佛山市南海区：\n创建熟人社区重构邻里关系',
    summary: `佛山市南海区创新推行“创熟”社区治理模式，通过情感治理重构邻里关系，有效破解基层治理难题。
南海区构建“纵向指挥到底、横向动员到边”的工作体系，在区、镇（街道）、村（社区）三级建立“创熟”工作团队，整合党群资源。通过培育社区社会组织、开展志愿服务、举办邻里文化活动三大举措，累计培育街坊志愿互助会351个、社区志愿服务队1533个、“三长”7219人，开展活动超3万场次，带动居民参与80万人次。
经过多年实践，“创熟”实现了从“相见不相识”到“熟人好说话”的邻里关系转变，搭建了359个议事协商平台，形成楼长制、街坊会等可复制机制，构建起共建共治共享的基层治理新格局。`,
    images: [
      {
        name: '图为桂城创熟嘉年华现场各社区邻里文化展示',
        url: list3Image6
      }
    ]
  },
  {
    name: '重庆市渝中区：\n“小红伞”撑起文旅融合新风景',
    summary: `面对大景区、大港区、大市场带来的超大客流治理挑战，重庆朝天门街道创新打造“小红伞”文明实践志愿服务项目，实现基层治理与文旅发展的双赢。
项目集党员实践、志愿服务、文明展示、文旅推介、平安建设五大功能于一体。通过“收益反哺公益”的创新模式，既满足游客需求，又实现收支平衡；整合多方资源，组建五类青年志愿力量，细化11项服务内容，提供全年无休的“七务一全”一站式服务。
运行至今，“小红伞”累计接待超50万人次，处理突发事件105起，协助找回走失人员21名，收获国内外游客感谢信30余次。项目已与20余家单位达成合作，用志愿服务链接文旅资源，让“打卡变刷卡、人气变商气”，成功打造出超大城市中心城区现代化治理的新样本。`,
    images: [
      {
        name: '图为市民参与现场志愿服务展台活动',
        url: list3Image5
      }
    ]
  },
  {
    name: '贵州省铜仁市江口县：\n“五联五创”提升党建引领城市基层治理水平',
    summary: `贵州省江口县以“五联五创”模式推进城市社区治理，通过系统化改革全面提升基层治理效能。
该县构建起“县委—街道—社区”三级联动体系，由16名县领导、30家县直部门包保网格，推动资源下沉。通过整合多部门网格为“一张网”，形成一贯到底的五级网格治理体系。创新推行“积分制”管理，激发居民参与热情；打造“党建+就业”服务模式，开展技能培训促进居民就业；在安置点社区实施“五微”举措，提升治理精度。
通过组织联建、上下联动、网格联户、社会联手、数据联通，江口县成功创建红色、高效、和谐、智慧、幸福的“五型社区”，实现了治理重心下移和服务效能提升，探索出县域城市社区治理的有效路径。`,
    images: [
      {
        name: '图为非公企业党委参与志愿服务',
        url: list3Image4
      }
    ]
  },
  {
    name: '甘肃省金昌市金川区：\n“红色网格”织就幸福家园',
    summary: `金昌市金川区宝林里社区创新党建引领模式，以340名党员为核心，构建起覆盖5119户居民的“红色网格”治理体系，打造出文明和谐的社区典范。
社区建立“党员中心户”制度，按照“1+10+N”模式划出“红色网格”，配备12户标准化中心户，开展“红色微讲堂”18次、志愿服务活动30余次。同时打造“红色驿站”，为156名流出党员送学2000余人次，组织16名流入党员参与活动500余人次，确保流动党员“离乡不离党”。
通过“农社对接”周末市场，线上线下销售农产品52000公斤；孵化12支社工队伍，建立150余人的老年志愿者服务队坚持服务12年。社区开展红色教育活动300余场，央视曾报道其宣讲经验，形成了10分钟“党员联络圈”“便民服务圈”的治理新格局。`,
    images: [
      {
        name: '图为老党员为青少年讲述“红船启航”故事',
        url: list3Image3
      }
    ]
  },
  {
    name: '青海省玉树州治多县：\n“五微”促民族团结一家亲',
    summary: `青海省玉树州治多县加吉博洛镇治渠街社区创新打造“江源处处石榴红”党建品牌，以“五心”推进“五微”工作法，成功构建互嵌式社区环境。
社区通过打造党员教育微基地，创新“菜单式学习”“行走的党课”等模式，建成州级党支部组织生活共享阵地。创办双语月刊，与红色广播站、网络直播平台构建宣传矩阵，“银发”宣讲团成员曾受习近平总书记接见，红领巾宣传员登上中国教育电视台。
实施“民情流水线工程”，与多家单位签订“红联共建”协议，筹集钱款物资帮扶困难群众。通过建设民族团结主题市场、开展“石榴红家园”文化节等举措，有效促进了各民族在经济、文化、民生等方面的深度融合，走出了一条民族互嵌的特色治理之路。`,
    images: [
      {
        name: '图为加吉博洛镇治渠街社区石榴红微心愿集中圆梦主题党日活动',
        url: list3Image2
      }
    ]
  },
  {
    name: '广东省深圳市对口支援喀什社会工作站：\n绘就民族团结与民生改善新画卷',
    summary: `深喀社工站坚持以党建为引领，自2021年成立党支部以来，通过“党建+业务”双融合模式，打造“深喀益桥”等品牌项目，累计解决群众实际需求2000余例，“幸孕”妈妈计划惠及200余名孕产妇，新生儿死亡率显著下降30%。
在人才培养方面，深圳累计派遣援疆社工90人次，培育本土社工400余人，孵化20家本地社会组织。通过“嵌入式服务”促进民族团结，组织50余户深塔家庭结对联谊，连续12年开展“手拉手”青少年交流活动，惠及千余名学生。
在民生改善领域，依托援疆资金，联动爱心企业、慈善资源，开展“一老一小”关爱行动；实施“残疾人就业帮扶”“精康融合”等系列残疾人服务项目；实施“幸福满园”企业社工服务项目，以“个人发展取向模式”和“社群权益取向”模式助推职工成长。同时培育400余名旅游志愿者，资助26个公益微项目，构建起共建共治共享的基层治理新格局。`,
    images: [
      {
        name: '图为深喀青少年“手拉手”交流活动开班仪式',
        url: list3Image1
      }
    ]
  },
]

function Detail2({ name, gallery, onBack, currentIndex = 0 }) {
  const [index, setIndex] = useState(currentIndex);
  const allList = list3;
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
            {currentItem.summary
              .split('\n')
              .filter((paragraph) => paragraph.trim() !== '')
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
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