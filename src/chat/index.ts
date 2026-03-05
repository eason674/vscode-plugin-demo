import  { getAgent } from "../modules";

/**
 * @description: 聊天agent管理
 */
export class Agent {
  public async request(userMessage: string) {
    // console.log(agent,'请求前的agent');
    console.log(getAgent(),'试试这个agent');
    let agent=getAgent();
    const result = await agent.invoke({
      messages: [{ role: "user", content: userMessage }],
    });
    return this.response(result);
  }
  public response(result: any) {
    console.log("响应处理", result);
    // let 
    const lastMessage = result.messages.at(-1);
    return lastMessage.content;
  }
}
