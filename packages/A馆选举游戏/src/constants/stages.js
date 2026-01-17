export const STAGE = {
  WAITING: 'waiting',
  PREPARE: 'prepare',
  PHOTO: 'photo',
  UDPPHOTO: 'udpphoto',
  GAMING: 'gaming',
  ELECTION: 'election',
  COMPLETE: 'complete',
};

export const STAGE_LABEL = {
  [STAGE.WAITING]: '等待全部参赛者点击开始',
  [STAGE.PREPARE]: '准备拍摄，保持队形',
  [STAGE.PHOTO]: '拍照中，请保持微笑',
  [STAGE.UDPPHOTO]: '拍照中，请保持微笑',
  [STAGE.GAMING]: '游戏中',
  [STAGE.ELECTION]: '游戏中',
  [STAGE.COMPLETE]: '本轮互动结束，准备返回首页',
};

export const GAME_COUNT = 5;
const DEV_WS = 'ws://localhost:5260';
const PROD_WS = 'ws://192.168.22.16:5260';
export const DEFAULT_WS_URL =
  process.env.NODE_ENV === 'development' ? DEV_WS : PROD_WS;
