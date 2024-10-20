<script setup lang="ts">
import { ref } from 'vue';

interface DropdownOption {
  key: string;
  label: string;
  icon?: string;
  class?: string;
  command: (event: MouseEvent) => void;
}

const props = defineProps<{
  options: DropdownOption[];
  icon: string;
}>();

const menu = ref();

function toggleShowDropdown(turnOn: boolean) {
  menu.value?.toggle(turnOn);
}
</script>
<template>
  <div>
    <PButton :icon="`pi pi-${icon || 'ellipsis-v'}`" severity="secondary" @click="toggleShowDropdown"></PButton>
    <PMenu ref="menu" :popup="true" :model="options"></PMenu>
  </div>
</template>
