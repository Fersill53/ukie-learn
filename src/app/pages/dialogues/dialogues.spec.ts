import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialogues } from './dialogues';

describe('Dialogues', () => {
  let component: Dialogues;
  let fixture: ComponentFixture<Dialogues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialogues],
    }).compileComponents();

    fixture = TestBed.createComponent(Dialogues);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
