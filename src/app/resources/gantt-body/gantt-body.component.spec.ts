import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttBodyComponent } from './gantt-body.component';

describe('GanttBodyComponent', () => {
  let component: GanttBodyComponent;
  let fixture: ComponentFixture<GanttBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
