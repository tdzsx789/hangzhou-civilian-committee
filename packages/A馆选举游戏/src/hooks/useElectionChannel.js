import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_WS_URL, GAME_COUNT, STAGE } from '../constants/stages';

const CONNECTION = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  CLOSED: 'closed',
  ERROR: 'error',
};

const DEV_DELAY = 15000;

function safeParse(data) {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.warn('[socket] parse error', err);
    return null;
  }
}

export function useElectionChannel({ role, playerId }) {
  const socketRef = useRef(null);
  const [connectionState, setConnectionState] = useState(CONNECTION.IDLE);
  const [currentStage, setCurrentStage] = useState(STAGE.WAITING);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const [photosBin, setPhotosBin] = useState([]);
  const [roles, setRoles] = useState({ humans: [], npcs: [] });
  const [waitingCountdown, setWaitingCountdown] = useState(null);
  const [photoCountdown, setPhotoCountdown] = useState(null);
  const [gamingShowPlayers, setGamingShowPlayers] = useState([]);
  const [championPlayerId, setChampionPlayerId] = useState('');

  useEffect(() => {
    const shouldMock = process.env.REACT_APP_ENABLE_SOCKET !== 'true';
    if (shouldMock) {
      startMockFlow(role, setCurrentStage, fallbackTimerRef);
      return () => clearMockFlow(fallbackTimerRef);
    }

    const connect = () => {
      setConnectionState(CONNECTION.CONNECTING);
      setRetryCount((c) => c + 1);
      const socket = new WebSocket(
        `${DEFAULT_WS_URL}?role=${role}&playerId=${playerId || ''}`,
      );
      socketRef.current = socket;
      socket.binaryType = 'arraybuffer';

      socket.onopen = () => {
        setConnectionState(CONNECTION.CONNECTED);
        setRetryCount(0);
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        socket.send(
          JSON.stringify({
            type: 'client:reload',
            role,
            playerId,
          }),
        );
      };
      socket.onerror = () => setConnectionState(CONNECTION.ERROR);
      socket.onclose = () => {
        setConnectionState(CONNECTION.CLOSED);
        if (!retryTimerRef.current) {
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            connect();
          }, 5000);
        }
      };
      socket.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const payload = safeParse(event.data);
          if (!payload) return;
          setLastMessage(payload);
          switch (payload.type) {
          case 'stage:update':
            if (payload.payload?.stage) {
              console.log('[socket] received stage update:', payload.payload.stage);
              setCurrentStage(payload.payload.stage);
            }
            break;
          case 'game:ready:list':
            if (Array.isArray(payload.payload?.playerIds)) {
              setReadyPlayers(payload.payload.playerIds);
            }
            break;
        case 'playlist:update':
          if (Array.isArray(payload.payload?.methods)) {
            setPlaylist(payload.payload.methods);
          }
          break;
        case 'players:roles':
          if (payload.payload) {
            const { humans = [], npcs = [] } = payload.payload || {};
            setRoles({ humans, npcs });
          }
          break;
        case 'waiting:countdown':
          if (typeof payload.payload?.seconds === 'number') {
            setWaitingCountdown(payload.payload.seconds);
          }
          break;
        case 'photo:countdown':
          if (typeof payload.payload?.seconds === 'number') {
            setPhotoCountdown(payload.payload.seconds);
          }
          break;
        case 'gaming:show':
          if (payload.payload && payload.payload.playerId) {
            const pid = String(payload.payload.playerId);
            setGamingShowPlayers((prev) => {
              if (prev.includes(pid)) return prev;
              const next = [...prev, pid];
              return next.slice(-5);
            });
          }
          break;
        case 'champion:update':
          if (payload.payload && payload.payload.playerId) {
            setChampionPlayerId(String(payload.payload.playerId));
          } else if (payload.payload && payload.payload.playerId === '') {
            setChampionPlayerId('');
          }
          break;
        default:
          break;
        }
          return;
        }
        if (event.data && event.data.byteLength) {
          const buf = event.data;
          const dv = new DataView(buf);
          if (dv.byteLength < 4) return;
          const headerLen = dv.getUint32(0);
          const headerBytes = new Uint8Array(buf, 4, headerLen);
          const headerStr = new TextDecoder().decode(headerBytes);
          let header;
          try {
            header = JSON.parse(headerStr);
          } catch (_) {
            return;
          }
          if (!header || header.type !== 'photo:bin') return;
          const imageBuf = buf.slice(4 + headerLen);
          const player = header.playerId || '';
          const mime = header.mime || 'image/png';
          setPhotosBin((prev) => {
            const fil = prev.filter((p) => p.playerId !== player);
            const next = [...fil, { playerId: player, buffer: imageBuf, mime }];
            return next.slice(-5);
          });
        }
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [role, playerId]);

  const send = useCallback(
    (type, payload = {}) => {
      if (!socketRef.current) {
        console.warn('[socket] connection not ready, skip send');
        return;
      }
      if (socketRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[socket] socket not open');
        return;
      }
      socketRef.current.send(
        JSON.stringify({
          type,
          role,
          playerId,
          payload,
        }),
      );
    },
    [playerId, role],
  );

  const meta = useMemo(
    () => ({
      totalPlayers: GAME_COUNT,
      readyPlayers,
      connectionState,
      retryCount,
    }),
    [connectionState, readyPlayers, retryCount],
  );

  const sendPhotoBinary = useCallback(
    (arrayBuffer, mime = 'image/png') => {
      if (!socketRef.current) return;
      if (socketRef.current.readyState !== WebSocket.OPEN) return;
      const headerObj = { type: 'photo:bin', playerId, mime };
      const headerStr = JSON.stringify(headerObj);
      const headerBytes = new TextEncoder().encode(headerStr);
      const totalLen = 4 + headerBytes.length + arrayBuffer.byteLength;
      const buf = new ArrayBuffer(totalLen);
      const dv = new DataView(buf);
      dv.setUint32(0, headerBytes.length);
      new Uint8Array(buf, 4, headerBytes.length).set(headerBytes);
      new Uint8Array(buf, 4 + headerBytes.length).set(new Uint8Array(arrayBuffer));
      socketRef.current.send(buf);
    },
    [playerId],
  );

  return {
    stage: currentStage,
    send,
    sendPhotoBinary,
    meta,
    lastMessage,
    playlist,
    photosBin,
    roles,
    waitingCountdown,
    photoCountdown,
    gamingShowPlayers,
    champion: championPlayerId,
  };
}

function startMockFlow(role, setCurrentStage, timerRef) {
  clearMockFlow(timerRef);
  if (role === 'screen') {
    timerRef.current = setTimeout(() => {
      setCurrentStage(STAGE.PREPARE);
      timerRef.current = setTimeout(() => {
        setCurrentStage(STAGE.PHOTO);
      }, DEV_DELAY);
    }, DEV_DELAY);
  } else {
    timerRef.current = setTimeout(() => {
      setCurrentStage(STAGE.PREPARE);
      timerRef.current = setTimeout(() => {
        setCurrentStage(STAGE.PHOTO);
      }, DEV_DELAY);
    }, DEV_DELAY);
  }
}

function clearMockFlow(timerRef) {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}
