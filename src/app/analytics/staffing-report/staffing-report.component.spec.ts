import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffingReportComponent } from './staffing-report.component';

describe('StaffingReportComponent', () => {
  let component: StaffingReportComponent;
  let fixture: ComponentFixture<StaffingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
