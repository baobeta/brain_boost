<template>
  <div class="px-6 py-4" :class="customClass">
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
