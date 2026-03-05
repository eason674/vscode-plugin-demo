// ide接收到来自webview的命令
export const IDEFROMWEBVIEWREQ = {
  WEBVIEW_READY: "webview-ready",
  CHAT_REQUEST: "chat-request",
  CHANGE_MODEL_REQUEST: "change-model-request",
};

// ide发送给webview的命令
export const IDETOWEBVIEWREP = {
  CHAT_RESPONSE: "chat-response",
  CHANGE_MODEL_RESPONSE: "change-model-response",
  CONFIG_RESPONSE: "config-response",
};
