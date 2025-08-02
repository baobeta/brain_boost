<template>
  <div :class="containerClass">
    <label v-if="label" :for="inputId" :class="labelClass">
      {{ label }}
    </label>

    <input
      v-if="type !== 'textarea'"
      :id="inputId"
      v-model="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      @input="handleInput"
      @blur="handleBlur"
    />

    <textarea
      v-else
      :id="inputId"
      v-model="modelValue"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="textareaClass"
      @input="handleInput"
      @blur="handleBlur"
    ></textarea>

    <p v-if="errorMessage" :class="errorClass">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  errorMessage?: string;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  textareaClass?: string;
  errorClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  rows: 3,
  label: '',
  placeholder: '',
  errorMessage: '',
  containerClass: '',
  labelClass: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
  inputClass:
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  textareaClass:
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
  errorClass: 'text-sm text-red-600 dark:text-red-400 mt-1',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const inputId = useId();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleBlur = () => {
  emit('blur');
};
</script>
