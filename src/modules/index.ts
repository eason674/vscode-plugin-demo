import { createAgent } from "langchain";
import { deepSeekmodels, getModelByName} from "./deepseek";

export const modelName='deepseekReasoner'
export const currentModel =getModelByName(modelName) 

const modelList=deepSeekmodels as any

 const agent = createAgent({
  model: currentModel, 
  tools:[]
});

export const getModels = (): any[] => {
  let models: any[] = [];
  for (const key in modelList) {
    const modelInstance = modelList[key as any];
    models.push({
      name: modelInstance.model,
      label:modelInstance.model==='deepseek-chat' || 'deepseek-reasoner'?'deepseek':modelInstance.model,
    });
  }
  return models;
};


export default agent;