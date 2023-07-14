import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningBoardFilterComponent } from './planning-board-filter.component';

describe('PlanningBoardFilterComponent', () => {
  let component: PlanningBoardFilterComponent;
  let fixture: ComponentFixture<PlanningBoardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningBoardFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningBoardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
