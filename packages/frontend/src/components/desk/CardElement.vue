<script setup lang="ts">
import { ref, computed } from 'vue';
import PreviewCard from '../card/PreviewCard.vue';

const props = defineProps<{
  id: string;
  front: string;
  back: string;
  isShowBack: boolean;
}>();

const emit = defineEmits(['delete', 'edit']);
const isShowBack = ref(props.isShowBack);

const dropdownOption = computed(() => [
  {
    key: `edit-${props.id}`,
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      emit('edit', props.id);
    },
  },
  {
    key: `delete-${props.id}`,
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      emit('delete', props.id);
    },
    class: '*:!text-red-500',
  },
  {
    key: `show-back-${props.id}`,
    label: isShowBack.value ? 'Hide Back' : 'Show Back',
    icon: isShowBack.value ? 'pi pi-eye-slash' : 'pi pi-eye',
    command: () => {
      isShowBack.value = !isShowBack.value;
    },
    class: '*:!text-red-500',
  },
]);
</script>

<template>
  <div class="rounded-lg border shadow-sm p-2 flex flex-col">
    <div class="flex justify-between items-center">
      <div class="preview ql-editor">
        <PreviewCard :model-value="props.front" />
      </div>
      <div><Dropdown :options="dropdownOption" icon="ellipsis-v" /></div>
    </div>
    <div v-if="isShowBack" class="mt-2 pt-2 border-t">
      <div class="preview ql-editor">
        <PreviewCard :model-value="props.back" />
      </div>
    </div>
  </div>
</template>
