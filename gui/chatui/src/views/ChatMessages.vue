<template>
  <div class="chat-messages-contaier">
    <template v-if="chatStore.messagesList.length">
      <template v-for="item in chatStore.messagesList">
        <UserMessage :item="item.role=='user'?item:''"></UserMessage>
        <ModelMessage :item="item.role=='ai'?item:''"></ModelMessage>
      </template>
    </template>
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chat'
import UserMessage from '@/components/UserMessage.vue'
import ModelMessage from '@/components/ModelMessage.vue'
const chatStore = useChatStore()
</script>

<style>
.chat-messages-contaier {
  flex: 1;
  width: 100%;
  height: calc(100vh - 150px);
}
</style>
