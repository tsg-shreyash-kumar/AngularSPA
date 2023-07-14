import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandNotesModalComponent } from './demand-notes-modal.component';

describe('DemandNotesModalComponent', () => {
  let component: DemandNotesModalComponent;
  let fixture: ComponentFixture<DemandNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandNotesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
