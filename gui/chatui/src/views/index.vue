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
const chatStore = useChatStore()
const chatRequest = (userMessage: string) => {
  sendMessage({
    command: webviewReqCommand.CHAT_REQUEST,
    data: {
      userMessage,
    },
  })
}

const configResponse = (data: any) => {
  chatStore.currentModel.name = data.currentModel;
  chatStore.pushModelList(data.modelList);
}
const chatResponse = (data: any) => {
  // 创建一个新的消息对象用于打字机效果
  const newMessage = {
    role: 'ai',
    content: '',
    model: data.model,
  };
  chatStore.messagesList.push(newMessage);
  const messageIndex = chatStore.messagesList.length - 1;

  // 获取完整内容并逐步添加到当前消息
  const fullText = data.content;
  let currentIndex = 0;
  
  // 打字机效果
  const typewriterInterval = setInterval(() => {
    if (currentIndex < fullText.length) {
      // 更新消息内容
      newMessage.content = fullText.substring(0, currentIndex + 1);
      // 通过替换数组中的元素来触发响应式更新
      chatStore.messagesList[messageIndex] = {...newMessage};
      currentIndex++;
    } else {
      // 完成后清除定时器
      clearInterval(typewriterInterval);
    }
  }, 30); // 每30毫秒添加一个字符
}

const responseCommandConfig: any = {
  'chat-response': chatResponse,
  'config-response': configResponse,
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