import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSchoolHistoryComponent } from './employee-school-history.component';

describe('EmployeeLevelGradeChangesComponent', () => {
  let component: EmployeeSchoolHistoryComponent;
  let fixture: ComponentFixture<EmployeeSchoolHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSchoolHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSchoolHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
