import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Modal from '../Modal';
import detailBgImgZh from '../../assets/detailBg.jpg';
import detailBgImgEn from '../../assets_english/detailBg.jpg';
import selectImgZh from '../../assets/select.png';
import selectImgEn from '../../assets_english/select.png';
import select1ImgZh from '../../assets/step1.png';
import select1ImgEn from '../../assets_english/step1.png';
import select2ImgZh from '../../assets/step2.png';
import select2ImgEn from '../../assets_english/step2.png';
import select3ImgZh from '../../assets/step3.png';
import select3ImgEn from '../../assets_english/step3.png';
import select4ImgZh from '../../assets/step4.png';
import select4ImgEn from '../../assets_english/step4.png';
import page2ImgZh from '../../assets/page2.png';
import page2ImgEn from '../../assets_english/page2.png';
import page3ImgZh from '../../assets/page3.png';
import page3ImgEn from '../../assets_english/page3.png';
import page4ImgZh from '../../assets/page4.png';
import page4ImgEn from '../../assets_english/page4.png';
import beforeImgZh from '../../assets/before.png';
import beforeImgEn from '../../assets_english/before.png';
import nextImgZh from '../../assets/next.png';
import nextImgEn from '../../assets_english/next.png';

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
  {
    name: {
      zh: '1952年，华东军政委员会民政部关于《城市居民委员会经费收支情况调查摘要》',
      en: `Summary of the Survey on Revenue and Expenditure of Urban Neighborhood Committees issued by the Ministry of Civil Affairs of the East China Military and Political Committee, 1952`
    },
    url: chubujianli13,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '上海市居民委员会调查综合报告',
      en: `Comprehensive survey report on neighborhood committees in Shanghai`
    },
    url: chubujianli11,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1954年，山东省张周市（现淄博市张店区、周村区）建立居民委员会试点工作总结',
      en: `Summary report on the pilot program of establishing neighborhood committees in Zhangzhou, Shandong Province (now Zhangdian District and Zhoucun District in Zibo), 1954`
    },
    url: chubujianli6,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1952年，广州市金华街干部群众组织起来整治街内卫生',
      en: `In 1952, the cadres and residents of Jinhua Street in Guangzhou organized `
    },
    url: chubujianli2,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1952年，华东军政委员会制定了第一个行政大区试点方案——《关于10万人口以上城市建立居民委员会试行方案（草案）》',
      en: `In 1952, the East China Military and Political Committee formulated the first pilot plan at the administrative region level — the Draft Trial Plan for Establishing Neighborhood Committees in Cities with a Population of Over 100,000`
    },
    url: chubujianli1,
    from: 'chubujianli'
  },
  {
    name: {
      zh: `彭真同志向毛主席和中共中央报送“城市应建立街道办事处和居民委员会”报告的节录`,
      en: `An excerpt from Comrade Peng Zhen's report to Mao Zedong and the Central Committee of the Communist Party of China on the establishment of street offices and residents' committees in cities`
    },
    url: chubujianli16,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '城市街道办事处组织条例、城市居民委员会组织条例等条例单行本照片',
      en: `Photos of the separate editions of regulations such as the Organic Regulations of Urban Sub-district Offices and the Organic Regulations of Urban Neighborhood Committees`
    },
    url: chubujianli14,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1955年7月28日，辽宁省鞍山市出台《居民委员会生活补助费使用办法》的文件',
      en: `Document on the Measures for the Use of Living Subsidies for Urban Neighborhood Committees issued by the City of Anshan, Liaoning Province on July 28, 1955`
    },
    url: chubujianli7,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1953年，居民委员会发放的杭州居民购粮证',
      en: '1953, Grain Purchase Certificate for Hangzhou Residents Issued by Resident Committee'
    },
    url: chubujianli3,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1954年，广东省珠江区水上居民参加全国第一次普选',
      en: '1954, Water Residents in Zhujiang District, Guangdong Province Participated in the First National General Election'
    },
    url: chubujianli5,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '1955年，山东省潍坊市潍城区南关西南关居民委员会开展青少年教育活动',
      en: '1955, Youth Education Activities Carried out by Nanguan Southwest Gate Resident Committee, Weicheng District, Weifang City, Shandong Province'
    },
    url: chubujianli8,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '时任上城区区公所区长田奎荣',
      en: 'Tian Kuirong, then District Mayor of Shangcheng District'
    },
    url: chubujianli9,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '《上海市委关于一九五四年全市进行里弄整顿工作的决定》',
      en: `Decision of the Shanghai Municipal Committee regarding the citywide neighborhood reorganization work in 1954`
    },
    url: chubujianli10,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '五十年代，上海市居民委员会工作的照片（上海市黄浦区宝兴里家庭妇女捐寒衣救济灾民。上海市黄浦区宝兴里居民委员会工作剪影。上海市老闸区汇中里、曲江里居民委员会慰问军烈属）',
      en: `  Photographs of the work of Shanghai's neighborhood committees in the early 1950s (Housewives in Baoxing Lane, Huangpu District, Shanghai, donating winter clothes to disaster victims.  A glimpse into the work of the Baoxing Lane Neighborhood Committee in Huangpu District, Shanghai during that period.  The Huizhong Lane and Qujiang Lane Neighborhood Committees in Laoza District, Shanghai, visiting and comforting families of martyrs and soldiers.)`
    },
    url: chubujianli12,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '居民群众积极参加居民委员会选举，行使当家作主权利。图为1956年安徽省合肥市居民群众核对选民榜情景',
      en: 'Residents actively participating in Resident Committee elections, exercising their rights as masters of the country. Photo shows residents checking the voter list in Hefei, Anhui Province in 1956'
    },
    url: chubujianli15,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '时任中共杭州市委书记、市长江华',
      en: 'Jiang Hua, then Secretary of the CPC Hangzhou Municipal Committee and Mayor of Hangzhou'
    },
    url: chubujianli17,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '新中国第一个居民委员会首任主任陈福林',
      en: 'Chen Fulin, the First Director of the First Neighborhood Committee of New China'
    },
    url: chubujianli18,
    from: 'chubujianli'
  },
  {
    name: {
      zh: '黑龙江省哈尔滨街道居民委员会在新年期间，给朝鲜战场上的烈士家属家门口挂光荣灯',
      en: `    During the New Year period, the neighborhood committee in Harbin, Heilongjiang Province, hung "honorary lanterns" outside the homes of the families of martyrs who died in the Korean War`
    },
    url: chubujianli19,
    from: 'chubujianli'
  },

  // quzhefazhan 文件夹
  {
    name: {
      zh: '1957年1月，重庆市崇义街道九、十居民委员会全体治安干部合影',
      en: 'January 1957, Group photo of all security cadres of the 9th and 10th Resident Committees of Chongyi Street, Chongqing'
    },
    url: quzhefazhan1,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1959年，辽宁省鞍山市第十三居民委员会全体干部合影留念',
      en: `Group photo of all cadres from the 13th Neighborhood Committee of the City of Anshan, Liaoning Province, 1959`
    },
    url: quzhefazhan5,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1962年11月，《浙江省杭州市拱墅区人民委员会关于同意建立沈塘新村居民委员会的批复》',
      en: `Official Reply on Approving the Establishment of Shentangxincun Neighborhood Committee issued by the People's Committee of Gongshu District, Hangzhou, Zhejiang Province, November 1962`
    },
    url: quzhefazhan6,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1969年，内蒙古自治区呼和浩特市长和廊居民委员会开展批修整风活动',
      en: `In 1969, the Changhelang Neighborhood Committee in Hohhot, the Inner Mongolia Autonomous Region, carried out the movement of criticizing revisionism and rectifying work style`
    },
    url: quzhefazhan8,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1958年，广东省广州市广九街五居民委员会开展破除封建迷信活动，群众自觉交缴香炉',
      en: `In 1958, the Fifth Residents' Committee of Guangjiu Street in Guangzhou City, Guangdong Province, launched a campaign to eliminate feudal superstitions, and residents voluntarily handed over their incense burners`
    },
    url: quzhefazhan2,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1959年，江苏省无锡市和平区居民食堂',
      en: `1959 Residential Canteen in Heping District, Wuxi City, Jiangsu Province`
    },
    url: quzhefazhan3,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1959年，西藏自治区拉萨市西城区干部向雪居民委员会宣传三反双减（反叛乱、反乌拉、反奴役和减租减息）政策',
      en: `In 1959, cadres from Xicheng District, Lhasa City, Tibet Autonomous Region, publicized the policy of three antis and two reductions (anti-insurgency, anti-ulama, anti-slavery, and reduction of rent and interest) to the residents’ committee`
    },
    url: quzhefazhan4,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1963年，江苏省南京市举办歌颂三面红旗群众歌咏会场景',
      en: `Scenes of a mass singing meeting to praise the three red flags held in Nanjing, Jiangsu Province in 1963`
    },
    url: quzhefazhan7,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1975年，内蒙古自治区呼和浩特市长和廊居民委员会组织居民学习',
      en: `In 1975, the mayor of Hohhot in the Inner Mongolia Autonomous Region and the Lang Residents Committee organized residents to study`
    },
    url: quzhefazhan9,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1977年，浙江省杭州市上羊市街居民委员会成员免费向居民赠送腊八粥',
      en: `In 1977, members of the Shangyangshi Street Residents Committee in Hangzhou City, Zhejiang Province presented Laba porridge to residents for free`
    },
    url: quzhefazhan10,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1977年，重庆市西城四所居民委员会干部获奖留影',
      en: `In 1977, cadres of the four residents' committees in Xicheng, Chongqing took photos after receiving awards`
    },
    url: quzhefazhan11,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1978年，安徽省宁国县河力镇先代会西津居民委员会全体代表合影',
      en: `Group photo of all representatives of the Xijin Residents' Committee, Xiandaihui Township, Ningguo County, Anhui Province, 1978`
    },
    url: quzhefazhan12,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '1978年，重庆市敦仁街道麻柳嘴居民委员会组织居民开展学雷锋打扫卫生活动（呈组图摆放）',
      en: `In 1978, the Maliusui Neighborhood Committee of Dunren Street in Chongqing organized residents to carry out cleaning activities imitating Lei Feng (displayed in a group picture)`
    },
    url: quzhefazhan13,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '一组反映1968年至1978年吉林省延吉市新兴街道民安居民委员会的工作照片。①1968年新兴人民公社革命委员会成立。②1968年居民委员会举办第三产业为民服务。③1970年居民委员会委员们正在学习研究居民委员会工作。④1974年居民委员会干部与派出所民警一起巡逻。⑤居民委员会组织居民学习',
      en: `A set of photos reflecting the work of the Xinxing Street Min'an Residents Committee in Yanji City, Jilin Province from 1968 to 1978. ①In 1968, the Xinxing People's Commune Revolutionary Committee was established. ②In 1968, the residents committee organized the tertiary industry to serve the people. ③In 1970, members of the residents' committee were studying the work of the residents' committee. ④In 1974, residents' committee cadres and police station police patrolled together. ⑤The residents’ committee organizes residents’ studies`
    },
    url: quzhefazhan14,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '党的十一届三中全会，实现了新中国成立以来党的历史的伟大转折，中国进入了改革开放和社会主义现代化建设新时期。图为1978年12月18日至22日，党的十一届三中全会在北京举行',
      en: `The Third Plenary Session of the Eleventh Central Committee of the Communist Party of China achieved a great turning point in the history of the Party since the founding of New China. China has entered a new era of reform, opening up and socialist modernization. The picture shows the Third Plenary Session of the 11th Central Committee of the Communist Party of China held in Beijing from December 18 to 22, 1978`
    },
    url: quzhefazhan15,
    from: 'quzhefazhan'
  },
  {
    name: {
      zh: '六十年代初，黑龙江省哈尔滨市居民委员会代表开会情景',
      en: `A meeting of representatives of the residents’ committee in Harbin City, Heilongjiang Province in the early 1960s`
    },
    url: quzhefazhan16,
    from: 'quzhefazhan'
  },

  // huifu 文件夹
  {
    name: {
      zh: '1982年重新修订颁布的宪法中，首次以根本大法的形式明确了居民委员会的性质任务和作用。图为1982年《中华人民共和国宪法》',
      en: `In the revised constitution promulgated in 1982, the nature, tasks and functions of the residents' committees were clarified for the first time in the form of a fundamental law. The picture shows the 1982 Constitution`
    },
    url: huifu3,
    from: 'huifu'
  },
  {
    name: {
      zh: '1989年12月26日，第七届全国人民代表大会常务委员会第十一次会议通过《中华人民共和国城市居民委员会组织法》，标志着我国城市居民委员会的建设和发展，进入了一个新的全面发展的时期。图为1989年《中华人民共和国城市居民委员会组织法》',
      en: `On December 26, 1989, the 11th meeting of the Standing Committee of the Seventh National People's Congress passed the "Organic Law of Urban Residents' Committees of the People's Republic of China", marking that the construction and development of urban residents' committees in our country has entered a new period of comprehensive development. The picture shows the 1989 "Organic Law of Urban Residents' Committees"`
    },
    url: huifu4,
    from: 'huifu'
  },
  {
    name: {
      zh: '2009年12月21日，纪念《中华人民共和国城市居民委员会组织法》颁布实施二十周年座谈会在浙江省杭州市召开',
      en: 'December 21, 2009, Symposium commemorating the 20th anniversary of the promulgation and implementation of the "Organic Law of the Urban Resident Committees of the People\'s Republic of China" was held in Hangzhou, Zhejiang Province'
    },
    url: huifu6,
    from: 'huifu'
  },
  {
    name: {
      zh: '2010年10月28日，新中国第一个居民委员会成立61周年纪念大会暨上羊市街社区第七届邻居节隆重举行',
      en: 'October 28, 2010, The 61st Anniversary Celebration of the First Resident Committee in New China and the 7th Neighbor Festival of Shangyangshi Street Community were grandly held'
    },
    url: huifu8,
    from: 'huifu'
  },
  {
    name: {
      zh: '1979年，山东省潍坊市潍城区城关街道增福堂居民委员会办公会议',
      en: `1979 Office meeting of Zengfutang Residents Committee, Chengguan Street, Weicheng District, Weifang City, Shandong Province`
    },
    url: huifu1,
    from: 'huifu'
  },
  {
    name: {
      zh: '1982年，四川省成都市西城区（现青羊区）召开居民委员会先进集体、先进个人代表大会',
      en: `In 1982, Xicheng District (now Qingyang District), Chengdu City, Sichuan Province held a residents’ committee advanced collective and advanced individual representative conference`
    },
    url: huifu2,
    from: 'huifu'
  },
  {
    name: {
      zh: '1990年，广州市先进居民委员会、居民委员会先进工作者表彰大会',
      en: '1990, Commendation Conference for Advanced Resident Committees and Advanced Workers of Resident Committees in Guangzhou'
    },
    url: huifu5,
    from: 'huifu'
  },
  {
    name: {
      zh: `2009年12月25日，北京市“心系姐妹、情牵一线 ---- 96156‘姐妹驿站’公益服务热线开通仪式”。`,
      en: `December 25, 2009, Launch ceremony of Beijing "Care for Sisters, Connected by Love - 96156 'Sisters Station' Public Service Hotline"`
    },
    url: huifu7,
    from: 'huifu'
  },
  {
    name: {
      zh: '2010年11月10日，“非遗”文化社区体验站共建活动仪式在中国社区建设展示中心举行',
      en: 'November 10, 2010, Ceremony of co-construction activity of "Intangible Cultural Heritage" Community Experience Station held at China Community Construction Exhibition Center'
    },
    url: huifu9,
    from: 'huifu'
  },
  {
    name: {
      zh: '2010年5月3日，湖北省宜昌市西陵区廖家台社区组织开展青少年活动',
      en: 'May 3, 2010, Liaojiatai Community, Xiling District, Yichang City, Hubei Province organized youth activities'
    },
    url: huifu10,
    from: 'huifu'
  },
  {
    name: {
      zh: '广东省佛山市南海区罗湖社区举行学雷锋便民活动',
      en: 'Luohu Community, Nanhai District, Foshan City, Guangdong Province held Learn from Lei Feng convenience activities'
    },
    url: huifu11,
    from: 'huifu'
  },
  {
    name: {
      zh: '杭州市下城区积极推进社区老年食堂建设，图为武林街道“金叟园”社区老年食堂',
      en: 'Xiacheng District, Hangzhou actively promotes the construction of community elderly canteens. Photo shows "Jinsouyuan" Community Elderly Canteen in Wulin Street'
    },
    url: huifu12,
    from: 'huifu'
  },

  // xinshidai 文件夹
  {
    name: {
      zh: '中国共产党第十八次全国代表大会',
      en: 'The 18th National Congress of the Communist Party of China'
    },
    url: xinshidai9,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '第十二届全国人民代表大会第五次会议',
      en: 'The 5th Session of the 12th National People\'s Congress'
    },
    url: xinshidai11,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '《民法总则》',
      en: '"General Provisions of the Civil Law"'
    },
    url: xinshidai1,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2014年11月5日，青海省西宁市城北区建设巷社区联合小桥大街小学开展消防安全演练活动',
      en: 'November 5, 2014, Jianshexiang Community, Chengbei District, Xining City, Qinghai Province jointly launched fire safety drills with Xiaoqiao Street Primary School'
    },
    url: xinshidai2,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2017年1月25日，辽宁省大连市中山区青泥洼桥街道双合社区组织开展文明祭祀活动，居民、未成年人在“移风易俗，平安是福”展板上签名承诺',
      en: 'January 25, 2017, Shuanghe Community, Qingniwaqiao Street, Zhongshan District, Dalian City, Liaoning Province organized civilized sacrifice activities. Residents and minors signed on the "Change Customs, Safety is Blessing" display board'
    },
    url: xinshidai3,
    from: 'xinshidai'
  },
  {
    name: {
      zh: `2017年3月6日，湖北省宜昌市西陵区举行“百家宴活动”`,
      en: `March 6, 2017, "Hundred Families Feast" held in Xiling District, Yichang City, Hubei Province`
    },
    url: xinshidai4,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2017年5月24日，江苏省无锡市惠山区钱桥街道钱桥社区开展义诊活动',
      en: 'May 24, 2017, Qianqiao Community, Qianqiao Street, Huishan District, Wuxi City, Jiangsu Province carried out free medical consultation activities'
    },
    url: xinshidai5,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2018年2月27日，湖北省宜昌市夷陵区东平湖社区平湖国际小区以楼栋为单元由全体业主投票选举产生35名业主代表',
      en: 'February 27, 2018, Pinghu International Community, Dongpinghu Community, Yiling District, Yichang City, Hubei Province elected 35 owner representatives by voting of all owners based on buildings'
    },
    url: xinshidai6,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2022年5月19日，上羊市街社区居民骨干项目启动',
      en: 'May 19, 2022, Launch of Shangyangshi Street Community Resident Backbone Project'
    },
    url: xinshidai7,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '2023年2月23日，上羊市街社区居民共同商议袁井巷小区停车管理规定',
      en: 'February 23, 2023, Residents of Shangyangshi Street Community discussed parking management regulations for Yuanjingxiang Residential Area'
    },
    url: xinshidai8,
    from: 'xinshidai'
  },
  {
    name: {
      zh: '广西壮族自治区玉林市玉州区南江街道玉铁社区联合志愿者举办幸福爱心超市扶贫直播活动',
      en: 'Yutie Community, Nanjiang Street, Yuzhou District, Yulin City, Guangxi Zhuang Autonomous Region jointly held a poverty alleviation live broadcast activity for Happy Love Supermarket with volunteers'
    },
    url: xinshidai10,
    from: 'xinshidai'
  }
];

