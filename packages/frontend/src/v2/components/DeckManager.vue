<template>
  <div>
    <ModalHeader show-close @close="$emit('close')"> Manage Deck: {{ deck.name }} </ModalHeader>
    <ModalBody custom-class="max-h-[60vh] overflow-y-auto">
      <!-- Deck Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ cards.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ dueCards.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Due for Review</div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ masteredCards }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Mastered</div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <button
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            @click="openAddCard"
          >
            <Plus class="h-4 w-4 mr-1" />
            Add Card
          </button>
          <button
            v-if="selectedCards.length > 0"
            class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            @click="bulkDelete"
          >
            <Trash2 class="h-4 w-4 mr-1" />
            Delete Selected ({{ selectedCards.length }})
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search cards..."
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>

      <!-- Cards Table -->
      <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-3 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  @change="toggleAllCards"
                />
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Term
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Definition
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Next Review
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="card in filteredCards" :key="card.id">
              <td class="px-3 py-4">
                <input
                  v-model="selectedCards"
                  type="checkbox"
                  :value="card.id"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ card.term }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                {{ card.definition }}
              </td>
              <td class="px-3 py-4 text-sm">
                <span :class="getStatusClass(card)">
                  {{ getCardStatus(card) }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ formatNextReview(card.nextReviewDate) }}
              </td>
              <td class="px-3 py-4 text-sm">
                <div class="flex space-x-2">
                  <button
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    @click="editCard(card)"
                  >
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    @click="deleteCard(card)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ModalBody>

    <!-- Add/Edit Card Modal -->
    <Modal v-model="cardModal.isOpen.value" size="md">
      <CardEditor :card="editingCard" :deck-id="deck.id as number" @close="closeCardModal" @saved="handleCardSaved" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Trash2, Search, Edit2 } from 'lucide-vue-next';
import { cardService } from '../services/database';
import { useModal } from '../composables/useModal';
import Modal from './Modal.vue';
import { ModalHeader, ModalBody } from './modal';
import CardEditor from './CardEditor.vue';
import type { Deck, Card } from '../types';

const props = defineProps<{
  deck: Deck;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const cards = ref<Card[]>([]);
const dueCards = ref<Card[]>([]);
const selectedCards = ref<number[]>([]);
const searchQuery = ref<string>('');
const editingCard = ref<Card | null>(null);

// Modal management
const cardModal = useModal();

const filteredCards = computed<Card[]>(() => {
  if (!searchQuery.value) return cards.value;

  const query = searchQuery.value.toLowerCase();
  return cards.value.filter(
    (card) => card.term.toLowerCase().includes(query) || card.definition.toLowerCase().includes(query),
  );
});

const allSelected = computed<boolean>(() => {
  return filteredCards.value.length > 0 && selectedCards.value.length === filteredCards.value.length;
});

const masteredCards = computed<number>(() => {
  return cards.value.filter((card) => {
    const daysSinceCreation = (new Date().getTime() - new Date(card.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation > 30 && new Date(card.nextReviewDate).getTime() > new Date().getTime();
  }).length;
});

const loadCards = async (): Promise<void> => {
  try {
    cards.value = await cardService.getByDeck(props.deck.id as number);
    dueCards.value = await cardService.getDueCards(props.deck.id as number);
  } catch (error) {
    console.error('Failed to load cards:', error);
  }
};

const toggleAllCards = (): void => {
  if (allSelected.value) {
    selectedCards.value = [];
  } else {
    selectedCards.value = filteredCards.value.map((card) => card.id as number);
  }
};

const bulkDelete = async (): Promise<void> => {
  if (confirm(`Delete ${selectedCards.value.length} selected cards?`)) {
    try {
      await cardService.bulkDelete(selectedCards.value);
      selectedCards.value = [];
      await loadCards();
      emit('updated');
    } catch (error) {
      console.error('Failed to delete cards:', error);
    }
  }
};

const openAddCard = (): void => {
  editingCard.value = null;
  cardModal.open();
};

const editCard = (card: Card): void => {
  editingCard.value = card;
  cardModal.open();
};

const deleteCard = async (card: Card): Promise<void> => {
  if (confirm(`Delete card "${card.term}"?`)) {
    try {
      await cardService.delete(card.id as number);
      await loadCards();
      emit('updated');
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  }
};

const closeCardModal = (): void => {
  cardModal.close();
  editingCard.value = null;
};

const handleCardSaved = async (): Promise<void> => {
  closeCardModal();
  await loadCards();
  emit('updated');
};

const getCardStatus = (card: Card): string => {
  const now = new Date();
  const nextReview = new Date(card.nextReviewDate);

  if (nextReview.getTime() <= now.getTime()) return 'Due';

  const daysDiff = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff <= 7) return `${daysDiff} days`;
  if (daysDiff <= 30) return `${Math.ceil(daysDiff / 7)} weeks`;
  return `${Math.ceil(daysDiff / 30)} months`;
};

const getStatusClass = (card: Card): string => {
  const now = new Date();
  const nextReview = new Date(card.nextReviewDate);

  if (nextReview.getTime() <= now.getTime()) {
    return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  }

  const daysDiff = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff <= 3) {
    return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
  }

  return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
};

const formatNextReview = (date: Date): string => {
  const reviewDate = new Date(date);
  const now = new Date();

  if (reviewDate.getTime() <= now.getTime()) return 'Now';

  const daysDiff = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff <= 7) return `${daysDiff} days`;

  return reviewDate.toLocaleDateString();
};

onMounted(() => {
  loadCards();
});
</script>
