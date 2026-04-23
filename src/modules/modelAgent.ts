import {
  AIMessage,
  createAgent,
  createMiddleware,
  summarizationMiddleware,
  tool,
} from "langchain";
import { ChatOpenAI, tools } from "@langchain/openai";
import { currentModel, models, systemPrompt } from ".";
import { mcpClient } from "./modelMcp";
import * as z from "zod";
import {
  HumanMessage,
  RemoveMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";
import { IModels } from "./types";

export class ModelAgent {
  // agent 实例
  private _agent: any;
  // 当前选择的模型
  public currentModelName: string;
  // 模型列表
  private modelsMap: Map<string, ChatOpenAI>;
  // 是否开启流式返回
  private stream: boolean = true;
  // mcp client
  private _mcpClient: any;
  // 初始化agent 控制器
  private agentController: any;
  // agent 配置参数
  private agentConfigurable = {
    configurable: {
      thread_id: "vscode_plugins_demo_999",
    },
    signal: false,
  };
  // 当前中间件
  private middleWareList: any[] = [];

  constructor(initialModelName: string = currentModel) {
    let newModels = this.initModels(models);
    // 组建模型map
    this.modelsMap = new Map(newModels.map((m) => [m.name, m.model]));
    // 当前模型
    this.currentModelName = initialModelName;
    // 传入初始化好的mcp
    this._mcpClient = mcpClient;
    // 初始化 agent 控制器
    this.agentController = new AbortController();
    // 配置好 agent 可取消信号
    this.agentConfigurable.signal = this.agentController.signal;
    // 初始化中间件
    this.initMiddleware();
    // 初始化 agent
    this.initAgent();
  }
  private initModels(models: IModels[]) {
    let newModels: any[] = [];
    models.forEach((model) => {
      newModels.push({
        name: model.name,
        modelName: model.modelName,
        model: new ChatOpenAI({
          apiKey: model.apiKey,
          model: model.modelName,
          configuration: model.configuration,
          streaming: this.stream,
        }),
      });
    });
    return newModels;
  }

  // 裁剪k轮会话中间件
  private trimMessageMiddleWare() {
    // 加载短期记忆中间件-只保持20条最近消息（10轮对话）
    const trimMessages = createMiddleware({
      name: "TrimMessages",
      beforeModel: (state) => {
        const messages = state.messages;
        if (messages.length <= 5) {
          return; // No changes needed
        }
        const firstMsg = messages[0];
        // 获取配置的会话记忆长度
        let memoryLimit =
          (process.env.SESSION_MEMORY_LENGTH
            ? parseInt(process.env.SESSION_MEMORY_LENGTH)
            : 10) * 2;
        // 增加保留条数，例如保留最近 20 条消息（10 轮对话）
        const recentMessages = messages.slice(-memoryLimit);
        const newMessages = [firstMsg, ...recentMessages];
        return {
          messages: [
            new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
            ...newMessages,
          ],
        };
      },
    });
    return trimMessages;
  }
  // summarization 升级版本中间件
  private summarizationMiddleWare() {
    const summMiddleWare = summarizationMiddleware({
      model: this.modelsMap.get(this.currentModelName) || "", // 当前模型
      trigger: { tokens: 2000, messages: 3 }, // 触发条件
      keep: { messages: 20 }, // 消息保持多少条
    });
    return summMiddleWare;
  }
  // 模型切换中间件
  private changeModeliddleWare() {
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
    return modelSwitchMiddleware;
  }
  // 初始化中间件
  private initMiddleware() {
    // let trimMessages = this.trimMessageMiddleWare();
    let changeModelMiddleware = this.changeModeliddleWare();
    let summarizationMiddleWare = this.summarizationMiddleWare();
    // this.middleWareList.push(trimMessages);
    this.middleWareList.push(summarizationMiddleWare);
    this.middleWareList.push(changeModelMiddleware);
  }

  private initAgent() {
    const checkpointer = new MemorySaver();
    // 测试自定义tool--getWeather
    const getWeather = tool((input) => `It's rain in ${input.location}.`, {
      name: "get_weather",
      description: "Get the weather at a location.",
      schema: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
    });

    let currentModel=this.modelsMap.get(this.currentModelName) || [...this.modelsMap][0][1];

    // 创建 Agent，只需要创建一次
    this._agent = createAgent({
      // 默认模型
      model:currentModel,
      tools: [...this._mcpClient.getAllTools(), getWeather],
      systemPrompt: systemPrompt,
      // 添加中间件
      middleware: this.middleWareList,
      checkpointer,
    })
    console.log("agent 创建成功！");
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
   * 主方法，根据是否开启流式返回调用不同的方法
   * @param content
   * @returns
   */
  public async request(content: string, chunkCallback?: Function) {
    // 确保每次有可用的控制器实例可用
    this.ensureSignal();
    if (this.stream) {
      return this.invokeStream(content, chunkCallback);
    } else {
      return this.invoke(content);
    }
  }

  /**
   * 确保signal可用
   */
  private ensureSignal() {
    if (this.agentController.signal.aborted) {
      console.log("🔄 Signal已中止，重新创建AbortController");
      this.agentController = new AbortController();
      this.agentConfigurable.signal = this.agentController.signal;
    }
    return this.agentController;
  }
  private async invokeStream(content: string, chunkCallback?: Function) {
    if (!this._agent) throw new Error("Agent未初始化");
    console.log(`🤖 使用模型 [${this.currentModelName}] 处理请求...`);
    try {
      const stream = await this._agent.streamEvents(
        {
          messages: [{ role: "user", content }],
        },
        this.agentConfigurable,
      );

      return this.streamResponse(stream, chunkCallback);
    } catch (error) {
      console.error(`❌ 模型调用失败:`, error);
      throw error;
    }
  }

  /**
   * 流式返回处理
   * @param stream
   * @returns 返回一个包含完整内容和流式回调的 Promise
   */
  public async streamResponse(
    stream: AsyncGenerator<any>,
    chunkCallback?: Function,
  ) {
    // 全部内容
    let fullResponse = "";
    for await (const event of stream) {
      // 区分流式返回与其他工具返回
      switch (event.event) {
        case "on_chat_model_stream":
          // 模型返回原始conenttent
          const content = event.data?.chunk?.content;
          // 是否有自定义tools_calls返回
          let tools_calls = event.data?.chunk?.tool_calls;
          let hasToolsCalls = tools_calls && tools_calls.length > 0;

          // if (hasToolsCalls) {
          //   console.log("tools_calss 流式输出", event.data?.chunk?.tool_calls);
          //   let toolsResults = await this.handleToolsCalls(tools_calls);
          //   toolsResults.forEach((toolRes: any) => {
          //     let toolName = toolRes.toolName;
          //     if (chunkCallback) {
          //       chunkCallback({
          //         content: toolRes.toolResult,
          //         model: this.currentModelName,
          //         stream: true,
          //         eventType: "text",
          //         toolName: toolName,
          //       });
          //     }
          //   });

          //   return;
          // }

          if (content) {
            fullResponse += content;
            // console.log("流式输出", content);
            if (chunkCallback) {
              chunkCallback({
                content: content,
                model: this.currentModelName,
                stream: true,
                eventType: "text",
              });
            }
          }
          break;

        case "on_tool_start":
          // 工具开始执行
          const toolName = event.name || event.data?.input?.name || "unknown";
          const toolInput = event.data?.input;
          console.log(`🔧 工具开始执行: ${toolName}`, toolInput);
          if (chunkCallback) {
            chunkCallback({
              eventType: "tool_start",
              toolName: toolName,
              toolInput: toolInput,
              model: this.currentModelName,
              stream: true,
            });
          }
          break;

        case "on_tool_end":
          // 工具执行结束
          const toolResult = event.data?.output;
          const endedToolName = event.name || "unknown";
          console.log(`✅ 工具执行完成: ${endedToolName}`, toolResult);
          if (chunkCallback) {
            chunkCallback({
              eventType: "tool_end",
              toolName: endedToolName,
              toolResult: toolResult,
              model: this.currentModelName,
              stream: true,
            });
          }
          break;

        case "on_chain_end":
          // 链执行结束（可能包含工具的中间结果）
          console.log("链执行结束", event.data?.output);
          break;

        case "on_chat_model_end":
          // console.log("流式返回结束", event);
          // // 流氏返回结束
          // if (chunkCallback) {
          //   chunkCallback({
          //     onComplete: true,
          //     content: fullResponse,
          //     stream: this.stream,
          //   });
          // }
          break;
        default:
          // 记录其他事件类型以便调试
          // console.log("未处理的事件类型:", event.event);
          break;
      }
    }
    if (chunkCallback) {
      chunkCallback({
        onComplete: true,
        content: fullResponse,
        stream: this.stream,
        eventType: "complete",
      });
    }
  }

  public async handleToolsCalls(tools_calls: any[]): Promise<any> {
    console.log("tools_calls 流式输出", tools_calls);
    const toolsRegistry: Record<string, () => string> = {
      get_currentTime: () => new Date().toLocaleString(),
    };
    let toolResults = await Promise.all(
      tools_calls.map((item: any) => {
        const toolName = item.name || item.function?.name;
        let toolFunc = toolsRegistry[toolName];
        if (toolFunc && typeof toolFunc === "function") {
          const result = toolFunc();
          return {
            toolName: toolName,
            toolResult: result,
          };
        }
        return null;
      }),
    );
    return toolResults;
  }

  /**
   * 调用 Agent
   */
  public async invoke(content: string) {
    if (!this._agent) throw new Error("Agent未初始化");
    console.log(
      `🤖 使用模型 [${this.currentModelName}] 处理请求...,当前模式-invoke`,
    );
    const startTime = Date.now();
    try {
      const result = await this._agent.invoke(
        {
          messages: [{ role: "user", content }],
        },
        this.agentConfigurable,
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
   * 取消当前 Agent 调用
   */
  public cancelAgent() {
    this.agentController.abort();
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
