// 流氏返回前端使用raf处理
class OptimizedStreamManager {
  // UI 更新回调
  private updateUI: Function
  // 消息数组（响应式）
  private messages: any[]
  // ID 到消息的映射
  private messagesMap
  // 流式内容缓存
  private streamingBuffer
  // 待更新的消息 ID
  private pendingUpdates
  // raf id
  private rafId: any | null

  constructor(updateUI: Function) {
    this.updateUI = updateUI
    this.messages = []
    this.messagesMap = new Map()
    this.streamingBuffer = new Map()
    this.pendingUpdates = new Set()
    this.rafId = null
  }

  // 添加消息（一次性）
  addMessage(role: 'user' | 'ai', content: string, isStreaming = true) {
    const message = {
      id: Date.now(),
      role,
      content,
      isStreaming,
      isComplete: !isStreaming,
    }

    this.messages.push(message)
    this.messagesMap.set(message.id, message)

    if (isStreaming) {
      this.streamingBuffer.set(message.id, content)
    }

    // 触发 UI 更新
    this.updateUI(this.messages)

    return message
  }

  // 更新流式消息（高频）
  updateStreaming(messageId:number, chunk:string) {
    // 1. 累积到缓冲区
    const current = this.streamingBuffer.get(messageId) || ''
    const newContent = current + chunk
    this.streamingBuffer.set(messageId, newContent)

    // 2. 标记需要更新
    this.pendingUpdates.add(messageId)

    // 3. 批量调度更新
    this.scheduleUpdate()
  }

  scheduleUpdate() {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      // 批量更新所有待更新的消息
      for (const messageId of this.pendingUpdates) {
        const message = this.messagesMap.get(messageId)
        const newContent = this.streamingBuffer.get(messageId)

        if (message && newContent) {
          // 直接修改消息对象
          message.content = newContent
          message.isStreaming = true
        }
      }

      // 清空待更新队列
      this.pendingUpdates.clear()

      // 触发 UI 更新（只更新变化的部分）
      this.updateUI(this.messages)

      this.rafId = null
    })
  }

  // 完成流式消息
  completeStreaming(messageId:number) {
    const message = this.messagesMap.get(messageId)
    if (message) {
      message.isStreaming = false
      message.isComplete = true
      this.streamingBuffer.delete(messageId)
      // 最终更新
      this.updateUI(this.messages)
    }
  }
}

// // Vue 3 使用示例
// import { shallowRef, triggerRef } from 'vue'

// const messages = shallowRef([])

// const manager = new OptimizedChatManager((newMessages) => {
//   // 只更新数组引用，不深度遍历
//   messages.value = newMessages
// })

// // 接收流式数据
// let currentMessageId = null

// function onStreamStart() {
//   const msg = manager.addMessage('assistant', '', true)
//   currentMessageId = msg.id
// }

// function onStreamChunk(chunk) {
//   if (currentMessageId) {
//     manager.updateStreaming(currentMessageId, chunk)
//   }
// }

// function onStreamEnd() {
//   if (currentMessageId) {
//     manager.completeStreaming(currentMessageId)
//     currentMessageId = null
//   }
// }