const selectList = [
  {
    name: { zh: '初步建立阶段', en: 'Initial Development Stage' },
    period: { zh: '1949-1956年', en: '1949-1956' },
    top: 442,
    selectKey: 'select1'
  },
  {
    name: { zh: '探索与曲折发展阶段', en: 'Exploration and Tortuous \nDevelopment Stage' },
    period: { zh: '1956-1978年', en: '1956-1978' },
    top: 597,
    selectKey: 'page2'
  },
  {
    name: { zh: '恢复与发展阶段', en: ' Restoration and \nDevelopment Stage' },
    period: { zh: '1978-2012年', en: '1978-2012' },
    top: 752,
    selectKey: 'page3'
  },
  {
    name: { zh: '新时代创新发展阶段', en: 'The Innovative Development \nStage in the New Era' },
    period: { zh: '2012年至今', en: '2012-Present' },
    top: 907,
    selectKey: 'page4'
  },
]

const selectParams = {
  select1: {
    left: 60, top: 101, url: { zh: select1ImgZh, en: select1ImgEn }, downButtonLeft: 1390, downButtonTop: 875, upButtonTop: 815, upButtonLeft: 1330, beforeButtonTop: 850, beforeButtonRight: 1020
  },
  select2: {
    left: 60, top: 101, url: { zh: select2ImgZh, en: select2ImgEn }, downButtonLeft: 1125, downButtonTop: 875, upButtonTop: 815, upButtonLeft: 1330, beforeButtonTop: 850, beforeButtonRight: 1020
  },
  select3: {
    left: 60, top: 101, url: { zh: select3ImgZh, en: select3ImgEn }, downButtonLeft: 1390, downButtonTop: 805,
  },
  select4: {
    left: 60, top: 101, url: { zh: select4ImgZh, en: select4ImgEn }, downButtonLeft: 950, downButtonTop: 960,
  },
  page2: {
    left: 60, top: 101, url: { zh: page2ImgZh, en: page2ImgEn }, beforeButtonTop: 920, beforeButtonRight: 1020
  },
  page3: {
    left: 60, top: 101, url: { zh: page3ImgZh, en: page3ImgEn }, beforeButtonTop: 1000, beforeButtonRight: 1020
  },
  page4: {
    left: 60, top: 101, url: { zh: page4ImgZh, en: page4ImgEn }, beforeButtonTop: 886, beforeButtonRight: 1020
  },
}

