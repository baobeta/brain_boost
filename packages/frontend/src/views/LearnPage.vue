<template>
  <div>{{ $route.params.deskId }}</div>
</template>
<script setup lang="ts">
import { useCard } from '@/service/useCard';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { State } from 'ts-fsrs';
import type { ICard } from '@/models/card';
const route = useRoute();
const deskId = computed(() => route.params.deskId);
const reviewingCards = ref([]);
const reviewedCards = ref([]);
const { fetchCards } = useCard();
const today = new Date(Date.now());

const providedCards = ref<ICard[]>([]);

const critialCards = computed(() => {
  return providedCards.value
    .filter((card: ICard) => [State.Learning, State.Relearning].includes(card.model.state))
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

const newCards = computed(() => {
  return providedCards.value
    .filter((card: ICard) => card.model.state === State.New)
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

const toReviewCards = computed(() => {
  return providedCards.value
    .filter((card: ICard) => card.model.state === State.Review && card.model.due < today)
    .sort((a: ICard, b: ICard) => (a.model.due as Date).getTime() - (b.model.due as Date).getTime());
});

onMounted(async () => {
  providedCards.value = await fetchCards();
});
</script>
