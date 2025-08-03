<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 flex flex-col w-full">
    <TransitionGroup name="toast" tag="div" class="flex justify-end min-h-0 w-full">
      <div class="flex flex-col w-72 space-y-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden relative',
            'border-l-4',
            {
              'border-green-500': toast.type === 'success',
              'border-red-500': toast.type === 'error',
              'border-yellow-500': toast.type === 'warning',
              'border-blue-500': toast.type === 'info',
            },
          ]"
        >
          <!-- Progress Bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"
          >
            <div
              class="h-full transition-all duration-100 ease-linear"
              :class="{
                'bg-green-500': toast.type === 'success',
                'bg-red-500': toast.type === 'error',
                'bg-yellow-500': toast.type === 'warning',
                'bg-blue-500': toast.type === 'info',
              }"
              :style="{ width: `${progress[toast.id] * 100}%` }"
            ></div>
          </div>

          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component
                  :is="getIcon(toast.type)"
                  :class="[
                    'h-5 w-5',
                    {
                      'text-green-400': toast.type === 'success',
                      'text-red-400': toast.type === 'error',
                      'text-yellow-400': toast.type === 'warning',
                      'text-blue-400': toast.type === 'info',
                    },
                  ]"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ toast.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  class="relative bg-white dark:bg-gray-800 rounded-full inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1"
                  @click="removeToast(toast.id)"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <!-- Circular Progress -->
                  <svg
                    v-if="toast.duration && toast.duration > 0"
                    class="absolute inset-0 h-7 w-7 transform -rotate-90"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      class="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      fill="none"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      :class="{
                        'text-green-400': toast.type === 'success',
                        'text-red-400': toast.type === 'error',
                        'text-yellow-400': toast.type === 'warning',
                        'text-blue-400': toast.type === 'info',
                      }"
                      stroke="currentColor"
                      fill="none"
                      stroke-dasharray="75.4"
                      :stroke-dashoffset="75.4 - 75.4 * progress[toast.id]"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';

const { toasts, removeToast } = useToast();
const progress = ref<Record<string, number>>({});

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

const startProgress = (toastId: string, duration: number) => {
  const startTime = Date.now();
  progress.value[toastId] = 1;

  const updateProgress = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, 1 - elapsed / duration);

    progress.value[toastId] = remaining;

    if (remaining > 0) {
      requestAnimationFrame(updateProgress);
    } else {
      delete progress.value[toastId];
    }
  };

  requestAnimationFrame(updateProgress);
};

const checkForMissingProgress = () => {
  toasts.value.forEach((toast) => {
    if (toast.duration && toast.duration > 0 && !progress.value[toast.id]) {
      startProgress(toast.id, toast.duration);
    }
  });
};

onMounted(() => {
  checkForMissingProgress();

  const unwatch = watch(
    toasts,
    (newToasts, oldToasts) => {
      newToasts.forEach((toast) => {
        if (toast.duration && toast.duration > 0 && !progress.value[toast.id]) {
          startProgress(toast.id, toast.duration);
        }
      });
    },
    { immediate: true, deep: true },
  );

  const interval = setInterval(checkForMissingProgress, 100);

  onUnmounted(() => {
    unwatch();
    clearInterval(interval);
  });
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
