<template>
  <div class="max-w-2xl mx-auto">
    <!-- Deck Selection -->
    <div v-if="!selectedDeck" class="text-center py-12">
      <BookOpen class="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a Deck for Typing Practice</h2>

      <div class="grid gap-4 max-w-md mx-auto">
        <button
          v-for="deck in decksWithCards"
          :key="deck.id"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          @click="selectDeck(deck)"
        >
          <div class="font-medium text-gray-900 dark:text-white">{{ deck.name }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ deck.cardCount }} cards available</div>
        </button>
      </div>

      <div v-if="decksWithCards.length === 0" class="mt-8">
        <p class="text-gray-600 dark:text-gray-400">No decks with cards available for typing practice.</p>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="$emit('change-tab', 'decks')"
        >
          Manage Decks
        </button>
      </div>
    </div>

    <!-- Card Count Selection -->
    <div v-else-if="selectedDeck && !sessionStarted" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          How many cards would you like to practice?
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ selectedDeck.name }} has {{ selectedDeck.cardCount }} cards available
        </p>

        <!-- Card Count Options -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button
            v-for="option in cardCountOptions"
            :key="option.value"
            :class="[
              'p-4 border rounded-lg text-center transition-colors',
              selectedCardCount === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
            ]"
            @click="selectedCardCount = option.value"
          >
            <div class="text-lg font-semibold">{{ option.value }}</div>
            <div class="text-sm">{{ option.label }}</div>
          </button>
        </div>

        <!-- Custom Count Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Or enter a custom number:
          </label>
          <input
            v-model.number="customCardCount"
            type="number"
            min="1"
            :max="selectedDeck.cardCount"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter number of cards"
          />
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum: {{ selectedDeck.cardCount }} cards</div>
        </div>

        <!-- Start Session Button -->
        <div class="flex justify-center space-x-4">
          <button
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canStartSession"
            @click="startSession"
          >
            Start Session
          </button>
          <button
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="exitTypingMode"
          >
            Back
          </button>
        </div>
      </div>
    </div>

    <!-- Typing Session -->
    <div v-else-if="currentCard && !sessionComplete" class="space-y-6">
      <!-- Progress -->
      <div class="flex justify-between items-center">
        <button
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          @click="exitTypingMode"
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
          <div class="text-sm text-blue-600 dark:text-blue-400 mt-1">Typing Mode - Type the term</div>
        </div>

        <!-- Card Content -->
        <div class="flex-1 p-8 flex flex-col justify-center">
          <!-- Definition -->
          <div class="text-center mb-8">
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2 whitespace-pre-line">
              {{ currentCard.definition }}
            </div>
            <div v-if="currentCard.example" class="text-lg text-gray-600 dark:text-gray-400 mt-4 whitespace-pre-line">
              {{ currentCard.example }}
            </div>
          </div>

          <!-- Typing Input Area -->
          <div class="space-y-4">
            <div class="relative">
              <input
                ref="typingInput"
                v-model="userAnswer"
                type="text"
                placeholder="Type the term here..."
                class="w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="[
                  feedback
                    ? feedback.isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                  'text-gray-900 dark:text-white',
                ]"
                :disabled="!!feedback"
                @keyup.enter="submitAnswer"
              />
            </div>

            <!-- Feedback -->
            <div v-if="feedback" class="space-y-4">
              <div
                :class="[
                  'text-center font-medium',
                  feedback.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                ]"
              >
                {{ feedback.isCorrect ? 'Correct!' : 'Incorrect' }}
              </div>

              <div v-if="!feedback.isCorrect" class="text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Correct answer:</div>
                <div class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ currentCard.term }}
                </div>
              </div>

              <!-- Next Button -->
              <div class="flex justify-center">
                <button
                  class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  @click="nextCard"
                >
                  Next Card
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div v-else class="flex justify-center">
              <button
                class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!userAnswer.trim()"
                @click="submitAnswer"
              >
                Submit (Enter)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Complete -->
    <div v-else-if="selectedDeck && sessionComplete" class="text-center py-12">
      <CheckCircle class="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Typing Session Complete!</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        You've completed all {{ reviewedCount }} cards in this typing session.
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
          Practice Again
        </button>
        <button
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="exitTypingMode"
        >
          Back to Decks
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { BookOpen, ArrowLeft, CheckCircle } from 'lucide-vue-next';
import { deckService, cardService } from '../services/database';
import type { Deck, Card } from '../types';

const emit = defineEmits<{
  (e: 'change-tab', tabId: string): void;
}>();

interface SessionStats {
  correct: number;
  incorrect: number;
}

