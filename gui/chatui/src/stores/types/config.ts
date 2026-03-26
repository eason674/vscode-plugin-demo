export interface IConfig {
    // 当前模型
  currentModel: {
    name: string
  }
  //  当前可用模型列表
  modelList: {
    name: string
    label: string
  }[]
}

export interface IProjectConfig{
    currentModel:string,
    modelList:IConfig['modelList']
}