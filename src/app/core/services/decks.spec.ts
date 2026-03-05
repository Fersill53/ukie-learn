import { TestBed } from '@angular/core/testing';

import { Decks } from './decks';

describe('Decks', () => {
  let service: Decks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Decks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
