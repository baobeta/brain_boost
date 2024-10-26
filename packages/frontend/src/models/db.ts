import Dexie, { type Table } from 'dexie';
import { type IDesk } from './desk';
import { type ICard } from './card';

export class Database extends Dexie {
  desks!: Dexie.Table<IDesk, string>;
  cards!: Dexie.Table<ICard, string>;

  constructor() {
    // create flashcard_database
    super('flashcard_database');
    // add tables
    this.version(1).stores({
      desks: 'id',
      cards: 'id, front',
    });
    this.version(2).stores({
      desks: 'id',
      cards: 'id, front, deckId',
    });
    // open db
    this.open();
  }
}

export const db = new Database();
