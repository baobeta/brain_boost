<template>
  <div class="p-8">
    <h2 class="mb-4 text-xl font-bold">Modal Examples</h2>

    <!-- Basic Modal Example -->
    <div class="mb-8">
      <h3 class="mb-2 text-lg font-semibold">Basic Modal</h3>
      <button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" @click="basicModal.open()">
        Open Basic Modal
      </button>

      <Modal v-model="basicModal.isOpen.value">
        <ModalHeader show-close @close="basicModal.close()"> Basic Modal Title </ModalHeader>
        <ModalBody>
          <p>This is a basic modal with header, body, and footer sections.</p>
        </ModalBody>
        <ModalFooter>
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="basicModal.close()"
          >
            Cancel
          </button>
          <button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" @click="handleSave">
            Save Changes
          </button>
        </ModalFooter>
      </Modal>
    </div>

    <!-- Sized Modals -->
    <div class="mb-8">
      <h3 class="mb-2 text-lg font-semibold">Different Sizes</h3>
      <div class="flex gap-2">
        <button
          v-for="size in sizes"
          :key="size"
          class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          @click="openSizedModal(size)"
        >
          {{ size.toUpperCase() }} Modal
        </button>
      </div>

      <Modal v-model="sizedModal.isOpen.value" :size="currentSize">
        <ModalHeader show-close @close="sizedModal.close()"> {{ currentSize.toUpperCase() }} Size Modal </ModalHeader>
        <ModalBody>
          <p>This modal is using the "{{ currentSize }}" size preset.</p>
          <p class="mt-2">Available sizes: sm, md, lg, xl, full</p>
        </ModalBody>
        <ModalFooter>
          <button class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700" @click="sizedModal.close()">
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>

    <!-- Custom Content Modal -->
    <div class="mb-8">
      <h3 class="mb-2 text-lg font-semibold">Custom Content</h3>
      <button class="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700" @click="customModal.open()">
        Open Custom Modal
      </button>

      <Modal v-model="customModal.isOpen.value" :show-close="false" :close-on-backdrop="false" size="lg">
        <div class="p-6">
          <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Custom Content Modal</h3>
          <p class="mb-4 text-gray-600 dark:text-gray-400">
            This modal demonstrates custom content without using the predefined header/body/footer components.
          </p>
          <div class="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <p class="text-sm text-gray-700 dark:text-gray-300">Features demonstrated:</p>
            <ul class="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
              <li>No close button in header</li>
              <li>Backdrop click disabled</li>
              <li>Custom padding and layout</li>
              <li>Large size preset</li>
            </ul>
          </div>
          <div class="flex justify-end">
            <button
              class="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              @click="customModal.close()"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModal } from '../../composables/useModal';
import Modal from '../Modal.vue';
import ModalHeader from './ModalHeader.vue';
import ModalBody from './ModalBody.vue';
import ModalFooter from './ModalFooter.vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Modal instances
const basicModal = useModal();
const sizedModal = useModal();
const customModal = useModal();

// Size modal state
const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
const currentSize = ref<ModalSize>('md');

const openSizedModal = (size: ModalSize) => {
  currentSize.value = size;
  sizedModal.open();
};

const handleSave = () => {
  console.log('Save clicked');
  basicModal.close();
};
</script>
