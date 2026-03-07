export interface IChatResponse {
  content: string
  model: string
  isStreamComplete: boolean
  stream: boolean
}