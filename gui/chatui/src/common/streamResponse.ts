// stream-handler.ts
import type { IMessagesList } from '@/stores/types/chat'
import type { IChatResponse } from '@/views/types'

export class StreamHandler {
  // 当前是否处于流式返回状态
  private isStreaming = false
  // 当前流式消息的index
  private currentStreamMessageIndex = -1
  // 是否更新调度
  private updateScheduled = false
  // 流式缓冲内容
  private contentChunks: string[] = []
  // 缓冲内容
  private pendingContent: string = ''
  // 上一次更新时间
  private lastUpdateTime = 0
  // 流氏返回处理间隔时间
  private streamUpdateTime = 50
  // 消息store
  private messageStore: any // 根据实际类型调整
  // 结束回调
  private resetCallback: () => void

  constructor(messageStore: any, resetCallback: () => void) {
    this.messageStore = messageStore
    this.resetCallback = resetCallback
  }

  // 处理流式响应
  public handleStreamResponse(streamData: IChatResponse) {
    const { content, stream, isStreamComplete } = streamData
    // 流氏返回结束
    if (stream && isStreamComplete) {
      // 结束时进行更新，防止丢最后一段
      this.flushUpdate()
      // 找到需要流式更新内容的消息
      const currentMessage = this.messageStore.messagesList[this.currentStreamMessageIndex]
      if (currentMessage) {
        // 一次性 join
        currentMessage.isStreamComplete = true
      }
      this.reset()
      return
    }

    // 如果当前不处于正在流式更新，则需要开启新一轮流式消息接收
    if (!this.isStreaming) {
      this.startNewStream(streamData)
    }

    // 累积等待内容到缓冲区
    this.pendingContent += content

    // 调度更新
    this.scheduleUpdate()
  }

  // 调度更新
  private scheduleUpdate() {
    // if (this.updateScheduled) return

    // this.updateScheduled = true

    // requestAnimationFrame(() => {
    //   const now = Date.now()
    //   if (now - this.lastUpdateTime >= this.streamUpdateTime) {
    //     this.flushUpdate()
    //   }
    //   this.updateScheduled = false
    // })
    if (!this.updateScheduled) {
      const now = Date.now()
      // 采用50ms间隔更新，如果足够，则立即更新ui
      const timeSinceLastUpdate = now - this.lastUpdateTime
      if (timeSinceLastUpdate >= this.streamUpdateTime) {
        this.flushUpdate()
      } else {
        this.updateScheduled = true
        requestAnimationFrame(() => {
          this.flushUpdate()
          this.updateScheduled = false
        })
      }
    }
  }

  // 开始新的流式传输
  private startNewStream(streamData: IChatResponse) {
    //  初始化 chunk
    this.contentChunks = []
    // 正在流式接收返回
    this.isStreaming = true
    // 构建模型流式返回消息
    const newMessage: IMessagesList = {
      role: 'ai',
      content: '',
      isStreamComplete: streamData.isStreamComplete,
      model: streamData.model,
    }
    this.messageStore.messagesList.push(newMessage)
    // 当前流式消息index指向
    this.currentStreamMessageIndex = this.messageStore.messagesList.length - 1
  }

  // 执行更新
  private flushUpdate() {
    // 存在当前需要流式更新的消息index并且存在流式缓冲内容时
    if (this.currentStreamMessageIndex >= 0 && this.pendingContent) {
      const newList = [...this.messageStore.messagesList]
      // 找到需要流式更新内容的消息
      const currentMessage = newList[this.currentStreamMessageIndex]
      //  收集 chunk（避免字符串频繁拼接）
      this.contentChunks.push(this.pendingContent)

      if (currentMessage) {
        // 一次性 join
        currentMessage.content = this.contentChunks.join('')
      }
      // -------本次更新完成---------
      // 本次更新完成后清空缓冲内容以及记录当前时间
      this.pendingContent = ''
      this.lastUpdateTime = Date.now()
    }
  }

  // 重置状态
  private reset() {
    this.updateScheduled = false
    this.pendingContent = ''
    this.lastUpdateTime = 0
    this.isStreaming = false
    this.currentStreamMessageIndex = -1
    this.contentChunks = []
    this.resetCallback()
  }

  // 强制结束流式传输
  public forceEnd() {
    this.flushUpdate()
    this.isStreaming = false
    this.currentStreamMessageIndex = -1
    this.pendingContent = ''
    this.contentChunks = []
  }

  // 获取当前状态
  public getIsStreaming() {
    return this.isStreaming
  }
}
