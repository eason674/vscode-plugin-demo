# 自定义 Tool 返回与再次询问功能实现指南

## 📋 功能概述

本功能实现了以下特性：
1. **工具执行实时反馈** - 当 AI 调用 MCP 工具时，实时显示工具执行状态
2. **工具输入输出展示** - 可查看工具的输入参数和执行结果
3. **自动追问机制** - AI 基于工具执行结果自动生成后续问题或最终答案
4. **流式更新** - 所有信息都以流式方式实时更新到 UI

## 🎯 实现原理

### 后端流程（LangChain Agent）

```
用户提问 
  ↓
Agent 分析是否需要调用工具
  ↓
【工具开始】→ 发送 tool_start 事件 → 前端显示"执行中..."
  ↓
执行工具（如读取文件、网络请求等）
  ↓
【工具结束】→ 发送 tool_end 事件 → 前端显示"已完成"及结果
  ↓
Agent 基于工具结果继续推理
  ↓
生成文本回复 → 发送 text 事件 → 前端流式显示
  ↓
【完成】→ 发送 complete 事件 → 前端标记对话结束
```

### 前端流程

```
接收后端事件
  ↓
判断事件类型
  ├─ tool_start → 在消息中添加运行中的工具记录
  ├─ tool_end → 更新工具记录为完成状态，显示结果
  ├─ text → 流式追加文本内容
  └─ complete → 标记消息完成
  ↓
UI 自动更新展示
```

## 🔧 已修改的文件

### 1. 后端部分

#### `src/modules/modelAgent.ts`
- 增强了 `streamResponse` 方法
- 添加了 `on_tool_start` 和 `on_tool_end` 事件监听
- 通过 `chunkCallback` 向前端发送工具执行事件

#### 关键代码片段：
```typescript
case "on_tool_start":
  const toolName = event.name || event.data?.input?.name || "unknown";
  const toolInput = event.data?.input;
  if (chunkCallback) {
    chunkCallback({
      eventType: "tool_start",
      toolName: toolName,
      toolInput: toolInput,
      model: this.currentModelName,
      stream: true,
    });
  }
  break;

case "on_tool_end":
  const toolResult = event.data?.output;
  const endedToolName = event.name || "unknown";
  if (chunkCallback) {
    chunkCallback({
      eventType: "tool_end",
      toolName: endedToolName,
      toolResult: toolResult,
      model: this.currentModelName,
      stream: true,
    });
  }
  break;
```

### 2. 前端部分

#### `gui/chatui/src/views/types/index.ts`
扩展了 `IChatResponse` 接口：
```typescript
export interface IChatResponse {
  content: string
  model: string
  isStreamComplete: boolean
  stream: boolean
  // 新增字段
  eventType?: 'text' | 'tool_start' | 'tool_end' | 'complete'
  toolName?: string
  toolInput?: any
  toolResult?: any
}
```

#### `gui/chatui/src/stores/types/chat.ts`
添加了工具执行信息类型：
```typescript
export interface IToolExecution {
  toolName: string
  toolInput?: any
  toolResult?: any
  status: 'running' | 'completed' | 'error'
  timestamp: number
}

export interface IMessagesList {
  // ... 原有字段
  toolExecutions?: IToolExecution[]  // 新增
}
```

#### `gui/chatui/src/common/streamResponse.ts`
增强了流式处理器：
- `handleToolStart()` - 处理工具开始事件
- `handleToolEnd()` - 处理工具结束事件
- 自动管理工具执行列表的状态更新

#### `gui/chatui/src/components/ToolExecution.vue` （新建）
专门用于展示工具执行信息的组件：
- 显示工具名称和状态（执行中/已完成）
- 可折叠的输入/输出详情
- 动画效果（执行中时脉冲动画）

#### `gui/chatui/src/components/ModelMessage.vue`
集成了 `ToolExecution` 组件，在 AI 消息中显示工具执行情况。

## 🚀 使用方法

