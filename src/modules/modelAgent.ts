import { AIMessage, createAgent, createMiddleware } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { currentModel, models } from ".";
import { mcpClient } from "./modelMcp";
import { RemoveMessage } from "@langchain/core/messages";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

export class ModelAgent {
  // agent 实例
  private _agent: any;
  // 当前选择的模型
  public currentModelName: string;
  // 模型列表
  private modelsMap: Map<string, ChatOpenAI>;
  // 是否开启流式返回
  private steram: boolean = false;

  private _mcpClient: any;

  constructor(initialModelName: string = currentModel) {
    // 组建模型map
    this.modelsMap = new Map(models.map((m) => [m.name, m.model]));
    // 当前模型
    this.currentModelName = initialModelName;
    // 传入初始化好的mcp
    this._mcpClient = mcpClient;
    // 初始化 agent
    this.initAgent();
  }

  private initAgent() {
    // 创建中间件：在每次模型调用前动态选择模型
    const modelSwitchMiddleware = createMiddleware({
      name: "ModelSwitchMiddleware",
      // wrapModelCall 钩子：拦截每次 LLM 调用[citation:7][citation:9]
      wrapModelCall: async (request, next) => {
        // 获取当前要使用的模型
        const model = this.modelsMap.get(this.currentModelName);
        if (!model) {
          throw new Error(`模型 ${this.currentModelName} 不存在`);
        }
        request.model = model;
        return next(request);
      },
    });
    // 加载短期记忆中间件-只保持3条最近消息
    const trimMessages = createMiddleware({
      name: "TrimMessages",
      beforeModel: (state) => {
        const messages = state.messages;
        if (messages.length <= 5) {
          return; // No changes needed
        }
        const firstMsg = messages[0];
        // 增加保留条数，例如保留最近 6 条消息（3 轮对话）
        const recentMessages = messages.slice(-6);
        const newMessages = [firstMsg, ...recentMessages];
        return {
          messages: [
            new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
            ...newMessages,
          ],
        };
      },
    });

    const checkpointer = new MemorySaver();
    // 创建 Agent，只需要创建一次
    this._agent = createAgent({
      // 默认模型
      model: this.modelsMap.get(this.currentModelName) || models[0].model,
      tools: this._mcpClient.getAllTools(),
      systemPrompt: "You are a helpful assistant.",
      // 添加中间件
      middleware: [modelSwitchMiddleware, trimMessages],
      checkpointer,
    });
  }

  /**
   * 切换模型
   */
  public switchModel(modelName: string) {
    if (!this.modelsMap.has(modelName)) {
      throw new Error(
        `模型 ${modelName} 不存在，可用模型: ${Array.from(this.modelsMap.keys()).join(", ")}`,
      );
    }
    this.currentModelName = modelName;
    console.log(`🔄 已切换到模型: ${modelName}`);
  }

  /**
   * 调用 Agent
   */
  public async invoke(content: string) {
    if (!this._agent) throw new Error("Agent未初始化");
    console.log(`🤖 使用模型 [${this.currentModelName}] 处理请求...`);
    const startTime = Date.now();
    try {
      const result = await this._agent.invoke(
        {
          messages: [{ role: "user", content }],
        },
        {
          configurable: {
            thread_id: "vscode_plugins_demo_999",
          },
        },
      );
      const duration = Date.now() - startTime;
      console.log(`📊 调用耗时: ${duration}ms`);
      return this.invokeResponse(result);
    } catch (error) {
      console.error(`❌ 模型调用失败:`, error);
      throw error;
    }
  }

  private invokeResponse(result: { messages: AIMessage[] }) {
    const lastMessage = result.messages.at(-1) as AIMessage;
    console.log(lastMessage, "model response");
    return lastMessage.content;
  }

  /**
   * 获取当前模型信息
   */
  public getCurrentModelInfo() {
    return {
      currentModel: this.currentModelName,
      availableModels: Array.from(this.modelsMap.keys()),
    };
  }
}
