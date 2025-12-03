import React, { useRef, useState } from 'react'
import './index.css'
import InputEditor from './inputEditor'
import {
  createAvatar,
  EventTypes,
  TYAvatarType,
  TYVoiceChatMessageType,
  TYVolumeSourceType,
} from 'lm-avatar-chat-sdk'

const IChatState = {
  online: 'online',
  offline: 'offline',
}

function Home() {
  const [chatState, setChatState] = useState(IChatState.offline)
  const [chatAvatarType, setChatAvatarType] = useState(TYAvatarType.cloudAvatar)
  const chatAvatar = useRef()
  const [chatLocalMute, setChatLocalMute] = useState(false)

  const chatInitInfo = useRef({
    renderType: 'cloudAvatar',
    chatMode: 'tap2talk',
    sessionId: '',
    rtcParams: {},
    avatarAssets: {},
    license: '',
  })

  const getJson = (data) => {
    console.log('dddd', data)
    const { renderType, chatMode, jsonData, license } = data
    const { sessionId, rtcParams, avatarAssets } = jsonData
    try {
      setChatAvatarType(renderType)
      chatInitInfo.current.renderType = renderType
      chatInitInfo.current.chatMode = chatMode
      chatInitInfo.current.sessionId = sessionId
      chatInitInfo.current.rtcParams = rtcParams
      chatInitInfo.current.avatarAssets = avatarAssets
      chatInitInfo.current.license = license || ''
      } catch (error) {
        console.error('error', error)
    }
  }

  const exitChat = () => {
    if (chatAvatar.current) {
      chatAvatar.current.exit()
    }
    setChatState(IChatState.offline)
  }

  const startChat = async () => {
    const {
      renderType,
      chatMode,
      sessionId,
      rtcParams,
      avatarAssets,
      license,
    } = chatInitInfo.current
    if (!rtcParams) {
      setChatState(IChatState.offline)
      console.log('rtc初始化数据缺失')
      return false
    }

    const dialogParams = {
      mode: chatMode,
    }
    const avatarInitParams = Object.assign(
      {},
      {
        rootContainer:
          renderType === TYAvatarType.cloudAvatar
            ? '#cloudPreviewer'
            : '#localPreviewer',
      },
      {
        ...rtcParams,
        sessionId,
      },
    )

    let avatar
    if (renderType === TYAvatarType.cloudAvatar) {
      avatar = createAvatar(renderType, avatarInitParams)
    } else {
      avatar = createAvatar(renderType, avatarInitParams, {
        ...avatarAssets,
        license,
      })
    }

    chatAvatar.current = avatar

    avatar.start(dialogParams)

    avatar.onFirstFrameReceived(() => {
      console.log('数字人渲染完成')
      setChatState(IChatState.online)
    })
    avatar.onReadyToSpeech(() => {
      console.log('可以开始对话了')
    })
    avatar.onStateChanged((tyState) => {
      console.log('数字人状态变化', tyState)
    })

    avatar.on(EventTypes.SpeakStarted, () => {
      console.log('用户开始说话了')
    })
    avatar.on(EventTypes.SpeakEnded, () => {
      console.log('用户结束说话了')
    })
    avatar.on(EventTypes.ResponseStarted, () => {
      console.log('数字人开始回复了')
    })
    avatar.on(EventTypes.ResponseEnded, () => {
      console.log('数字人结束回复了')
    })

    avatar.onMessageReceived((msg) => {
      if (msg.type === TYVoiceChatMessageType.speaking) {
        console.log('用户的提问', msg)
      } else {
        console.log('数字人的回复', msg)
      }
    })

    avatar.onVolumeChanged((data) => {
      if (data.source === TYVolumeSourceType.mic) {
        console.log('用户音量:' + data.volume)
      } else {
        console.log('数字人音量:' + data.volume)
      }
    })

    avatar.onErrorReceived((error) => {
      console.error('接收到对话错误:', error.message)
      if (error.terminate) {
        exitChat()
        setChatState(IChatState.offline)
      }
    })
    avatar.onPerformanceInfoTrack((info) => {
      const { type, data } = info
      console.log('性能信息:', type, data)
    })
  }

  const interruptChat = () => {
    if (chatAvatar.current) {
      chatAvatar.current.interrupt()
    }
  }

  const toggleChatMute = (isMuted) => {
    setChatLocalMute(!isMuted)
    if (chatAvatar.current) {
      chatAvatar.current.muteLocalMic(!isMuted)
    }
  }

  return (
    <div className="app-container">
      <span className="title">
        灵眸数字人sdk调试demo（
        <span>{chatState === IChatState.online ? '对话中' : '离线'}</span>）
      </span>
      <InputEditor getJson={getJson} />
      <div className="chat-btn-container">
        <button onClick={startChat} type="primary">
          开始对话
        </button>
        <button onClick={exitChat} type="primary">
          结束对话
        </button>
        <button onClick={interruptChat}>打断</button>
        <button
          onClick={() => {
            toggleChatMute(chatLocalMute)
          }}
        >
          {chatLocalMute ? '取消静音' : '静音'}
        </button>
      </div>

      {chatAvatarType === TYAvatarType.cloudAvatar && (
        <video className="chat-video-container" id="cloudPreviewer" muted />
      )}
      {chatAvatarType === TYAvatarType.localAvatar && (
        <div className="chat-local-render-container" id="localPreviewer"></div>
      )}
    </div>
  )
}

export default Home