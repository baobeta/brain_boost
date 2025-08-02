<template>
  <div class="space-y-6">
    <!-- Header with Create Deck Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Decks</h2>
      <div class="flex space-x-3">
        <button
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="showImportModal = true"
        >
          <Upload class="h-4 w-4 mr-2" />
          Import CSV
        </button>
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          @click="showCreateModal = true"
        >
          <Plus class="h-4 w-4 mr-2" />
          Create Deck
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex space-x-4">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search decks..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>

    <!-- Deck Grid -->
    <div v-if="filteredDecks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="deck in filteredDecks"
        :key="deck.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ deck.name }}
            </h3>
            <div class="flex space-x-1">
              <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="editDeck(deck)">
                <Edit2 class="h-4 w-4" />
              </button>
              <button class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400" @click="deleteDeck(deck)">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Total Cards:</span>
              <span class="font-medium">{{ deck.cardCount || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Due for Review:</span>
              <span class="font-medium text-orange-600 dark:text-orange-400">{{ deck.dueCount || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Last Updated:</span>
              <span class="font-medium">{{ formatDate(deck.updatedAt) }}</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              @click="openDeck(deck)"
            >
              <BookOpen class="h-4 w-4 inline mr-1" />
              Study
            </button>
            <button
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="manageDeck(deck)"
            >
              <Settings class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="decks.length === 0" class="text-center py-12">
      <BookOpen class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No decks yet</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first deck.</p>
      <div class="mt-6">
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          @click="showCreateModal = true"
        >
          <Plus class="h-4 w-4 mr-2" />
          Create Deck
        </button>
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else class="text-center py-12">
      <Search class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No decks found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
    </div>

    <!-- Create Deck Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Deck</h3>
        <form @submit.prevent="createDeck">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Deck Name </label>
            <input
              v-model="newDeckName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter deck name..."
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Import CSV Modal -->
    <Modal v-if="showImportModal" @close="showImportModal = false">
      <CSVImport @close="showImportModal = false" @imported="loadDecks" />
    </Modal>

    <!-- Deck Management Modal -->
    <Modal v-if="selectedDeck && showManageModal" @close="showManageModal = false">
      <DeckManager :deck="selectedDeck" @close="showManageModal = false" @updated="loadDecks" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, BookOpen, Settings, Edit2, Trash2, Upload, Search } from 'lucide-vue-next';
import { deckService, cardService } from '../services/database'; // .ts extension is inferred
import Modal from './Modal.vue';
import CSVImport from './CSVImport.vue';
import DeckManager from './DeckManager.vue';
import type { Deck } from '@/types'; // Import Deck type

const emit = defineEmits<{
  (e: 'change-tab', tabId: string): void;
}>();

const decks = ref<Deck[]>([]);
const searchQuery = ref<string>('');
const showCreateModal = ref<boolean>(false);
const showImportModal = ref<boolean>(false);
const showManageModal = ref<boolean>(false);
const newDeckName = ref<string>('');
const selectedDeck = ref<Deck | null>(null);

const filteredDecks = computed<Deck[]>(() => {
  if (!searchQuery.value) return decks.value;

  const query = searchQuery.value.toLowerCase();
  return decks.value.filter((deck) => deck.name.toLowerCase().includes(query));
});

const loadDecks = async (): Promise<void> => {
  try {
    const deckList: Deck[] = await deckService.getAll();

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
  }
};

const createDeck = async (): Promise<void> => {
  if (!newDeckName.value.trim()) return;

  try {
    await deckService.create(newDeckName.value.trim());
    newDeckName.value = '';
    showCreateModal.value = false;
    await loadDecks();
  } catch (error) {
    console.error('Failed to create deck:', error);
  }
};

const editDeck = (deck: Deck): void => {
  const newName = prompt('Enter new deck name:', deck.name);
  if (newName && newName.trim() !== deck.name) {
    updateDeckName(deck.id as number, newName.trim());
  }
};

const updateDeckName = async (deckId: number, newName: string): Promise<void> => {
  try {
    await deckService.update(deckId, { name: newName });
    await loadDecks();
  } catch (error) {
    console.error('Failed to update deck:', error);
  }
};

const deleteDeck = async (deck: Deck): Promise<void> => {
  if (confirm(`Are you sure you want to delete "${deck.name}"? This will also delete all cards in this deck.`)) {
    try {
      await deckService.delete(deck.id as number);
      await loadDecks();
    } catch (error) {
      console.error('Failed to delete deck:', error);
    }
  }
};

const openDeck = (deck: Deck): void => {
  // Switch to review mode with this deck
  localStorage.setItem('selectedDeckId', (deck.id as number).toString());
  emit('change-tab', 'review');
};

const manageDeck = (deck: Deck): void => {
  selectedDeck.value = deck;
  showManageModal.value = true;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  loadDecks();
});
</script>
