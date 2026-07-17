const WebSocket = require('ws');
const dgram = require('dgram');
const { URL } = require('url');

const PORT = Number(process.env.PORT) || 5260;
const UDP_PORT = Number(process.env.UDP_PORT) || 6000;
const GAME_COUNT = Number(process.env.GAME_COUNT) || 5;
const STAGE = {
  WAITING: 'waiting',
  PREPARE: 'prepare',
  PHOTO: 'photo',
  UDPPHOTO: 'udpphoto',
  GAMING: 'gaming',
  ELECTION: 'election',
  COMPLETE: 'complete',
};

const METHODS = [
  '背箱法',
  '豆选法',
  '喊选法',
  '举手法',
  '票选法',
  '烧洞法',
  '投纸团法',
];

const server = new WebSocket.Server({ port: PORT });
const udpServer = dgram.createSocket('udp4');

udpServer.on('error', (err) => {
  console.log(`[udp] server error:\n${err.stack}`);
  udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
  console.log('====== 收到UDP消息 ======');
  const message = msg.toString().trim();
  console.log(`[udp] received: ${message} from ${rinfo.address}:${rinfo.port}`);
  handleUdpMessage(message);
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`[udp] server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);

const clients = new Set();
const readyPlayers = new Set();
const photoPlayers = new Set();
const photoDonePlayers = new Set();
const capturedPhotoPlayers = new Set();
const playerPhotos = new Map();
const humanPlayers = new Set();
const npcPlayers = new Set();
let photoTimer = null;
let completeTimer = null;
let gamingTimer = null;
let electionTimer = null;
let championPlayerId = '';
let isPhotoWaiting = false;
let waitingForPhotos = false;
let photoCountdownVal = 0;
let currentMode = '游客模式';

let currentStage = STAGE.WAITING;

console.log(`[ws] server listening on ws://localhost:${PORT}`);

server.on('connection', (ws, request) => {
  const { role, playerId } = parseContext(request);
  const client = { ws, role, playerId };
  clients.add(client);

  console.log(`[ws] client connected role=${role} id=${playerId || '-'}`);

  ws.on('message', (data) => {
    const message = safeParse(data);
    if (message) {
      handleMessage(client, message);
      return;
    }
    if (Buffer.isBuffer(data)) {
      handleBinaryMessage(client, data);
    }
  });

  ws.on('close', () => {
    clients.delete(client);
    if (client.role === 'game' && client.playerId) {
      readyPlayers.delete(client.playerId);
      photoPlayers.delete(client.playerId);
      photoDonePlayers.delete(client.playerId);
      capturedPhotoPlayers.delete(client.playerId);
      humanPlayers.delete(client.playerId);
      broadcastReadyList();
      broadcastRoles();
    }
    console.log(
      `[ws] client disconnected role=${client.role} id=${client.playerId || '-'}`,
    );
  });

  ws.on('error', (err) => {
    console.error('[ws] client error', err.message);
  });

  sendStateSnapshot(ws);

  // 如果是screen角色，补发所有已缓存的照片
  if (role === 'screen') {
    console.log(`[ws] sending ${playerPhotos.size} cached photos to screen client`);
    for (const [pid, buffer] of playerPhotos) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(buffer);
      }
    }
  }
});

function handleMessage(client, message) {
  const type = message.type;
  console.log('type', type)
  switch (type) {
    case 'game:start':
      handleGameStart(client, message);
      break;
    case 'game:photo':
      handleGamePhoto(client, message);
      break;
    case 'game:photoDone':
      handleGamePhotoDone(client, message);
      break;
    case 'game:reset':
      handleGameReset(client, message);
      break;
    case 'client:reload':
      handleClientReload();
      break;
    case 'admin:reset':
      resetState();
      break;
    case 'gaming:show':
      handleGamingShow(client, message);
      break;
    case 'champion:update':
      handleChampionUpdate(client, message);
      break;
    case 'mode:update':
      handleModeUpdate(client, message);
      break;
    default:
      console.warn('[ws] unknown message type', type);
  }
}

