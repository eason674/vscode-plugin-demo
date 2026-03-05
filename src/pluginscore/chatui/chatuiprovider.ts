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
    if(!this._agent) {
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
   * 发送请求
   * @param data
   */
  public async handleRequest(data: { content: string } ) {
    await this.initAgent();
    let aiResponseContent = await this._agent.invoke(data.content);
    let model=this._agent.getCurrentModelInfo();
    this.sendMessageToWebView({
      command: IDETOWEBVIEWREP.CHAT_RESPONSE,
      data: {
        content: aiResponseContent,
        model: model.currentModel
      },
    });
  }
  /**
   * 切换模型
   * @param data
   */
  public async handleChangeModel(data: { model: string } ) {
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
