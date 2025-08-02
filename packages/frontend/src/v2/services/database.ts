import Dexie, { type Table } from 'dexie';
import type { Deck, Card, ReviewLog } from '../types';

export class VocabularyDatabase extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card>;
  reviewLogs!: Table<ReviewLog>;

  constructor() {
    super('VocabularyDB');

    this.version(1).stores({
      decks: '++id, name, createdAt, updatedAt',
      cards: '++id, deckId, term, definition, example, createdAt, updatedAt, nextReviewDate',
      reviewLogs: '++id, cardId, reviewDate, quality, interval, ease, reps',
    });
  }
}

export const db = new VocabularyDatabase();

// Deck operations
export const deckService = {
  async getAll(): Promise<Deck[]> {
    return await db.decks.orderBy('updatedAt').reverse().toArray();
  },

  async create(name: string): Promise<number> {
    const now = new Date();
    return await db.decks.add({
      name,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: number, updates: Partial<Deck>): Promise<number> {
    return await db.decks.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async delete(id: number): Promise<void> {
    await db.transaction('rw', db.decks, db.cards, db.reviewLogs, async () => {
      // Delete all cards in the deck
      const cardsToDelete = await db.cards.where('deckId').equals(id).toArray();
      const cardIds = cardsToDelete.map((card) => card.id as number);

      // Delete all review logs for these cards
      await db.reviewLogs.where('cardId').anyOf(cardIds).delete();

      // Delete all cards in the deck
      await db.cards.where('deckId').equals(id).delete();

      // Delete the deck
      await db.decks.delete(id);
    });
  },
};

// Card operations
export const cardService = {
  async getByDeck(deckId: number | null): Promise<Card[]> {
    if (deckId === null) {
      return await db.cards.toArray(); // Get all cards if deckId is null
    }
    return await db.cards.where('deckId').equals(deckId).toArray();
  },

  async create(cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'nextReviewDate'>): Promise<number> {
    const now = new Date();
    return await db.cards.add({
      ...cardData,
      createdAt: now,
      updatedAt: now,
      nextReviewDate: now, // New cards are due immediately
    } as Card); // Cast to Card to ensure all properties are present
  },

  async update(id: number, updates: Partial<Card>): Promise<number> {
    return await db.cards.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async delete(id: number): Promise<void> {
    await db.transaction('rw', db.cards, db.reviewLogs, async () => {
      await db.reviewLogs.where('cardId').equals(id).delete();
      await db.cards.delete(id);
    });
  },

  async getDueCards(deckId: number | null = null): Promise<Card[]> {
    const now = new Date();
    const query = db.cards.where('nextReviewDate').belowOrEqual(now);

    if (deckId !== null) {
      const cards = await query.toArray();
      return cards.filter((card) => card.deckId === deckId);
    }

    return await query.toArray();
  },

  async bulkDelete(cardIds: number[]): Promise<void> {
    await db.transaction('rw', db.cards, db.reviewLogs, async () => {
      await db.reviewLogs.where('cardId').anyOf(cardIds).delete();
      await db.cards.bulkDelete(cardIds);
    });
  },
};

// Review log operations
export const reviewLogService = {
  async create(logData: Omit<ReviewLog, 'id' | 'reviewDate'>): Promise<number> {
    return await db.reviewLogs.add({
      ...logData,
      reviewDate: new Date(),
    } as ReviewLog); // Cast to ReviewLog
  },

  async getByCard(cardId: number): Promise<ReviewLog[]> {
    return await db.reviewLogs.where('cardId').equals(cardId).reverse().sortBy('reviewDate');
  },

  async getStats(days = 30): Promise<ReviewLog[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await db.reviewLogs.where('reviewDate').above(startDate).toArray();
  },
};
