<script setup lang="ts">
import { faPlus } from '@fortawesome/free-solid-svg-icons';
</script>

<template>
  <section class="home flex flex-col items-center">
    <div class="flex flex-col w-3/4 mt-2">
      <div class="flex justify-end">
        <ButtonIcon :title="'New Deck'" :icon="faPlus" @click="useDeskModal" />
      </div>
      <VTooltip v-for="desk in listDesks" :key="desk.id">
        <ListDeck :desk="desk" />
        <template #popper>
          {{ desk.description }}
        </template>
      </VTooltip>
    </div>
  </section>
</template>
