import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridOfficeDropdownComponent } from './ag-grid-office-dropdown.component';

describe('AgGridOfficeDropdownComponent', () => {
  let component: AgGridOfficeDropdownComponent;
  let fixture: ComponentFixture<AgGridOfficeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridOfficeDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridOfficeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
