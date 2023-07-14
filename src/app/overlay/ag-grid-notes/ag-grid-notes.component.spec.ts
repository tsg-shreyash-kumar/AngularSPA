import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgGridNotesComponent } from './ag-grid-notes.component';

describe('AgGridNotesComponent', () => {
  let component: AgGridNotesComponent;
  let fixture: ComponentFixture<AgGridNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgGridNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
