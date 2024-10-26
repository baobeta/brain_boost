<template>
  <div class="flex flex-col p-16 justify-center">
    <div class="flex space-x-2 justify-start w-[200px]">
      <Select
        v-model="deskId"
        :options="options"
        :option-label="'label'"
        :option-value="'key'"
        class="w-full"
        :placeholder="'Select Desk ...'"
      />
    </div>
    <div class="flex justify-between mt-4">
      <EditorLabel v-model="front" option-label="label" label="Front" />
      <EditorLabel v-model="back" label="Back" />
    </div>
    <div class="flex justify-between">
      <PButton label="Back to desk" severity="secondary" class="mt-4" icon="pi pi-arrow-left" @click="backToDesk" />
      <PButton
        :label="cardId ? 'Update Card' : 'Add New Card'"
        severity="primary"
        class="mt-4"
        icon="pi pi-plus"
        @click="addCard"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import EditorLabel from './EditorLabel.vue';
import Select from 'primevue/select';
import { computed } from 'vue';
import { ref } from 'vue';
import { useDesk } from '@/service/useDesk';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useCard } from '@/service/useCard';

const deskId = ref('');
const { listDesks } = useDesk();
const route = useRoute();
const router = useRouter();
const { saveNewCard, fetchCard, updateCard } = useCard();

const options = computed(() => listDesks.value.map((desk) => ({ key: desk.id, label: desk.name })));
const front = ref('');
const back = ref('');
const cardId = computed(() => route.params.cardId as string);

onMounted(async () => {
  const card = await fetchCard(cardId.value);
  if (card) {
    front.value = card.front;
    back.value = card.back;
  }
  deskId.value = card?.deckId || String(route.params.deskId) || options.value[0].key;
});

const clearData = () => {
  front.value = '';
  back.value = '';
};

async function backToDesk() {
  clearData();
  router.push({ name: 'desk', params: { id: deskId.value } });
}

async function addCard() {
  if (cardId.value) {
    await updateCard(front.value, back.value, cardId.value);
    backToDesk();
    return;
  }
  await saveNewCard(front.value, back.value, deskId.value);
  clearData();
}
</script>
