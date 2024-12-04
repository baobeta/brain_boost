import { createEmptyCard, fsrs, type Card, type Card as Model, type ReviewLog } from 'ts-fsrs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export interface ICardSkeleton {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  deckId: string;
  history: ReviewLog[];
  model: Model;
}

export interface ICard extends ICardSkeleton {
  front: string;
  back: string;
}

export function createNewCard(front: string, back: string, deckId: string): ICard {
  const newCard: ICard = {
    id: uuidv4(),
    front,
    back,
    createdAt: new Date(),
    deckId,
    history: [],
    model: createEmptyCard(),
  };
  return newCard;
}

export async function save(card: ICard): Promise<ICard | undefined> {
  try {
    if (!card.id) return;
    await db.cards.add(card, card.id);
    console.log('add card successfully');
  } catch (error) {
    console.error('Error adding desk to database', error);
  }
}

export async function update(card: ICard): Promise<void> {
  try {
    await db.cards.update(card.id, {
      front: card.front,
      back: card.back,
      history: card.history,
      model: card.model,
      deckId: card.deckId,
    });
  } catch (error) {
    console.error('Error updating desk in database', error);
  }
}

export async function deleteCardById(id: string): Promise<void> {
  try {
    await db.cards.delete(id);
  } catch (error) {
    console.error('Error deleting desk in database', error);
  }
}

export async function getCard(id: string): Promise<ICard | null> {
  try {
    const card = await db.cards.get(id);
    if (!card) return null;
    return card;
  } catch (error) {
    console.error('Error getting desk from database', error);
    return null;
  }
}

export async function getAllCards(): Promise<ICard[]> {
  try {
    console.log('getAllCards');
    const cards = await db.cards.toArray();
    return cards;
  } catch (error) {
    console.error('Error getting desk from database', error);
    return [];
  }
}

export async function getCardsByDeckId(deckId: string): Promise<ICard[]> {
  try {
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    return cards;
  } catch (error) {
    console.error('Error getting desk from database', error);
    return [];
  }
}
