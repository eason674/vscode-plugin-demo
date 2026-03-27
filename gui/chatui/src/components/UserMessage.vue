<template>
  <div class="user-message-container">
    <div class="title">我</div>
    <div class="_text" v-html="requestHtml"></div>
    <Toolbar @copy="handleCopy" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Toolbar from './Toolbar.vue'
import { markdownHtml } from '../common/marked'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const requestHtml = computed(() => {
  return markdownHtml(props.item.content)
})

// 复制文本
const handleCopy = () => {
  navigator.clipboard.writeText(props.item.content).then(() => {
    Message.info('已复制')
  })
}
</script>

<style lang="scss">
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
  // .content {
  //   direction: rtl;
  //   text-align: right;
  //   border-radius: 5px;
  //   display: inline-block;

  ._text {
    background: var(--vscode-activityBar-background);
    /* width: fit-content; */
    padding: 5px 10px;
    /* text-align: right; */
    direction: rtl;
    text-align: left;
    border-radius: 5px;
    display: inline-block;
    text-align: left;
    /* padding: ; */
  }
  // }
}
</style>
