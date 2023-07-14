import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridMultiSelectComponent } from './ag-grid-multi-select.component';

describe('AgGridMultiSelectComponent', () => {
  let component: AgGridMultiSelectComponent;
  let fixture: ComponentFixture<AgGridMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
