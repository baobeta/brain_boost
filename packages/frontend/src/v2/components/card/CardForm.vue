<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <FormField
      v-model="formData.term"
      :label="text.labels.term"
      :placeholder="text.placeholders.term"
      :required="true"
      :input-class="styles.input"
      :label-class="styles.label"
    />

    <FormField
      v-model="formData.definition"
      type="textarea"
      :label="text.labels.definition"
      :placeholder="text.placeholders.definition"
      :required="true"
      :rows="3"
      :textarea-class="styles.textarea"
      :label-class="styles.label"
    />

    <FormField
      v-model="formData.example"
      type="textarea"
      :label="text.labels.example"
      :placeholder="text.placeholders.example"
      :rows="2"
      :textarea-class="styles.textarea"
      :label-class="styles.label"
    />

    <FormError :error="error" />

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
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  card?: Card | null;
}

const formData = defineModel<CardFormData>('modelValue', { required: true });

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

// Constants
const text = CARD_EDITOR_TEXT;
const styles = CARD_EDITOR_STYLES;

const isEditMode = computed(() => !!props.card);

const handleSubmit = () => {
  if (props.isValid && !props.isLoading) emit('submit');
};

const handleCancel = () => {
  emit('cancel');
};
</script>
