<template>
  <Modal v-model="isOpen" size="md" @close="handleClose">
    <ModalHeader show-close @close="handleClose"> Create New Deck </ModalHeader>
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
          :disabled="!deckName.trim()"
          :loading="isLoading"
          loading-text="Creating..."
          :button-class="submitButtonClass"
        >
          Create
        </LoadingButton>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { deckService } from '../../services/database';
import Modal from '../Modal.vue';
import { ModalHeader, ModalBody, ModalFooter } from '../modal';
import { LoadingButton } from '../form';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  created: [];
}>();

const deckName = ref('');
const isLoading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const submitButtonClass =
  'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed';

const handleSubmit = async () => {
  if (!deckName.value.trim() || isLoading.value) return;

  isLoading.value = true;
  try {
    await deckService.create(deckName.value.trim());
    emit('created');
    handleClose();
  } catch (error) {
    console.error('Failed to create deck:', error);
    // TODO: Show error message to user
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  deckName.value = '';
  isOpen.value = false;
};
</script>
