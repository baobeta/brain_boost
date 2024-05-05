<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type{ IconDefinition } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  name: string,
  icon: IconDefinition
  isCurrent?: boolean
  page?: string
}>()


</script>
<template>
  <router-link :to="{ name: page }"
    class="flex justify-start p-2 items-center hover:bg-gray-100  text:bg-gray-500 rounded-lg mx-2 mt-2"
    :class="{
        'text-green-900 hover:bg-green-100': isCurrent
    }"
  >
    <FontAwesomeIcon :icon="icon" class="mr-2"/>
    <span class="font-medium text-base">{{ name }}</span>
</router-link>
</template>
