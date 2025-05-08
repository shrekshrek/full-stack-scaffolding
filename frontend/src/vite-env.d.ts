/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 可以添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
