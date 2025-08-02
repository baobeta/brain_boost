# The Vocabulary Study App Project Context

## Overview
The Vocabulary Study App is a browser-based Progressive Web App (PWA) designed for desktop users seeking a fully offline vocabulary learning solution. Leveraging the Flexible Spaced Repetition Scheduling (FSRS) algorithm and client-side storage (IndexedDB), learners can import or create flashcard decks, review words at optimal intervals, and track progress—all without server dependencies.

## Key Technologies
- **Frontend**: Vue 3, TypeScript, Vite 5, Pinia

## Key Directories
- `packages/frontend/` - Frontend Vue.js application

### Vue Development Rules
- Composition API - prefer composables (`useXyz`) over mixins.
- Component Structure
  - Single File Components with `<script setup>` syntax preferred
  - Order: template → script → style
  - Co-locate component tests in the same directory, with `.test.ts` extension
  - Extract complex logic into composables
- State Management
  - Use Pinia for global state management
  - Keep component state local when possible (`useState`, `ref`, `reactive`)
  - Lift state up only when necessary for sharing between components
  - Prefer computed properties over watchers for derived state
  - Use readonly for exposing state that shouldn't be mutated externally
  - Structure stores by domain/feature, not by type
- API Integration
  - Create dedicated API service files (e.g., `user.ajax.ts`)
  - Use composables for data fetching (e.g., `useUserData`)
  - Implement consistent error handling with try/catch blocks
  - Always handle loading and error states in components
  - Use AbortController for cancellable requests
  - Prefer async/await over Promise chains
  - Cache API responses when appropriate using Pinia or composables
- Routing
  - Use Vue Router with typed routes when possible
  - Lazy load route components: `() => import('./views/Page.vue')`
  - Keep route names consistent with component names
  - Use route meta for page titles, permissions, and layout info
  - Handle 404 and error routes gracefully
  - Prefer programmatic navigation over <a> tags for internal links
- Additional Best Practices
  - Always use TypeScript for type safety
  - Emit events with clear, descriptive names using kebab-case
  - Validate props with proper types and validators
  - Use v-model for two-way binding on custom components
  - Implement proper cleanup in onUnmounted for subscriptions/timers
  - Follow naming conventions: PascalCase for components, camelCase for props/methods

### Type Safety
- Use Sorbet for Ruby type checking
- TypeScript for frontend code, enable strict mode whenever possible

### Performance guidelines
- Careful to avoid n+1 problem
- Caching with Redis when reasonable
- Employ lazy loading and preloading when reasonable
- Suggest database indexes when reasonable

### Security guidelines
- CSRF protection enabled
- API versioning via headers
- Prevent SQL injection
- Cross-origin security policies
- Multiple authentication methods: Session, API key, Public links


## References
- For more details, read `README.md` and `docs` directory
