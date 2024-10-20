<script setup lang="ts">
const props = defineProps<{
  front: string;
  back: string;
  isShowBack: boolean;
}>();
</script>

<template>
  <div class="rounded-lg border shadow-sm p-4 flex flex-col">
    <div class="flex justify-between mb-2">
      <div class="text-lg">{{ props.front }}</div>
      <div>Action</div>
    </div>
    <div v-if="props.isShowBack" class="pt-2 border-t">{{ props.back }}</div>
  </div>
</template>
