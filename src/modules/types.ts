import { ChatOpenAI } from "@langchain/openai";

export interface IdeepSeekmodels {
  deepseekChat: ChatOpenAI;
  deepseekReasoner: ChatOpenAI;
}

export interface IqianWenmodels {
  qianWen: ChatOpenAI;
}
