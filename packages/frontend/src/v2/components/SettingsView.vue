<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

    <!-- FSRS Parameters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">FSRS Algorithm Settings</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Adjust the spaced repetition algorithm parameters to match your learning style.
        </p>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Request Retention ({{ (fsrsSettings.requestRetention * 100).toFixed(0) }}%)
          </label>
          <input
            v-model.number="fsrsSettings.requestRetention"
            type="range"
            min="0.7"
            max="0.98"
            step="0.01"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Higher values mean more frequent reviews but better retention.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Interval ({{ fsrsSettings.maximumInterval }} days)
          </label>
          <input
            v-model.number="fsrsSettings.maximumInterval"
            type="range"
            min="30"
            max="36500"
            step="30"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum time between reviews for well-known cards.
          </p>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="resetFSRSSettings"
          >
            Reset to Defaults
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            @click="saveFSRSSettings"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Data Management</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Export your data or clear all stored information.</p>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Export All Data</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Download all your decks, cards, and review history as JSON.
            </div>
          </div>
          <button
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            @click="exportData"
          >
            <Download class="h-4 w-4 inline mr-1" />
            Export
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Import Data</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Restore data from a previously exported JSON file.
            </div>
          </div>
          <div>
            <input ref="importFileInput" type="file" accept=".json" class="hidden" @change="importData" />
            <button
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              @click="($refs.importFileInput as HTMLInputElement).click()"
            >
              <Upload class="h-4 w-4 inline mr-1" />
              Import
            </button>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-red-600 dark:text-red-400">Clear All Data</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Permanently delete all decks, cards, and review history.
              </div>
            </div>
            <button
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              @click="clearAllData"
            >
              <Trash2 class="h-4 w-4 inline mr-1" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- App Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">About</h3>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Version</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">1.0.0</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ storageUsed }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">PWA Status</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ isPWAInstalled ? 'Installed' : 'Not Installed' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="message"
      :class="[
        'p-4 rounded-md',
        message.type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
          : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      ]"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Download, Upload, Trash2 } from 'lucide-vue-next';
import { deckService, cardService, reviewLogService, db } from '../services/database';
import { fsrsEngine } from '../services/fsrs';
import type { FSRSParameters, Deck, Card, ReviewLog, Message } from '@/types';

const fsrsSettings = ref<FSRSParameters>({
  requestRetention: 0.9,
  maximumInterval: 36500,
  w: [], // 'w' is not directly configurable by user, but part of FSRSParameters
});

const storageUsed = ref<string>('Calculating...');
const isPWAInstalled = ref<boolean>(false);
const message = ref<Message | null>(null);

const saveFSRSSettings = (): void => {
  // Update FSRS engine parameters
  fsrsEngine.parameters.requestRetention = fsrsSettings.value.requestRetention;
  fsrsEngine.parameters.maximumInterval = fsrsSettings.value.maximumInterval;

  // Save to localStorage
  localStorage.setItem(
    'fsrsSettings',
    JSON.stringify({
      requestRetention: fsrsSettings.value.requestRetention,
      maximumInterval: fsrsSettings.value.maximumInterval,
    }),
  );

  showMessage('FSRS settings saved successfully!', 'success');
};

const resetFSRSSettings = (): void => {
  fsrsSettings.value = {
    requestRetention: 0.9,
    maximumInterval: 36500,
    w: [], // Resetting 'w' is not user-facing
  };

  localStorage.removeItem('fsrsSettings');
  showMessage('FSRS settings reset to defaults.', 'success');
};

