<template>
  <div class="tool-execution-container">
    <div 
      v-for="(tool, index) in toolExecutions" 
      :key="index"
      class="tool-item"
      :class="{ 'running': tool.status === 'running', 'completed': tool.status === 'completed' }"
    >
      <div class="tool-header">
        <span class="tool-icon">
          <span v-if="tool.status === 'running'">⚙️</span>
          <span v-else-if="tool.status === 'completed'">✅</span>
          <span v-else>❌</span>
        </span>
        <span class="tool-name">{{ tool.toolName }}</span>
        <span class="tool-status">
          {{ getStatusText(tool.status) }}
        </span>
      </div>
      
      <!-- 工具输入参数（可折叠） -->
      <div v-if="tool.toolInput && showDetails" class="tool-detail">
        <div class="detail-label">输入:</div>
        <pre class="detail-content">{{ formatJson(tool.toolInput) }}</pre>
      </div>
      
      <!-- 工具输出结果（可折叠） -->
      <div v-if="tool.toolResult && showDetails" class="tool-detail">
        <div class="detail-label">输出:</div>
        <pre class="detail-content">{{ formatJson(tool.toolResult) }}</pre>
      </div>
      
      <!-- 展开/收起按钮 -->
      <div 
        v-if="tool.toolInput || tool.toolResult"
        class="toggle-details"
        @click="toggleDetail(index)"
      >
        {{ expandedIndices.has(index) ? '收起详情' : '查看详情' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IToolExecution } from '@/stores/types/chat'

const props = defineProps<{
  toolExecutions: IToolExecution[]
}>()

// 跟踪哪些工具的执行详情是展开的
const expandedIndices = ref<Set<number>>(new Set())

// 是否显示详细信息
const showDetails = ref(false)

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'running':
      return '执行中...'
    case 'completed':
      return '已完成'
    case 'error':
      return '执行失败'
    default:
      return status
  }
}

// 格式化 JSON
const formatJson = (data: any) => {
  try {
    if (typeof data === 'string') {
      // 尝试解析字符串为 JSON
      const parsed = JSON.parse(data)
      return JSON.stringify(parsed, null, 2)
    }
    return JSON.stringify(data, null, 2)
  } catch (e) {
    // 如果不是 JSON，直接返回字符串
    return String(data)
  }
}

// 切换详情展开/收起
const toggleDetail = (index: number) => {
  if (expandedIndices.value.has(index)) {
    expandedIndices.value.delete(index)
  } else {
    expandedIndices.value.add(index)
  }
  // 触发响应式更新
  expandedIndices.value = new Set(expandedIndices.value)
}
</script>

<style scoped>
.tool-execution-container {
  margin: 8px 0;
  padding: 0;
}

.tool-item {
  background: var(--vscode-editor-inactiveSelectionBackground);
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.tool-item.running {
  border-left: 3px solid #ffa940;
  animation: pulse 1.5s infinite;
}

.tool-item.completed {
  border-left: 3px solid #52c41a;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.tool-icon {
  font-size: 16px;
}

.tool-name {
  font-weight: 600;
  color: var(--vscode-foreground);
  flex: 1;
}

.tool-status {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.tool-detail {
  margin-top: 8px;
  padding: 8px;
  background: var(--vscode-editor-background);
  border-radius: 4px;
  font-size: 12px;
}

.detail-label {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--vscode-descriptionForeground);
}

.detail-content {
  margin: 0;
  padding: 8px;
  background: var(--vscode-textCodeBlock-background);
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.toggle-details {
  margin-top: 6px;
  font-size: 12px;
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
  text-align: right;
  user-select: none;
}

.toggle-details:hover {
  text-decoration: underline;
}
</style>