function handleGameStart(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  if (currentStage === STAGE.WAITING) {
    readyPlayers.add(playerId);
    humanPlayers.add(playerId);
    npcPlayers.delete(playerId);

    // 立即填充NPC
    for (let i = 1; i <= GAME_COUNT; i++) {
      const pid = String(i);
      if (!humanPlayers.has(pid)) {
        npcPlayers.add(pid);
      }
    }

    broadcastReadyList();
    broadcastRoles();

    // 即使跳过PREPARE，也生成播放列表以保持一致性
    const order = generatePlaylist();
    broadcast({ type: 'playlist:update', payload: { methods: order } });

    // 直接进入拍照阶段，不再等待
    updateStage(STAGE.PHOTO);
  } else if (currentStage === STAGE.PHOTO) {
    // PHOTO阶段也允许加入并成为人类玩家
    readyPlayers.add(playerId);
    humanPlayers.add(playerId);
    npcPlayers.delete(playerId);
    photoPlayers.delete(playerId); // 重置拍照状态，等待新的人类玩家拍照

    broadcastReadyList();
    broadcastRoles();

    if (waitingForPhotos) {
      if (humanPlayers.size >= 3) {
        console.log('[ws] new player joined during waitingForPhotos (PHOTO), human count >= 3, restarting countdown');
        photoDonePlayers.clear();
        waitingForPhotos = false;
        startPhotoCountdown();
      } else {
        console.log('[ws] new player joined during waitingForPhotos (PHOTO), resetting timer');
        startPhotoWaiting();
      }
    } else if (isPhotoWaiting) {
      console.log('[ws] new player joined during photo waiting (PHOTO), resetting timer');
      startPhotoWaiting();
    } else {
      console.log('[ws] new player joined during photo countdown (PHOTO), resetting countdown');
      startPhotoCountdown();
    }
  } else if (currentStage === STAGE.UDPPHOTO) {
    // UDPPHOTO阶段逻辑
    readyPlayers.add(playerId);
    humanPlayers.add(playerId);
    npcPlayers.delete(playerId);
    photoPlayers.delete(playerId); // 重置拍照状态，等待新的人类玩家拍照

    broadcastReadyList();
    broadcastRoles();

    console.log('[ws] new player joined during UDPPHOTO, resetting waiting state');
    startPhotoWaiting();
  } else {
    readyPlayers.add(playerId);
    photoPlayers.delete(playerId);
    broadcastReadyList();
  }
}

function handleGamePhoto(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  if (currentStage !== STAGE.PREPARE && currentStage !== STAGE.PHOTO && currentStage !== STAGE.UDPPHOTO) return;
  photoPlayers.add(playerId);

  if (photoPlayers.size >= GAME_COUNT && currentStage !== STAGE.PHOTO && currentStage !== STAGE.UDPPHOTO) {
    updateStage(STAGE.PHOTO);
  }
}

function handleGamePhotoDone(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  if (currentStage !== STAGE.PHOTO && currentStage !== STAGE.UDPPHOTO) return;

  // Update captured status
  const hasPhoto = message.hasPhoto ?? message.payload?.hasPhoto;
  if (hasPhoto) {
    capturedPhotoPlayers.add(playerId);
  } else if (hasPhoto === false) {
    capturedPhotoPlayers.delete(playerId);
  }

  // UDPPHOTO 阶段只记录照片状态，不自动跳转到 GAMING
  if (currentStage === STAGE.UDPPHOTO) {
    console.log(`[ws] photo update in UDPPHOTO (total: ${capturedPhotoPlayers.size}), waiting for manual gaming command`);
    return;
  }

  // If we are waiting for photos, check if we have enough now
  if (waitingForPhotos) {
    const totalWithPhotos = capturedPhotoPlayers.size;
    if (totalWithPhotos >= 3) {
      console.log(`[ws] enough photos collected (${totalWithPhotos} >= 3), entering GAMING directly`);
      waitingForPhotos = false;
      updateStage(STAGE.GAMING);
    }
    return;
  }

  photoDonePlayers.add(playerId);

  if (photoDonePlayers.size >= GAME_COUNT) {
    const totalWithPhotos = capturedPhotoPlayers.size;
    if (totalWithPhotos < 3) {
      console.log(`[ws] all players done but only ${totalWithPhotos} photos. Entering waiting.`);
      waitingForPhotos = true;
      startPhotoWaiting();
    } else {
      updateStage(STAGE.GAMING);
    }
  }
}

