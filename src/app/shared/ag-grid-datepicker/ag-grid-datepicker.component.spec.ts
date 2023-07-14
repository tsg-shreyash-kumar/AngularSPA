import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgGridDatepickerComponent } from './ag-grid-datepicker.component';

describe('AgGridDatepickerComponent', () => {
  let component: AgGridDatepickerComponent;
  let fixture: ComponentFixture<AgGridDatepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgGridDatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
