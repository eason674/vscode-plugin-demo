<template>
<Index></Index>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Index from './views/index.vue';
import { sendMessage } from './common/vscode';
import { webviewReqCommand } from './common/commandname';
onMounted(() => {
  sendMessage({ command: webviewReqCommand.WEBVIEW_READY })
})
</script>



<style></style>