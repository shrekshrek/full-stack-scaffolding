/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Element Plus 按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// UnoCSS 插件
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vue-router', 'pinia'], 
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      dts: 'src/types/auto-imports.d.ts', // 指定自动导入的类型定义文件路径
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      // 指定自定义组件位置，默认是 'src/components'
      dirs: ['src/core/ui', 'src/features/**/components'],
      dts: 'src/types/components.d.ts', // 指定组件类型定义文件路径
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // 开发服务器端口
    open: false, // 是否自动打开浏览器
    proxy: {
      // 可选：配置开发环境 API 代理
      // '/api': {
      //   target: 'http://localhost:8000', // 后端服务地址
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/api/, '')
      // }
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境是否生成 source map
    // chunkSizeWarningLimit: 1500, // 可选: 调整块大小警告限制 (KB)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
    include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 新增别名，将 CSS 和常见资源文件指向一个空模块
      '^.*\\.(css|less|scss|sass)$ ': path.resolve(__dirname, './src/test-utils/empty-module-mock.js'),
      '^.*\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$ ': path.resolve(__dirname, './src/test-utils/empty-module-mock.js'),
    },
  },
}) 