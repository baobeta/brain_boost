<template>
  <button :class="classes" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    color: string;
  }>(),
  {
    color: 'teal',
  },
);

const classes = computed(() => {
  const { color } = props;
  return [`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded-lg uppercase text-sm`];
});
</script>
