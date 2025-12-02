export const STAGE = {
  WAITING: 'waiting',
  PREPARE: 'prepare',
  PHOTO: 'photo',
  COMPLETE: 'complete',
};

export const STAGE_LABEL = {
  [STAGE.WAITING]: '等待全部参赛者点击开始',
  [STAGE.PREPARE]: '准备拍摄，保持队形',
  [STAGE.PHOTO]: '拍照中，请保持微笑',
  [STAGE.COMPLETE]: '本轮互动结束，准备返回首页',
};

export const GAME_COUNT = 5;
export const DEFAULT_WS_URL =
  process.env.REACT_APP_WS_URL || 'ws://localhost:5260';

