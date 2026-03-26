import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IChat } from './types/chat'

// 聊天store
export const useConfigStore = defineStore('config', () => {
  // 当前模型
  const currentModel = ref<IChat['currentModel']>({
    name: '',
  })
 
  // 模型列表
  const modelList = ref<IChat['modelList']>([])

  const addModelList = (models: IChat['modelList']) => {
    modelList.value.push(...models)
  }


  return {
    currentModel,
    modelList,
    addModelList,
  }
})
