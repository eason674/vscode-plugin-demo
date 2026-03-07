import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IChat, IMessagesList } from './types/chat'

export const useChatStore = defineStore('chat', () => {
  // 对话信息列表
  const messagesList = ref<IMessagesList[]>([]) 
  // 当前模型
  const currentModel=ref<IChat['currentModel']>({
    name:'',
  })
  // 模型对话中等待状态
  const waiting=ref<IChat['waiting']>({
    status:false,
    text:'正在生成中...'
  })
  // 模型列表
  const modelList=ref<IChat['modelList']>([])
  // 添加对话信息
  const pushMessages=(message:IMessagesList)=>{
    messagesList.value.push(message)
  }
  const pushModelList=(models:IChat['modelList'])=>{
    modelList.value.push(...models)
  }
  const updateWaiting=(status:boolean,text='正在生成中...')=>{
    waiting.value.status=status
    waiting.value.text=text
  }
  return { messagesList,currentModel,modelList,waiting,pushMessages,pushModelList,updateWaiting}
})
