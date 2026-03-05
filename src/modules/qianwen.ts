import { ChatOpenAI } from "@langchain/openai";
import {  IqianWenmodels } from "./types";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/**
 * deepseek模型列表
 */
export const qianWenmodels: IqianWenmodels = {
  qianWen: new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: "qwen3-coder-plus",
    configuration: { baseURL: process.env.DEEPSEEK_BASE_URL }
  }),
  
};



