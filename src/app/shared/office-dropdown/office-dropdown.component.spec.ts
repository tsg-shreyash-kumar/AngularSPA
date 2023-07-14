import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfficeDropdownComponent } from './office-dropdown.component';

describe('OfficeDropdownComponent', () => {
  let component: OfficeDropdownComponent;
  let fixture: ComponentFixture<OfficeDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
