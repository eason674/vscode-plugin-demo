<template>
  <div class="model-message-container">
    <div>{{ chatStore.currentModel }}</div>
    <div class="_text">ai</div>
  </div>
</template>

<script setup>
import {useChatStore} from '@/stores/chat'
const chatStore = useChatStore()
</script>

<style >
.model-message-container {
 ._text{
    padding: 10px 0;
 }
}
</style>