### 1. 启动开发环境

```bash
# 终端 1: 启动前端开发服务器
cd gui/chatui
npm run dev

# 终端 2: 启动 VS Code 插件调试
# 按 F5 启动调试
```

### 2. 测试工具调用

在聊天窗口中输入需要调用工具的查询，例如：

**示例 1：文件系统操作**
```
请读取当前目录下的 package.json 文件内容
```

**示例 2：网络请求**
```
请访问 https://jsonplaceholder.typicode.com/posts/1 并告诉我返回的内容
```

**示例 3：组合操作**
```
先读取 README.md 的内容，然后总结一下主要功能
```

### 3. 观察效果

当 AI 调用工具时，你会看到：

1. **工具开始执行**
   - 显示 ⚙️ 图标
   - 工具名称高亮
   - 状态显示"执行中..."
   - 有脉冲动画效果

2. **工具执行完成**
   - 图标变为 ✅
   - 状态显示"已完成"
   - 可以点击"查看详情"查看输入和输出

3. **AI 继续回答**
   - 基于工具结果生成文本回答
   - 流式显示在工具执行信息下方

## 🎨 自定义配置

### 调整工具详情默认展开

在 `ToolExecution.vue` 中修改：
```typescript
const showDetails = ref(true)  // 改为 true 默认展开
```

### 修改更新频率

在 `streamResponse.ts` 中调整：
```typescript
private streamUpdateTime = 50  // 毫秒，越小更新越频繁
```

### 自定义工具执行样式

在 `ToolExecution.vue` 的 `<style>` 部分修改 CSS 变量或直接修改样式。

## 🔍 调试技巧

### 1. 查看后端日志

在 VS Code 调试控制台中可以看到：
```
🔧 工具开始执行: read_file { path: "package.json" }
✅ 工具执行完成: read_file { content: "{...}" }
```

### 2. 查看前端控制台

浏览器控制台中会打印接收到的事件数据。

### 3. 检查消息结构

在 Vue DevTools 中查看 `chatStore.messagesList`，可以看到完整的消息结构包括 `toolExecutions` 数组。

## 📝 添加自定义 Tool

如果你想添加自己的工具，需要在 `src/modules/modelMcp.ts` 中配置：

```typescript
this._client = new MultiServerMCPClient({
  // 现有工具
  filesystem: { ... },
  fetch: { ... },
  
  // 添加工具
  myCustomTool: {
    transport: "stdio",
    command: "npx",
    args: ["-y", "@your-org/custom-mcp-server"],
  },
});
```

## ⚠️ 注意事项

1. **性能考虑**
   - 工具执行的输入/输出可能很大，建议对大对象进行截断显示
   - 可以在 `ToolExecution.vue` 中添加最大长度限制

2. **安全性**
   - 工具输出可能包含敏感信息，生产环境需要脱敏处理
   - 建议在显示前对 `toolResult` 进行过滤

3. **错误处理**
   - 当前实现假设工具都会成功执行
   - 可以增强 `handleToolEnd` 来检测错误状态

4. **内存管理**
   - 长时间对话会积累大量工具执行记录
   - 可以考虑定期清理旧的工具执行历史

## 🎯 下一步优化建议

1. **工具执行进度条** - 对于耗时较长的工具显示进度
2. **重试机制** - 工具失败时提供重试按钮
3. **工具执行历史** - 单独页面查看所有工具调用历史
4. **性能监控** - 统计每个工具的执行时间
5. **智能折叠** - 自动折叠不重要的工具执行细节

## 📞 问题排查

如果工具执行信息没有显示：

1. 检查后端是否正确发送事件（查看 VS Code 控制台）
2. 检查前端是否正确接收事件（查看浏览器控制台）
3. 确认 `eventType` 字段是否正确传递
4. 验证 `toolExecutions` 数组是否正确添加到消息对象

---

**实现完成！** 现在你的 VS Code 插件已经支持完整的工具执行可视化功能。🎉
