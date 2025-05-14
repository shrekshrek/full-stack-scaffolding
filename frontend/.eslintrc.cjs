module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Use vue3-recommended for stricter rules
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. THIS MUST BE LAST IN THE ARRAY.
    // Consider using Prettier directly for formatting and ESLint for linting only to avoid conflicts.
    // If using Prettier directly, remove 'plugin:prettier/recommended' and ensure Prettier runs separately (e.g., on save, pre-commit hook).
  ],
  parser: 'vue-eslint-parser', // The parser that allows ESLint to lint <template> and <script> in .vue files
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser', // The parser for <script> tags
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    // 'prettier' // Only if using eslint-plugin-prettier
  ],
  rules: {
    // General ESLint rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // TypeScript specific rules (examples)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    // Vue specific rules (examples)
    'vue/multi-word-component-names': 'warn', // Or 'off' if you prefer single-word component names
    'vue/no-reserved-component-names': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    // Prettier rules (only if using eslint-plugin-prettier)
    // 'prettier/prettier': [
    //   'warn',
    //   {
    //     // your Prettier options here
    //     // singleQuote: true,
    //     // semi: false,
    //   },
    // ],
    // Add your custom rules here
  },
  globals: {
    // defineExpose: 'readonly', // If using <script setup> with defineExpose
    // defineProps: 'readonly',
    // defineEmits: 'readonly',
    // withDefaults: 'readonly',
    // Add other globals if necessary
  },
  settings: {
    // 'import/resolver': { // If using eslint-plugin-import
    //   typescript: {},
    //   node: {
    //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   },
    // },
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
        'src/features/**/__tests__/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true, // or vitest for Vitest globals if not handled by tsconfig types
        // 'vitest-globals/env': true, // If using vitest-globals
      },
    },
    {
      // Allow console logs in specific files like main.ts or service workers
      files: ['src/main.ts', 'vite.config.ts', 'uno.config.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}; 