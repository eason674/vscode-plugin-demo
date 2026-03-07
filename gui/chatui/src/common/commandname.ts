// webview向ide发送请求
export const webviewReqCommand = {
  WEBVIEW_READY: 'webview-ready',
  CHAT_REQUEST: 'chat-request',
  CHANGE_MODEL_REQUEST: 'change-model-request',
  CANCEL_AGENT_REQUEST: 'cancel-agent-request',
}
// ide向webview响应
export const ideResCommand = {
  CHAT_RESPONSE: 'chat-response',
  CHANGE_MODEL_RESPONSE: 'change-model-response',
  CONFIG_RESPONSE: 'config-response',
  CANCEL_AGENT_RESPONSE: 'cancel-agent-response',
}