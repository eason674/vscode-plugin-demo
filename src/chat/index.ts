import agent from "../modules";

/**
 * @description: 聊天agent管理
 */
export class Agent {
  public async request(userMessage: string) {
    const result = await agent.invoke({
      messages: [{ role: "user", content: userMessage }],
    });
    return this.response(result);
  }
  public response(result: any) {
    console.log("响应处理", result);
    const lastMessage = result.messages.at(-1);
    return lastMessage.content;
  }
}
