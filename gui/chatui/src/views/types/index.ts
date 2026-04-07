import type { ideResCommand } from "@/common/commandname"

export interface IChatResponse {
  // 模型返回内容
  content: string
  // 当前模型返回名称
  model: string
  // 是否流式返回结束
  isStreamComplete: boolean
  // 是否流式返回
  stream: boolean
  // 事件类型：text-文本流, tool_start-工具开始, tool_end-工具结束, complete-完成
  eventType?: 'text' | 'tool_start' | 'tool_end' | 'complete'
  // 工具名称（当事件类型为 tool_start 或 tool_end 时）
  toolName?: string
  // 工具输入参数（当事件类型为 tool_start 时）
  toolInput?: any
  // 工具执行结果（当事件类型为 tool_end 时）
  toolResult?: any
}


// 本轮对话已经结束
export interface IAgentRequestEndResponse {
  // 本轮对话是否结束
  isEnd: boolean
  // 当前模型名称
  model: string
  // 对话结束提示消息
  message: string
}

// 取消对话
export  interface ICancelAgentResponse {
  // 是否取消当前对话
  isCancel: boolean
  // 当前模型名称
  model: string
  // 取消当前对话消息提示
  message: string
}

export type ResponseCommandKey = typeof ideResCommand[keyof typeof ideResCommand];