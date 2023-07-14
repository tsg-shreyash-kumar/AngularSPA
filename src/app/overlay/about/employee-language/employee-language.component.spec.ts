import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeLanguageComponent } from './employee-language.component';

describe('EmployeeLanguageComponent', () => {
  let component: EmployeeLanguageComponent;
  let fixture: ComponentFixture<EmployeeLanguageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
