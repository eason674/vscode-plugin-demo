export interface IChatResponse {
  content: string
  model: string
  isStreamComplete: boolean
  stream: boolean
}


// 本轮对话已经结束
export interface IAgentRequestEndResponse {
  isEnd: boolean
  model: string
  message: string
}

// 取消对话
export  interface ICancelAgentResponse {
  isCancel: boolean
  model: string
  message: string
}
