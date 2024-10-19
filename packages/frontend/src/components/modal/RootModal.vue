<template>
  <Modal :isOpen="!!componentModal" :title="title" @onClose="handleModalClose">
    <component :is="componentModal" @onClose="closeModal" v-bind="props" />
  </Modal>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core';
import Modal from './common/Modal.vue';
import { useModalStore } from './service/useModalStore';

const {
  componentModal,
  title,
  props,
  closeOnClick,
  closeModal
} = useModalStore();

function handleModalClose (force = false) {
  if (!closeOnClick.value && !force) return;
  closeModal();
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.keyCode === 27) closeModal();
};

useEventListener('keyup', handleKeyup);
</script>
<style>
.slide-modal-enter-active {
  transition: all 0.3s ease-out;
}

.slide-modal-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-modal-enter-from,
.slide-modal-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>