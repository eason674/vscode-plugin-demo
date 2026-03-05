import { marked } from 'marked'
marked.use({
  gfm: true, // 启用 GitHub 风格的 Markdown (默认开启)
  breaks: true, // 允许回车换行 (默认换行需要两个空格)
  pedantic: false, // 尽可能遵循 Markdown.pl 规范（通常关掉）
})

export const markdownHtml=(text:string)=>{
    let newtext=preprocessMarkdown(text)
  return marked.parse(newtext)
}

export const  preprocessMarkdown=(content:string)=> {
  return content
    .replace(/\r\n/g, '\n')  // 统一换行符
    .replace(/\n{3,}/g, '\n\n'); // 将多个空行减少为两个
}