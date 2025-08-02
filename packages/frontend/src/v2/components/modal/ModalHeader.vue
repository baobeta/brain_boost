<template>
  <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        <slot />
      </h3>
      <button
        v-if="showClose"
        type="button"
        class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        @click="$emit('close')"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showClose?: boolean;
}

withDefaults(defineProps<Props>(), {
  showClose: false,
});

defineEmits<{
  close: [];
}>();
</script>
