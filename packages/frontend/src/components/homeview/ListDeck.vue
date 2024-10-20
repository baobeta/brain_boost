<script lang="ts" setup>
import Desk from '@/models/desk';
import { useDesk } from '@/service/useDesk';
import useModal from '@/service/useModal';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { useDeskModal } = useModal();
const { deleteDesk } = useDesk();
const router = useRouter();

const props = defineProps<{
  desk: Desk;
}>();

const dropdownOption = ref([
  {
    key: `edit-${props.desk.id}`,
    label: 'Edit',
    command: () => useDeskModal(props.desk),
  },
  {
    key: `delete-${props.desk.id}`,
    label: 'Delete',
    command: () => deleteDesk(props.desk.id),
    class: '*:!text-red-500',
  },
]);

const menu = ref();

function toggleShowDropdown(turnOn: boolean) {
  menu.value?.toggle(turnOn);
}

function goToDesk() {
  router.push({ name: 'desk', params: { id: props.desk.id } });
}
</script>

<template>
  <div
    class="flex bg-gray-100 text-gray-800 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2 hover:bg-gray-300"
  >
    <span class="font-base w-full" @click="goToDesk">{{ desk.name }}</span>
    <Icon name="chevron-right" @click="toggleShowDropdown"></Icon>
    <PMenu ref="menu" :popup="true" :model="dropdownOption"></PMenu>
  </div>
</template>
