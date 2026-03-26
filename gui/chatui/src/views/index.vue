<template>
  <div class="chat-container">
    <ChatMessages></ChatMessages>
    <ChatInput></ChatInput>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatInput from './ChatInput/index.vue'
import ChatMessages from './ChatMessages.vue'
import { onMounted, onUnmounted } from 'vue'
import type { IMessagesList } from '@/stores/types/chat'
import type {
  ICancelAgentResponse,
  IChatResponse,
  ResponseCommandKey,
} from './types'
import { Message } from '@arco-design/web-vue'
import { useConfigStore } from '@/stores/config'
import { ideResCommand } from '@/common/commandname'
import { StreamHandler } from '@/common/streamResponse'

const chatStore = useChatStore()
const configStore = useConfigStore()

// 结束对话
const reset = () => {
  chatStore.updateWaiting(false)
}

// 流氏响应handler
const streamHandler = new StreamHandler(chatStore, () => {
  console.log('流氏响应结束')
  reset()
})

// 处理非流式响应
const invokeResponse = (data: IChatResponse) => {
  // 创建一个新的消息对象用于打字机效果
  const newMessage: IMessagesList = {
    role: 'ai',
    content: '',
    model: data.model,
  }
  chatStore.messagesList.push(newMessage)
  const messageIndex = chatStore.messagesList.length - 1
  // 获取完整内容并逐步添加到当前消息
  const fullText = data.content
  let currentIndex = 0
  // 打字机效果
  const typewriterInterval = setInterval(() => {
    if (currentIndex < fullText.length) {
      // 更新消息内容
      newMessage.content = fullText.substring(0, currentIndex + 1)
      // 通过替换数组中的元素来触发响应式更新
      chatStore.messagesList[messageIndex] = { ...newMessage }
      currentIndex++
    } else {
      // 完成后清除定时器
      clearInterval(typewriterInterval)
    }
  }, 30) // 每30毫秒添加一个字符
}

const chatResponse = (data: IChatResponse) => {
  const { stream } = data
  !stream && reset()
  stream ? streamHandler.handleStreamResponse(data) : invokeResponse(data)
}

// 模型取消返回
const cancelResponse = (data: ICancelAgentResponse) => {
  const { isCancel, message } = data
  if (isCancel) {
    Message.success(message)
  }
}

// ide返回响应处理
const responseCommandConfig: Record<ResponseCommandKey, Function> = {
  // 聊天响应
  [ideResCommand.CHAT_RESPONSE]: chatResponse,
  // 配置响应
  [ideResCommand.CONFIG_RESPONSE]: configStore.setConfig,
  // 取消聊天响应
  [ideResCommand.CANCEL_RESPONSE]: cancelResponse,
  // 聊天本轮会话结束
  // [ideResCommand.CHAT_REQUEST_END_RESPONSE]: agentRequestEndResponse,
}

// ide响应接口消息处理
const _handleMessage = (event: any) => {
  let { command, data } = event.data
  responseCommandConfig[command]?.(data)
}

onMounted(() => {
  window.addEventListener('message', _handleMessage)
})
onUnmounted(() => {
  window.removeEventListener('message', _handleMessage)
})
</script>

<style>
.chat-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
