# Modal Component Documentation

## Overview

A fully-featured modal component for Vue 3 with animations, accessibility features, and flexible customization options.

## Features

- 🎨 Beautiful animations with smooth transitions
- ♿ Accessibility-ready with ARIA attributes
- 📱 Responsive design
- 🎯 Focus management
- 🔒 Body scroll lock when open
- ⌨️ Keyboard navigation (ESC to close)
- 🎭 Dark mode support
- 📏 Multiple size presets
- 🧩 Modular components

## Basic Usage

```vue
<template>
  <button @click="modal.open()">Open Modal</button>

  <Modal v-model="modal.isOpen.value">
    <ModalHeader show-close @close="modal.close()">
      Modal Title
    </ModalHeader>
    <ModalBody>
      <p>Your content here...</p>
    </ModalBody>
    <ModalFooter>
      <button @click="modal.close()">Cancel</button>
      <button @click="handleSave">Save</button>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import { useModal } from '@/composables/useModal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/modal';

const modal = useModal();

const handleSave = () => {
  // Your save logic
  modal.close();
};
</script>
```

## Props

### Modal Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Controls modal visibility (v-model) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size preset |
| `showClose` | `boolean` | `true` | Show close button in top-right |
| `closeOnBackdrop` | `boolean` | `true` | Close modal when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close modal on ESC key press |
| `backdropClass` | `string` | `''` | Additional backdrop classes |
| `customClass` | `string` | `''` | Additional modal classes |

### ModalHeader Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showClose` | `boolean` | `false` | Show close button in header |

### ModalBody Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customClass` | `string` | `''` | Additional body classes |

### ModalFooter Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customClass` | `string` | `''` | Additional footer classes |

## Events

### Modal Component

- `update:modelValue` - Emitted when modal state changes
- `open` - Emitted when modal opens
- `close` - Emitted when modal closes

### ModalHeader Component

- `close` - Emitted when close button is clicked

## Composable: useModal

```typescript
const { isOpen, open, close, toggle } = useModal(initialState?: boolean);
```

- `isOpen` - Readonly reactive reference to modal state
- `open()` - Open the modal
- `close()` - Close the modal
- `toggle()` - Toggle modal state

## Size Presets

- `sm` - Small (max-width: 24rem)
- `md` - Medium (max-width: 28rem) - Default
- `lg` - Large (max-width: 32rem)
- `xl` - Extra Large (max-width: 36rem)
- `full` - Full width with margins

## Custom Content

You can use the modal without the header/body/footer components:

```vue
<Modal v-model="isOpen" :show-close="false">
  <div class="p-6">
    <h2>Custom Layout</h2>
    <p>Your custom content here...</p>
  </div>
</Modal>
```

## Accessibility

- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`)
- Focus management (focus trapped within modal)
- Keyboard navigation (ESC to close)
- Screen reader announcements
- Semantic HTML structure

## Styling

All components use Tailwind CSS classes and support dark mode out of the box. You can customize styles using the provided class props or by wrapping components in your own styled containers.