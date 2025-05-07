import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: '#409eff',
        50: '#ecf5ff',
        100: '#d9ecff',
        200: '#c6e2ff',
        300: '#a0cfff',
        400: '#79bbff',
        500: '#409eff',
        600: '#337ecc',
        700: '#2a5e99',
        800: '#213e66',
        900: '#0f1f33',
        950: '#071426'
      },
      success: {
        DEFAULT: '#67c23a',
        light: '#f0f9eb'
      },
      warning: {
        DEFAULT: '#e6a23c',
        light: '#fdf6ec'
      },
      danger: {
        DEFAULT: '#f56c6c',
        light: '#fef0f0'
      },
      info: {
        DEFAULT: '#909399',
        light: '#f4f4f5'
      }
    }
  },
  shortcuts: {
    // 常用布局
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',

    // 按钮 - 与Element Plus风格一致
    btn: 'px-4 py-2 rounded font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary-600',
    'btn-success': 'btn bg-success text-white hover:bg-success/90',
    'btn-warning': 'btn bg-warning text-white hover:bg-warning/90',
    'btn-danger': 'btn bg-danger text-white hover:bg-danger/90',
    'btn-info': 'btn bg-gray-500 text-white hover:bg-gray-600',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',
    'btn-text': 'bg-transparent hover:bg-gray-100 text-gray-700 transition-colors',

    // 卡片
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all',
    'card-hover': 'card hover:shadow-md cursor-pointer',

    // 输入框
    input:
      'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary'
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700'
      }
    })
  ],
  safelist: [
    // 这里添加一些你希望无论使用与否都要包含在构建中的类
    'text-primary',
    'bg-primary',
    'text-success',
    'bg-success',
    'text-warning',
    'bg-warning',
    'text-danger',
    'bg-danger',
    'text-info',
    'bg-info'
  ]
})
