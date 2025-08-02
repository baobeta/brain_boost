import { ref, computed, watch } from 'vue';
import type { Card } from '../types';

export interface CardFormData {
  term: string;
  definition: string;
  example: string;
}

export function useCardForm(initialCard?: Card | null) {
  const formData = ref<CardFormData>({
    term: '',
    definition: '',
    example: '',
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isValid = computed(() => {
    return formData.value.term.trim() !== '' && formData.value.definition.trim() !== '';
  });

  const resetForm = () => {
    formData.value = {
      term: '',
      definition: '',
      example: '',
    };
    error.value = null;
  };

  const setFormData = (card: Card) => {
    formData.value = {
      term: card.term,
      definition: card.definition,
      example: card.example || '',
    };
  };

  // Watch for changes to initialCard
  watch(
    () => initialCard,
    (newCard) => {
      if (newCard) {
        setFormData(newCard);
      } else {
        resetForm();
      }
    },
    { immediate: true },
  );

  return {
    formData,
    isLoading,
    error,
    isValid,
    resetForm,
    setFormData,
  };
}
