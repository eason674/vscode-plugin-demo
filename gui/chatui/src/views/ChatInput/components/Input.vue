<template>
  <a-textarea allow-clear v-model="inputValue" :placeholder="inputPlaceholder" />
</template>

<script setup>
import { inputPlaceholder, inputValue } from '@/views/ChatInput/service/input'
</script>

<style lang="scss">
.chat-input-container {
  .arco-textarea-wrapper {
    background: none;
    color: var(--vscode-editor-foreground);
    height: 50px;
  }
  .arco-textarea-wrapper:focus-within,
  .arco-textarea-wrapper.arco-textarea-focus {
    border-color: transparent;
  }
  .arco-textarea {
    resize: none;
  }
}
</style>
