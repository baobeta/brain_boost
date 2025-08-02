import { ref } from 'vue';
import type { Ref } from 'vue';

export interface UseModalReturn {
  isOpen: Readonly<Ref<boolean>>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialState = false): UseModalReturn {
  const isOpen = ref(initialState);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
