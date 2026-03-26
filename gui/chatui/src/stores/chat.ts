import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IChat, IMessagesList } from './types/chat'

// 聊天store
export const useChatStore = defineStore('chat', () => {
  // 对话信息列表
  const messagesList = ref<IMessagesList[]>([])

  // 模型对话中等待状态
  const waiting = ref<IChat['waiting']>({
    status: false,
    text: '正在生成中...',
  })

  // 添加对话信息列表
  const addMessages = (messages: IMessagesList | IMessagesList[]) => {
    // 处理单个消息
    if (!Array.isArray(messages)) {
      const newMessage = {
        ...messages,
        id: messages.id || Date.now(),
      }
      messagesList.value.push(newMessage)
      return
    }
    // 处理多个消息
    const newMessages = messages.map((msg) => ({
      ...msg,
      id: msg.id || Date.now() + Math.random(),
    }))
    messagesList.value.push(...newMessages)
  }


  const updateWaiting = (status: boolean, text = '正在生成中...') => {
    waiting.value.status = status
    waiting.value.text = text
  }

  return {
    messagesList,
    waiting,
    addMessages,
    updateWaiting,
  }
})
