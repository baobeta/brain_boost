<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @mousedown.self="handleBackdropClick">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" :class="backdropClass" aria-hidden="true" />

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="modelValue"
              ref="modalRef"
              class="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-800"
              :class="[sizeClasses[size], customClass]"
              role="dialog"
              :aria-modal="true"
              :aria-labelledby="titleId"
              :aria-describedby="descriptionId"
              @click.stop
            >
              <!-- Close button -->
              <button
                v-if="showClose"
                type="button"
                class="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                @click="close"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                  />
                </svg>
                <span class="sr-only">Close</span>
              </button>

              <!-- Modal Content -->
              <slot />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, useId } from 'vue';
import { onKeyStroke } from '@vueuse/core';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
  modelValue: boolean;
  size?: ModalSize;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  backdropClass?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  backdropClass: '',
  customClass: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
  open: [];
}>();

const modalRef = ref<HTMLElement>();
const titleId = useId();
const descriptionId = useId();

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

// Handle close
const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close();
  }
};

// Handle escape key
onKeyStroke('Escape', (e) => {
  if (props.modelValue && props.closeOnEscape) {
    e.preventDefault();
    close();
  }
});

// Emit open event
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      emit('open');
    }
  },
);

// Prevent body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);

// Clean up on unmount
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>
