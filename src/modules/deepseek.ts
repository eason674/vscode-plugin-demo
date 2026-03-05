import { ChatOpenAI } from "@langchain/openai";
import { IdeepSeekmodels } from "./types";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/**
 * deepseek模型列表
 */
export const deepSeekmodels: IdeepSeekmodels = {
  // 非思考模式
  deepseekChat: new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: "deepseek-chat",
    configuration: { baseURL: process.env.DEEPSEEK_BASE_URL }
  }),
  // 思考模式-不支持tools,暂去掉
  // deepseekReasoner: new ChatOpenAI({
  //   apiKey: process.env.DEEPSEEK_API_KEY,
  //   model: "deepseek-reasoner",
  //   configuration: { baseURL: process.env.DEEPSEEK_BASE_URL }
  // }),
  GLM: new ChatOpenAI({
    apiKey: process.env.GLM_API_KEY,
    model: "glm-4.7",
    configuration: { baseURL: process.env.GLM_BASE_URL }
  })
};

/**
 *
 * @param name 选择的模型名称
 * @returns ChatOpenAI实例
 */
export const getModelByName = (
  name: keyof typeof deepSeekmodels,
): ChatOpenAI => {
  return deepSeekmodels[name];
};


