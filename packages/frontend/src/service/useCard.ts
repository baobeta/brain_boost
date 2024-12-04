import { createNewCard, deleteCardById, getAllCards, getCard, getCardsByDeckId, save, update } from '@/models/card';
import { useToast } from 'primevue/usetoast';
import type { Card, ReviewLog } from 'ts-fsrs';

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

  async function updateModelAndHistory(id: string, model: Card, log: ReviewLog) {
    const card = await getCard(id);
    if (!card) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Not found card', life: 3000 });
      return;
    }
    // Update new model, in model will include due date and all the info that we need
    card.model = model;
    // Track history for this model
    card.history = [...card.history, log];
    await update(card);
  }
  return {
    saveNewCard,
    fetchCards,
    deleteCard,
    fetchCard,
    updateCard,
    updateModelAndHistory,
  };
}
