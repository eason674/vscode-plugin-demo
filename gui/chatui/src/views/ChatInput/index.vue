<template>
  <div class="chat-input-container">
    <!-- 添加参考 -->
    <Relate />
    <!-- 输入框 -->
    <Input />
    <div class="footer">
      <!-- 模型切换 -->
      <ModelChange />
      <!-- 回答icon -->
      <ChatIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Input from './components/Input.vue'
import ModelChange from './components/ModelChange.vue'
import ChatIcon from './components/ChatIcon.vue'
import Relate from './components/Relate.vue'
import { handleEnter } from './service/input'

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      handleEnter()
      break
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss">
.chat-input-container {
  position: relative;
  width: 100%;
  height: 120px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 0 10px 0;
  background: var(--vscode-editor-background);
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
