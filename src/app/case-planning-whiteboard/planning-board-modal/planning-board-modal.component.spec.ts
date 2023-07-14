import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningBoardModalComponent } from './planning-board-modal.component';

describe('CasePlanningModalComponent', () => {
  let component: PlanningBoardModalComponent;
  let fixture: ComponentFixture<PlanningBoardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningBoardModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