function handleGameReset(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  resetState();
}

function handleGamingShow(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  broadcast({ type: 'gaming:show', payload: { playerId } });
}

function handleClientReload() {
  if (
    currentStage !== STAGE.WAITING ||
    readyPlayers.size > 0 ||
    photoPlayers.size > 0 ||
    photoDonePlayers.size > 0
  ) {
    resetState();
  }
}

function updateStage(nextStage) {
  if (photoTimer) {
    clearInterval(photoTimer);
    photoTimer = null;
  }

  if (completeTimer) {
    clearTimeout(completeTimer);
    completeTimer = null;
  }
  if (gamingTimer) {
    clearTimeout(gamingTimer);
    gamingTimer = null;
  }
  if (electionTimer) {
    clearTimeout(electionTimer);
    electionTimer = null;
  }

  currentStage = nextStage;

  if (nextStage === STAGE.WAITING) {
    readyPlayers.clear();
    photoPlayers.clear();
    photoDonePlayers.clear();
    playerPhotos.clear();
    humanPlayers.clear();
    npcPlayers.clear();
    championPlayerId = '';
    isPhotoWaiting = false;
    broadcastRoles();
    broadcast({ type: 'champion:update', payload: { playerId: championPlayerId } });
  }

  if (nextStage === STAGE.PREPARE) {
    const order = generatePlaylist();
    broadcast({ type: 'playlist:update', payload: { methods: order } });
    broadcastRoles();
  }

  if (nextStage === STAGE.PHOTO) {
    photoDonePlayers.clear();
    startPhotoWaiting();
  }

  if (nextStage === STAGE.UDPPHOTO) {
    photoDonePlayers.clear();
    waitingForPhotos = true;
    startPhotoWaiting();
  }

  if (nextStage === STAGE.GAMING) {
    gamingTimer = setTimeout(() => {
      updateStage(STAGE.ELECTION);
    }, 4000);
  }

  if (nextStage === STAGE.ELECTION) {
    electionTimer = setTimeout(() => {
      updateStage(STAGE.COMPLETE);
    }, 10000);
  }

  if (nextStage === STAGE.COMPLETE) {
    completeTimer = setTimeout(() => {
      console.log('[ws] complete timer expired, auto resetting to waiting');
      resetState();
    }, 20000);
    console.log('[ws] complete timer started, will reset in 9s');
  }

  if (nextStage !== STAGE.PHOTO && nextStage !== STAGE.UDPPHOTO) {
    photoPlayers.clear();
    photoDonePlayers.clear();
    capturedPhotoPlayers.clear();
    waitingForPhotos = false;
  }

  broadcastStage();
}

function broadcastStage() {
  const message = {
    type: 'stage:update',
    payload: { stage: currentStage },
  };
  broadcast(message);
  console.log('[ws] stage ->', currentStage, 'broadcasted to', clients.size, 'clients');
}

