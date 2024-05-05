<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const router = useRoute()

const MAPPING_TITLE: Record<string, any> = {
  '/home': 'Home',
  '/today': 'Today',
  '/statistics': 'Statistics',
  '/manage-cards': 'Manage Cards',
  '/settings': 'Settings',
}

const title = computed(() => {
  const currentRoute: string | undefined | null = router.path;
  if(!currentRoute) return 'Home';
  return MAPPING_TITLE[currentRoute] || 'Home';
})
</script>

<template>
  <header class="flex border-b-2 items-center justify-center h-10">
    <nav class="flex">
      <span class="font-semibold text-xl">{{ title }}</span>
    </nav>
  </header>
</template>
