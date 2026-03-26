<template>
  <a-select
    :style="{ width: '120px' }"
    placeholder="请选择模型"
    v-model="configStore.currentModel.name"
    @change="handleChangeModel"
  >
    <a-option v-for="model in configStore.modelList">{{ model.name }}</a-option>
  </a-select>
</template>

<script setup lang="ts">
import { sendMessage } from '@/common/vscode'
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
const handleChangeModel = (model: string) => {
  sendMessage({
    command: 'change-model-request',
    data: {
      model,
    },
  })
}
</script>

<style lang="scss">
.chat-input-container {
  .arco-select-view-single,
  .arco-select,
  .arco-select-view,
  .arco-select-view-size-medium {
    background: none;
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
