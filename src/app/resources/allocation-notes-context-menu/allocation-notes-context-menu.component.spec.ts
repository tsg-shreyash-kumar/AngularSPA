import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationNotesContextMenuComponent } from './allocation-notes-context-menu.component';

describe('AllocationNotesContextMenuComponent', () => {
  let component: AllocationNotesContextMenuComponent;
  let fixture: ComponentFixture<AllocationNotesContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocationNotesContextMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationNotesContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
