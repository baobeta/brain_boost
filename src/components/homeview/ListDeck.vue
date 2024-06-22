<script lang="ts" setup>

defineProps<{
  title: string
}>()

const addSubDesk = () => {
  console.log("Add sub desk");
};

const updateSubDesk = () => {
  console.log("update Sub desk");
};

const deleteSubDesk = () => {
  console.log("delete sub desk");
};

const dropdownOption = [
  {
    title: 'Add sub desk',
    action: addSubDesk,
  },
  {
    title: 'Edit',
    action: updateSubDesk
  },
  {
    title: 'Delete',
    action: deleteSubDesk
  }
];
</script>

<template>
  <div class="flex bg-gray-100 text-gray-800 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2 hover:bg-gray-300">
    <span class="font-base">{{ title }}</span>
    <VDropdown>
      <vue-feather type="more-horizontal" class="w-6 h-6" />
      <template #popper>
        <div class="flex flex-col p-2 items-start justify-center">
            <button v-for="option in dropdownOption" @click="option.action" class="font-base p-2 hover:bg-slate-100 rounded">{{ option.title }}</button>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

