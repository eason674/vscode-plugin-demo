// 工具执行信息
export interface IToolExecution {
  // 工具名称
  toolName: string
  // 工具输入
  toolInput?: any
  // 工具输出结果
  toolResult?: any
  // 执行状态：running-执行中, completed-已完成, error-错误
  status: 'running' | 'completed' | 'error'
  // 执行时间戳
  timestamp: number
}

// 聊天对话消息
export interface IMessagesList {
  id?:number,
  // 消息角色
  role: 'user' | 'ai'
  //   消息内容
  content: string
  //   如果是ai返回的，则为当前使用的模型名称
  model?: string
  // 是否流式返回完成
  isStreamComplete?:boolean
  // 工具执行列表（可选）
  toolExecutions?: IToolExecution[]
}

// 对话所有状态
export interface IChat {
  // 聊天对话消息list
  messagesList: IMessagesList[]
 
  // 模型对话中等待状态
  waiting: {
    status: boolean
    text: string
  }
  
}