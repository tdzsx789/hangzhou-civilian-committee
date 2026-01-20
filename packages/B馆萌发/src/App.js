import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail1 from './pages/Detail1';
import Detail2 from './pages/Detail2';
import Detail3 from './pages/Detail3';

const list = {
  '2003年初': {
    text: {
      zh: `2003年初，浙江省委、省政府按照党的十六大提出的统筹城乡发展的要求，顺应农民群众的新期盼，作出了实施“千村示范、万村整治”工程的重大决策。时任省委书记习近平同志提出，要“用城市社区建设的理念指导农村新社区建设，抓好一批全面建设小康示范村镇”，“使农村与城市的生活质量差距逐步缩小，使所有人都能共享现代文明”。`,
      en: `In early 2003, the CPC Zhejiang Provincial Committee and People’s Government of Zhejiang Province, in accordance with the requirements of the 16th National Congress of the CPC to coordinate urban and rural development and in response to the new expectations of farmers, made the major decision to implement the "One Thousand Villages Demonstration, Ten Thousand Villages Renovation" project. Comrade Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee, proposed that "the concept of urban community development should guide the development of new rural communities, focusing on a number of demonstration villages and towns for comprehensive well-off society," and "gradually narrow the quality-of-life gap between rural and urban areas, enabling everyone to share in modern civilization."`
    }
  },
  '2003年4月12日': {
    text: {
      zh: `2003年4月12日，时任浙江省委书记习近平第一次来到杭州市西湖区翠苑一区社区。翠苑一区社区党委当时是保持共产党员先进性教育活动的试点，也是习近平同志的联系点。习近平同志亲自作了动员讲话并进行走访调研。动员会上习近平同志强调，在先进性教育活动中，要牢牢抓住“三个代表”重要思想这一主线，坚持用党的最新理论成果武装头脑，不断增强广大党员的原动力；始终坚持着力提高群众满意度这一主旨，不断增强广大群众的向心力；紧紧围绕加快发展这一主题，不断增强推进事业的创造力。习近平同志提出了“三主三力”的重要指示：“主题、主线、主旨，向心力、创造力、原动力”。`,
      en: `On April 12, 2003, Comrade Xi Jinping, then Secretary of the  CPC Zhejiang Provincial Committee, visited Cuiyuanyiqu Community in Xihu District, Hangzhou, for the first time. At the time, the CPC Committee of Cuiyuanyiqu Community was a pilot site for the education campaign to maintain the advanced nature of Communist Party members and also a contact point for Comrade Xi Jinping. Comrade Xi Jinping personally delivered a mobilization speech and conducted inspections and surveys. During the mobilization meeting, Comrade Xi Jinping emphasized that in the education campaign to maintain advanced nature, it was essential to firmly grasp the main line of the important thought of "Three Represents," persistently arm minds with the Party’s latest theoretical achievements, and continuously enhance the driving force of Party members. He stressed the need to always focus on improving public satisfaction as the core purpose, continuously strengthening the centripetal force of the masses, and closely centering on the theme of accelerating development to continuously enhance the creative force in advancing the cause. Comrade Xi Jinping put forward the important directive of the "Three Main Elements and Three Core Forces": Theme, Main Line, Core Purpose; Centripetal Force, Creative Force, Driving Force`
    }
  },
  '2003年4月17日':{
    text: {
      zh: `2003年4月17日，时任浙江省委书记的习近平同志主持召开全省城市社区工作会议。他作了题为《以建设新型社区为目标 全面提高城市社区工作水平》的重要讲话，强调社区工作是一项全新的社会系统工程，必须提供坚强有力的组织保证：一要加强组织领导，保证社区建设有序推进；二要注重分类指导，突出社区工作特色；三要总结推广典型，不断深化社区工作。他将党的十六大之后的一个时期浙江省城市社区工作的主要任务概括为“八个进一步”：一要进一步提高对城市社区工作重要性的认识；二要进一步深化城市社区体制改革；三要进一步加强城市社区民主自治建设；四要进一步强化城市社区服务功能；五要进一步完善城市社区基础设施；六要进一步开展创建城市文明社区活动；七要进一步加强城市社区党的建设；八要进一步培育高素质的城市社区工作者队伍。`,
      en: `On April 17, 2003, Comrade Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee, presided over the provincial urban community work conference. He delivered an important speech titled Building New-Type Communities and Comprehensively Raise the Standard of Urban Community Work, emphasizing that community work is a brand-new social system project that requires strong organizational guarantees: First, strengthen organizational leadership to ensure orderly progress in community development; second, pay attention to classified guidance to highlight the characteristics of community work; third, summarize and promote typical cases to continuously deepen community work. He summarized the main tasks of urban community work in Zhejiang Province after the 16th National Congress of the CPC as the "Eight Furthers": First, further improve the understanding of the importance of urban community work; second, further deepen the reform of the urban community system; third, further strengthen the development of urban community democratic self-governance; fourth, further enhance the service functions of urban communities; fifth, further improve urban community infrastructure; sixth, further carry out activities to create civilized urban communities; seventh, further strengthen Party building in urban communities; eighth, further cultivate a high-quality urban community workforce.`
    }
  },
  // '2003年4月24日': {
  //   text: '2003年4月24日，时任浙江省委书记习近平第一次来到下姜村，见到散乱的山村模样，就指出要开展布局优化、道路硬化、村庄绿化、路灯亮化、卫生洁化、河道净化的“六化”建设。下姜村在习近平手把手的指导下，在实施“千万工程”建设美丽乡村过程中率先垂范，勇打头阵。通过实施沼气生态示范村建设、生活污水纳管工程、河道清理工程、农房改造工程、畜禽养殖污染治理、垃圾分类固废处理，全力推进村庄美化、村道硬化、路灯亮化等一系列农村人居环境综合整治，使下姜村家家户户的“盆景”汇聚成全村的美丽风景。村容越来越靓丽，人居环境实现重塑，治理效能飞速提升。'
  // },
  '2003年5月23日': {
    text: {
      zh: `2003年5月23日，时任浙江省委书记习近平第二次亲临翠苑一区指导社区保持共产党员先进性教育活动工作。在座谈会上他指出，要充分认识先进性教育的重要性，始终保持坚定和自觉，要认识党员先进性的标准，开展党员分析和民主评议；通过先进性活动，加强基层组织建设，充分发挥基层组织的战斗力和党员的先锋模范作用，把广大群众带动好、调动好、发挥好，不断增强推进事业发展的创造力，做好抗击非典、促进发展工作。习近平同志要求社区一定要多多关心老年人的生活，要为老同志多做一些工作。正因为习近平同志的要求，社区筹建了老托所和全省第一家老年食堂。`,
      en: `On May 23, 2003, Comrade Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee, personally visited Cuiyuanyiqu Community for the second time to guide the work of the Party members’ advanced education activities. At a symposium, he pointed out that it is necessary to fully recognize the importance of advanced education, always maintain firmness and consciousness, understand the standards of Party members’ advanced nature, and carry out Party member analysis and democratic evaluation; through advanced activities, strengthen the development of grassroots organizations, give full play to the combat effectiveness of grassroots organizations and the vanguard and exemplary role of Party members, mobilize, guide, and leverage the masses well, continuously enhance the creativity to promote career development, and excel in both the fight against SARS and the drive for development. Comrade Xi Jinping urged the community to show more care for the lives of the elderly and to do more work for senior comrades. In response to Comrade Xi Jinping’s request, the community established an elderly care center and the province’s first canteen for the elderly.`
    }
  },
  '2003年6月': {
    text: {
      zh: `2003年6月，“千村示范、万村整治”工程启动，美丽乡村建设序幕拉开。期间，习近平同志七到基层联系点淳安县下姜村，八下丽水乡镇，多次登上舟山群岛。至2007年，全省10303个建制村得到整治，其中1181个建制村建设成为“全面小康建设示范村”。`,
      en: `In June 2003, the "One Thousand Villages Demonstration, Ten Thousand Villages Renovation" project was launched, raising the curtain on the Beautiful Countryside Initiative. During this period, Comrade Xi Jinping visited the grassroots contact point of Xiajiang Village in Chun’an County seven times, traveled to rural areas in Lishui eight times, and made multiple trips to the Zhoushan Islands. By 2007, 10,303 administrative villages across the province had undergone renovation, with 1,181 of them being designated as "Demonstration Villages for Comprehensive Well-off Society Construction."`
    }
  },
  '2003年6月23日': {
    text: {
      zh: `2003年6月23日，时任浙江省委书记习近平第三次来到翠苑一区社区。当时正是“非典”时期，习近平同志号召广大党员，要忠实履行全心全意为人民服务的宗旨，一切以人民的利益为重，做到情为民所系、权为民所用、利为民所谋。他实地察看了建设中的托老所和老年食堂，参加了第六支部党员大会。会上习近平同志再次强调“三主三力”，提出了“民有所呼、我有所应，民有所呼、我有所为”的要求。`,
      en: `On June 23, 2003, Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee visited Cuiyuanyiqu Community for the third time. During the SARS outbreak, Comrade Xi Jinping called on Party members to faithfully uphold the fundamental tenet of serving the people wholeheartedly, prioritizing the people’s interests, and ensuring that affections are tied to the people, power is used for the people, and benefits are shared with the people. He inspected the construction of the elderly care center and senior canteen and attended the Sixth Party Branch meeting. At the meeting, Comrade Xi Jinping reiterated the "Three Main Elements and Three Core Forces" and put forward the requirement to "respond to what the people call for and take action to address their needs."`
    }
  },
  '2003年9月18日': {
    text: {
      zh: `2003年9月18日，时任浙江省委书记习近平在浙江工作期间，面对浙江群众信访总量居高不下的复杂形势，要求在全省实施领导下访接待群众制度。他第一次下访选择了浦江县，开创省级领导下访先河。此后，浦江等地迭代优化下访接访工作体系，形成了以“变群众上访为领导下访，深入基层，联系群众，真下真访民情，实心实意办事”等为主要内容的重要经验，成为改善干群关系、加强基层治理的生动实践。`,
      en: `On September 18, 2003, during his tenure as Secretary of the CPC Zhejiang Provincial Committee, Comrade Xi Jinping, faced with the complex situation of a persistently high number of public petitions and appeals in the province, mandated a province-wide implementation of a system whereby leading officials go to the grassroots to meet with and hear the public. He chose Pujiang County for his first petition reception, pioneering the practice of provincial-level leaders going directly to the grassroots. Subsequently, Pujiang and other areas iteratively optimized the petition reception system, which has shifted from "receiving public petitions passively into paying personal visits proactively," and formed an ethos of going to the grassroots, connecting with the people, genuinely understanding public sentiment, and sincerely addressing their concerns. This became a vivid example of improving cadre-mass relations and strengthening grassroots governance.`
    }
  },
  '2003年9月24日': {
    text: {
      zh: `2003年9月24日，时任浙江省委书记习近平在宁波市鄞州区下应街道湾底村调研“千村示范、万村整治”工作时，强调必须把村庄整治与发展经济结合起来，与治理保护农村生态环境结合起来，走出一条以城带乡、以工促农、城乡一体化发展的新路子。`,
      en: `On September 24, 2003, Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee, emphasized during his research on the "One Thousand Villages Demonstration, Ten Thousand Villages Renovation" Project in Wandi Village, Xiaying Subdistrict, Yinzhou District, Ningbo City, that village renovation must be combined with economic development and the conservation of the rural eco-environment. He called for a new path of urban-rural integration, where cities drive rural development and industry promotes agriculture.`
    }
  },
  '2003年10月2日': {
    text: {
      zh: `2003年10月2日，时任浙江省委书记习近平在回复翠苑一区社区党委信中写道，“杭州市保持共产党员先进性教育活动试点工作已圆满结束，但保持共产党员先进性是一项长期的任务”，并提出“希望你们忠实履行全心全意为人民服务的宗旨，努力为群众办实事、办好事，切实帮助群众排忧解难，真正做到对群众的呼声有所应、有所为”。`,
      en: `On October 2, 2003, Xi Jinping, then Secretary of the CPC Zhejiang Provincial Committee, in his reply letter to the Committee of Cuiyuanyiqu Community, he said the pilot work of the CPC members’ advanced education campaign in Hangzhou has been successfully completed, but maintaining the advanced nature of CPC members is a long-term task. He expressed his hope that CPC members will faithfully uphold the fundamental tenet of serving the people wholeheartedly, strive to do practical and good things for the masses, genuinely help them solve difficulties, and truly respond to and act on their voices.`
    }
  },
  '2003年11月': {
    text: {
      zh: `2003年11月，时任浙江省委书记习近平在纪念毛泽东同志“枫桥经验” 批示40周年暨创新“枫桥经验”大会上，强调要把“枫桥经验”贯穿于“平安浙江”建设始终，努力做到小事不出村、大事不出乡、矛盾不上交，促进社会和谐稳定。`,
      en: `In November 2003, at the conference commemorating the 40th anniversary of Comrade Mao Zedong’s instruction on the "Fengqiao Experience" and innovating the "Fengqiao Experience," Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, emphasized that the "Fengqiao Experience" should be consistently applied in the construction of a "Safe Zhejiang." He called for efforts to ensure that minor issues are resolved at the village level, major issues at the township level, and no conflicts are escalated to higher authorities, thereby promoting social harmony and stability.`
    }
  },
  '2003年12月19日': {
    text: {
      zh: `2003年12月19日，时任浙江省委书记习近平到杭州市上城区小营巷社区调研爱国卫生运动工作。调研期间，习近平同志察看了当年毛主席检查有没有蚊子幼虫的水缸盖子，并指出：毛主席当年如此重视卫生工作，各级党的干部更加要把人民生命安全和身体健康摆在心里。在随后召开的座谈会上，他提出“没有人民的健康，就没有全面的小康”的重要论断。强调“要做实一件事，赢得万人心”，要求认真总结卫生工作的好做法、好经验，推进公共卫生建设各项工作，努力建设全覆盖、高效率、现代化的公共卫生体系。`,
      en: `On December 19, 2003, Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, visited Xiaoyingxiang Community in Shangcheng District, Hangzhou City, to inspect the patriotic health campaign. During his visit, Comrade Xi Jinping inspected the cover of the water vat where Chairman Mao had checked for mosquito larvae. He pointed out that Chairman Mao attached such importance to health work back then, so Party cadres at all levels must place the people’s life safety and physical health in their hearts. At a subsequent symposium, he put forward an important assertion that without the health of the people, there can be no comprehensive well-off society. He required every cadre to execute a task solidly and gain widespread recognition. He also called them thoroughly review effective practices and experiences in health work, advance various tasks in public health, and strive to build a comprehensive, efficient, and modern public health system.`
    }
  },
  '2005年6月': {
    text: {
      zh: `1999年，温岭市松门镇出现干部与群众平等对话、协商重要事项的“民主恳谈”形式。2004年6月，习近平同志到台州市调研时关注到这一“民间创举”。2005年6月，他到温岭市松建村调研，对当地通过“民主恳谈”推动新农村建设成效予以充分肯定。此后，“民主恳谈”不断深化创新，从乡村推广到企业，用于解决劳资矛盾等问题。`,
      en: `In 1999, Songmen Town in Wenling City introduced the "Democratic Consultation" initiative, where officials and the public engaged in equal dialogues to negotiate important matters. In June 2004, Comrade Xi Jinping took note of this "Grassroots Initiative" during his research trip to Taizhou. In June 2005, he visited Songjian Village in Wenling City for research and fully affirmed the local achievements in advancing new rural development through "Democratic Consultation." Since then, "Democratic Consultation" have been continuously optimized and gradually generalized from rural areas to enterprises to address issues such as labor disputes.`
    }
  },
  '2004年8月4日': {
    text: {
      zh: `2004年8月4日，时任浙江省委书记习近平在浙江省委建设“平安浙江”领导小组第一次全体会议上再次强调，要把创新发展“枫桥经验”作为总抓手，贯穿于建设“平安浙江”的始终。`,
      en: `On August 4, 2004, Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, reiterated at the first plenary meeting of the "Safe Zhejiang" Leading Group that the innovative development of the "Fengqiao Experience" should serve as the overarching approach, applied throughout the construction of a "Safe Zhejiang."`
    }
  },
  '2005年1月4日': {
    text: {
      zh: `2005年1月4日，时任浙江省委书记习近平来到小古城村调研“三农”工作，肯定了“村里的事情大家商量着办”的做法，鼓励加强基层民主法治建设。小古城村此前由三村合并而成，面临诸多矛盾，通过村民小组协商，解决了新建村道等难题。此后，小古城村将这一模式应用于乡村旅游等领域，形成了公益事业项目申报制等一系列制度，推动了村庄发展。`,
      en: `On January 4, 2005, Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, visited Xiaogucheng Village to inspect the "agriculture, rural areas, and farmers" work. He affirmed the practice of "village matters subject to negotiation among villagers" and encouraged strengthened development of grassroots democracy and the rule of law. Xiaogucheng Village, formed by three villages through a merge, was faced with numerous conflicts. Through consultations among villager groups, challenges such as constructing new village roads were resolved. Subsequently, Xiaogucheng Village applied this model to areas like rural tourism. Thanks to this model, a series of systems such as the public welfare project application mechanism were introduced, driving village development.`
    }
  },
  '2005年6月17日': {
    text: {
      zh: `2005年6月17日，时任浙江省委书记习近平同志到金华市武义县后陈村调研村务公开民主管理工作，充分肯定后陈做法，明确指出村务监督委员会“是农村基层民主的有益探索，是积极的，有意义的，符合基层民主管理的大方向”。`,
      en: `On June 17, 2005, Comrade Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, visited Houchen Village in Wuyi County, Jinhua, to inspect village affairs transparency and democratic management. He fully affirmed the practices of Houchen Village and clearly stated that the Village Affairs Supervision Committee is a beneficial exploration for rural grassroots democracy, is a proactive and meaningful practice, and aligns with the general direction of grassroots democratic management.`
    }
  },
  '2005年8月15日': {
    text: {
      zh: `2005年8月15日，时任浙江省委书记习近平同志到安吉县余村进行调研，当听到村里下决心关掉石矿，停掉水泥厂，习近平同志给予高度肯定，称这是高明之举。这次调研中他提出了“两山理论”：“绿水青山就是金山银山。我们过去讲既要绿水青山，也要金山银山，实际上绿水青山就是金山银山”。`,
      en: `On August 15, 2005, Comrade Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, paid a study visit to Yu Village in Anji County. Upon hearing the village’s decision to shut down the stone quarry and cement plant, Comrade Xi Jinping gave high praise, calling it a wise move. During his visit, he proposed the "Two Mountains Theory." He said: "Lucid waters and lush mountains are invaluable assets. We used to say that we want both lucid waters and lush mountains as well as mountains of gold and silver. In fact, lucid waters and lush mountains are mountains of gold and silver."`
    }
  },
  '2005年8月26日': {
    text: {
      zh: `2005年8月26日，时任浙江省委书记习近平亲赴浙江省民政厅调研，在充分肯定浙江民政工作的基础上，对浙江民政工作提出殷切期望。他强调浙江民政工作要按照“干在实处、走在前列”的要求，增强责任感，牢固树立为民、爱民、利民、助民、系民的民本思想，时刻把人民群众的安危和冷暖放在心上，全心全意为人民群众办实事办好事，脚踏实地为人民群众排忧解难，切实维护好人民群众的基本生活权益和民主政治权利，使人民群众真正感受到党和政府的关怀与温暖。`,
      en: `On August 26, 2005, Comrade Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, personally visited the Zhejiang Provincial Department of Civil Affairs for research. While fully affirming the achievements of Zhejiang’s civil affairs work, he expressed earnest expectations for its future. He emphasized that Zhejiang’s civil affairs work should follow the requirement of "Act with concrete efforts and strive to be in the forefront," enhance the sense of responsibility, firmly establish a people-centered ideology of serving, loving, benefiting, assisting, and connecting with the people, always keep the safety and well-being of the people in mind, wholeheartedly do practical and good things for the people, diligently resolve difficulties for the people, and effectively safeguard the basic living rights and democratic political rights of the people, so that the people truly feel the care and warmth of the Party and the government.`
    }
  },
  '2006年6月13日': {
    text: {
      zh: `2006年6月13日，时任浙江省委书记习近平同志视察了金华市磐安县玉山镇古茶场和尖山镇管头村，围绕新农村建设，他在古茶场视察时一再嘱咐：要保护开发好古茶场，在保护中利用，在开发中继续弘扬。在视察管头村时，他提出要加大对古村的保护，做好生态经济。`,
      en: `On June 13, 2006, Comrade Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, inspected the Ancient Tea Plantation in Yushan Town, and Guantou Village in Jianshan Town, Pan’an County, Jinhua. Revolving around the topic of new countryside construction, he repeatedly told the local government to preserve and promote the Ancient Tea Plantation while exploiting it. During his inspection of Guantou Village, he stressed the need to enhance the preservation of ancient villages and develop the ecological economy.`
    }
  },
  '2006年8月16日': {
    text: {
      zh: `2006年8月16日，时任浙江省委书记习近平到开化县华埠镇金星村调研，嘱托金星村村民：“新农村建设一定要把经济搞上去，为群众办实事。人人有事做，家家有收入，这就是新农村”。`,
      en: `On August 16, 2006, Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, conducted field research in Jinxing Village, Huabu Town, Kaihua County. He urged the villagers to boost the economy and deliver tangible benefits to the people during new countryside construction. He pointed out that a new countryside is when everyone has work to do and every household has a source of income.`
    }
  },
  '2006年8月29日至30日': {
    text: {
      zh: `2006年8月29日至30日，时任浙江省委书记习近平在台州调研时强调，加强基层建设和基层工作，始终是我们党的建设和政府工作的根本基础和重要方面。乡镇换届工作和农村综合改革是当前基层建设和基层工作中的重点工作。各级党委、政府和领导干部一定要高度重视，敢于负责，扎实做好工作，进一步加强乡镇基层建设，为创建和谐新农村提供重要保证。他强调，要从事关全局、事关长远的高度，充分认识做好乡镇换届工作的重要性，明确任务，严格要求，把加强党的领导、充分发扬民主和严格依法办事有机结合起来，坚持按照思想政治素质过硬的要求选拔使用干部，着力选好配强班子“一把手”与增强班子整体功能的统一，选派精兵强将充实到乡镇领导班子，为新农村建设与构建和谐社会提供坚强的组织保证。`,
      en: `From August 29 to 30, 2006, Xi Jinping, then Secretary of the Zhejiang Provincial Party Committee, during his visit in Taizhou, emphasized that strengthening grassroots construction and grassroots work has always been the fundamental foundation and crucial aspect of the Party’s building and government work. Township government elections and leadership reshuffles and comprehensive rural reforms are the key tasks in current grassroots construction and work. Party committees, governments, and leading officials at all levels must attach great importance to these tasks, take responsibility, and carry out the work diligently to further strengthen grassroots construction in townships, providing a vital guarantee for building a harmonious new rural area. He stressed the need to recognize the importance of township government elections and leadership reshuffles from a strategic and long-term perspective, clarify tasks, set strict requirements, and integrate the Party’s leadership, full democratic participation, and strict adherence to legal procedures. Efforts should focus on selecting and appointing cadres who meet high ideological and political standards, striving to achieve unity between selecting and appointing competent first-in-charge leaders for teams, enhancing the overall effectiveness of these teams, selecting and assigning capable and outstanding personnel to strengthen township leadership teams, thereby providing a solid organizational guarantee for new countryside construction and social harmony.`
    }
  }
}

