<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  id: string;
  front: string;
  back: string;
  isShowBack: boolean;
}>();

const dropdownOption = ref([
  {
    key: `edit-${props.id}`,
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      console.log('edit');
    },
  },
  {
    key: `delete-${props.id}`,
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      console.log('trash');
    },
    class: '*:!text-red-500',
  },
]);
</script>

<template>
  <div class="rounded-lg border shadow-sm p-2 flex flex-col">
    <div class="flex justify-between items-center">
      <div class="text-lg">{{ props.front }}</div>
      <div><Dropdown :options="dropdownOption" icon="ellipsis-v" /></div>
    </div>
    <div v-if="props.isShowBack" class="mt-2 pt-2 border-t">{{ props.back }}</div>
  </div>
</template>
