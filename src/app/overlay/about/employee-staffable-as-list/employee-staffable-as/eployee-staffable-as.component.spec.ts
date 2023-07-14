import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeStaffableAsComponent } from './employee-staffable-as.component';

describe('EmployeeStaffableAsComponent', () => {
  let component: EmployeeStaffableAsComponent;
  let fixture: ComponentFixture<EmployeeStaffableAsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeStaffableAsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStaffableAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
