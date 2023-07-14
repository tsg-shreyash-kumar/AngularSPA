import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningBoardStageComponent } from './planning-board-stage.component';

describe('PlanningBoardStageComponent', () => {
  let component: PlanningBoardStageComponent;
  let fixture: ComponentFixture<PlanningBoardStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningBoardStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningBoardStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
