<template>
  <div class="model-message-container">
    <div class="title">模型：{{ item.model }}</div>
    
    <!-- 工具执行展示 -->
    <ToolExecution 
      v-if="item.toolExecutions && item.toolExecutions.length > 0"
      :toolExecutions="item.toolExecutions"
    />
    
    <div class="_text" v-html="responseHtml"></div>
    <Toolbar @copy="handleCopy" v-show="item.isStreamComplete" />
  </div>
</template>

<script setup>
import { computed,ref } from 'vue'
import Toolbar from './Toolbar.vue'
import ToolExecution from './ToolExecution.vue'
import { markdownHtml } from '../common/marked'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
// 流式显示text
let displayContent=ref('')

const responseHtml = computed(() => {
  // 如果在模型回答时，即为流式传输中，流式暂时不要格式，直接text
  if(!props.item.isStreamComplete) {
    displayContent.value=props.item.content
    return props.item.content
  }
  return markdownHtml(displayContent.value)
})

const handleCopy = () => {
  navigator.clipboard.writeText(responseHtml.value).then(() => {
    Message.info('已复制')
  })
}
</script>

<style>
.model-message-container {
  margin: 10px 0 0 0;
  /* padding: 0 10px; */
  /* text-align: right; */
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
    /* text-align: right; */
    border-radius: 5px;
    /* padding: ; */
  }
}
</style>
