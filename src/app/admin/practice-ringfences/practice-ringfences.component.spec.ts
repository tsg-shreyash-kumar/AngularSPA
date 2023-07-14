import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeRingfencesComponent } from './practice-ringfences.component';

describe('PracticeRingfencesComponent', () => {
  let component: PracticeRingfencesComponent;
  let fixture: ComponentFixture<PracticeRingfencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeRingfencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeRingfencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
