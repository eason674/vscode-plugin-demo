<template>
  <div class="footer-right">
    <icon-send
      v-if="!chatStore.waiting.status"
      :style="{ color: inputValue.trim() !== '' ? '#76ed96' : '' }"
      @click="handleEnter"
      class="send-icon"
    />
    <icon-record-stop
      v-else
      :style="{ color: chatStore.waiting.status ? '#76ed96' : '' }"
      @click="handleCancelRequest"
      class="cancel-icon"
    ></icon-record-stop>
  </div>
</template>

<script setup lang="ts">
import { handleEnter } from '../service/input'
import { useChatStore } from '@/stores/chat'
import { inputValue } from '../service/input'
import { sendMessage } from '@/common/vscode'
import { webviewReqCommand } from '@/common/commandname'

const chatStore = useChatStore()

const handleCancelRequest = () => {
  console.log('用户要取消模型回答')
  // 更新等待状态
  chatStore.updateWaiting(false)
  sendMessage({
    command: webviewReqCommand.CANCEL_AGENT_REQUEST,
  })
}
</script>

<style lang="scss">
.chat-input-container {
  .footer {
    .footer-right {
      margin: 0 5px 0 0;
      .send-icon,
      .cancel-icon {
        padding: 5px;
        border-radius: 5px;
        background: var(--vscode-activityBar-background);
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
