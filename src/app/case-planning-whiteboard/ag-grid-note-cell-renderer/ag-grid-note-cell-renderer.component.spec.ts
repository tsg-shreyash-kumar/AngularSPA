import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridNoteCellRendererComponent } from './ag-grid-note-cell-renderer.component';

describe('AgGridNoteCellRendererComponent', () => {
  let component: AgGridNoteCellRendererComponent;
  let fixture: ComponentFixture<AgGridNoteCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridNoteCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridNoteCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
