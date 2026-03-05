import { ChatOpenAI } from "@langchain/openai";

export interface IdeepSeekmodels {
  deepseekChat: ChatOpenAI;
  // deepseekReasoner: ChatOpenAI;
  GLM: ChatOpenAI;
}

export interface IqianWenmodels {
  qianWen: ChatOpenAI;
}
