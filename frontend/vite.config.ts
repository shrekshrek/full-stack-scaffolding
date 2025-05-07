import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [
      // Vue 3 支持
      vue(),

      // UnoCSS
      UnoCSS(),

      // 自动导入Element Plus组件
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),

      // 生产环境启用Gzip压缩
      isProd &&
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240, // 10kb以上的文件进行压缩
          deleteOriginFile: false
        }),

      // 构建分析可视化工具
      isProd &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html'
        })
    ].filter(Boolean),

    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    // 开发服务器配置
    server: {
      // API请求代理
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true
        }
      }
    },

    // 构建配置
    build: {
      outDir: 'dist',
      // 仅在开发环境启用sourcemap
      sourcemap: !isProd,
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 生产环境使用terser压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd
        }
      },
      rollupOptions: {
        output: {
          // 代码分块策略
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            utils: ['axios', '@vueuse/core']
          },
          // 使用内容哈希命名文件以优化缓存
          entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
        }
      }
    }
  }
})
