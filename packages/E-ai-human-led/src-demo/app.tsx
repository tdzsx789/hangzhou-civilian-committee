import React, { useRef, useState } from 'react'
import styles from './app.module.less'
import InputEditor, { initData } from './components/inputEditor/index.tsx'
import { message, Button } from 'antd'
import {
  createAvatar,
  EventTypes,
  TYAvatarType,
  TYVoiceChatMessage,
  TYVoiceChatMessageType,
  TYVoiceChatState,
  TYVoiceChatMode,
  TYVolumeSourceType,
  TYError,
  TYVolume,
  TYPerformanceInfo,
  type CloudAvatar,
  type LocalAvatar,
} from 'lm-avatar-chat-sdk'

enum IChatState {
  online = 'online',
  offline = 'offline',
}

const AppPage: React.FC = () => {
  const [chatState, setChatState] = useState(IChatState.offline)

  const [chatAvatarType, setChatAvatarType] = useState(TYAvatarType.cloudAvatar)
  const chatAvatar = useRef<CloudAvatar | LocalAvatar | undefined>(undefined)
  const [chatLocalMute, setChatLocalMute] = useState(false)

  const chatInitInfo = useRef<{
    renderType: string
    chatMode: string
    sessionId: string
    rtcParams: any
    avatarAssets: any
    license: string
  }>({
    renderType: 'cloudAvatar',
    chatMode: 'tap2talk',
    sessionId: '',
    rtcParams: {},
    avatarAssets: {},
    license: '',
  })

  const getJson = (data: initData) => {
    const { renderType, chatMode, jsonData, license } = data
    const { sessionId, rtcParams, avatarAssets } = jsonData
    try {
      setChatAvatarType(renderType as TYAvatarType)
      chatInitInfo.current.renderType = renderType
      chatInitInfo.current.chatMode = chatMode
      chatInitInfo.current.sessionId = sessionId
      chatInitInfo.current.rtcParams = rtcParams
      chatInitInfo.current.avatarAssets = avatarAssets
      chatInitInfo.current.license = license || ''
    } catch (error) {
      message.error(error)
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
      message.error('rtc初始化数据缺失')
      return false
    }

    const dialogParams = {
      mode: chatMode as TYVoiceChatMode,
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
      avatar = createAvatar(renderType as TYAvatarType, avatarInitParams)
    } else {
      avatar = createAvatar(renderType as TYAvatarType, avatarInitParams, {
        ...avatarAssets,
        license,
      })
    }

    chatAvatar.current = avatar

    avatar.start(dialogParams)

    // 重要事件监听
    avatar.onFirstFrameReceived(() => {
      console.log('数字人渲染完成')
      setChatState(IChatState.online)
    })
    avatar.onReadyToSpeech(() => {
      console.log('可以开始对话了')
    })
    avatar.onStateChanged((tyState: TYVoiceChatState) => {
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

    avatar.onMessageReceived((msg: TYVoiceChatMessage) => {
      if (msg.type === TYVoiceChatMessageType.speaking) {
        console.log('用户的提问', msg)
      } else {
        console.log('数字人的回复', msg)
      }
    })

    avatar.onVolumeChanged((data: TYVolume) => {
      if (data.source === TYVolumeSourceType.mic) {
        console.log('用户音量:' + data.volume)
      } else {
        console.log('数字人音量:' + data.volume)
      }
    })

    avatar.onErrorReceived((error: TYError) => {
      console.error('接收到对话错误:', error.message)
      message.error(error.message)
      if (error.terminate) {
        exitChat()
        setChatState(IChatState.offline)
      }
    })
    avatar.onPerformanceInfoTrack((info: TYPerformanceInfo) => {
      const { type, data } = info
      console.log('性能信息:', type, data)
    })
  }

  const interruptChat = () => {
    if (chatAvatar.current) {
      chatAvatar.current.interrupt()
    }
  }
  const toggleChatMute = (isMuted: boolean) => {
    setChatLocalMute(!isMuted)
    if (chatAvatar.current) {
      chatAvatar.current.muteLocalMic(!isMuted)
    }
  }

  return (
    <div className={styles['app-container']}>
      <span className={styles['title']}>
        灵眸数字人sdk调试demo（
        <span>{chatState === IChatState.online ? '对话中' : '离线'}</span>）
      </span>
      <InputEditor getJson={getJson} />
      <div className={styles['chat-btn-container']}>
        <Button onClick={startChat} type="primary">
          开始对话
        </Button>
        <Button onClick={exitChat} type="primary">
          结束对话
        </Button>
        <Button onClick={interruptChat}>打断</Button>
        <Button
          onClick={() => {
            toggleChatMute(chatLocalMute)
          }}
        >
          {chatLocalMute ? '取消静音' : '静音'}
        </Button>
      </div>

      {chatAvatarType === TYAvatarType.cloudAvatar && (
        <video
          className={styles['chat-video-container']}
          id="cloudPreviewer"
          muted
        />
      )}
      {chatAvatarType === TYAvatarType.localAvatar && (
        <div
          className={styles['chat-local-render-container']}
          id="localPreviewer"
        ></div>
      )}
    </div>
  )
}

export default AppPage
