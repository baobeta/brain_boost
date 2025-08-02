<template>
  <div class="p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ card ? 'Edit Card' : 'Add New Card' }}
    </h3>

    <form class="space-y-4" @submit.prevent="saveCard">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Term * </label>
        <input
          v-model="formData.term"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter the term or word..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Definition * </label>
        <textarea
          v-model="formData.definition"
          required
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter the definition..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Example (Optional) </label>
        <textarea
          v-model="formData.example"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter an example sentence..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!formData.term.trim() || !formData.definition.trim()"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ card ? 'Update' : 'Add' }} Card
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { cardService } from '../services/database';
import type { Card } from '@/types';

const props = defineProps<{
  card?: Card | null;
  deckId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const formData = ref<Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'nextReviewDate'>>({
  term: '',
  definition: '',
  example: '',
});

const saveCard = async (): Promise<void> => {
  try {
    if (props.card) {
      // Update existing card
      await cardService.update(props.card.id as number, formData.value);
    } else {
      // Create new card
      await cardService.create({
        ...formData.value,
        deckId: props.deckId,
      });
    }

    emit('saved');
  } catch (error) {
    console.error('Failed to save card:', error);
  }
};

onMounted(() => {
  if (props.card) {
    formData.value = {
      term: props.card.term,
      definition: props.card.definition,
      example: props.card.example || '',
    };
  }
});
</script>
