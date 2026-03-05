import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueDetails } from './dialogue-details';

describe('DialogueDetails', () => {
  let component: DialogueDetails;
  let fixture: ComponentFixture<DialogueDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