function App() {
  
    // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);

  // 使用原生事件监听器，设置 passive: false 以允许 preventDefault
  useEffect(() => {
    const buttonElement = redButtonRef.current;
    if (!buttonElement) return;

    // 处理触摸双击检测（1秒内两次touchstart）
    const handleRedButtonTouch = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentTime = Date.now();
      if (currentTime - lastTouchTimeRef.current < 1000 && lastTouchTimeRef.current > 0) {
        // 双击检测成功
        setShowPasswordInput(true);
        setPasswordInput('');
        lastTouchTimeRef.current = 0;
      } else {
        lastTouchTimeRef.current = currentTime;
      }
    };

    buttonElement.addEventListener('touchstart', handleRedButtonTouch, { passive: false });
    return () => {
      buttonElement.removeEventListener('touchstart', handleRedButtonTouch);
    };
  }, []);

  // 处理密码提交
  const handlePasswordSubmit = () => {
    if (passwordInput === '20251212') {
      // 退出整个浏览器/应用
      // 优先尝试 Electron 的退出方法
      if (typeof window.electron !== 'undefined') {
        // 尝试多种 Electron 退出方式
        if (window.electron.ipcRenderer) {
          // 通过 IPC 发送退出信号（需要主进程监听 'quit-app' 事件）
          window.electron.ipcRenderer.send('quit-app');
        } else if (window.electron.remote && window.electron.remote.app) {
          // Electron 旧版本 API
          window.electron.remote.app.quit();
        } else if (window.electron.quit) {
          window.electron.quit();
        } else if (window.electron.exit) {
          window.electron.exit();
        } else if (window.electron.app && window.electron.app.quit) {
          window.electron.app.quit();
        }
      } else if (window.require) {
        // 尝试通过 require 获取 Electron 模块
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('quit-app');
        } catch (e) {
          try {
            const { remote } = window.require('electron');
            if (remote && remote.app) {
              remote.app.quit();
            }
          } catch (e2) {
            // 如果都不行，尝试关闭窗口
            window.close();
          }
        }
      } else {
        // 普通浏览器环境：尝试关闭窗口
        // 注意：JavaScript 无法直接关闭整个浏览器，只能关闭由脚本打开的窗口
        window.close();
        // 如果 window.close() 不起作用，延迟后尝试其他方法
        setTimeout(() => {
          window.location.href = 'about:blank';
        }, 100);
      }
    } else {
      alert('密码错误');
      setPasswordInput('');
    }
  };


  


  const [currentPage, setCurrentPage] = useState('home');
  const [selectedKey, setSelectedKey] = useState(null);
  const [language, setLanguage] = useState('zh');
  const listKeys = Object.keys(list);

  const handleLearnMore = () => {
    setCurrentPage('detail1');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (key) => {
    setSelectedKey(key);
    setCurrentPage('detail2');
  };

  const handleEnterDetail3 = () => {
    setCurrentPage('detail3');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail1');
  };

  const handleBackToDetail2 = () => {
    setCurrentPage('detail2');
  };
  // 1个小时无交互自动返回Home页
  useEffect(() => {
    let autoReturnTimer = null;

    const resetTimer = () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      autoReturnTimer = setTimeout(() => {
        setCurrentPage('home');
      }, 3600000); // 1个小时 = 3600000毫秒
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

      {/* 红色按钮 - 双击打开密码输入 */}
      <div 
        ref={redButtonRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '150px',
          height: '150px',
          backgroundColor: 'transparent',
          zIndex: 99999,
          cursor: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      />
      
      {/* 密码输入界面 */}
      {showPasswordInput && (
        <div 
          className="password-input-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordInput(false);
              setPasswordInput('');
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: '10px',
              top: '160px',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              minWidth: '350px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{
              fontSize: '20px',
              marginBottom: '15px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>请输入密码</div>
            <div style={{
              fontSize: '28px',
              textAlign: 'center',
              marginBottom: '15px',
              minHeight: '35px',
              letterSpacing: '6px',
              fontFamily: 'monospace',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px'
            }}>{passwordInput || ''}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => setPasswordInput(prev => prev + String(num))}
                  style={{
                    padding: '15px',
                    fontSize: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'none',
                    backgroundColor: '#f0f0f0',
                    transition: 'background-color 0.2s',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                  onTouchEnd={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onTouchStart={(e) => {
                    e.target.style.backgroundColor = '#e0e0e0';
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              <button
                onClick={() => setPasswordInput(prev => prev + '0')}
                style={{
                  padding: '15px',
                  fontSize: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#f0f0f0',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#e0e0e0';
                }}
              >
                0
              </button>
              <button
                onClick={() => setPasswordInput(prev => prev.slice(0, -1))}
                style={{
                  padding: '15px',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#ff6b6b';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#ff5252';
                }}
              >
                删除
              </button>
              <button
                onClick={handlePasswordSubmit}
                style={{
                  padding: '15px',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#4caf50';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#45a049';
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      
      <div className={`page-layer ${currentPage === 'home' ? 'active' : ''}`}>
        <Home onLearnMore={handleLearnMore} language={language} setLanguage={setLanguage} />
      </div>
      <div className={`page-layer ${currentPage === 'detail1' ? 'active' : ''}`}>
        <Detail1
          name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
          gallery="B馆"
          onBack={handleBackToHome}
          onOpenDetail2={handleEnterDetail2}
          onOpenDetail3={handleEnterDetail3}
          listKeys={listKeys}
          language={language}
        />
      </div>
      <div className={`page-layer ${currentPage === 'detail2' ? 'active' : ''}`}>
        <Detail2
          onBack={handleBackToDetail}
          onOpenDetail3={handleEnterDetail3}
          selectedKey={selectedKey}
          list={list}
          language={language}
        />
      </div>
      <div className={`page-layer ${currentPage === 'detail3' ? 'active' : ''}`}>
        <Detail3
          onBackToDetail1={handleBackToDetail}
          onOpenDetail2={handleBackToDetail2}
          language={language}
        />
      </div>
    </div>
  );
}

export default App;