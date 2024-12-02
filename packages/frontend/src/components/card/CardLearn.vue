<template>
  <div class="flex flex-col justify-center h-full">
    <div class="h-full flex flex-col justify-center p-8">
      <div
        :class="{
          'text-red-500': card?.model.state === State.Relearning,
          'text-green-500': card?.model.state === State.Learning,
          'text-blue-500': card?.model.state === State.Review,
          'text-yellow-500': card?.model.state === State.New,
        }"
        class="font-semibold"
      >
        {{ MAP_STATE[card?.model.state] }}
      </div>
      <div class="border mt-2 p-4 rounded"><PreviewCard :model-value="props.card.front" /></div>
    </div>
    <div class="h-20 rounded bg-slate-100 flex items-center justify-center space-x-4">
      <div class="bg-red-500 px-4 text-white py-2 rounded cursor-pointer hover:bg-red-700">Again</div>
      <div class="bg-yellow-500 px-4 text-white py-2 rounded cursor-pointer hover:bg-yellow-700">Hard</div>
      <div class="bg-green-500 px-4 text-white py-2 rounded cursor-pointer hover:bg-green-700">Good</div>
      <div class="bg-blue-500 px-4 text-white py-2 rounded cursor-pointer hover:bg-blue-700">Easy</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ICard } from '@/models/card';
import PreviewCard from './PreviewCard.vue';
import { State } from 'ts-fsrs';
import { ref } from 'vue';

const isShowBack = ref(false);

const props = defineProps<{ card: ICard }>();
const MAP_STATE = {
  [State.New]: 'New',
  [State.Review]: 'To Review',
  [State.Learning]: 'Learning',
  [State.Relearning]: 'Relearning',
};
</script>
