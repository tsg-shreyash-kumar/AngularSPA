import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgGridSplitAllocationPopUpComponent } from './ag-grid-split-allocation-pop-up.component';

describe('AgGridSplitAllocationPopUpComponent', () => {
  let component: AgGridSplitAllocationPopUpComponent;
  let fixture: ComponentFixture<AgGridSplitAllocationPopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgGridSplitAllocationPopUpComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridSplitAllocationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
