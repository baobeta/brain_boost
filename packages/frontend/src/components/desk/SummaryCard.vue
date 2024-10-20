<template>
  <div
    class="rounded-lg border text-center py-4 flex flex-col"
    :class="`bg-${props.color}-100 border-${props.color}-300`"
  >
    <div class="text-2xl font-bold" :class="`!text-${props.color}-700`">{{ total }}</div>
    <div class="text-sm flex justify-center" :class="`text-${props.color}-700`">
      <Icon :name="icon" class="mr-2" />
      <span>{{ title }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  icon: string;
  total: number;
  title: string;
  color: string;
}>();
</script>
