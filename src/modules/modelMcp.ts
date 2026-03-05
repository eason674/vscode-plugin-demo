import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { StructuredToolInterface } from "@langchain/core/tools";

export class ModelMcp {
  private _client!: MultiServerMCPClient;
  private allTools: StructuredToolInterface[] = [];
  constructor() {
    this.initMcp();
  }

  public getMcpClient() {
    if (!this._client) {
      throw new Error(`当前 MCP 客户端不存在`);
    }
    return this._client;
  }
  public getAllTools() {
    if (!this.allTools.length) {
      console.log("当前无tools");
    }
    return this.allTools;
  }
  private async initMcp() {
    this._client = new MultiServerMCPClient({
      // 内置mcp-文件系统操作
      filesystem: {
        transport: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
      },
      // 内置mcp-fetch
      fetch: {
        command: "npx",
        args: ["-y", "@tokenizin/mcp-npx-fetch"],
        // 添加重启设置
        restart: {
          enabled: true,
          maxAttempts: 3,
          delayMs: 3000, // 增加重试延迟
        },
      },
    });
    // await this._client.initializeConnections();
    let tools = await this._client.getTools();
    this.allTools = tools;
    console.log("MCP 初始化成功！");
  }
}

export const mcpClient = new ModelMcp();
