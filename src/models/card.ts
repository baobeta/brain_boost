import { type Card as Model, createEmptyCard, type ReviewLog } from "ts-fsrs";

export interface ICard {
  id: string;
  front: string;
  back: string;
  createdAt: string;
  deckId: string;
  history: ReviewLog[];
  model: Model;
}