<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex bg-gray-200 text-gray-900 items-center py-2 px-4 rounded max-w-2xl text-xl justify-between mt-2">
    <span class="font-base">{{ title }}</span>
    <FontAwesomeIcon :icon="faAngleRight"/>
  </div>
</template>

