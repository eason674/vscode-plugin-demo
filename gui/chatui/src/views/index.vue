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
  chatStore.messagesList.push({
    role: 'ai',
    content: data.content,
    model: data.model,
  })
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
