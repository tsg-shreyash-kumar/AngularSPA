import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffingAllocationsMonthlyComponent } from './staffing-allocations-monthly.component';

describe('StaffingAllocationsMonthlyComponent', () => {
  let component: StaffingAllocationsMonthlyComponent;
  let fixture: ComponentFixture<StaffingAllocationsMonthlyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffingAllocationsMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffingAllocationsMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
