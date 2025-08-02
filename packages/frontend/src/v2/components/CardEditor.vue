<template>
  <div :class="styles.container">
    <h3 :class="styles.title">
      {{ card ? text.title.edit : text.title.add }}
    </h3>

    <CardForm
      :form-data="formData"
      :is-loading="isLoading"
      :error="error"
      :is-valid="isValid"
      :card="card"
      @submit="handleSaveCard"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { cardService } from '../services/database';
import type { Card } from '../types';
import { useCardForm } from '../composables/useCardForm';
import { CARD_EDITOR_TEXT, CARD_EDITOR_STYLES } from '../constants/cardEditor';
import CardForm from './card/CardForm.vue';

const props = defineProps<{
  card?: Card | null;
  deckId: number;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

// Use the card form composable
const { formData, isLoading, error, isValid, resetForm } = useCardForm(props.card);

// Constants
const text = CARD_EDITOR_TEXT;
const styles = CARD_EDITOR_STYLES;

const handleSaveCard = async (): Promise<void> => {
  if (!isValid.value || isLoading.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    if (props.card) {
      // Update existing card
      await cardService.update(props.card.id as number, formData.value);
    } else {
      // Create new card
      await cardService.create({
        ...formData.value,
        deckId: props.deckId,
      });
    }

    emit('saved');
    emit('close');
  } catch (err) {
    console.error('Failed to save card:', err);
    error.value = text.errors.saveFailed;
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = (): void => {
  resetForm();
  emit('close');
};
</script>
