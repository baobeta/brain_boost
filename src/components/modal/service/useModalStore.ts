// useCounterStore.ts
import { computed, ref, type Component } from 'vue';
import { createInjectionState } from '@vueuse/core';

interface ModalProps {
  component: Component,
  props: any,
  title: string,
  closeOnClick: boolean;
}

const [useProvideModalStore, _useModalStore] = createInjectionState(() => {

  // state
  const componentModal = ref<Component | null>(null);
  const props = ref<any>(null);
  const title = ref<string | null>(null);
  const closeOnClick = ref<boolean>(true);

  function openModal (modalPros: ModalProps) {
    componentModal.value = modalPros.component;
    props.value = modalPros.props;
    title.value = modalPros.title;
    closeOnClick.value = modalPros.closeOnClick;
  };

  function closeModal () {
    componentModal.value = null;
    props.value = null;
    title.value = null;
    closeOnClick.value = true;
  };


  return {
    componentModal,
    props,
    title,
    closeOnClick,
    openModal,
    closeModal
  };
});

export { useProvideModalStore };

export function useModalStore () {
  const counterStore = _useModalStore();
  if (counterStore == null)
    throw new Error('Please call `useProvideModalStore` on the appropriate parent component');
  return counterStore;
}