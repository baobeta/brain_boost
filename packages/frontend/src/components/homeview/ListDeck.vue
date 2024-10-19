<script lang="ts" setup>
import type Desk from '@/models/desk';
import { useDesk } from '@/service/useDesk';
import useModal from '@/service/useModal';

const { useDeskModal } = useModal();
const {
  deleteDesk
} = useDesk();

const props = defineProps<{
  desk: Desk;
}>()

const dropdownOption = [
  {
    title: 'Edit',
    action: () => useDeskModal(props.desk),
  },
  {
    title: 'Delete',
    action: () => deleteDesk(props.desk.id),
    class: 'text-red-500'
  }
];
</script>

<template>
  <div class="flex bg-gray-100 text-gray-800 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2 hover:bg-gray-300">
    <span class="font-base">{{ desk.name }}</span>
    <VDropdown>
      <vue-feather type="more-horizontal" class="w-6 h-6" />
      <template #popper>
        <div class="flex flex-col p-2">
            <button v-for="option in dropdownOption"
              @click="option.action"
              class="flex font-base p-2 w-full hover:bg-slate-100 rounded justify-center">
              <span :class="option.class">{{ option.title }}</span>
            </button>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

