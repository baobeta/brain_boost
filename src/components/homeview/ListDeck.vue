<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex bg-gray-100 text-gray-800 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2 hover:bg-gray-300">
    <span class="font-base">{{ title }}</span>
    <FontAwesomeIcon :icon="faAngleRight"/>
  </div>
</template>

