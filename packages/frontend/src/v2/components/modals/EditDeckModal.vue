<template>
  <Modal v-model="isOpen" size="sm" @close="handleClose">
    <ModalHeader show-close @close="handleClose"> Edit Deck Name </ModalHeader>
    <form @submit.prevent="handleSubmit">
      <ModalBody>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deck Name</label>
          <input
            v-model="deckName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter deck name..."
            @keyup.esc="handleClose"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="handleClose"
        >
          Cancel
        </button>
        <LoadingButton
          type="submit"
          :disabled="!deckName.trim() || deckName.trim() === deck?.name"
          :loading="isLoading"
          loading-text="Updating..."
          :button-class="submitButtonClass"
        >
          Update
        </LoadingButton>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useToast } from '../../../composables/useToast';
import { deckService } from '../../services/database';
import Modal from '../Modal.vue';
import { ModalHeader, ModalBody, ModalFooter } from '../modal';
import { LoadingButton } from '../form';
import type { Deck } from '../../types';

const props = defineProps<{
  modelValue: boolean;
  deck: Deck | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  updated: [];
}>();

const toast = useToast();
const deckName = ref('');
const isLoading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const submitButtonClass =
  'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed';

// Watch for deck changes
watch(
  () => props.deck,
  (newDeck) => {
    if (newDeck) {
      deckName.value = newDeck.name;
    }
  },
);

const handleSubmit = async () => {
  if (!props.deck || !deckName.value.trim() || deckName.value.trim() === props.deck.name || isLoading.value) return;

  isLoading.value = true;
  try {
    await deckService.update(props.deck.id as number, { name: deckName.value.trim() });
    emit('updated');
    handleClose();
  } catch (error) {
    console.error('Failed to update deck:', error);
    toast.error('Error', 'Failed to update deck. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  deckName.value = '';
  isOpen.value = false;
};
</script>