function startPhotoWaiting() {
  if (photoTimer) {
    clearInterval(photoTimer);
    photoTimer = null;
  }

  if (currentStage === STAGE.UDPPHOTO) {
    console.log('[ws] startPhotoWaiting (UDPPHOTO): skipping timer');
    isPhotoWaiting = true;
    broadcast({ type: 'photo:waiting', payload: { seconds: null, waitingForPhotos } });
    return;
  }

  if (waitingForPhotos) {
    const totalWithPhotos = capturedPhotoPlayers.size;
    if (totalWithPhotos >= 3) {
      console.log(`[ws] startPhotoWaiting (photos): ${totalWithPhotos} >= 3, skipping waiting`);
      waitingForPhotos = false;
      startPhotoCountdown();
      return;
    }
  } else {
    if (humanPlayers.size >= 3) {
      console.log(`[ws] startPhotoWaiting (join): human players ${humanPlayers.size} >= 3, skipping waiting`);
      isPhotoWaiting = false;
      startPhotoCountdown();
      return;
    }
  }

  isPhotoWaiting = true;
  let waitingSeconds = 5;

  // 广播初始状态
  broadcast({ type: 'photo:waiting', payload: { seconds: waitingSeconds, waitingForPhotos } });

  photoTimer = setInterval(() => {
    waitingSeconds--;
    broadcast({ type: 'photo:waiting', payload: { seconds: waitingSeconds, waitingForPhotos } });

    if (waitingSeconds <= 0) {
      clearInterval(photoTimer);
      photoTimer = null;

      if (waitingForPhotos) {
        const totalWithPhotos = capturedPhotoPlayers.size;
        if (totalWithPhotos >= 3) {
          console.log(`[ws] photo waiting ended, photos: ${totalWithPhotos} >= 3, starting countdown`);
          waitingForPhotos = false;
          isPhotoWaiting = false;
          startPhotoCountdown();
        } else {
          console.log(`[ws] photo waiting ended, photos: ${totalWithPhotos} < 3, resetting to waiting`);
          resetState();
        }
      } else {
        if (humanPlayers.size >= 3) {
          console.log(`[ws] photo waiting ended, human players: ${humanPlayers.size} >= 3, starting countdown`);
          isPhotoWaiting = false;
          startPhotoCountdown();
        } else {
          console.log(`[ws] photo waiting ended, human players: ${humanPlayers.size} < 3, resetting to waiting`);
          resetState();
        }
      }
    }
  }, 1000);
}

function startPhotoCountdown() {
  photoCountdownVal = 5;
  broadcast({ type: 'photo:countdown', payload: { seconds: photoCountdownVal } });

  if (photoTimer) {
    clearInterval(photoTimer);
    photoTimer = null;
  }

  photoTimer = setInterval(() => {
    photoCountdownVal--;
    broadcast({ type: 'photo:countdown', payload: { seconds: photoCountdownVal } });

    if (photoCountdownVal <= 0) {
      clearInterval(photoTimer);
      photoTimer = null;

      if (currentStage === STAGE.UDPPHOTO) {
        console.log('[ws] UDPPHOTO countdown ended, entering GAMING');
        broadcast({ type: 'photo:countdown', payload: { seconds: null } });
        updateStage(STAGE.GAMING);
        return;
      }

      const totalWithPhotos = capturedPhotoPlayers.size;
      if (totalWithPhotos < 3) {
        console.log(`[ws] countdown ended but only ${totalWithPhotos} photos. Entering waiting.`);
        waitingForPhotos = true;
        startPhotoWaiting();
      } else {
        updateStage(STAGE.GAMING);
      }
    }
  }, 1000);
}

function generatePlaylist() {
  const arr = METHODS.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const must = '豆选法';
  const idx = arr.indexOf(must);
  if (idx !== -1 && idx >= GAME_COUNT) {
    const target = 0;
    [arr[target], arr[idx]] = [arr[idx], arr[target]];
  }
  return arr;
}

function broadcastReadyList() {
  broadcast({
    type: 'game:ready:list',
    payload: { playerIds: Array.from(readyPlayers) },
  });
}

