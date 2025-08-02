<template>
  <div class="space-y-6">
    <!-- Header with Create Deck Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Decks</h2>
      <div class="flex space-x-3">
        <button
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="importModal.open()"
        >
          <Upload class="h-4 w-4 mr-2" />
          Import CSV
        </button>
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          @click="createModal.open()"
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
    <div v-else-if="props.decks.length === 0" class="text-center py-12">
      <BookOpen class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No decks yet</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first deck.</p>
      <div class="mt-6">
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          @click="createModal.open()"
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
    <CreateDeckModal v-model="createModal.isOpen.value" @created="handleDeckCreated" />

    <!-- Import CSV Modal -->
    <ImportCSVModal v-model="importModal.isOpen.value" @imported="handleImported" />

    <!-- Deck Management Modal -->
    <DeckManagerModal v-model="manageModal.isOpen.value" :deck="selectedDeck" @updated="handleManagerUpdated" />

    <!-- Edit Deck Modal -->
    <EditDeckModal v-model="editModal.isOpen.value" :deck="editingDeck" @updated="handleDeckUpdated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, BookOpen, Settings, Edit2, Trash2, Upload, Search } from 'lucide-vue-next';
import { useModal } from '../composables/useModal';
import { CreateDeckModal, EditDeckModal, ImportCSVModal, DeckManagerModal } from './modals';
import type { Deck } from '../types';

const props = defineProps<{
  decks: Deck[];
}>();

const emit = defineEmits<{
  'change-tab': [tabId: string];
  'load-decks': [];
  'delete-deck': [deckId: number];
  'deck-created': [];
  'deck-updated': [];
}>();

const searchQuery = ref<string>('');
const selectedDeck = ref<Deck | null>(null);

// Modal management
const createModal = useModal();
const importModal = useModal();
const manageModal = useModal();
const editModal = useModal();

// Edit deck state
const editingDeck = ref<Deck | null>(null);

const filteredDecks = computed<Deck[]>(() => {
  if (!searchQuery.value) return props.decks;

  const query = searchQuery.value.toLowerCase();
  return props.decks.filter((deck) => deck.name.toLowerCase().includes(query));
});

const editDeck = (deck: Deck): void => {
  editingDeck.value = deck;
  editModal.open();
};

const deleteDeck = async (deck: Deck): Promise<void> => {
  if (confirm(`Are you sure you want to delete "${deck.name}"? This will also delete all cards in this deck.`)) {
    emit('delete-deck', deck.id as number);
  }
};

const openDeck = (deck: Deck): void => {
  // Switch to review mode with this deck
  localStorage.setItem('selectedDeckId', (deck.id as number).toString());
  emit('change-tab', 'review');
};

const manageDeck = (deck: Deck): void => {
  selectedDeck.value = deck;
  manageModal.open();
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

const handleDeckCreated = (): void => {
  createModal.close();
  emit('deck-created');
};

const handleDeckUpdated = (): void => {
  editModal.close();
  editingDeck.value = null;
  emit('deck-updated');
};

const handleImported = (): void => {
  importModal.close();
  emit('deck-created');
};

const handleManagerUpdated = (): void => {
  manageModal.close();
  emit('deck-updated');
};

// Request initial data load when component mounts
onMounted(() => {
  emit('load-decks');
});
</script>
