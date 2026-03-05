import vscode from "vscode";
import { Agent } from "../../chat/index";
import { currentModel, switchModel } from "../../modules";
import { getModels } from "../../modules";
import { load } from "langchain/load";
import { getModelByName } from "../../modules/deepseek";
import { IDEFROMWEBVIEWREQ } from "../../common/idecommand";
export class ChatUiProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView | any;
  private _context: vscode.ExtensionContext;
  private _agent: Agent;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._agent = new Agent();
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    // const scriptUri = webviewView.webview.asWebviewUri(
    //   vscode.Uri.joinPath(
    //     this._context.extensionUri,
    //     "chat",
    //     "chatui",
    //     "index.js",
    //   ),
    // );
    // const styleUri = webviewView.webview.asWebviewUri(
    //   vscode.Uri.joinPath(
    //     this._context.extensionUri,
    //     "chat",
    //     "chatui",
    //     "index.css",
    //   ),
    // );
    webviewView.webview.html = this.dev();
    // webviewView.webview.html = this.getHtml(scriptUri, styleUri);
    webviewView.webview.onDidReceiveMessage(async (message) => {
      const { command ,data} = message;
      const config: any = {
        [IDEFROMWEBVIEWREQ.WEBVIEW_READY]: (message: any) =>
          this.handleInit(message),
        [IDEFROMWEBVIEWREQ.CHAT_REQUEST]: (message: any) =>
          this.handleChatRequest(message),
        [IDEFROMWEBVIEWREQ.CHANGE_MODEL_REQUEST]: (message: any) =>
          this.handleChangeModel(message),
      };
      config[command]?.(message);
    });
  }

  /**
   * webview初始化ide发送给webview的config数据
   * @param message
   */
  public async handleInit(message: any) {
    this.sendMessageToWebView({
      command: "config-response",
      data: {
        currentModel: currentModel.model,
        modelList: getModels(),
      },
    });
  }

  public async handleChatRequest(message: { data: { userMessage: string } }) {
    let aiResponseContent = await this._agent.request(message.data.userMessage);
    this.sendMessageToWebView({
      command: "chat-response",
      data: {
        content: aiResponseContent,
        model: currentModel.model,
      },
    });
  }

  public async handleChangeModel(message: { data: { model: string } }) {
    console.log(message.data.model, "message.data.model;");
    switch (message.data.model) {
      case "deepseek-chat":
        switchModel("deepseekChat");
        break;
      case "deepseek-reasoner":
        switchModel("deepseekReasoner");
        break;
      default:
        break;
    }
    // this.sendMessageToWebView({
    //   command: "change-model-response",
    //   data: {
    //     model:currentModel.model,
    //   },
    // });
  }

  public sendMessageToWebView(message: { command: string; data?: any }): void {
    this._view?.webview.postMessage(message);
  }
  // 开发环境自动热更新
  public dev() {
    let devUrl = "http://localhost:5180";
    let wsurl = "//localhost:5180";
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="
            default-src 'none';
            style-src ${devUrl} 'unsafe-inline' 'unsafe-eval';
            script-src ${devUrl} 'unsafe-eval' 'unsafe-inline';
            connect-src ws:${wsurl} ${devUrl} vscode-webview:;
            font-src ${devUrl};
          " />
          <title>vscode plugin demo</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" src="${devUrl}/src/main.ts"></script>
        </body>
      </html>
    `;
  }

  private getHtml(scriptUri: vscode.Uri, styleUri: vscode.Uri): string {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" crossorigin rel="stylesheet">
        <title>vscode plugin demo</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" crossorigin src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}
