<template>
  <div class="p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Import CSV File</h3>

    <div class="space-y-4">
      <!-- Deck Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Import to Deck </label>
        <div class="flex space-x-2">
          <select
            v-model="selectedDeckId"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Create New Deck</option>
            <option v-for="deck in decks" :key="deck.id" :value="deck.id">
              {{ deck.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- New Deck Name (if creating new) -->
      <div v-if="!selectedDeckId">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> New Deck Name </label>
        <input
          v-model="newDeckName"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter deck name..."
        />
      </div>

      <!-- File Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> CSV File </label>
        <div
          class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
        >
          <div class="space-y-1 text-center">
            <Upload class="mx-auto h-12 w-12 text-gray-400" />
            <div class="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>Upload a file</span>
                <input ref="fileInput" type="file" accept=".csv" class="sr-only" @change="handleFileSelect" />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
          </div>
        </div>
      </div>

      <!-- File Info -->
      <div v-if="selectedFile" class="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
        <div class="flex items-center">
          <FileText class="h-5 w-5 text-gray-400 mr-2" />
          <span class="text-sm text-gray-900 dark:text-white">{{ selectedFile.name }}</span>
          <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {{ (selectedFile.size / 1024).toFixed(1) }} KB
          </span>
        </div>
      </div>

      <!-- CSV Format Info -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <div class="flex">
          <Info class="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">CSV Format</h4>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Expected columns: <code>term,definition,example</code><br />
              Example row: <code>hello,a greeting,Hello, how are you?</code>
            </p>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="previewData.length > 0" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">Preview (first 5 rows)</h4>
        <div class="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Term</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Definition
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Example
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="(row, index) in previewData.slice(0, 5)" :key="index">
                <td class="px-3 py-2 text-sm text-gray-900 dark:text-white">{{ row.term }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 dark:text-white">{{ row.definition }}</td>
                <td class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{{ row.example || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ previewData.length }} cards will be imported</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3"
      >
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-red-400 mr-2" />
          <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        @click="$emit('close')"
      >
        Cancel
      </button>
      <button
        :disabled="!canImport || isImporting"
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="importCards"
      >
        {{ isImporting ? 'Importing...' : 'Import Cards' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Upload, FileText, Info, AlertCircle } from 'lucide-vue-next';
import Papa from 'papaparse';
import { deckService, cardService } from '../services/database';
import type { Deck, Card } from '../types';

interface CSVRow {
  term: string;
  definition: string;
  example?: string;
}

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'imported'): void;
}>();

const decks = ref<Deck[]>([]);
const selectedDeckId = ref<number | ''>('');
const newDeckName = ref<string>('');
const selectedFile = ref<File | null>(null);
const previewData = ref<CSVRow[]>([]);
const errorMessage = ref<string>('');
const isImporting = ref<boolean>(false);

const canImport = computed<boolean>(() => {
  return (
    previewData.value.length > 0 &&
    (selectedDeckId.value !== '' || newDeckName.value.trim() !== '') &&
    !isImporting.value
  );
});

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type === 'text/csv') {
    selectedFile.value = file;
    parseCSV(file);
  } else {
    errorMessage.value = 'Please select a valid CSV file';
    selectedFile.value = null;
    previewData.value = [];
  }
};

const parseCSV = (file: File): void => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<CSVRow>) => {
      if (results.errors.length > 0) {
        errorMessage.value = 'Error parsing CSV: ' + results.errors[0].message;
        previewData.value = [];
        return;
      }

      const validCards = results.data.filter(
        (row) => row.term && row.term.trim() && row.definition && row.definition.trim(),
      );

      if (validCards.length === 0) {
        errorMessage.value = 'No valid cards found. Make sure your CSV has "term" and "definition" columns.';
        previewData.value = [];
        return;
      }

      previewData.value = validCards.map((row) => ({
        term: row.term.trim(),
        definition: row.definition.trim(),
        example: row.example ? row.example.trim() : '',
      }));

      errorMessage.value = '';
    },
    error: (error: Error) => {
      errorMessage.value = 'Failed to parse CSV: ' + error.message;
      previewData.value = [];
    },
  });
};

const importCards = async (): Promise<void> => {
  if (!canImport.value) return;

  isImporting.value = true;
  errorMessage.value = '';

  try {
    let deckId: number | undefined;
    if (selectedDeckId.value !== '') {
      deckId = selectedDeckId.value as number;
    } else {
      deckId = await deckService.create(newDeckName.value.trim());
    }

    if (deckId === undefined) {
      throw new Error('Failed to create or select deck.');
    }

    // Import cards
    for (const cardData of previewData.value) {
      await cardService.create({
        deckId: deckId,
        term: cardData.term,
        definition: cardData.definition,
        example: cardData.example,
      } as Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'nextReviewDate'>);
    }

    emit('imported');
    emit('close');
  } catch (error: any) {
    errorMessage.value = 'Failed to import cards: ' + (error.message || 'Unknown error');
  } finally {
    isImporting.value = false;
  }
};

onMounted(async () => {
  try {
    decks.value = await deckService.getAll();
  } catch (error) {
    console.error('Failed to load decks:', error);
  }
});
</script>
