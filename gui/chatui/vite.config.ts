import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  build: {
    outDir: '../../dist/chatui',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 开发环境对接插件运行热更新设置
  server: {
    port: 5180,
    strictPort: true,
    cors: {
      origin: '*',
    },
    watch: {
      usePolling: true,
      interval: 100, // 或 200，根据系统性能调整
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5180,
    },
  },
})
