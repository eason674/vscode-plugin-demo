import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  // 对话信息列表
  const messagesList = ref<any[]>([]) 
  // 当前模型
  const currentModel=ref({
    name:'',
  })
  // 模型列表
  const modelList=ref<any[]>([])
  // 添加对话信息
  const pushMessages=(message:any)=>{
    messagesList.value.push(message)
  }
  const pushModelList=(models:any[])=>{
    modelList.value.push(...models)
  }
  return { messagesList,currentModel,modelList,pushMessages,pushModelList}
})
