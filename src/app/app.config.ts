import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SeedService } from './core/services/seed.service';

function seedAppFactory(seed: SeedService) {
  return () => seed.ensureSeeded();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Runs once on startup (before app finishes initializing)
    {
      provide: APP_INITIALIZER,
      useFactory: seedAppFactory,
      deps: [SeedService],
      multi: true,
    },
  ],
};