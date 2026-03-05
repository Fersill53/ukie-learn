import { TestBed } from '@angular/core/testing';

import { Srs } from './srs';

describe('Srs', () => {
  let service: Srs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Srs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
