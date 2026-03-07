# VS Code AI Chat Plugin

一个VS Code AI聊天插件demo，支持多种AI模型和MCP协议，提供智能对话和代码辅助功能。

## 功能特性

- 🤖 **多模型支持**: 集成DeepSeek-V3、GLM-4.7等主流AI模型
- 🔄 **动态切换**: 支持运行时切换不同AI模型
- 💬 **智能对话**: 基于LangChain框架的智能对话系统
- 🔌 **MCP适配**: 集成Model Context Protocol，支持工具调用
- 📊 **会话记忆**: 窗口级别短期记忆，支持K轮会话保持
- ⚡ **流式返回**: 实时流式响应，提升用户体验
- 🎨 **现代化UI**: 基于Vue 3和Arco Design的现代化界面
- 🔧 **可配置性**: MCP服务可配置，模型参数可自定义-开发中

## 技术栈

### VS Code扩展
- **TypeScript** - 类型安全的JavaScript
- **VS Code Extension API** - VS Code插件开发框架
- **LangChain** - AI应用开发框架
- **MCP Adapters** - 模型上下文协议适配器
- **esbuild** - 快速JavaScript打包工具

### 前端界面 (Webview)
- **Vue 3** - 现代化前端框架
- **Arco Design Vue** - 企业级UI组件库
- **Vite** - 快速构建工具

### 支持的AI模型
- **DeepSeek-V3** - 深度求索最新模型，支持128K上下文
- **GLM-4.7** - 智谱AI最新模型，性能优异
- **可扩展架构** - 支持添加更多兼容LangChain的模型-可根据自己的需要基于项目下models/index.ts添加自己的模型，并基于.env配置模型参数

## 快速开始

### 安装依赖
```bash
npm install
```

### 构建项目
```bash
npm run build
```
### 调试插件前置条件
1. 源码默认开启热更新连接webview的dev server，无需手动刷新，在开启插件前要先开启webview的dev server-npm run dev 暴露dev server端口
2. 如若插件打包，请将chatuiprovider重写webview连接的resolveWebviewView方法，将webview的html路径指向打包后的html文件

### 调试插件
1. 按F5启动调试模式
2. 在新窗口中测试插件功能

### 配置环境变量
在项目根目录创建 `.env` 文件，配置AI模型API密钥和基础URL：
```env
# DeepSeek模型配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# GLM模型配置
GLM_API_KEY=your_glm_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4


```

## 使用方法

1. **启动插件**: 在VS Code中安装并启用插件
2. **打开界面**: 在侧边栏找到 "Chat" 图标并点击
3. **选择模型**: 在聊天界面中选择DeepSeek-V3或GLM-4.7模型
4. **开始对话**: 输入问题，插件将提供智能响应
5. **流式体验**: 享受实时流式返回的对话体验
6. **会话记忆**: 当前窗口的对话将保持K轮会话记忆

### 模型特性

#### DeepSeek-V3
- **上下文长度**: 128K tokens
- **对话模式**: Chat模式优化
- **特色功能**: 强大的代码理解和生成能力
- **适用场景**: 编程辅助、技术问答、代码审查

#### GLM-4.7
- **上下文长度**: 128K tokens
- **对话模式**: 通用对话优化
- **特色功能**: 优秀的自然语言理解能力
- **适用场景**: 文档编写、内容创作、问题解答

## 核心模块

#### ModelAgent (模型代理)
负责AI模型的调用和管理，支持：
- 模型初始化配置
- 动态模型切换
- 流式对话处理
- 会话记忆管理（K轮会话保持）

#### ChatUI Provider (聊天界面提供者)
管理Webview界面，处理：
- 界面渲染和通信
- 用户交互响应
- 模型配置同步
- 流式内容实时显示

#### MCP Adapter (MCP适配器)
集成Model Context Protocol，提供：
- 标准化模型接口
- 文件系统工具调用
- HTTP请求工具支持
- 可配置的MCP服务管理

## 环境配置

项目使用 `.env` 文件进行环境变量配置：

```env
# DeepSeek模型配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# GLM模型配置
GLM_API_KEY=your_glm_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4


# 会话配置
SESSION_MEMORY_LENGTH=10  # K轮会话记忆-短期窗口级记忆存于内存
```

## 常见问题

1. **插件无法激活**
   - 检查VS Code版本兼容性
   - 验证Node.js版本
   - 查看开发者控制台错误信息

2. **模型无响应**
   - 验证API密钥和Base URL配置
   - 检查网络连接和代理设置
   - 确认模型服务可用性

3. **流式返回中断**
   - 检查网络稳定性
   - 验证流式传输配置
   - 查看控制台错误信息

4. **MCP服务异常**
   - 检查MCP服务配置
   - 验证文件系统权限
   - 查看MCP连接日志

5. **会话记忆丢失**
   - 检查窗口状态
   - 验证会话存储配置
   - 重启插件尝试恢复

## 扩展开发

### 添加新功能

#### 添加新AI模型
要添加新的AI模型支持：

1. 在 `src/modules/index.ts` 的 `models` 数组中添加新模型配置
2. 更新 `src/modules/types.ts` 中的类型定义
3. 在 `.env` 文件中添加对应的API配置

示例：
```typescript
{
  name: "new-model",
  modelName: "new-model-name",
  model: new ChatOpenAI({
    apiKey: process.env.NEW_MODEL_API_KEY,
    model: "new-model-name",
    configuration: { baseURL: process.env.NEW_MODEL_BASE_URL },
  }),
}
```

#### 配置MCP服务
要添加新的MCP服务：

1. 在 `src/modules/modelMcp.ts` 的 `initMcp` 方法中添加服务配置
2. 配置对应的MCP服务器命令和参数
3. 更新工具调用逻辑
4. 可配置的MCP还在开发中

#### 添加新的Webview视图
要添加新的Webview视图：

1. 在 `src/pluginscore/` 下创建新的视图目录
2. 实现WebviewViewProvider接口
3. 在 `extension.ts` 中注册新的视图提供者
4. 更新 `package.json` 中的视图配置

