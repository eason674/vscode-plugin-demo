import { createAgent } from "langchain"; // 补全完整导入路径，避免歧义
import { deepSeekmodels, getModelByName } from "./deepseek";
import type { ChatOpenAI } from "@langchain/openai"; // 引入类型，提升类型安全

/** 默认模型名称 */
export const modelName = "deepseekReasoner";

/** 当前激活的模型实例（标注可空类型，避免未赋值使用） */
export let currentModel: ChatOpenAI | undefined | any= getModelByName(modelName);

/** Agent实例（延迟初始化，确保currentModel有效） */
let agent: ReturnType<typeof createAgent> | undefined | any;

/** 初始化Agent（封装逻辑，支持重复调用） */
const initAgent = () => {
  if (!currentModel) {
    throw new Error(`初始化Agent失败：模型 ${modelName} 未找到或初始化失败`);
  }
  agent = createAgent({
    model: currentModel,
    tools: [],
  });
};

// 首次初始化Agent
initAgent();

/**
 * 获取格式化的模型列表
 * 修复点：label逻辑错误（原代码中 || 优先级问题导致判断失效）
 */
export const getModels = (): { name: string; label: string }[] => {
  const models: { name: string; label: string }[] = [];
  // 确保deepSeekmodels是可遍历的对象/数组
  const modelEntries = Array.isArray(deepSeekmodels) 
    ? deepSeekmodels.entries() 
    : Object.entries(deepSeekmodels);

  for (const [_, modelInstance] of modelEntries) {
    if (!modelInstance?.model) continue; // 空值保护
    
    // 修复||逻辑错误：正确判断是否为deepseek系列模型
    const isDeepSeekModel = modelInstance.model === 'deepseek-chat' || modelInstance.model === 'deepseek-reasoner';
    models.push({
      name: modelInstance.model,
      label: isDeepSeekModel ? 'deepseek' : modelInstance.model,
    });
  }
  return models;
};

/**
 * 切换模型并重建Agent
 * @param newModelName 新模型名称（如 'deepseek-chat'）
 */
export const switchModel = (newModelName: any) => {
  try {
    // 获取新模型实例
    const newModel = getModelByName(newModelName);
    if (!newModel) {
      throw new Error(`模型 ${newModelName} 不存在`);
    }

    // 更新当前模型
    currentModel = newModel;
    // 重建Agent
    initAgent();
    
    console.log(`✅ 成功切换到模型：${newModelName}`);
    return newModel;
  } catch (error) {
    console.error(`❌ 切换模型失败：${(error as Error).message}`);
    throw error; // 抛出错误，让调用方感知
  }
};

/** 获取当前有效的Agent实例 */
export const getAgent = () => {
  if (!agent) {
    throw new Error("Agent未初始化，请检查模型配置");
  }
  return agent;
};

// 默认导出（兼容原有用法，添加空值保护）
export default agent;