import Dexie, { Table } from 'dexie';

export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export type Deck = {
  id: string;
  name: string;
  level: Level;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type ReviewState = {
  cardId: string; // PK
  due: number; // epoch ms
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
  lastReviewedAt?: number;
};

export class AppDb extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  review!: Table<ReviewState, string>;

  constructor() {
    super('ukieLearnDb');

    this.version(1).stores({
      decks: 'id, level, createdAt, updatedAt',
      cards: 'id, deckId, createdAt, updatedAt',
      review: 'cardId, due',
    });
  }
}

export const db = new AppDb();