import { createNewCard, deleteCardById, getAllCards, getCard, getCardsByDeckId, save, update } from '@/models/card';
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

  async function fetchCard(id: string) {
    const card = await getCard(id);
    return card;
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

  async function updateCard(front: string, back: string, id: string) {
    const card = await getCard(id);
    if (card) {
      card.front = front;
      card.back = back;
      await update(card);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Card is updated successfully', life: 3000 });
    }
  }
  return {
    saveNewCard,
    fetchCards,
    deleteCard,
    fetchCard,
    updateCard,
  };
}
