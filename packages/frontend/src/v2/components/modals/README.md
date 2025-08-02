# Modal Architecture Documentation

## Overview

This directory contains async modal components that are lazy-loaded for better performance. Each modal is self-contained with its own service imports, ensuring services are only loaded when the modal is actually used.

## Architecture Benefits

- **Lazy Loading**: Modals are loaded only when needed using `defineAsyncComponent`
- **Code Splitting**: Each modal is in its own chunk, reducing initial bundle size
- **Service Isolation**: Database services are imported only in modals that need them
- **Better Performance**: Unused modals and their dependencies are never loaded

## Modal Components

### CreateDeckModal
- **Purpose**: Create new decks
- **Service**: `deckService`
- **Events**: `@created`

### EditDeckModal
- **Purpose**: Edit deck names
- **Service**: `deckService`
- **Props**: `:deck`
- **Events**: `@updated`

### CardEditorModal
- **Purpose**: Create/edit cards
- **Service**: `cardService`
- **Props**: `:card`, `:deck-id`
- **Events**: `@saved`

### ImportCSVModal
- **Purpose**: Import cards from CSV
- **Service**: Internal to CSVImport component
- **Events**: `@imported`

### DeckManagerModal
- **Purpose**: Manage deck cards
- **Service**: Internal to DeckManager component
- **Props**: `:deck`
- **Events**: `@updated`

## Usage Example

```vue
<template>
  <div>
    <!-- Trigger buttons -->
    <button @click="createModal.open()">Create Deck</button>
    
    <!-- Async modals -->
    <CreateDeckModal 
      v-model="createModal.isOpen.value" 
      @created="handleDeckCreated" 
    />
  </div>
</template>

<script setup>
import { useModal } from '@/composables/useModal';
import { CreateDeckModal } from '@/components/modals';

const createModal = useModal();

const handleDeckCreated = () => {
  // Refresh data
  emit('deck-created');
};
</script>
```

## Parent Component Pattern

The parent component (e.g., `DecksView.vue`) should:
1. Manage the data (decks array)
2. Handle all service calls
3. Pass data down to DeckList as props
4. Listen for events and update data accordingly

```vue
<!-- DecksView.vue -->
<template>
  <DeckList
    :decks="decks"
    @load-decks="loadDecks"
    @deck-created="loadDecks"
    @deck-updated="loadDecks"
    @delete-deck="deleteDeck"
  />
</template>

<script setup>
import { deckService, cardService } from '@/services/database';

const decks = ref([]);

const loadDecks = async () => {
  decks.value = await deckService.getAll();
  // Add counts...
};

const deleteDeck = async (deckId) => {
  await deckService.delete(deckId);
  await loadDecks();
};
</script>
```

## Performance Monitoring

You can verify the lazy loading by:
1. Opening Chrome DevTools Network tab
2. Loading the page (modals won't be loaded)
3. Opening a modal (you'll see the chunk load)

## Best Practices

1. **Keep modals self-contained**: Each modal should handle its own logic
2. **Use events for communication**: Don't pass callbacks or services
3. **Let parent manage data**: Child components should be presentational
4. **Type your props and events**: Use TypeScript for better DX