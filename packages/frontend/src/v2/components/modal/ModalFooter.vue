<template>
  <div
    class="flex items-center justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900/50"
    :class="customClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  customClass: '',
});
</script>
