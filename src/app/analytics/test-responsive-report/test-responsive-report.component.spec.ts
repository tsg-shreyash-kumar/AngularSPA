import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestResponsiveReportComponent } from './test-responsive-report.component';

describe('TestResponsiveReportComponent', () => {
  let component: TestResponsiveReportComponent;
  let fixture: ComponentFixture<TestResponsiveReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResponsiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResponsiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
