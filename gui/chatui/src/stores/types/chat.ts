// 聊天对话消息
export interface IMessagesList {
  // 消息角色
  role: 'user' | 'ai'
  //   消息内容
  content: string
  //   如果是ai返回的，则为当前使用的模型名称
  model?: string
}

// 对话所有状态
export interface IChat {
  // 聊天对话消息list
  messagesList: IMessagesList[]
  // 当前模型
  currentModel: {
    name: string
  }
  // 模型对话中等待状态
  waiting: {
    status: boolean
    text: string
  }
  //  当前可用模型列表
  modelList: {
    name: string
    label: string
  }[]
}
