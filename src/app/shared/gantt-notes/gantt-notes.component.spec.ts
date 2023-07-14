import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttNotesComponent } from './gantt-notes.component';

describe('GanttNotesComponent', () => {
  let component: GanttNotesComponent;
  let fixture: ComponentFixture<GanttNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GanttNotesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
