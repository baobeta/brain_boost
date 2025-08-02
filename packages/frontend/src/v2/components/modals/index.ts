// Async modal components - lazy loaded for better performance
import { defineAsyncComponent } from 'vue';

export const CreateDeckModal = defineAsyncComponent(() => import('./CreateDeckModal.vue'));
export const EditDeckModal = defineAsyncComponent(() => import('./EditDeckModal.vue'));
export const CardEditorModal = defineAsyncComponent(() => import('./CardEditorModal.vue'));
export const ImportCSVModal = defineAsyncComponent(() => import('./ImportCSVModal.vue'));
export const DeckManagerModal = defineAsyncComponent(() => import('./DeckManagerModal.vue'));