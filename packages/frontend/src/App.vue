<template>
  <div id="app" :class="{ dark: isDarkMode }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <BookOpen class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Vocabulary Study</h1>
            </div>

            <div class="flex items-center space-x-4">
              <nav class="flex space-x-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="[
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                  ]"
                  @click="activeTab = tab.id"
                >
                  <component :is="tab.icon" class="h-4 w-4 inline mr-2" />
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <component :is="currentComponent" @change-tab="activeTab = $event" />
      </main>
    </div>

    <!-- Custom Toast Component for notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component as VueComponent } from 'vue';
import { BookOpen, Library, Play, BarChart3, Settings, Keyboard } from 'lucide-vue-next';
import Toast from './components/Toast.vue';
import ReviewMode from './v2/components/ReviewMode.vue';
import TypingMode from './v2/components/TypingMode.vue';
import Dashboard from './v2/components/Dashboard.vue';
import SettingsView from './v2/components/SettingsView.vue';
import DecksView from './v2/views/DecksView.vue';
import { useProvideToast } from './composables/useToast';

type Tab = {
  id: string;
  name: string;
  icon: VueComponent;
  component: VueComponent;
};

useProvideToast();

const activeTab = ref<string>('decks');
const isDarkMode = ref<boolean>(false);

const tabs: Tab[] = [
  { id: 'decks', name: 'Decks', icon: Library, component: DecksView },
  { id: 'review', name: 'Review', icon: Play, component: ReviewMode },
  { id: 'typing', name: 'Typing', icon: Keyboard, component: TypingMode },
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, component: Dashboard },
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsView },
];

const currentComponent = computed<VueComponent | undefined>(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.component;
});
</script>
