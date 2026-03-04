<template>
  <div class="model-message-container">
    <div>{{ chatStore.currentModel.name }}</div>
    <div class="_text">{{ item.content }}</div>
  </div>
</template>

<script setup>
import {useChatStore} from '@/stores/chat'
const chatStore = useChatStore()
const props=defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<style >
.model-message-container {
 ._text{
    padding: 10px 0;
 }
}
</style>