interface Feedback {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

const decks = ref<Deck[]>([]);
const selectedDeck = ref<Deck | null>(null);
const cards = ref<Card[]>([]);
const currentCardIndex = ref<number>(0);
const userAnswer = ref<string>('');
const feedback = ref<Feedback | null>(null);
const reviewedCount = ref<number>(0);
const sessionStats = ref<SessionStats>({ correct: 0, incorrect: 0 });
const sessionComplete = ref<boolean>(false);
const typingInput = ref<HTMLInputElement | null>(null);

const currentCard = computed<Card | null>(() => {
  return cards.value[currentCardIndex.value] || null;
});

const totalCards = computed<number>(() => {
  return cards.value.length;
});

const decksWithCards = computed<Deck[]>(() => {
  return decks.value.filter((deck) => (deck.cardCount || 0) > 0);
});

const cardCountOptions = ref([
  { value: 10, label: '10 Cards' },
  { value: 20, label: '20 Cards' },
  { value: 30, label: '30 Cards' },
  { value: 40, label: '40 Cards' },
  { value: 50, label: '50 Cards' },
]);
const selectedCardCount = ref<number>(10);
const customCardCount = ref<number | null>(null);
const sessionStarted = ref<boolean>(false);

const canStartSession = computed<boolean>(() => {
  if (!selectedDeck.value?.cardCount) return false;

  if (customCardCount.value !== null) {
    return customCardCount.value > 0 && customCardCount.value <= selectedDeck.value.cardCount;
  }
  return selectedCardCount.value > 0 && selectedCardCount.value <= selectedDeck.value.cardCount;
});

const loadDecks = async (): Promise<void> => {
  try {
    const deckList: Deck[] = await deckService.getAll();

    // Get card counts for each deck
    for (const deck of deckList) {
      const allCards = await cardService.getByDeck(deck.id as number);
      deck.cardCount = allCards.length;
    }

    decks.value = deckList;
  } catch (error) {
    console.error('Failed to load decks:', error);
  }
};

const selectDeck = async (deck: Deck): Promise<void> => {
  selectedDeck.value = deck;
  // Reset card count selection when a new deck is selected
  selectedCardCount.value = 10;
  customCardCount.value = null;
  sessionStarted.value = false;
};

const startSession = async (): Promise<void> => {
  if (!selectedDeck.value || !selectedDeck.value.cardCount) return;

  const cardCount = customCardCount.value !== null ? customCardCount.value : selectedCardCount.value;
  if (cardCount === null || cardCount <= 0 || cardCount > selectedDeck.value.cardCount) {
    alert('Please select a valid number of cards to practice.');
    return;
  }

  cards.value = await cardService.getByDeck(selectedDeck.value.id as number);
  cards.value = cards.value.sort(() => Math.random() - 0.5);
  cards.value = cards.value.slice(0, cardCount);

  currentCardIndex.value = 0;
  userAnswer.value = '';
  feedback.value = null;
  reviewedCount.value = 0;
  sessionStats.value = { correct: 0, incorrect: 0 };
  sessionComplete.value = false;
  sessionStarted.value = true;

  // Focus input after component updates
  await nextTick();
  typingInput.value?.focus();
};

const normalizeAnswer = (answer: string): string => {
  // Remove extra whitespace and convert to lowercase for comparison
  return answer.trim().toLowerCase();
};

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  // Exact match (case-insensitive)
  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  // Check if user answer contains all significant words from correct answer
  // This allows for minor differences in phrasing
  const correctWords = normalizedCorrect.split(/\s+/).filter((word) => word.length > 2);
  const userWords = normalizedUser.split(/\s+/);

  const matchedWords = correctWords.filter((word) =>
    userWords.some((userWord) => userWord.includes(word) || word.includes(userWord)),
  );

  // If 80% or more of significant words match, consider it correct
  return matchedWords.length >= correctWords.length * 0.8;
};

const submitAnswer = (): void => {
  if (!userAnswer.value.trim() || !currentCard.value || feedback.value) return;

  const isCorrect = checkAnswer(userAnswer.value, currentCard.value.term);

  feedback.value = {
    isCorrect,
    userAnswer: userAnswer.value,
    correctAnswer: currentCard.value.term,
  };

  // Update session stats
  if (isCorrect) {
    sessionStats.value.correct++;
  } else {
    sessionStats.value.incorrect++;
  }

  reviewedCount.value++;
};

const nextCard = async (): Promise<void> => {
  if (currentCardIndex.value + 1 >= cards.value.length) {
    sessionComplete.value = true;
  } else {
    currentCardIndex.value++;
    userAnswer.value = '';
    feedback.value = null;

    // Focus input after component updates
    await nextTick();
    typingInput.value?.focus();
  }
};

const startNewSession = async (): Promise<void> => {
  if (selectedDeck.value) {
    sessionStarted.value = false;
    selectedCardCount.value = 10;
    customCardCount.value = null;
  }
};

const exitTypingMode = (): void => {
  selectedDeck.value = null;
  cards.value = [];
  currentCardIndex.value = 0;
  userAnswer.value = '';
  feedback.value = null;
  reviewedCount.value = 0;
  sessionStats.value = { correct: 0, incorrect: 0 };
  sessionComplete.value = false;
  sessionStarted.value = false;
};

onMounted(() => {
  loadDecks();
});
</script>
