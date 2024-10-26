<template>
  <div class="flex flex-col">
    <div class="flex font-semibold">{{ label }}</div>
    <Editor v-model="value" editor-style="height: 320px" />
  </div>
</template>
<script setup lang="ts">
import Editor from 'primevue/editor';
defineProps<{ label: string }>();
const value = defineModel<string>();
</script>
