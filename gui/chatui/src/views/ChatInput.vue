<template>
  <div class="chat-input-container">
  <a-textarea placeholder="Please enter something" allow-clear @press-enter="handleEnter" v-model="inputValue"  />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()
const inputValue = ref('')
const emits = defineEmits(['enter'])
// 添加用户信息
const pushMessages = () => {
  chatStore.pushMessages({
    role: 'user',
    content: inputValue.value,
  })
}
const handleEnter = (event: any) => {
  pushMessages()
  emits('enter', event.target.value);
  inputValue.value = ''
}
</script>

<style >
.chat-input-container {
 width: 100%;
 height: 150px;
 border: 1px solid #ccc;
 border-radius: 5px;
}
</style>
