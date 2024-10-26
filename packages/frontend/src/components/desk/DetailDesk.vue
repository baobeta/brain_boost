<script setup lang="ts">
import Desk from '@/models/desk';
import { useDesk } from '@/service/useDesk';
import { useCard } from '@/service/useCard';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CardElement from './CardElement.vue';
import type { ICard } from '@/models/card';
import { useToast } from 'primevue/usetoast';
import PanelSummary from './PanelSummary.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const deskData = ref<Desk | null>(null);

const { getDesk } = useDesk();
const { fetchCards, deleteCard } = useCard();
const listCards = ref<ICard[]>([]);

async function refreshCards() {
  if (!deskData.value) return;
  listCards.value = await fetchCards(deskData.value.id);
}

// fetch the data when params change
watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;
    if (typeof newId !== 'string') return;
    deskData.value = await getDesk(newId);
    refreshCards();
  },
  { immediate: true },
);

async function handleDeleteCard(id: string) {
  await deleteCard(id);
  refreshCards();
}

async function handleAddCard() {
  if (!deskData?.value?.id) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Desk not found', life: 3000 });
    return;
  }
  router.push({ name: 'new_card', params: { deskId: deskData.value.id } });
}

async function handleEditCard(id: string) {
  if (!deskData?.value?.id) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Desk not found', life: 3000 });
    return;
  }
  router.push({ name: 'edit_card', params: { cardId: id } });
}
</script>
<template>
  <div v-if="deskData">
    <div>
      <div class="max-w-4xl mx-auto p-6 flex flex-col">
        <div class="flex justify-between">
          <div class="font-semibold text-xl">{{ deskData.name }}</div>
          <PButton label="Add Cards" outlined severity="contrast" icon="pi pi-plus" @click="handleAddCard" />
        </div>
        <PanelSummary class="mt-4" />
        <div class="flex justify-between items-center mt-6 mb-4">
          <div dir="ltr" data-orientation="horizontal">
            <div class="flex space-x-4">
              <div class="font-medium text-sm">Notebook</div>
              <div class="font-medium text-sm">Subdecks</div>
            </div>
          </div>
          <div class="flex space-x-2">
            <PButton icon="pi pi-ellipsis-v" outlined severity="contrast" />
          </div>
        </div>
        <div class="flex flex-col space-y-2 overflow-auto" style="max-height: calc(100vh - 530px)">
          <CardElement
            v-for="card in listCards"
            id="test"
            :key="card.id"
            :front="card.front"
            :back="card.back"
            :is-show-back="false"
            @delete="handleDeleteCard(card.id)"
            @edit="handleEditCard(card.id)"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>Not found this data</div>
</template>
