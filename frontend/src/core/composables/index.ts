import { ref, onMounted, onUnmounted, Ref } from 'vue';

interface WindowSize {
  width: Ref<number>;
  height: Ref<Number>;
}

/**
 * Composable to track window size.
 * @returns Reactive width and height of the window.
 */
export function useWindowSize(): WindowSize {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { width, height };
}

// Example: Composable for managing a boolean toggle state
interface ToggleUtils {
  isActive: Ref<boolean>;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export function useToggle(initialState = false): ToggleUtils {
  const isActive = ref(initialState);

  const toggle = () => {
    isActive.value = !isActive.value;
  };

  const open = () => {
    isActive.value = true;
  };

  const close = () => {
    isActive.value = false;
  };

  return { isActive, toggle, open, close };
} 