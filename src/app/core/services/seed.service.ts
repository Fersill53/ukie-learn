import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SeedService {
  constructor(private storage: StorageService) {}

  async ensureSeeded(): Promise<void> {
    const deckCount = await this.storage.countDecks();
    if (deckCount > 0) return;

    const core = await this.storage.createDeck({
      name: 'Core Ukrainian (A1) — Starter',
      level: 'A1',
      description: 'High-frequency essentials: greetings, basics, survival phrases.',
    });

    // Small starter set (you can expand later with JSON import)
    await this.storage.createCard({
      deckId: core.id,
      front: 'Hello',
      back: 'Привіт',
      tags: ['greetings'],
    });
    await this.storage.createCard({
      deckId: core.id,
      front: 'Thank you',
      back: 'Дякую',
      tags: ['polite'],
    });
    await this.storage.createCard({
      deckId: core.id,
      front: 'Yes / No',
      back: 'Так / Ні',
      tags: ['basics'],
    });
    await this.storage.createCard({
      deckId: core.id,
      front: 'Excuse me / Sorry',
      back: 'Вибачте',
      tags: ['polite'],
    });
    await this.storage.createCard({
      deckId: core.id,
      front: 'I don’t understand',
      back: 'Я не розумію',
      tags: ['survival'],
    });
  }
}