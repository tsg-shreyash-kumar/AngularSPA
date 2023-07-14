import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PracticeStaffingCaseServedComponent } from './practice-staffing-case-served.component';

describe('MonthlyPracticeAreaStaffingComponent', () => {
  let component: PracticeStaffingCaseServedComponent;
  let fixture: ComponentFixture<PracticeStaffingCaseServedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeStaffingCaseServedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeStaffingCaseServedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});