<template>
  <div class="max-w-2xl mx-auto">
    <!-- Deck Selection -->
    <div v-if="!selectedDeck" class="text-center py-12">
      <BookOpen class="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a Deck to Review</h2>

      <div class="grid gap-4 max-w-md mx-auto">
        <button
          v-for="deck in decksWithDue"
          :key="deck.id"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          @click="selectDeck(deck)"
        >
          <div class="font-medium text-gray-900 dark:text-white">{{ deck.name }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ deck.dueCount }} cards due for review</div>
        </button>
      </div>

      <div v-if="decksWithDue.length === 0" class="mt-8">
        <p class="text-gray-600 dark:text-gray-400">No cards are due for review right now.</p>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="$emit('change-tab', 'decks')"
        >
          Manage Decks
        </button>
      </div>
    </div>

    <!-- Review Session -->
    <div v-else-if="currentCard" class="space-y-6">
      <!-- Progress -->
      <div class="flex justify-between items-center">
        <button
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          @click="exitReview"
        >
          <ArrowLeft class="h-4 w-4 mr-1" />
          Back to Decks
        </button>

        <div class="text-sm text-gray-600 dark:text-gray-400">{{ reviewedCount }} / {{ totalCards }} cards</div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(reviewedCount / totalCards) * 100}%` }"
        ></div>
      </div>

      <!-- Flashcard -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col"
      >
        <!-- Card Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ selectedDeck.name }}
          </h3>
        </div>

        <!-- Card Content -->
        <div class="flex-1 p-8 flex flex-col justify-center">
          <!-- Term (always visible) -->
          <div class="text-center mb-8">
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentCard.term }}
            </div>
          </div>

          <!-- Definition and Example (shown after reveal) -->
          <div v-if="showAnswer" class="space-y-6">
            <div class="text-center">
              <div class="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {{ currentCard.definition }}
              </div>

              <div v-if="currentCard.example" class="text-sm text-gray-600 dark:text-gray-400 italic">
                "{{ currentCard.example }}"
              </div>
            </div>

            <!-- Rating Buttons -->
            <div class="flex justify-center space-x-3 mt-8">
              <button
                v-for="rating in ratings"
                :key="rating.value"
                :class="['px-6 py-3 rounded-lg font-medium transition-colors', rating.class]"
                @click="rateCard(rating.value)"
              >
                {{ rating.label }}
              </button>
            </div>
          </div>

          <!-- Show Answer Button -->
          <div v-else class="text-center">
            <button
              class="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
              @click="showAnswer = true"
            >
              Show Answer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Complete -->
    <div v-else-if="selectedDeck" class="text-center py-12">
      <CheckCircle class="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Review Complete!</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        You've reviewed all {{ reviewedCount }} cards in this session.
      </p>

      <!-- Session Stats -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto mb-8"
      >
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ sessionStats.correct }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Correct</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ sessionStats.incorrect }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100) }}% Accuracy
          </div>
        </div>
      </div>

      <div class="flex justify-center space-x-4">
        <button
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          @click="startNewSession"
        >
          Review Again
        </button>
        <button
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="exitReview"
        >
          Back to Decks
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BookOpen, ArrowLeft, CheckCircle } from 'lucide-vue-next';
import { deckService, cardService, reviewLogService } from '../services/database';
import { fsrsEngine } from '../services/fsrs';
import type { Deck, Card, ReviewLog, CardState } from '../types';

const emit = defineEmits<{
  (e: 'change-tab', tabId: string): void;
}>();

interface Rating {
  value: number;
  label: string;
  class: string;
}

interface SessionStats {
  correct: number;
  incorrect: number;
}

const decks = ref<Deck[]>([]);
const selectedDeck = ref<Deck | null>(null);
const dueCards = ref<Card[]>([]);
const currentCardIndex = ref<number>(0);
const showAnswer = ref<boolean>(false);
const reviewedCount = ref<number>(0);
const sessionStats = ref<SessionStats>({ correct: 0, incorrect: 0 });

const ratings: Rating[] = [
  { value: 0, label: 'Again', class: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 1, label: 'Hard', class: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { value: 2, label: 'Good', class: 'bg-green-500 hover:bg-green-600 text-white' },
  { value: 3, label: 'Easy', class: 'bg-blue-500 hover:bg-blue-600 text-white' },
];

const currentCard = computed<Card | null>(() => {
  return dueCards.value[currentCardIndex.value] || null;
});

const totalCards = computed<number>(() => {
  return dueCards.value.length;
});

const decksWithDue = computed<Deck[]>(() => {
  return decks.value.filter((deck) => (deck.dueCount || 0) > 0);
});

const loadDecks = async (): Promise<void> => {
  try {
    const deckList: Deck[] = await deckService.getAll();

    // Get due card counts for each deck
    for (const deck of deckList) {
      const due = await cardService.getDueCards(deck.id as number);
      deck.dueCount = due.length;
    }

    decks.value = deckList;

    // Auto-select deck if specified in localStorage
    const savedDeckId = localStorage.getItem('selectedDeckId');
    if (savedDeckId) {
      const deck = deckList.find((d) => d.id?.toString() === savedDeckId);
      if (deck && (deck.dueCount || 0) > 0) {
        selectDeck(deck);
      }
      localStorage.removeItem('selectedDeckId');
    }
  } catch (error) {
    console.error('Failed to load decks:', error);
  }
};

const selectDeck = async (deck: Deck): Promise<void> => {
  try {
    selectedDeck.value = deck;
    dueCards.value = await cardService.getDueCards(deck.id as number);

    // Shuffle cards for variety
    dueCards.value = dueCards.value.sort(() => Math.random() - 0.5);

    currentCardIndex.value = 0;
    showAnswer.value = false;
    reviewedCount.value = 0;
    sessionStats.value = { correct: 0, incorrect: 0 };
  } catch (error) {
    console.error('Failed to load due cards:', error);
  }
};

const rateCard = async (quality: number): Promise<void> => {
  if (!currentCard.value) return;

  try {
    // Get previous review logs for FSRS calculation
    const reviewLogs: ReviewLog[] = await reviewLogService.getByCard(currentCard.value.id as number);

    let cardState: CardState;
    if (reviewLogs.length === 0) {
      // First review - initialize card state
      cardState = fsrsEngine.initializeCard();
    } else {
      // Get last review state
      const lastLog = reviewLogs[reviewLogs.length - 1];
      cardState = {
        interval: lastLog.interval,
        ease: lastLog.ease,
        reps: lastLog.reps || 0,
        lapses: lastLog.lapses || 0,
        stability: lastLog.stability || 1,
        difficulty: lastLog.difficulty || 5,
      };
    }

    // Process the review with FSRS
    const newState: CardState = fsrsEngine.processReview(cardState, quality);
    const nextReviewDate: Date = fsrsEngine.getNextReviewDate(newState.interval);

    // Log the review
    await reviewLogService.create({
      cardId: currentCard.value.id as number,
      quality: quality,
      interval: newState.interval,
      ease: newState.ease,
      reps: newState.reps,
      lapses: newState.lapses,
      stability: newState.stability,
      difficulty: newState.difficulty,
    });

    // Update card's next review date and FSRS properties
    await cardService.update(currentCard.value.id as number, {
      nextReviewDate: nextReviewDate,
      interval: newState.interval,
      ease: newState.ease,
      reps: newState.reps,
      lapses: newState.lapses,
      stability: newState.stability,
      difficulty: newState.difficulty,
    });

    // Update session stats
    if (quality >= 2) {
      sessionStats.value.correct++;
    } else {
      sessionStats.value.incorrect++;
    }

    // Move to next card
    reviewedCount.value++;
    currentCardIndex.value++;
    showAnswer.value = false;

    // Remove reviewed card from due cards if it was successful
    if (quality >= 2) {
      dueCards.value.splice(currentCardIndex.value - 1, 1);
      currentCardIndex.value--;
    }
  } catch (error) {
    console.error('Failed to process review:', error);
  }
};

const startNewSession = async (): Promise<void> => {
  if (selectedDeck.value) {
    await selectDeck(selectedDeck.value);
  }
};

const exitReview = (): void => {
  selectedDeck.value = null;
  dueCards.value = [];
  currentCardIndex.value = 0;
  showAnswer.value = false;
  reviewedCount.value = 0;
  sessionStats.value = { correct: 0, incorrect: 0 };
};

onMounted(() => {
  loadDecks();
});
</script>
