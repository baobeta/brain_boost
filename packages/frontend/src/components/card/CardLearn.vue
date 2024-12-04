<template>
  <div class="flex flex-col justify-center h-full">
    <div v-if="!props.card" class="font-xxl text-gray-500 flex justify-center items-center">
      <p class="text-xxl">Good job, you are finished all card today</p>
    </div>
    <template v-else>
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
        <div class="border mt-2 p-4 rounded">
          <PreviewCard :model-value="card.front" />
          <div v-if="isShowBack" class="mt-4 border-t">
            <PreviewCard :model-value="card.back" />
          </div>
        </div>
      </div>
      <div class="h-20 rounded bg-slate-100 flex items-center justify-center space-x-4">
        <div v-if="isShowBack" class="flex space-x-2">
          <div
            v-for="button in LEVEL_BUTTONS"
            :key="button.key"
            :class="button.color"
            class="px-4 text-white py-2 rounded cursor-pointer"
            @click="learnCard(button.level)"
          >
            {{ button.label }}
          </div>
        </div>
        <div v-else class="flex space-x-2">
          <div
            class="bg-green-500 px-4 text-white py-2 rounded cursor-pointer hover:bg-green-700"
            @click="isShowBack = true"
          >
            Show back
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { ICard } from '@/models/card';
import PreviewCard from './PreviewCard.vue';
import { fsrs, Rating, State, type RecordLogItem } from 'ts-fsrs';
import { computed, ref } from 'vue';

const isShowBack = ref(false);
const manager = fsrs();

const LEVEL_BUTTONS = [
  {
    key: 'again',
    label: 'Again',
    color: 'bg-red-500 hover:bg-red-700',
    level: Rating.Again,
  },
  {
    key: 'hard',
    label: 'Hard',
    color: 'bg-yellow-500 hover:bg-yellow-700',
    level: Rating.Hard,
  },
  {
    key: 'good',
    label: 'Good',
    color: 'bg-green-500 hover:bg-green-700',
    level: Rating.Good,
  },
  {
    key: 'easy',
    label: 'Easy',
    color: 'bg-blue-500 hover:bg-blue-700',
    level: Rating.Easy,
  },
];

const props = defineProps<{ card: ICard | null }>();
const emit = defineEmits(['learned']);

const scheduleCard = computed(() => {
  if (!props.card?.model) return {};
  return manager.repeat(props.card.model, new Date());
});

const MAP_STATE = {
  [State.New]: 'New',
  [State.Review]: 'To Review',
  [State.Learning]: 'Learning',
  [State.Relearning]: 'Relearning',
};

function learnCard(level: Rating) {
  const recordLog = scheduleCard.value[level] as RecordLogItem;
  if (!recordLog) return;
  emit('learned', recordLog);
}
</script>
