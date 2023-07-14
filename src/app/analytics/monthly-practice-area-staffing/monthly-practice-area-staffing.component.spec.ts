import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthlyPracticeAreaStaffingComponent } from './monthly-practice-area-staffing.component';

describe('MonthlyPracticeAreaStaffingComponent', () => {
  let component: MonthlyPracticeAreaStaffingComponent;
  let fixture: ComponentFixture<MonthlyPracticeAreaStaffingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyPracticeAreaStaffingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPracticeAreaStaffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
