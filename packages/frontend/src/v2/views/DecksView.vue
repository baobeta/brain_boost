<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <DeckList
        :decks="decks"
        @load-decks="loadDecks"
        @deck-created="handleDeckCreated"
        @deck-updated="handleDeckUpdated"
        @delete-deck="handleDeleteDeck"
        @change-tab="handleChangeTab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from '../../composables/useToast';
import { deckService, cardService } from '../services/database';
import DeckList from '../components/DeckList.vue';
import type { Deck } from '../types';

const emit = defineEmits<{
  'change-tab': [tabId: string];
}>();

const toast = useToast();
const decks = ref<Deck[]>([]);
const isLoading = ref(false);

const loadDecks = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const deckList = await deckService.getAll();

    // Get card counts and due counts for each deck
    for (const deck of deckList) {
      const cards = await cardService.getByDeck(deck.id as number);
      const dueCards = await cardService.getDueCards(deck.id as number);

      deck.cardCount = cards.length;
      deck.dueCount = dueCards.length;
    }

    decks.value = deckList;
  } catch (error) {
    console.error('Failed to load decks:', error);
    toast.error('Error', 'Failed to load decks. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const handleDeckCreated = async (): Promise<void> => {
  await loadDecks();
  toast.success('Success', 'Deck created successfully!', 1000);
};

const handleDeckUpdated = async (): Promise<void> => {
  await loadDecks();
  toast.success('Success', 'Deck updated successfully!');
};

const handleDeleteDeck = async (deckId: number): Promise<void> => {
  try {
    await deckService.delete(deckId);
    await loadDecks();
    toast.success('Success', 'Deck deleted successfully!');
  } catch (error) {
    console.error('Failed to delete deck:', error);
    toast.error('Error', 'Failed to delete deck. Please try again.');
  }
};

const handleChangeTab = (tabId: string): void => {
  emit('change-tab', tabId);
};

// Load decks when component mounts
onMounted(() => {
  loadDecks();
});
</script>
