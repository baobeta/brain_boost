// src/types/index.d.ts
export interface Deck {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  cardCount?: number;
  dueCount?: number;
}

export interface Card {
  id?: number;
  deckId: number;
  term: string;
  definition: string;
  example?: string;
  createdAt: Date;
  updatedAt: Date;
  nextReviewDate: Date;
  interval?: number;
  ease?: number;
  reps?: number;
  lapses?: number;
  stability?: number;
  difficulty?: number;
}

export interface ReviewLog {
  id?: number;
  cardId: number;
  reviewDate: Date;
  quality: number;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  stability: number;
  difficulty: number;
}

export interface FSRSParameters {
  requestRetention: number;
  maximumInterval: number;
  w: number[];
}

export interface CardState {
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  stability: number;
  difficulty: number;
}

export interface Message {
  text: string;
  type: 'success' | 'error';
}
