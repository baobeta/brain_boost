<template>
<button class="border-2 flex items-center p-2 rounded-lg text-gray-800 text-base">
  <FontAwesomeIcon v-if="icon" :icon="icon" class="mr-2" />
  <span class="font-base">{{ title }}</span>
</button>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
defineProps<{
  icon?: IconDefinition,
  title: string
}>()
</script>