// 动画时长配置（单位：毫秒）
const ANIMATION_DURATION = 150;

function Detail({ name, gallery, onBack, index = 'select1', language }) {
  const [selectedSelectKey, setSelectedSelectKey] = useState(index);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const galleryContainerRef = useRef(null);
  const page2Container1Ref = useRef(null);
  const page2Container2Ref = useRef(null);
  const page3ContainerRef = useRef(null);
  const [atLeft, setAtLeft] = useState(true);
  const [atRight, setAtRight] = useState(false);

  const [explanationMode, setExplanationMode] = useState(false);
  const [explanationStep, setExplanationStep] = useState(0); // 1-based index
  const EXPLANATION_STEPS = ['select1', 'select2', 'select3', 'select4', 'page2', 'page3', 'page4'];

  const localizedSelectList = selectList.map((item) => ({
    ...item,
    name: item.name[language],
    period: item.period[language]
  }));

  const localizedGalleryImages = galleryImages.map((item) => ({
    ...item,
    name: item.name[language],
  }));

  const detailBgImg = language === 'zh' ? detailBgImgZh : detailBgImgEn;
  const selectImg = language === 'zh' ? selectImgZh : selectImgEn;
  const beforeImg = language === 'zh' ? beforeImgZh : beforeImgEn;
  const nextImg = language === 'zh' ? nextImgZh : nextImgEn;

  const handleSpeekGo = () => {
    if (!explanationMode) {
      setExplanationMode(true);
      setExplanationStep(1);
      setSelectedSelectKey(EXPLANATION_STEPS[0]);
    } else {
      if (explanationStep < EXPLANATION_STEPS.length) {
        const nextStep = explanationStep + 1;
        setExplanationStep(nextStep);
        setSelectedSelectKey(EXPLANATION_STEPS[nextStep - 1]);
      } else {
        // Exit explanation mode
        setExplanationMode(false);
        setExplanationStep(0);
      }
    }
  };

  const handleSpeekBack = () => {
    if (explanationStep === 1) {
      setExplanationMode(false);
      setExplanationStep(0);
    } else if (explanationStep > 1) {
      const prevStep = explanationStep - 1;
      setExplanationStep(prevStep);
      setSelectedSelectKey(EXPLANATION_STEPS[prevStep - 1]);
    }
  };

  const getActiveScrollElement = () => {
    const el = (selectedSelectKey === 'select1' || selectedSelectKey === 'select2')
      ? galleryContainerRef.current
      : (selectedSelectKey === 'page2')
        ? page2Container1Ref.current
        : (selectedSelectKey === 'page3' || selectedSelectKey === 'page4')
          ? page3ContainerRef.current
          : null;
    return el;
  };

  const updateEdges = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtLeft(el.scrollLeft <= 0);
    setAtRight(el.scrollLeft >= Math.max(0, max - 1));
  };

  useEffect(() => {
    setSelectedSelectKey(index);
  }, [index]);

  useEffect(() => {
    if ((selectedSelectKey === 'select1' || selectedSelectKey === 'select2') && galleryContainerRef.current) {
      if (selectedSelectKey === 'select2') {
        galleryContainerRef.current.scrollLeft = 1821;
      } else {
        galleryContainerRef.current.scrollLeft = 0;
      }
      updateEdges();
    }
    if (selectedSelectKey === 'page2') {
      if (page2Container1Ref.current) {
        page2Container1Ref.current.scrollLeft = 0;
      }
      if (page2Container2Ref.current) {
        page2Container2Ref.current.scrollLeft = 0;
      }
      updateEdges();
    }
    if ((selectedSelectKey === 'page3' || selectedSelectKey === 'page4') && page3ContainerRef.current) {
      page3ContainerRef.current.scrollLeft = 0;
      updateEdges();
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

    const handleScroll = (e) => {
      updateEdges();
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

  const selectedItem = localizedSelectList.find(item => item.selectKey === selectedSelectKey) || localizedSelectList[0];
  const currentImageParam = selectParams[selectedSelectKey];

  // 判断文字是否可能换行（估算：324px宽度，16px字体，大约可容纳15-18个中文字符）
  const isMultiLine = (text) => {
    // 粗略估算：如果文字长度超过18个字符，可能换行
    // 英文大约 2 倍字符数
    return language === 'zh' ? text.length > 18 : text.length > 36;
  };



  // 根据 selectKey 获取对应的图片列表
  const getImagesBySelectKey = (selectKey) => {
    if (selectKey === 'select1' || selectKey === 'select2') {
      return localizedGalleryImages.filter(img => img.from === 'chubujianli');
    }
    if (selectKey === 'page2') {
      return localizedGalleryImages.filter(img => img.from === 'quzhefazhan');
    }
    if (selectKey === 'page3') {
      return localizedGalleryImages.filter(img => img.from === 'huifu');
    }
    if (selectKey === 'page4') {
      return localizedGalleryImages.filter(img => img.from === 'xinshidai');
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
      }, ANIMATION_DURATION);
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

    if (newKey) {
      handleSelectClick(newKey);
    }
  };

  const handlePrev = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const step = 4 * (324 + 40);
    el.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const step = 4 * (324 + 40) + 4;
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (selectedSelectKey === 'select3' || selectedSelectKey === 'select4') {
      handleSelectClick('select1');
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
    <div className={`detail-page ${isTransitioning ? 'page-transitioning' : ''}`} style={{
      backgroundImage: `url(${detailBgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '--transition-duration': `${ANIMATION_DURATION}ms`
    }}>
      <div className="select-image" style={{ top: `${selectedItem.top}px` }}>
        <img src={selectImg} alt="select" />
        <div className="select-text">
          <div className={`select-text-line1 ${language === 'en' ? 'en' : ''}`}>{selectedItem.name}</div>
          <div className={`select-text-line2 ${language === 'en' ? 'en' : ''}`}>{selectedItem.period}</div>
        </div>
      </div>
      {currentImageParam && (
        <img
          src={currentImageParam.url[language]}
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
            width: '200px',
            height: '65px',
            top: '815px',
            left: "1330px"
          }}
        />
      )}
      {currentImageParam && currentImageParam.downButtonLeft && (
        <div
          className='downButton'
          onClick={handleDownButtonClick}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            left: `${currentImageParam.downButtonLeft}px`,
            top: `${currentImageParam.downButtonTop}px`,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            // background: 'red'
          }}
        />
      )}
      {(selectedSelectKey === 'select1' || selectedSelectKey === 'select2') && (
        <div
          ref={galleryContainerRef}
          style={{
            position: 'absolute',
            left: '50px',
            top: '460px',
            width: '1440px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="slides-container"
        >
          <div className="gallery-images-list">
            {(() => {
              const images = getImagesBySelectKey(selectedSelectKey);
              const firstThree = images.slice(0, 3);
              const rest = images.slice(3);

              return (
                <>
                  {firstThree.map((img, index) => {
                    const multiLine = isMultiLine(img.name);
                    return (
                      <div key={img.url} className="wide-item-wrapper">
                        <div className="gallery-image-item">
                          <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="gallery-image"
                            />
                          </div>
                          <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                            {img.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {rest.map((img, index) => {
                    const multiLine = isMultiLine(img.name);
                    return (
                      <div key={img.url} className="gallery-image-item">
                        <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="gallery-image"
                          />
                        </div>
                        <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                          {img.name}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page2') && (
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
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page3') && (
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 575 }}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              if (index === 2) {
                return (
                  <div key={index} className="double-slot">
                    <div className="gallery-image-item">
                      <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="gallery-image"
                        />
                      </div>
                      <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                        {img.name}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
      {(selectedSelectKey === 'page4') && (
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 520 }}>
          <div className="gallery-images-list page4">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              const isFirstTwo = index < 2;
              if (isFirstTwo) {
                const containerAlign = index === 0 ? 'align-right' : 'align-left';
                return (
                  <div key={index} className={`double-slot ${containerAlign}`}>
                    <div className="gallery-image-item">
                      <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="gallery-image"
                        />
                      </div>
                      <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                        {img.name}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
      {currentImageParam && currentImageParam.beforeButtonTop && (
        <>
          <img
            src={beforeImg}
            alt="prev"
            onClick={handlePrev}
            style={{
              position: 'absolute', width: 125, height: 60,
              right: (currentImageParam.beforeButtonRight + 125), top: currentImageParam.beforeButtonTop,
              cursor: 'pointer', userSelect: 'none',
              opacity: atLeft ? 0.5 : 1,
            }}
          />
          <img
            src={nextImg}
            alt="next"
            onClick={handleNext}
            style={{
              position: 'absolute', width: 125, height: 60,
              right: currentImageParam.beforeButtonRight, top: currentImageParam.beforeButtonTop,
              cursor: 'pointer', userSelect: 'none',
              opacity: atRight ? 0.5 : 1,
            }}
          />
        </>
      )}
      {explanationMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 9, background: 'rgba(0,0,0,0)'
        }} onClick={(e) => e.stopPropagation()}></div>
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
