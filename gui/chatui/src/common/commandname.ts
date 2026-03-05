// webview向ide发送请求
export const webviewReqCommand = {
  WEBVIEW_READY: 'webview-ready',
  CHAT_REQUEST: 'chat-request',

}
// ide向webview响应
export const ideResCommand = {
  CHAT_RESPONSE: 'chat-response',
}