<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Library class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalDecks }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Decks</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BookOpen class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalCards }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Clock class="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ dueCards }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Due for Review</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <TrendingUp class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageAccuracy }}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Avg. Accuracy</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daily Reviews Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Reviews (Last 30 Days)</h3>
        <div class="h-64">
          <Line v-if="dailyReviewsData.labels.length > 0" :data="dailyReviewsData" :options="chartOptions" />
          <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No review data available
          </div>
        </div>
      </div>

      <!-- Accuracy Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Review Accuracy</h3>
        <div class="h-64">
          <Doughnut
            v-if="accuracyData.datasets[0].data.some((val) => val > 0)"
            :data="accuracyData"
            :options="doughnutOptions"
          />
          <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No accuracy data available
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div class="p-6">
        <div v-if="recentReviews.length > 0" class="space-y-4">
          <div
            v-for="review in recentReviews.slice(0, 10)"
            :key="review.id"
            class="flex items-center justify-between py-2"
          >
            <div class="flex items-center space-x-3">
              <div :class="getQualityBadgeClass(review.quality)">
                {{ getQualityLabel(review.quality) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ review.cardTerm }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ review.deckName }}
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeTime(review.reviewDate) }}
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">No recent reviews</div>
      </div>
    </div>

    <!-- Study Streak -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Study Streak</h3>
      <div class="flex items-center space-x-4">
        <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {{ studyStreak }}
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Days</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Current streak</div>
        </div>
      </div>

      <!-- Streak Calendar -->
      <div class="mt-4">
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="day in streakCalendar"
            :key="day.date"
            :class="[
              'w-8 h-8 rounded text-xs flex items-center justify-center',
              day.hasReviews
                ? 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
            ]"
            :title="day.date"
          >
            {{ day.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Library, BookOpen, Clock, TrendingUp } from 'lucide-vue-next';
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { deckService, cardService, reviewLogService } from '../services/database';
import type { Deck, Card, ReviewLog } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface EnrichedReviewLog extends ReviewLog {
  cardTerm?: string;
  deckName?: string;
}

interface DailyReviewsData extends ChartData<'line'> {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    },
  ];
}

interface AccuracyData extends ChartData<'doughnut'> {
  labels: string[];
  datasets: [
    {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    },
  ];
}

interface StreakDay {
  date: string;
  day: number;
  hasReviews: boolean;
}

const totalDecks = ref<number>(0);
const totalCards = ref<number>(0);
const dueCards = ref<number>(0);
const averageAccuracy = ref<number>(0);
const recentReviews = ref<EnrichedReviewLog[]>([]);
const studyStreak = ref<number>(0);
const dailyReviewsData = ref<DailyReviewsData>({
  labels: [],
  datasets: [
    {
      label: 'Reviews',
      data: [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.1,
    },
  ],
});

const accuracyData = ref<AccuracyData>({
  labels: ['Correct', 'Incorrect'],
  datasets: [
    {
      data: [0, 0],
      backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
      borderWidth: 1,
    },
  ],
});

const streakCalendar = ref<StreakDay[]>([]);

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const loadDashboardData = async (): Promise<void> => {
  try {
    // Load basic stats
    const decks: Deck[] = await deckService.getAll();
    totalDecks.value = decks.length;

    let cardCount = 0;
    let dueCount = 0;

    for (const deck of decks) {
      const cards: Card[] = await cardService.getByDeck(deck.id as number);
      const due: Card[] = await cardService.getDueCards(deck.id as number);
      cardCount += cards.length;
      dueCount += due.length;
    }

    totalCards.value = cardCount;
    dueCards.value = dueCount;

    // Load review statistics
    const reviewLogs: ReviewLog[] = await reviewLogService.getStats(30);

    // Calculate accuracy
    if (reviewLogs.length > 0) {
      const correctReviews = reviewLogs.filter((log) => log.quality >= 2).length;
      averageAccuracy.value = Math.round((correctReviews / reviewLogs.length) * 100);

      // Update accuracy chart
      accuracyData.value.datasets[0].data = [correctReviews, reviewLogs.length - correctReviews];
    } else {
      averageAccuracy.value = 0;
      accuracyData.value.datasets[0].data = [0, 0];
    }

    // Prepare daily reviews chart
    const dailyReviews: { [key: string]: number } = {};
    const last30Days: string[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.push(dateStr);
      dailyReviews[dateStr] = 0;
    }

    reviewLogs.forEach((log) => {
      const dateStr = new Date(log.reviewDate).toISOString().split('T')[0];
      if (dailyReviews.hasOwnProperty(dateStr)) {
        dailyReviews[dateStr]++;
      }
    });

    dailyReviewsData.value = {
      labels: last30Days.map((date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Reviews',
          data: last30Days.map((date) => dailyReviews[date]),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
        },
      ],
    };

    // Load recent reviews with card and deck info
    const recentLogs = reviewLogs
      .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
      .slice(0, 20);

    const enrichedReviews: EnrichedReviewLog[] = [];
    const allCards: Card[] = await cardService.getByDeck(null); // Get all cards once
    for (const log of recentLogs) {
      try {
        const card = allCards.find((c) => c.id === log.cardId);
        if (card) {
          const deck = decks.find((d) => d.id === card.deckId);
          enrichedReviews.push({
            ...log,
            cardTerm: card.term,
            deckName: deck ? deck.name : 'Unknown Deck',
          });
        }
      } catch (error) {
        console.error('Error enriching review:', error);
      }
    }

    recentReviews.value = enrichedReviews;

    // Calculate study streak
    calculateStudyStreak(reviewLogs);
    generateStreakCalendar(reviewLogs);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
};

const calculateStudyStreak = (reviewLogs: ReviewLog[]): void => {
  const reviewDates = new Set<string>();
  reviewLogs.forEach((log) => {
    const dateStr = new Date(log.reviewDate).toISOString().split('T')[0];
    reviewDates.add(dateStr);
  });

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    if (reviewDates.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      // Allow for today to not have reviews yet
      break;
    }
  }

  studyStreak.value = streak;
};

const generateStreakCalendar = (reviewLogs: ReviewLog[]): void => {
  const reviewDates = new Set<string>();
  reviewLogs.forEach((log) => {
    const dateStr = new Date(log.reviewDate).toISOString().split('T')[0];
    reviewDates.add(dateStr);
  });

  const calendar: StreakDay[] = [];
  const today = new Date();

  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    calendar.push({
      date: dateStr,
      day: date.getDate(),
      hasReviews: reviewDates.has(dateStr),
    });
  }

  streakCalendar.value = calendar;
};

const getQualityBadgeClass = (quality: number): string => {
  const classes: { [key: number]: string } = {
    0: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    1: 'px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    2: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    3: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  };
  return classes[quality] || classes[2];
};

const getQualityLabel = (quality: number): string => {
  const labels: { [key: number]: string } = { 0: 'Again', 1: 'Hard', 2: 'Good', 3: 'Easy' };
  return labels[quality] || 'Good';
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

onMounted(() => {
  loadDashboardData();
});
</script>
