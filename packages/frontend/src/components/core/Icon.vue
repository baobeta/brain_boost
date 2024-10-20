<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ name: string }>();
const className = computed(() => 'pi pi-' + props.name);
</script>

<template>
  <span :class="className"></span>
</template>
