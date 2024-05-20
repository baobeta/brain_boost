<template>
  <Modal :isOpen="!!component" :title="title" @onClose="handleModalClose">
    <component :is="component" @onClose="handleClose" v-bind="props" />
  </Modal>
</template>

<script lang="ts" setup>
import { ModalBus } from '../eventBus';

import Modal from './common/Modal';

import { onCreated } from 'vue';
import {
  useEventListener,
  useEventBus,
} from '@vueuse/core';
import { modalKey } from '../modalKey';

// https://github.com/DJanoskova/Vue.js-Modal-context/blob/master/src/components/ModalRoot.vue

const component = ref<Component>(null);
const title = ref<string>('');
const props = ref<any>(null);
const closeOnClick = ref<boolean>(true);

const bus = useEventBus(fooKey);

bus.on(({ component, title = '', props = null, closeOnClick = true }) => {
  component.value = component;
  title.value = title;
  props.value = props;
  closeOnClick.value = closeOnClick;
});


const handleModalClose = (force = false) => {
  if (!closeOnClick.value && !force) return;
  handleClose();
};

const handleClose = () => {
  component.value = null;
};

const handleKeyup = (e) => {
  if (e.keyCode === 27) handleClose();
};

useEventListener('keyup', handleKeyup);
</script>