import { vi } from 'vitest';

// Mock CSS imports to prevent errors during component tests
// @ts-ignore Vitest allows regex for path, but TS might complain
vi.mock(/\.(css|scss|less)$/, () => ({
  default: {}
}));

// Mock image imports
// @ts-ignore Vitest allows regex for path, but TS might complain
vi.mock(/\.(jpg|jpeg|png|gif|webp|svg)$/, () => ({
  default: 'mock-image-path'
}));

// --- 全局 Mock Element Plus ---
vi.mock('element-plus', async () => {
  // const originalModule = await importOriginal(); // Let's try without original first
  return {
    // Explicitly list mocks, avoid spreading unknown module structure for now
    ElForm: { template: '<div>Mocked ElForm by vitest.setup.ts</div>' },
    ElFormItem: { template: '<div><slot /></div>' },
    ElInput: { template: '<input type="text" />' },
    ElButton: { template: '<button><slot /></button>' },
    // For types, Vitest/TS should still pick them up from the actual library.
    // We only need to mock runtime values.
    // Default export (plugin)
    default: {
      install: vi.fn(),
    },
    // If specific named exports that are runtime values are needed, add them here.
    // e.g. someUtilFunction: vi.fn(),
  };
});
// --- 结束 全局 Mock Element Plus ---

// You can add other global setup configurations here if needed
// For example, setting up a global Pinia instance for all tests, though we do it in beforeEach for now.

console.log('Vitest global setup file loaded with Element Plus mock.'); 