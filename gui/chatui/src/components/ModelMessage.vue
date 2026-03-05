<template>
  <div class="model-message-container">
    <div class="title">模型：{{ item.model }}</div>
    <div class="_text" v-html="responseHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { markdownHtml } from '../common/marked'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const responseHtml = computed(() => {
  return markdownHtml(props.item.content)
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
