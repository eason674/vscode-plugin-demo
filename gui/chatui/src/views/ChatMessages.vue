<template>
  <div class="chat-messages-contaier">
    <template v-if="chatStore.messagesList.length">
      <template v-for="item in messagesList">
        <UserMessage :item="item" v-if="item.role=='user'"></UserMessage>
        <ModelMessage v-if="item.role=='ai'" :item="item"></ModelMessage>
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import UserMessage from '@/components/UserMessage.vue'
import ModelMessage from '@/components/ModelMessage.vue'
const chatStore = useChatStore()
const messagesList = computed(() => chatStore.messagesList)
</script>

<style>
.chat-messages-contaier {
  padding: 0 10px;
  flex: 1;
  width: 100%;
  height: calc(100vh - 130px);
  /* background: var(--vscode-); */
}
</style>
