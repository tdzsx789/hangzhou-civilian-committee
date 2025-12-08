import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_WS_URL, GAME_COUNT, STAGE } from '../constants/stages';

const CONNECTION = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  CLOSED: 'closed',
  ERROR: 'error',
};

const DEV_DELAY = 5000;

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
  const fallbackTimerRef = useRef(null);

  useEffect(() => {
    const shouldMock = process.env.REACT_APP_ENABLE_SOCKET !== 'true';
    if (shouldMock) {
      startMockFlow(role, setCurrentStage, fallbackTimerRef);
      return () => clearMockFlow(fallbackTimerRef);
    }

    setConnectionState(CONNECTION.CONNECTING);
    const socket = new WebSocket(
      `${DEFAULT_WS_URL}?role=${role}&playerId=${playerId || ''}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionState(CONNECTION.CONNECTED);
      socket.send(
        JSON.stringify({
          type: 'client:reload',
          role,
          playerId,
        }),
      );
    };
    socket.onerror = () => setConnectionState(CONNECTION.ERROR);
    socket.onclose = () => setConnectionState(CONNECTION.CLOSED);
    socket.onmessage = (event) => {
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
        default:
          break;
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
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
    }),
    [connectionState, readyPlayers],
  );

  return {
    stage: currentStage,
    send,
    meta,
    lastMessage,
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

