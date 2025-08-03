import { ref, type Ref, watchEffect } from 'vue';
import { createInjectionState } from '@vueuse/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ToastComposable {
  toasts: Ref<Toast[]>;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

function createToast(): ToastComposable {
  const toasts = ref<Toast[]>([]);
  const timeouts = ref<Record<string, ReturnType<typeof setTimeout>>>({});

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      ...toast,
    };

    if (!newToast.duration) {
      newToast.duration = 3000;
    }

    toasts.value.push(newToast);
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);

      if (timeouts.value[id]) {
        clearTimeout(timeouts.value[id]);
        delete timeouts.value[id];
      }
    }
  };

  watchEffect(() => {
    toasts.value.forEach((toast) => {
      if (toast.duration && toast.duration > 0 && !timeouts.value[toast.id]) {
        console.log('⏰ Setting up auto-remove for toast:', toast.id, 'duration:', toast.duration);
        const timeout = setTimeout(() => {
          console.log('🔔 Auto-removing toast:', toast.id);
          const index = toasts.value.findIndex((t) => t.id === toast.id);
          if (index > -1) {
            toasts.value.splice(index, 1);
          }
          delete timeouts.value[toast.id];
        }, toast.duration);

        timeouts.value[toast.id] = timeout;
      }
    });
  });

  const success = (title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  };

  const error = (title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  };

  const warning = (title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  };

  const info = (title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

const [useProvideToast, _useToast] = createInjectionState(createToast);

const useToast = () => {
  const toast = _useToast();
  if (!toast) {
    throw new Error('useToast: No toast provider found. Please provide a toast provider in root component.');
  }
  return toast;
};

export { useProvideToast, useToast };
