import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IConfig, IProjectConfig } from './types/config'

// 聊天store
export const useConfigStore = defineStore('config', () => {
  // 当前模型
  const currentModel = reactive<IConfig['currentModel']>({
    name: '',
  })

  // 模型列表
  const modelList = reactive<IConfig['modelList']>([])

  const setConfig = (config:IProjectConfig) => {
    const { currentModel:newCurrentModel, modelList:newModelList} = config
    currentModel.name=newCurrentModel
    modelList.push(...newModelList)
  }

  return {
    currentModel,
    modelList,
    setConfig
  }
})
