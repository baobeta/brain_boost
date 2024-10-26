import { createNewCard, deleteCardById, getAllCards, getCardsByDeckId, save } from '@/models/card';
import { useToast } from 'primevue/usetoast';

export function useCard() {
  const toast = useToast();

  async function fetchCards(deskId?: string) {
    if (!deskId) {
      const cards = await getAllCards();
      return cards;
    }

    const cards = await getCardsByDeckId(deskId);
    return cards;
  }

  async function saveNewCard(front: string, back: string, deckId: string) {
    const card = createNewCard(front, back, deckId);
    await save(card);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Card is created successfully', life: 3000 });
  }

  async function deleteCard(id: string) {
    await deleteCardById(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Card is deleted successfully', life: 3000 });
  }
  return {
    saveNewCard,
    fetchCards,
    deleteCard,
  };
}
