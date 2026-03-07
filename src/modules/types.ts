import { ChatOpenAI } from "@langchain/openai";

export interface IModels {
  name: string;
  modelName: string;
  apiKey: string;
  configuration: { baseURL: string };
}
