import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleSelectDropdownComponent } from './single-select-dropdown.component';

describe('SingleSelectDropdownComponent', () => {
  let component: SingleSelectDropdownComponent;
  let fixture: ComponentFixture<SingleSelectDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSelectDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