function sendStateSnapshot(ws) {
  ws.send(
    JSON.stringify({
      type: 'stage:update',
      payload: { stage: currentStage },
    }),
  );
  ws.send(
    JSON.stringify({
      type: 'game:ready:list',
      payload: { playerIds: Array.from(readyPlayers) },
    }),
  );
  ws.send(
    JSON.stringify({
      type: 'players:roles',
      payload: {
        humans: Array.from(humanPlayers),
        npcs: Array.from(npcPlayers),
      },
    }),
  );
  ws.send(
    JSON.stringify({
      type: 'champion:update',
      payload: { playerId: championPlayerId },
    }),
  );
  ws.send(
    JSON.stringify({
      type: 'mode:update',
      payload: { mode: currentMode },
    }),
  );
  if (isPhotoWaiting) {
    ws.send(
      JSON.stringify({
        type: 'photo:waiting',
        payload: { seconds: 5, waitingForPhotos },
      }),
    );
  } else if (currentStage === STAGE.PHOTO && photoCountdownVal > 0) {
    ws.send(
      JSON.stringify({
        type: 'photo:countdown',
        payload: { seconds: photoCountdownVal },
      }),
    );
  } else if (currentStage === STAGE.UDPPHOTO && photoCountdownVal > 0) {
    ws.send(
      JSON.stringify({
        type: 'photo:countdown',
        payload: { seconds: photoCountdownVal },
      }),
    );
  }
}

function handleModeUpdate(client, message) {
  const mode = message.mode || message.payload?.mode;
  if (mode) {
    currentMode = mode;
    console.log(`[ws] mode updated to: ${currentMode}`);
    broadcast({ type: 'mode:update', payload: { mode: currentMode } });
  }
}

function handleChampionUpdate(client, message) {
  let pid = getPlayerId(client, message);

  // 校验：只有拍了照（在 playerPhotos 中有记录）的玩家才能成为 champion
  // 如果客户端传来空字符串（清除champion），则允许
  if (pid && !playerPhotos.has(pid)) {
    console.log(`[ws] champion candidate ${pid} has no photo, rejecting`);
    const candidates = Array.from(playerPhotos.keys());
    if (candidates.length > 0) {
      if (currentMode === '领导模式' && candidates.includes('3')) {
        pid = '3';
      } else {
        pid = candidates[Math.floor(Math.random() * candidates.length)];
      }
      console.log(`[ws] champion falling back to ${pid}`);
    } else {
      console.log('[ws] no players have photos, cannot set champion');
      pid = '';
    }
  }

  // 根据模式决定是否强制 avatar3 (id=3) 为 champion
  if (currentMode === '领导模式' && humanPlayers.has('3') && playerPhotos.has('3')) {
    console.log('[ws] champion override: avatar3 is human and has photo, forcing champion to 3');
    pid = '3';
  }

  championPlayerId = String(pid || '');
  broadcast({ type: 'champion:update', payload: { playerId: championPlayerId } });
}

function resetState() {
  console.log('[ws] resetState called, currentStage:', currentStage);
  if (completeTimer) {
    clearTimeout(completeTimer);
    completeTimer = null;
    console.log('[ws] complete timer cleared in resetState');
  }
  // 直接调用 updateStage，它会处理定时器清除、状态更新和广播
  updateStage(STAGE.WAITING);
  broadcastReadyList();
  broadcastRoles();
  console.log('[ws] reset state completed, stage should be waiting');
}

function parseContext(request) {
  try {
    const url = new URL(request.url, 'http://localhost');
    return {
      role: url.searchParams.get('role') || 'guest',
      playerId: url.searchParams.get('playerId') || '',
    };
  } catch (err) {
    return { role: 'guest', playerId: '' };
  }
}

function getPlayerId(client, message) {
  return (
    message.playerId ||
    message.payload?.playerId ||
    client.playerId ||
    ''
  );
}

