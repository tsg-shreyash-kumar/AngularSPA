import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeCertificateComponent } from './employee-certificate.component';

describe('EmployeeCertificateComponent', () => {
  let component: EmployeeCertificateComponent;
  let fixture: ComponentFixture<EmployeeCertificateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
