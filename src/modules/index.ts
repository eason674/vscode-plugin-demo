import { ChatOpenAI } from "@langchain/openai";
import { IModels } from "./types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// 当前选择模型
export let currentModel = "glm-4.7";
/**
 * 模型列表
 */
export const models: IModels[] = [
  {
    name: "deepseek-v3",
    modelName: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY as string,
    configuration: { baseURL: process.env.DEEPSEEK_BASE_URL as string },
  },
  {
    name: "glm-4.7",
    modelName: "glm-4.7",
    apiKey: process.env.GLM_API_KEY as string,
    configuration: { baseURL: process.env.GLM_BASE_URL as string },
  },
];

/**
 *
 * @returns 给前端显示的模型列表
 */
export const getAllModel = () => {
  return models.map((item) => ({
    name: item.name,
    label: item.modelName,
  }));
};
