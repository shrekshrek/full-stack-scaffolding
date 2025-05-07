declare module 'element-plus/es' {
  // ElMessage
  export const ElMessage: {
    success(message: string): void
    warning(message: string): void
    error(message: string): void
    info(message: string): void
  }

  // ElMessageBox
  export const ElMessageBox: {
    confirm(
      message: string,
      title: string,
      options?: {
        confirmButtonText?: string
        cancelButtonText?: string
        type?: string
      }
    ): Promise<void>
  }

  // UI Components
  export const ElAlert: any
  export const ElButton: any
  export const ElCard: any
  export const ElCheckbox: any
  export const ElDialog: any
  export const ElEmpty: any
  export const ElForm: any
  export const ElFormItem: any
  export const ElInput: any
  export const ElSkeleton: any
  export const ElSwitch: any
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const zhCn: any
  export default zhCn
}
