<script lang="ts" setup>

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex bg-gray-100 text-gray-800 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2 hover:bg-gray-300">
    <span class="font-base">{{ title }}</span>
    <VDropdown>
      <vue-feather type="more-horizontal" class="w-6 h-6" />
      <template #popper>
        <div class="flex flex-col">
          <div class>
            <button class="text-blue-500 hover:text-blue-600">Add sub desk</button>
          </div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

