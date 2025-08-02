<template>
  <div :class="containerClass">
    <slot name="left" />

    <div :class="actionsClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  containerClass?: string;
  actionsClass?: string;
}

withDefaults(defineProps<Props>(), {
  containerClass: 'flex justify-end items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600',
  actionsClass: 'flex items-center space-x-3',
});
</script>
