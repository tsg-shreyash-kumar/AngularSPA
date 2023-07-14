import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttThresholdComponent } from './gantt-threshold.component';

describe('GanttThresholdComponent', () => {
  let component: GanttThresholdComponent;
  let fixture: ComponentFixture<GanttThresholdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttThresholdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
