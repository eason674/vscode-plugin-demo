<template>
  <div class="chat-container">
    <ChatMessages></ChatMessages>
    <ChatInput @enter="chatRequest"></ChatInput>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatInput from './ChatInput.vue'
import ChatMessages from './ChatMessages.vue'
import { sendMessage } from '@/common/vscode'
import { webviewReqCommand } from '@/common/commandname'
import { onMounted, onUnmounted } from 'vue'
import type { IMessagesList } from '@/stores/types/chat'
import type { IAgentRequestEndResponse, ICancelAgentResponse, IChatResponse } from './types'
import { Message } from '@arco-design/web-vue'
const chatStore = useChatStore()

const chatRequest = (content: string) => {
  sendMessage({
    command: webviewReqCommand.CHAT_REQUEST,
    data: {
      content,
    },
  })
}

const configResponse = (data: any) => {
  chatStore.currentModel.name = data.currentModel
  chatStore.pushModelList(data.modelList)
}
const reset = () => {
  chatStore.updateWaiting(false)
}

// 处理流式数据块
let isStreaming = false
let currentStreamMessageIndex = -1
// 处理流式响应
const streamResponse = (data: IChatResponse) => {
  console.log('webview处理流式',data);
  const { content, model, stream, isStreamComplete } = data
  if (stream && isStreamComplete) {
     reset() 
    isStreaming = false
    currentStreamMessageIndex = -1
    return
  }

  // 如果是流式传输的开始，创建新消息并执行reset
  if (!isStreaming) {
    isStreaming = true
   
    // 创建新的消息对象用于流式显示
    const newMessage: IMessagesList = {
      role: 'ai',
      content: '',
      model: model,
    }
    chatStore.messagesList.push(newMessage)
    currentStreamMessageIndex = chatStore.messagesList.length - 1
  }

  // 更新当前流式消息的内容
  if (currentStreamMessageIndex >= 0) {
    const currentMessage = chatStore.messagesList[currentStreamMessageIndex]
    if (currentMessage) {
      currentMessage.content += content
      // 通过替换数组中的元素来触发响应式更新
      chatStore.messagesList[currentStreamMessageIndex] = { ...currentMessage }
    }
  }
}
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
  stream ? streamResponse(data) : invokeResponse(data)
}

// 模型取消返回
const cancelResponse=(data:ICancelAgentResponse)=>{
  const {isCancel,message}=data;
  if(isCancel) {
     Message.success(message)
  }
}

// 本轮对话已经结束
const agentRequestEndResponse=(data:IAgentRequestEndResponse)=>{
  reset()
  isStreaming = false
  currentStreamMessageIndex = -1
}
const responseCommandConfig: any = {
  'chat-response': chatResponse,
  'config-response': configResponse,
  'cancel-agent-response': cancelResponse,
  'agent-request-end-response': agentRequestEndResponse,
}

const handleMessage = (event: any) => {
  let { command, data } = event.data
  console.log(command, 'command')
  console.log(data, 'data')
  responseCommandConfig[command]?.(data)
}
onMounted(() => {
  window.addEventListener('message', handleMessage)
})
onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
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
