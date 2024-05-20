<script setup lang="ts">
import ButtonIcon from "@/components/core/ButtonIcon.vue";
import ListDeck from "@/components/homeview/ListDeck.vue";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
</script>

<template>
  <section class="home flex flex-col items-center">
    <div class="flex flex-col w-3/4 mt-2">
      <div class="flex justify-end">
        <ButtonIcon :title="'New Deck'" :icon="faPlus" />
      </div>
      <ListDeck :title="'List Deck'" />
      <ListDeck :title="'List Deck'" />
    </div>
  </section>
</template>
