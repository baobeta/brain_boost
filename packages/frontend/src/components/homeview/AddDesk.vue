<script setup lang="ts">
import { ref } from 'vue';
import { useDesk } from '@/service/useDesk';
import Desk from '@/models/desk';

interface Props {
  desk: Desk;
}

const props = defineProps<Props>();

const name = ref<string>(props.desk.name || '');
const description = ref(props.desk.description || '');

const { addDesk, updateDesk } = useDesk();

const emit = defineEmits(['onClose']);

const handleAction = async () => {
  const desk = new Desk();
  desk.name = name.value;
  desk.description = description.value;

  if (props.desk.id) {
    desk.id = props.desk.id;
    await updateDesk(desk);
  } else {
    await addDesk(desk);
  }
  emit('onClose');
};
</script>

<template>
  <div class="w-full">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
      <input
        v-model="name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2"> Description </label>
      <input
        v-model="description"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div class="flex items-center justify-end">
      <button
        class="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click="handleAction"
      >
        {{ desk.id ? 'Update' : 'Add' }}
      </button>
    </div>
  </div>
</template>
