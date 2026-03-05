import { Injectable } from '@angular/core';
import { db, Card, Deck, ReviewState } from '../db/app-db';
import { uid } from '../utils/id';

export type DashboardStats = {
  deckCount: number;
  cardCount: number;
  introducedCount: number; // cards that have review state
  newCount: number;        // cards without review state yet
  dueCount: number;        // review states due now
  nextDueAt?: number;      // soonest due timestamp (if any)
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  // ------- Decks -------
  async listDecks(): Promise<Deck[]> {
    return db.decks.orderBy('updatedAt').reverse().toArray();
  }

  async getDeck(deckId: string): Promise<Deck | undefined> {
    return db.decks.get(deckId);
  }

  async createDeck(input: Pick<Deck, 'name' | 'level' | 'description'>): Promise<Deck> {
    const now = Date.now();
    const deck: Deck = {
      id: uid('deck_'),
      name: input.name.trim(),
      level: input.level,
      description: input.description?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };
    await db.decks.add(deck);
    return deck;
  }

  async updateDeck(
    deckId: string,
    patch: Partial<Pick<Deck, 'name' | 'level' | 'description'>>
  ): Promise<void> {
    const now = Date.now();
    await db.decks.update(deckId, {
      ...patch,
      updatedAt: now,
    });
  }

  async deleteDeck(deckId: string): Promise<void> {
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    const cardIds = cards.map(c => c.id);

    await db.transaction('rw', db.decks, db.cards, db.review, async () => {
      await db.decks.delete(deckId);
      await db.cards.where('deckId').equals(deckId).delete();
      if (cardIds.length) {
        await db.review.bulkDelete(cardIds);
      }
    });
  }

  // ------- Cards -------
  async listCardsByDeck(deckId: string): Promise<Card[]> {
    return db.cards.where('deckId').equals(deckId).sortBy('createdAt');
  }

  async getCard(cardId: string): Promise<Card | undefined> {
    return db.cards.get(cardId);
  }

  async createCard(input: Pick<Card, 'deckId' | 'front' | 'back' | 'tags'>): Promise<Card> {
    const now = Date.now();
    const card: Card = {
      id: uid('card_'),
      deckId: input.deckId,
      front: input.front.trim(),
      back: input.back.trim(),
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    await db.cards.add(card);
    return card;
  }

  async updateCard(cardId: string, patch: Partial<Pick<Card, 'front' | 'back' | 'tags'>>): Promise<void> {
    const now = Date.now();
    await db.cards.update(cardId, {
      ...patch,
      updatedAt: now,
    });
  }

  async deleteCard(cardId: string): Promise<void> {
    await db.transaction('rw', db.cards, db.review, async () => {
      await db.cards.delete(cardId);
      await db.review.delete(cardId);
    });
  }

  // ------- Meta -------
  async countDecks(): Promise<number> {
    return db.decks.count();
  }

  // ------- Dashboard stats -------
  async getDashboardStats(now = Date.now()): Promise<DashboardStats> {
    const [deckCount, cardCount, introducedCount, dueCount] = await Promise.all([
      db.decks.count(),
      db.cards.count(),
      db.review.count(), // review PK = cardId
      db.review.where('due').belowOrEqual(now).count(),
    ]);

    const newCount = Math.max(0, cardCount - introducedCount);

    // soonest due time (nice-to-have)
    const nextDue: ReviewState | undefined = await db.review.orderBy('due').first();

    return {
      deckCount,
      cardCount,
      introducedCount,
      newCount,
      dueCount,
      nextDueAt: nextDue?.due,
    };
  }
}