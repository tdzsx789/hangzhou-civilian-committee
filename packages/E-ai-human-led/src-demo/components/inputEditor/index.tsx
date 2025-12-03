import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Radio } from 'antd'
import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import styles from './index.module.less'
import classNames from 'classnames'

export type initData = {
  renderType: string
  chatMode: string
  jsonData: {
    sessionId: string
    rtcParams: any
    avatarAssets?: any
  }
  license?: string
}
interface InputEditorProps {
  getJson: (data: initData) => void
}

const InputEditor: React.FC<InputEditorProps> = ({ getJson }) => {
  const editorRef = useRef(null)
  const viewRef = useRef<EditorView | null>(null)
  const [renderType, setRenderType] = useState('cloudAvatar')
  const [chatMode, setChatMode] = useState('tap2talk')
  const [jsonData, setJsonData] = useState(
    '{\n  "sessionId": "",\n  "rtcParams": {} \n}',
  )
  const [error, setError] = useState('')
  const [license, setLicense] = useState('')
  const [showLicense, setShowLicense] = useState(false)

  // 初始化编辑器
  useEffect(() => {
    const state = EditorState.create({
      doc: jsonData,
      extensions: [
        basicSetup,
        json(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = viewRef.current?.state.doc.toString()
            if (newContent) {
              setJsonData(newContent)
            }
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current!,
    })

    viewRef.current = view // 保存引用

    return () => {
      view.destroy() // 组件卸载时销毁
    }
  }, [])

  useEffect(() => {
    try {
      setError('')
      const parseJson = JSON.parse(jsonData)
      getJson({
        renderType,
        chatMode,
        jsonData: parseJson,
        license,
      })
    } catch (error: any) {
      console.error(error)
      setError('JSON 格式错误')
    }
  }, [renderType, chatMode, jsonData, license])

  const onRenderTypeChange = (value: string) => {
    setRenderType(value)
    if (value === 'cloudAvatar') {
      setShowLicense(false)
    } else {
      setShowLicense(true)
    }
  }

  return (
    <div className={styles['json-editor-container']}>
      <Form.Item
        layout="vertical"
        label="渲染方式:"
        className={classNames(styles['form-item'], styles['render-type-item'])}
      >
        <Radio.Group
          block
          options={[
            { label: '云渲染', value: 'cloudAvatar' },
            { label: '端渲染', value: 'localAvatar' },
          ]}
          defaultValue="cloudAvatar"
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            onRenderTypeChange(e.target.value)
          }}
        />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="对话模式:"
        className={classNames(styles['form-item'], styles['chat-mode-item'])}
      >
        <Radio.Group
          block
          options={[
            { label: 'tap2talk', value: 'tap2talk' },
            { label: 'duplex', value: 'duplex' },
          ]}
          defaultValue="tap2talk"
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            setChatMode(e.target.value)
          }}
        />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="对话初始化参数:"
        className={classNames(styles['form-item'], styles['json-item'])}
      >
        <div
          ref={editorRef}
          className={classNames(styles['editor-wrapper'], {
            [styles['has-error']]: error,
          })}
        />
        <span className={styles['error-msg']}> {error} </span>
      </Form.Item>

      {showLicense && (
        <Form.Item
          layout="vertical"
          label="License:"
          className={classNames(styles['form-item'], styles['license-item'])}
        >
          <Input
            placeholder="请输入license"
            onChange={(e) => {
              setLicense(e.target.value)
            }}
            allowClear
          />
        </Form.Item>
      )}
    </div>
  )
}

export default InputEditor
InputEditor.displayName = 'InputEditor'
