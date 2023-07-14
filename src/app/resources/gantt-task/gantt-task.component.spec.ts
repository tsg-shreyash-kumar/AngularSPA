import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttTaskComponent } from './gantt-task.component';

describe('GanttTaskComponent', () => {
  let component: GanttTaskComponent;
  let fixture: ComponentFixture<GanttTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GanttTaskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
