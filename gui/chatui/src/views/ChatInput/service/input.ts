import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { sendMessage } from '@/common/vscode'
import { webviewReqCommand } from '@/common/commandname'

let chatStore: any = null

// 输入框绑定值
export const inputValue = ref('')
// 输入框placeholder-后续需要响应式改为ref即可
export const inputPlaceholder = '请输入你的问题，按enter发送'

const resetInputOperate = () => {
  inputValue.value = ''
}

const addUserMessage = () => {
  if (!chatStore) chatStore = useChatStore()
  chatStore.addMessages({
    role: 'user',
    content: inputValue.value,
  })
  chatStore.updateWaiting(true)
}
// 键盘enter事件
export const handleEnter = () => {
  if (inputValue.value.trim() == '') return
  //   发送模型
  sendMessage({
    command: webviewReqCommand.CHAT_REQUEST,
    data: {
      content: inputValue.value,
    },
  })
  // 组建用户消息
  addUserMessage()

  //   清空输入框消息
  resetInputOperate()
}
