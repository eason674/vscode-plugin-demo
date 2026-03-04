<template>
  <div class="model-message-container">
    <div class="title">模型：{{ chatStore.currentModel.name }}</div>
    <div class="_text">{{ item.content }}</div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<style>
.model-message-container {
  margin: 10px 0 0 0;
  padding: 0 10px;
  background: var(--vscode-activityBar-background);
  border-radius: 5px;
  .title {
    font-weight: 600;
    padding: 8px 0;
    border-bottom: 1px solid var(--vscode-editorWidget-border);
  }
  ._text {
    padding: 10px 0;
  }
}
</style>
