# 通用组件

此目录用于存放全应用共享的UI组件，例如：

- 按钮 (Button)
- 输入框 (Input)
- 卡片 (Card)
- 提示框 (Alert)
- 加载指示器 (Loader)
- 模态框 (Modal)
- 分页器 (Pagination)
- 标签 (Tag)
- 面包屑 (Breadcrumb)
- 下拉菜单 (Dropdown)

这些组件应该是纯UI组件，不包含业务逻辑和状态管理。

## 命名规范

- 组件名使用PascalCase (如 `Button.vue`)
- 导出的组件名也使用PascalCase
- 内部的CSS类名使用kebab-case

## 组件结构

每个组件应该遵循以下结构：

```vue
<template>
  <!-- 组件模板 -->
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped lang="scss">
/* 组件样式 */
</style>
``` 