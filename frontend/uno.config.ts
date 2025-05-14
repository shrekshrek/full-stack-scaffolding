import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

// Potentially Element Plus theme variables for UnoCSS integration
// import { epTheme } from '@unocss/preset-mini/theme' 

export default defineConfig({
  // shortcuts: [
  //   // you can customize your shortcuts here
  //   // example:
  //   // ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
  //   // ['btn-green', 'btn bg-green-500 hover:bg-green-600'],
  // ],
  presets: [
    presetUno(), // Basic UnoCSS preset (Tailwind CSS like utilities)
    presetAttributify(), // Enables Attributify mode (e.g. <div text-sm font-bold />)
    presetIcons({ // Enables Iconify integration
      scale: 1.2,
      warn: true,
      // collections: { // Example: specify collections to reduce bundle size
      //   mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      //   carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default)
      // }
    }),
  ],
  transformers: [
    transformerDirectives(), // Enables @apply, @screen, theme()
    transformerVariantGroup(), // Enables (hover:bg-red-500 text-white) syntax
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       // primary: epTheme.colors.primary, // Example: using Element Plus primary color
  //       // 'custom-blue': '#2474ff'
  //     },
  //     fontFamily: {
  //       // sans: ['YourCustomFont', ...epTheme.fontFamily.sans],
  //     },
  //   },
  // },
  // rules: [
  //   // Add custom rules here if needed
  //   // [/^m-(\d+)$/, ([_, d]) => ({ margin: `${d / 4}rem` })],
  // ],
  // safelist: 
  //   'prose prose-sm m-auto text-left'.split(' ')
  //   .concat(
  //      ['grid', 'gap-4', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3'] // Common layout classes
  //   ),
}) 