const exportData = async (): Promise<void> => {
  try {
    const decks: Deck[] = await deckService.getAll();
    const allCards: Card[] = [];
    const allReviewLogs: ReviewLog[] = [];

    for (const deck of decks) {
      const cards: Card[] = await cardService.getByDeck(deck.id as number);
      allCards.push(...cards);

      for (const card of cards) {
        const logs: ReviewLog[] = await reviewLogService.getByCard(card.id as number);
        allReviewLogs.push(...logs);
      }
    }

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      decks,
      cards: allCards,
      reviewLogs: allReviewLogs,
      fsrsSettings: {
        requestRetention: fsrsSettings.value.requestRetention,
        maximumInterval: fsrsSettings.value.maximumInterval,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage('Data exported successfully!', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showMessage('Failed to export data.', 'error');
  }
};

const importData = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.version || !data.decks || !data.cards) {
      throw new Error('Invalid backup file format');
    }

    if (!confirm('This will replace all existing data. Are you sure?')) {
      return;
    }

    // Clear existing data
    await db.transaction('rw', db.decks, db.cards, db.reviewLogs, async () => {
      await db.reviewLogs.clear();
      await db.cards.clear();
      await db.decks.clear();
    });

    // Import new data
    await db.transaction('rw', db.decks, db.cards, db.reviewLogs, async () => {
      await db.decks.bulkAdd(data.decks);
      await db.cards.bulkAdd(data.cards);
      if (data.reviewLogs) {
        await db.reviewLogs.bulkAdd(data.reviewLogs);
      }
    });

    // Import FSRS settings
    if (data.fsrsSettings) {
      fsrsSettings.value.requestRetention = data.fsrsSettings.requestRetention;
      fsrsSettings.value.maximumInterval = data.fsrsSettings.maximumInterval;
      localStorage.setItem('fsrsSettings', JSON.stringify(data.fsrsSettings));
    }

    showMessage('Data imported successfully!', 'success');

    // Reset file input
    target.value = '';
  } catch (error: any) {
    console.error('Import failed:', error);
    showMessage('Failed to import data. Please check the file format: ' + (error.message || 'Unknown error'), 'error');
  }
};

const clearAllData = async (): Promise<void> => {
  if (!confirm('This will permanently delete ALL your data. This cannot be undone. Are you sure?')) {
    return;
  }

  if (!confirm('Are you absolutely sure? This will delete all decks, cards, and review history.')) {
    return;
  }

  try {
    await db.transaction('rw', db.decks, db.cards, db.reviewLogs, async () => {
      await db.reviewLogs.clear();
      await db.cards.clear();
      await db.decks.clear();
    });

    // Clear localStorage settings
    localStorage.removeItem('fsrsSettings');
    localStorage.removeItem('theme');

    showMessage('All data cleared successfully.', 'success');
  } catch (error) {
    console.error('Failed to clear data:', error);
    showMessage('Failed to clear data.', 'error');
  }
};

const calculateStorageUsage = async (): Promise<void> => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;

      if (used > 0) {
        const usedMB = (used / (1024 * 1024)).toFixed(2);
        const quotaMB = (quota / (1024 * 1024)).toFixed(0);
        storageUsed.value = `${usedMB} MB / ${quotaMB} MB`;
      } else {
        storageUsed.value = 'Unknown';
      }
    } else {
      storageUsed.value = 'Not supported';
    }
  } catch (error) {
    storageUsed.value = 'Error calculating';
  }
};

const checkPWAStatus = (): void => {
  isPWAInstalled.value =
    window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true; // For iOS
};

const showMessage = (text: string, type: 'success' | 'error'): void => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 5000);
};

onMounted(() => {
  // Load FSRS settings
  const savedSettings = localStorage.getItem('fsrsSettings');
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    fsrsSettings.value.requestRetention = parsedSettings.requestRetention;
    fsrsSettings.value.maximumInterval = parsedSettings.maximumInterval;

    // Apply to FSRS engine
    fsrsEngine.parameters.requestRetention = fsrsSettings.value.requestRetention;
    fsrsEngine.parameters.maximumInterval = fsrsSettings.value.maximumInterval;
  }

  calculateStorageUsage();
  checkPWAStatus();
});
</script>
