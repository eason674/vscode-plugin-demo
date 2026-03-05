import { ChatOpenAI } from "@langchain/openai";
import { IModels } from "./types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export let currentModel='glm-4.7'
/**
 * 模型列表
 */
export const models:IModels[] = [
  {
    name: "deepseek-v3",
    modelName: "deepseek-chat",
    model: new ChatOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: "deepseek-chat",
      configuration: { baseURL: process.env.DEEPSEEK_BASE_URL },
    }),
  },
  {
    name: "glm-4.7",
    modelName: "glm-4.7",
    model: new ChatOpenAI({
      apiKey: process.env.GLM_API_KEY,
      model: "glm-4.7",
      configuration: { baseURL: process.env.GLM_BASE_URL },
    }),
  },
];

/**
 * 
 * @returns 给前端显示的模型列表
 */
export const getAllModel=()=>{
  return models.map((item) => ({
    name: item.name,
    label: item.modelName,
  }));
}