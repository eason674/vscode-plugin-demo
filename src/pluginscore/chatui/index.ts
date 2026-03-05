import vscode from 'vscode';
import { ChatUiProvider } from './chatuiprovider';

/**
 * @param context vscode.ExtensionContext
 * @description 注册ChatUI
 */
export const registerChatUI=(context:vscode.ExtensionContext)=>{
  const provider = new ChatUiProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('vscode-plugin-demo-chat', provider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    })
  );
}

