import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeWorkHistoryComponent } from './employee-work-history.component';

describe('EmployeeLevelGradeChangesComponent', () => {
  let component: EmployeeWorkHistoryComponent;
  let fixture: ComponentFixture<EmployeeWorkHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWorkHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
