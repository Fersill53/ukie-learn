import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { StorageService, DashboardStats } from '../../core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private storage = inject(StorageService);

  loading = true;
  stats: DashboardStats | null = null;

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    try {
      this.stats = await this.storage.getDashboardStats();
    } finally {
      this.loading = false;
    }
  }

  get learnProgressPercent(): number {
    if (!this.stats) return 0;
    if (this.stats.cardCount === 0) return 0;
    return Math.round((this.stats.introducedCount / this.stats.cardCount) * 100);
  }
}