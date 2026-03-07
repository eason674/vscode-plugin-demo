<template>
  <div class="user-message-container">
    <div class="title">我</div>
    <div class="_text" v-html="requestHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {markdownHtml} from '../common/marked'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const requestHtml = computed(() => {
  return markdownHtml(props.item.content)
})
</script>

<style>
.user-message-container {
  margin: 10px 0 0 0;
  /* padding: 0 10px; */
  text-align: right;
  /* background: var(--vscode-activityBar-background); */
  /* border-radius: 5px; */
  .title {
    font-weight: 600;
    padding: 8px 0;
    /* border-bottom: 1px solid var(--vscode-editorWidget-border); */
  }
  ._text {
    padding: 5px 10px;
    background: var(--vscode-activityBar-background);
    text-align: right;
     border-radius: 5px;
     /* padding: ; */
    
  }
}
</style>
