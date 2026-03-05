<template>
  <div class="chat-input-container">
    <div class="relate">
      <icon-plus :size="14" />
      <span>添加参考</span>
    </div>
    <a-textarea
      placeholder="请输入你的问题，按enter发送"
      allow-clear
      @press-enter="handleEnter"
      v-model="inputValue"
    />
    <!--模型列表选择  -->
    <div class="footer">
      <a-select :style="{ width: '200px' }" placeholder="请选择模型" v-model="chatStore.currentModel.name" @change="handleChangeModel" >
        <a-option v-for="model in chatStore.modelList">{{model.name}}</a-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { sendMessage } from '@/common/vscode'
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
const handleEnter = () => {
  pushMessages()
  emits('enter', inputValue.value)
  inputValue.value = ''
}
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()

      break
    case 'ArrowDown':
      event.preventDefault()

      break
    case 'Enter':
      event.preventDefault()
      handleEnter()
      break
    case 'Escape':
      console.log('取消')

      break
  }
}
const handleChangeModel=(model:string)=>{
  console.log('只有一次吧？',model);
  
  sendMessage({
    command:'change-model-request',
    data:{
      model
    }
  })
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

  .relate {
    color: var(--vscode-editor-foreground);
    padding: 8px 12px;
    display: flex;
    align-items: center;
    svg {
      padding: 5px;
      background: var(--vscode-editorWidget-background);
      border-radius: 3px;
    }
    span {
      margin: 0 0 0 10px;
      color: var(--vscode-editor-foreground);
    }
  }
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

  .arco-select-view-single,
  .arco-select,
  .arco-select-view,
  .arco-select-view-size-medium {
    background: none;
  }

  .footer {
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0;
  }
  .arco-select-view-single,
  .arco-select-view-single .arco-select-view-suffix {
    color: var(--vscode-editor-foreground);
  }
  .arco-select-dropdown {
    background: var(--vscode-editorWidget-background);
  }
}
</style>
