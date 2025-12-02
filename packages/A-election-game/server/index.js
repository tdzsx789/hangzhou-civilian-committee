const WebSocket = require('ws');
const { URL } = require('url');

const PORT = Number(process.env.PORT) || 5260;
const GAME_COUNT = Number(process.env.GAME_COUNT) || 5;
const STAGE = {
  WAITING: 'waiting',
  PREPARE: 'prepare',
  PHOTO: 'photo',
  COMPLETE: 'complete',
};

const server = new WebSocket.Server({ port: PORT });
const clients = new Set();
const readyPlayers = new Set();
const photoPlayers = new Set();
const photoDonePlayers = new Set();
let photoTimer = null;
let completeTimer = null;

let currentStage = STAGE.WAITING;

console.log(`[ws] server listening on ws://localhost:${PORT}`);

server.on('connection', (ws, request) => {
  const { role, playerId } = parseContext(request);
  const client = { ws, role, playerId };
  clients.add(client);

  console.log(`[ws] client connected role=${role} id=${playerId || '-'}`);

  ws.on('message', (buffer) => {
    const message = safeParse(buffer);
    if (!message) return;
    handleMessage(client, message);
  });

  ws.on('close', () => {
    clients.delete(client);
    if (client.role === 'game' && client.playerId) {
      readyPlayers.delete(client.playerId);
      photoPlayers.delete(client.playerId);
      photoDonePlayers.delete(client.playerId);
      broadcastReadyList();
    }
    console.log(
      `[ws] client disconnected role=${client.role} id=${client.playerId || '-'}`,
    );
  });

  ws.on('error', (err) => {
    console.error('[ws] client error', err.message);
  });

  sendStateSnapshot(ws);
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
    default:
      console.warn('[ws] unknown message type', type);
  }
}

function handleGameStart(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  readyPlayers.add(playerId);
  photoPlayers.delete(playerId);
  broadcastReadyList();

  if (readyPlayers.size >= GAME_COUNT && currentStage !== STAGE.PREPARE) {
    updateStage(STAGE.PREPARE);
  }
}

function handleGamePhoto(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  if (currentStage !== STAGE.PREPARE && currentStage !== STAGE.PHOTO) return;
  photoPlayers.add(playerId);

  if (photoPlayers.size >= GAME_COUNT && currentStage !== STAGE.PHOTO) {
    updateStage(STAGE.PHOTO);
  }
}

function handleGamePhotoDone(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  if (currentStage !== STAGE.PHOTO) return;
  photoDonePlayers.add(playerId);

  if (photoDonePlayers.size >= GAME_COUNT) {
    updateStage(STAGE.COMPLETE);
  }
}

function handleGameReset(client, message) {
  const playerId = getPlayerId(client, message);
  if (!playerId) return;
  resetState();
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
    clearTimeout(photoTimer);
    photoTimer = null;
  }

  if (completeTimer) {
    clearTimeout(completeTimer);
    completeTimer = null;
  }

  currentStage = nextStage;

  if (nextStage === STAGE.WAITING) {
    readyPlayers.clear();
    photoPlayers.clear();
    photoDonePlayers.clear();
  }

  if (nextStage === STAGE.PHOTO) {
    photoDonePlayers.clear();
    photoTimer = setTimeout(() => {
      updateStage(STAGE.COMPLETE);
    }, 10000);
  }

  if (nextStage === STAGE.COMPLETE) {
    completeTimer = setTimeout(() => {
      console.log('[ws] complete timer expired, auto resetting to waiting');
      // 清除定时器引用
      completeTimer = null;
      // 手动执行重置逻辑，避免 updateStage 的定时器清除干扰
      currentStage = STAGE.WAITING;
      readyPlayers.clear();
      photoPlayers.clear();
      photoDonePlayers.clear();
      // 广播状态更新
      broadcastStage();
      broadcastReadyList();
      console.log('[ws] auto reset completed, stage is now:', currentStage);
    }, 15000);
    console.log('[ws] complete timer started, will reset in 15s');
  }

  if (nextStage !== STAGE.PHOTO) {
    photoPlayers.clear();
    photoDonePlayers.clear();
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

function safeParse(buffer) {
  try {
    return JSON.parse(buffer.toString());
  } catch (err) {
    console.warn('[ws] JSON parse error', err.message);
    return null;
  }
}

