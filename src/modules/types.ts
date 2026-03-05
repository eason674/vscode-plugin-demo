import { ChatOpenAI } from "@langchain/openai";

export interface IModels {
  name: string;
  modelName: string;
  model: ChatOpenAI;
}
