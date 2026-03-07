import vscode from "vscode";
import { ModelAgent } from "../../modules/modelAgent";
import { currentModel, getAllModel } from "../../modules";
import { IDEFROMWEBVIEWREQ, IDETOWEBVIEWREP } from "../../common/idecommand";
export class ChatUiProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView | any;
  private _context: vscode.ExtensionContext;
  private _agent: any;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }
  private initAgent() {
    if (!this._agent) {
      this._agent = new ModelAgent();
    }
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
      const { command, data } = message;
      const config: any = {
        [IDEFROMWEBVIEWREQ.WEBVIEW_READY]: (data: any) => this.handleInit(),
        [IDEFROMWEBVIEWREQ.CHAT_REQUEST]: (data: any) =>
          this.handleRequest(data),
        [IDEFROMWEBVIEWREQ.CHANGE_MODEL_REQUEST]: (data: any) =>
          this.handleChangeModel(data),
        [IDEFROMWEBVIEWREQ.CANCEL_AGENT_REQUEST]: (data: any) =>
          this.handleCancelRequest(),
      };
      config[command]?.(data);
    });
  }

  /**
   * webview初始化ide发送给webview的config数据
   *
   */
  public async handleInit() {
    this.sendMessageToWebView({
      command: IDETOWEBVIEWREP.CONFIG_RESPONSE,
      data: {
        currentModel: currentModel,
        modelList: getAllModel(),
      },
    });
  }

  /**
   * 流式返回chunck 处理
   * @param data
   * @returns
   */
  private onChunk(data: any) {
    const { content, model, stream } = data;
    if (data.onComplete) {
      this.sendMessageToWebView({
        command: IDETOWEBVIEWREP.CHAT_RESPONSE,
        data: {
          content: "",
          isStreamComplete: true,
          stream: stream,
          model: model,
        },
      });
      return;
    } else {
      this.sendMessageToWebView({
        command: IDETOWEBVIEWREP.CHAT_RESPONSE,
        data: {
          content,
          model: model,
          stream: stream,
          isStreamComplete: false,
        },
      });
    }
  }
  /**
   * 发送请求
   * @param data
   */
  public async handleRequest(data: { content: string }) {
    await this.initAgent();
    let aiContent = await this._agent.request(
      data.content,
      this.onChunk.bind(this),
    );
    let model = this._agent.getCurrentModelInfo();
    if (aiContent) {
      // 非流式响应
      this.sendMessageToWebView({
        command: IDETOWEBVIEWREP.CHAT_RESPONSE,
        data: {
          content: aiContent,
          model: model.currentModel,
          stream: false,
        },
      });
    }
  }

  /**
   * 取消agent调用-停止回答
   */
  public async handleCancelRequest() {
    await this._agent.cancelAgent();
    // 取消成功通知webview
    this.sendMessageToWebView({
      command: IDETOWEBVIEWREP.CANCEL_AGENT_RESPONSE,
      data: {
        isCancel: true,
        model: this._agent.getCurrentModelInfo().currentModel,
        message: `"${this._agent.getCurrentModelInfo().currentModel}"模型取消成功`,
      },
    });
    // 通知本轮对话已结束
     this.sendMessageToWebView({
      command: IDETOWEBVIEWREP.AGENT_REQUEST_END_RESPONSE,
      data: {
        isEnd: true,
        model: this._agent.getCurrentModelInfo().currentModel,
        message: `本轮会话已结束`,
      },
    });
  }
  /**
   * 切换模型
   * @param data
   */
  public async handleChangeModel(data: { model: string }) {
    let newModel = data.model;
    console.log(newModel, "要切换的model");
    this._agent.switchModel(newModel);
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
