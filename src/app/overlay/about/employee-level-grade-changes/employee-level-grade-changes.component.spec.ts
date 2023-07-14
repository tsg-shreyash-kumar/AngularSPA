import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeLevelGradeChangesComponent } from './employee-level-grade-changes.component';

describe('EmployeeLevelGradeChangesComponent', () => {
  let component: EmployeeLevelGradeChangesComponent;
  let fixture: ComponentFixture<EmployeeLevelGradeChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeLevelGradeChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLevelGradeChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
