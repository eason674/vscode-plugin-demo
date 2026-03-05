import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import vscode from "vscode";
let client: any;

export const initMcp = async() => {
//   const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
//   console.log('准备初始化MCP客户端，工作目录:', workspaceFolder);
  
//   try {
//     client = new MultiServerMCPClient({
//       filesystem: {
//         transport: "stdio",
//         command: "npx",
//         args: [
//           "-y",  // 强制安装最新版本
//           "@modelcontextprotocol/server-filesystem",
//           workspaceFolder || process.cwd(),
//         ],
//       },
//     });
//     console.log('MCP客户端实例已创建:', !!client);

//     // // 尝试初始化连接
//     const toolsMap = await client.initializeConnections();
//     console.log('MCP客户端初始化成功，获得工具映射:', toolsMap);
    
//     // 额外获取工具验证连接
//     const tools = await client.getTools();
//     console.log('从MCP获取的工具:', tools);
    
//     return true;
//   } catch (error) {
//     console.error('MCP客户端初始化失败:', error);
//     console.error('错误详情:', error instanceof Error ? error.message : error);
//     return false;
//   }
 client = new MultiServerMCPClient({
  filesystem: {
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
  },
});

await client.initializeConnections();

const tools = await client.getTools();
console.log(tools,'tools');

console.log(tools.map((t: any) => t.name));
return tools
};

export const allTools = async () => {
  if (!client) {
    console.error('MCP客户端未初始化');
    return [];
  }
  
  try {
    // 确保客户端已连接后再获取工具
    const tools = await client.getTools();
    return tools;
  } catch (error) {
    console.error('获取MCP工具列表失败:', error);
    return [];
  }
};


