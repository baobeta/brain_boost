<script setup lang="ts">
import ButtonIcon from "@/components/core/ButtonIcon.vue";
import ListDeck from "@/components/homeview/ListDeck.vue";
import { useModalStore } from "@/components/modal/service/useModalStore";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddDesk from "@/components/homeview/AddDesk.vue";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../models/db";

const { openModal } = useModalStore();
const desks = useObservable(
  liveQuery(() => db.desks.toArray()),
)

function openCreateDeskModal () {
  openModal({
    component: AddDesk,
    title: "Add Desk",
    props: {},
    closeOnClick: true
  });
}
</script>

<template>
  <section class="home flex flex-col items-center">
    <div class="flex flex-col w-3/4 mt-2">
      <div class="flex justify-end">
        <ButtonIcon :title="'New Deck'" :icon="faPlus"  @click="openCreateDeskModal"/>
      </div>
      <VTooltip v-for="desk in desks" :key="desk.id">
        <ListDeck  :title="desk.name" />
        <template #popper>{{ desk.description }}</template>
      </VTooltip>
    </div>
  </section>
</template>
