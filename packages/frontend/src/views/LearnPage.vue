<template>
  <div class="flex flex-col w-full h-full">
    <div class="ml-2 font-bold border w-fit px-4 py-1 mt-2 max-w-64 truncate bg-slate-100 rounded text-gray-700">
      {{ currentDesk?.name || 'unknown' }}
    </div>
    <CardLearn v-if="currentCard" :card="currentCard" @learned="learnedCard" />
  </div>
</template>
<script setup lang="ts">
import { useCard } from '@/service/useCard';
import { useDesk } from '@/service/useDesk';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { State, type RecordLogItem } from 'ts-fsrs';
import type { ICard } from '@/models/card';
import CardLearn from '@/components/card/CardLearn.vue';
import type { IDesk } from '@/models/desk';

const route = useRoute();
const deskId = computed(() => route.params.deskId);

const currentCard = ref<ICard | null>(null);
const currentDesk = ref<IDesk | null>(null);

const { getDesk } = useDesk();
const { fetchCards, updateModelAndHistory } = useCard();
const today = new Date(Date.now());

const providedCards = ref<ICard[]>([]);
const learnedCardIds = ref(new Set());

const criticalCards = computed(() => {
  return providedCards.value
    .filter(
      (card: ICard) =>
        [State.Learning, State.Relearning].includes(card.model.state) && !learnedCardIds.value.has(card.id),
    )
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

const newCards = computed(() => {
  return providedCards.value
    .filter((card: ICard) => card.model.state === State.New && !learnedCardIds.value.has(card.id))
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

const toReviewCards = computed(() => {
  return providedCards.value
    .filter(
      (card: ICard) =>
        card.model.state === State.Review && card.model.due < today && !learnedCardIds.value.has(card.id),
    )
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

function nextCard() {
  if (criticalCards.value.length > 0) {
    currentCard.value = criticalCards.value[0];
    return;
  }

  if (newCards.value.length > 0) {
    currentCard.value = newCards.value[0];
    return;
  }

  if (toReviewCards.value.length > 0) {
    currentCard.value = toReviewCards.value[0];
    return;
  }
  currentCard.value = null;
}

onMounted(async () => {
  currentDesk.value = await getDesk(deskId.value as string);
  providedCards.value = await fetchCards();

  nextCard();
});

async function learnedCard(recordLogItem: RecordLogItem) {
  if (!currentCard.value) return;
  // Add id set to filter
  learnedCardIds.value.add(currentCard.value.id);
  // Don't need await, we will it run async
  await updateModelAndHistory(currentCard.value.id, recordLogItem.card, recordLogItem.log);
  nextCard();
}
</script>
