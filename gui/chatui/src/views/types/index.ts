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