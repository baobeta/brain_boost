<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <!-- Term Field -->
    <FormField
      v-model="term"
      :label="text.labels.term"
      :placeholder="text.placeholders.term"
      :required="true"
      :input-class="styles.input"
      :label-class="styles.label"
    />

    <!-- Definition Field -->
    <FormField
      v-model="definition"
      type="textarea"
      :label="text.labels.definition"
      :placeholder="text.placeholders.definition"
      :required="true"
      :rows="3"
      :textarea-class="styles.textarea"
      :label-class="styles.label"
    />

    <!-- Example Field -->
    <FormField
      v-model="example"
      type="textarea"
      :label="text.labels.example"
      :placeholder="text.placeholders.example"
      :rows="2"
      :textarea-class="styles.textarea"
      :label-class="styles.label"
    />

    <!-- Error Message -->
    <FormError :error="error" />

    <!-- Action Buttons -->
    <FormActions>
      <button type="button" :class="styles.cancelButton" @click="handleCancel">
        {{ text.buttons.cancel }}
      </button>

      <LoadingButton
        type="submit"
        :disabled="!isValid"
        :loading="isLoading"
        :loading-text="text.loadingText"
        :button-class="styles.submitButton"
      >
        {{ isEditMode ? text.buttons.update : text.buttons.add }}
      </LoadingButton>
    </FormActions>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '../../types';
import type { CardFormData } from '../../composables/useCardForm';
import { CARD_EDITOR_TEXT, CARD_EDITOR_STYLES } from '../../constants/cardEditor';
import FormField from '../form/FormField.vue';
import FormError from '../form/FormError.vue';
import FormActions from '../form/FormActions.vue';
import LoadingButton from '../form/LoadingButton.vue';

interface Props {
  formData: CardFormData;
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  card?: Card | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [];
  cancel: [];
  'update:formData': [value: CardFormData];
}>();

// Constants
const text = CARD_EDITOR_TEXT;
const styles = CARD_EDITOR_STYLES;

const isEditMode = computed(() => !!props.card);

// Computed properties for form fields to avoid prop mutations
const term = computed({
  get: () => props.formData.term,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, term: value });
  },
});

const definition = computed({
  get: () => props.formData.definition,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, definition: value });
  },
});

const example = computed({
  get: () => props.formData.example,
  set: (value: string) => {
    emit('update:formData', { ...props.formData, example: value });
  },
});

const handleSubmit = () => {
  if (props.isValid && !props.isLoading) {
    emit('submit');
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