function broadcast(data) {
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

function broadcastRoles() {
  broadcast({
    type: 'players:roles',
    payload: {
      humans: Array.from(humanPlayers),
      npcs: Array.from(npcPlayers),
    },
  });
}

function handleBinaryMessage(client, data) {
  try {
    if (!Buffer.isBuffer(data) || data.length < 4) return;
    const headerLen = data.readUInt32BE(0);
    const start = 4;
    const end = start + headerLen;
    if (end > data.length) return;
    const headerBuf = data.slice(start, end);
    const headerStr = headerBuf.toString();
    const header = JSON.parse(headerStr);
    if (!header || header.type !== 'photo:bin') return;

    // 缓存照片
    if (header.playerId) {
      playerPhotos.set(header.playerId, data);
      console.log(`[ws] cached photo for player ${header.playerId}, size: ${data.length}`);
    }

    for (const c of clients) {
      if (c.role === 'screen' && c.ws.readyState === WebSocket.OPEN) {
        c.ws.send(data);
      }
    }
  } catch (_) { }
}


function safeParse(buffer) {
  try {
    return JSON.parse(buffer.toString());
  } catch (err) {
    console.warn('[ws] JSON parse error', err.message);
    return null;
  }
}

function handleUdpMessage(message) {
  const cmd = message.toLowerCase();
  console.log('[udp] handling command:', cmd);

  if (cmd === 'start') {
    if (currentStage === STAGE.WAITING) {
      console.log('[udp] forcing game start');

      // 自动将已连接的 game 客户端加入游戏
      for (const client of clients) {
        if (client.role === 'game' && client.playerId) {
          readyPlayers.add(client.playerId);
          humanPlayers.add(client.playerId);
          npcPlayers.delete(client.playerId);
        }
      }

      // 填充NPC
      for (let i = 1; i <= GAME_COUNT; i++) {
        const pid = String(i);
        if (!humanPlayers.has(pid)) {
          npcPlayers.add(pid);
        }
      }

      broadcastReadyList();
      broadcastRoles();

      const order = generatePlaylist();
      broadcast({ type: 'playlist:update', payload: { methods: order } });

      updateStage(STAGE.PHOTO);
    } else {
      console.log('[udp] start ignored, current stage:', currentStage);
    }
  } else if (cmd === 'reset') {
    console.log('[udp] forcing reset');
    resetState();
  } else if (cmd === 'photo') {
    if (currentStage === STAGE.UDPPHOTO) {
      console.log('[udp] starting photo countdown for UDPPHOTO');
      broadcast({ type: 'game:capture' });
      startPhotoCountdown();
    } else {
      console.log('[udp] forcing photo capture');
      broadcast({ type: 'game:capture' });
    }
  } else if (cmd === 'gaming') {
    console.log('[udp] forcing gaming stage');
    waitingForPhotos = false;
    updateStage(STAGE.GAMING);
  } else if (cmd === 'rephoto') {
    console.log('[udp] forcing photo retake');
    broadcast({ type: 'game:recapture' });
  } else if (cmd === 'game') {
    if (currentStage === STAGE.WAITING) {
      console.log('[udp] enter UDPPHOTO stage');

      // 自动将已连接的 game 客户端加入游戏，就像 start 指令一样
      for (const client of clients) {
        if (client.role === 'game' && client.playerId) {
          readyPlayers.add(client.playerId);
          humanPlayers.add(client.playerId);
          npcPlayers.delete(client.playerId);
        }
      }

      // 填充NPC
      for (let i = 1; i <= GAME_COUNT; i++) {
        const pid = String(i);
        if (!humanPlayers.has(pid)) {
          npcPlayers.add(pid);
        }
      }

      broadcastReadyList();
      broadcastRoles();

      updateStage(STAGE.UDPPHOTO);
    } else {
      console.log('[udp] game command ignored, current stage:', currentStage);
    }
  } else {
    console.warn('[udp] unknown command:', cmd);
  }
}
