// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { registerChatUI } from "./pluginscore/chatui";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 注册chatui
  registerChatUI(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
