<template>
  <Modal v-model="isOpen" size="xl" @close="handleClose">
    <DeckManager v-if="deck" :deck="deck" @close="handleClose" @updated="handleUpdated" />
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Modal from '../Modal.vue';
import DeckManager from '../DeckManager.vue';
import type { Deck } from '../../types';

const props = defineProps<{
  modelValue: boolean;
  deck: Deck | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  updated: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleClose = () => {
  isOpen.value = false;
};

const handleUpdated = () => {
  emit('updated');
  handleClose();
};
</script>
