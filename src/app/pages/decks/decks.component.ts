import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { StorageService } from '../../core/services/storage.service';
import type { Deck, Level } from '../../core/db/app-db';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.scss',
})
export class DecksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private snack = inject(MatSnackBar);

  loading = true;
  decks: Deck[] = [];

  readonly levels: Level[] = ['A1', 'A2', 'B1', 'B2'];

  addForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    level: ['A1' as Level, [Validators.required]],
    description: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    try {
      this.decks = await this.storage.listDecks();
    } finally {
      this.loading = false;
    }
  }

  async addDeck(): Promise<void> {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const v = this.addForm.value;
    const name = (v.name ?? '').trim();
    const level = (v.level ?? 'A1') as Level;
    const description = (v.description ?? '').trim();

    try {
      await this.storage.createDeck({ name, level, description });
      this.snack.open('Deck created', 'OK', { duration: 2000 });
      this.addForm.reset({ name: '', level: 'A1', description: '' });
      await this.refresh();
    } catch {
      this.snack.open('Could not create deck', 'OK', { duration: 2500 });
    }
  }

  async deleteDeck(deck: Deck): Promise<void> {
    const ok = confirm(`Delete "${deck.name}"?\nThis also deletes its cards.`);
    if (!ok) return;

    try {
      await this.storage.deleteDeck(deck.id);
      this.snack.open('Deck deleted', 'OK', { duration: 2000 });
      await this.refresh();
    } catch {
      this.snack.open('Could not delete deck', 'OK', { duration: 2500 });
    }
  }

  trackById = (_: number, d: Deck) => d.id;
}