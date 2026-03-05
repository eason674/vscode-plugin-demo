export let vscode: any = null
if (!vscode) vscode = (window as any).acquireVsCodeApi()
export const sendMessage = (message: { command: string; data?: any }) => {
  vscode.postMessage({
    command: message.command,
    ...(message.data !== undefined && { 
      data: JSON.parse(JSON.stringify(message.data)) 
    }),
  })
}
