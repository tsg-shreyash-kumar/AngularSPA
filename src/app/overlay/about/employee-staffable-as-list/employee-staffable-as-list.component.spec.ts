import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeStaffableAsListComponent } from './employee-staffable-as-list.component';

describe('EmployeeStaffableAsListComponent', () => {
  let component: EmployeeStaffableAsListComponent;
  let fixture: ComponentFixture<EmployeeStaffableAsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeStaffableAsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStaffableAsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
