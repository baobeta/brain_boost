<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="error" :class="errorClass" role="alert">
      <svg v-if="showIcon" class="inline-block w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  error: string | null;
  showIcon?: boolean;
  errorClass?: string;
}

withDefaults(defineProps<Props>(), {
  showIcon: true,
  errorClass: 'flex items-center text-sm text-red-600 dark:text-red-400 mt-2',
});
</script>
