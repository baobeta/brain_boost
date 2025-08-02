<template>
  <Modal v-model="isOpen" size="lg" @close="handleClose">
    <CSVImport @close="handleClose" @imported="handleImported" />
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Modal from '../Modal.vue';
import CSVImport from '../CSVImport.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  imported: [];
  close: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleClose = () => {
  isOpen.value = false;
  emit('close');
};

const handleImported = () => {
  emit('imported');
  handleClose();
};
</script>
