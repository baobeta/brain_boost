export const CARD_EDITOR_TEXT = {
  title: {
    edit: 'Edit Card',
    add: 'Add New Card',
  },
  labels: {
    term: 'Term *',
    definition: 'Definition *',
    example: 'Example (Optional)',
  },
  placeholders: {
    term: 'Enter the term or word...',
    definition: 'Enter the definition...',
    example: 'Enter an example sentence...',
  },
  buttons: {
    cancel: 'Cancel',
    update: 'Update Card',
    add: 'Add Card',
  },
  errors: {
    saveFailed: 'Failed to save card. Please try again.',
  },
  loadingText: 'Saving...',
} as const;

export const CARD_EDITOR_STYLES = {
  container: 'p-6',
  title: 'text-lg font-medium text-gray-900 dark:text-white mb-4',
  form: 'space-y-4',
  fieldContainer: '',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
  input:
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  textarea:
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
  buttonContainer: 'flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600',
  cancelButton:
    'px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors',
  submitButton:
    'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  errorMessage: 'text-sm text-red-600 dark:text-red-400 mt-1',
} as const;
