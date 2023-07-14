import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttCaseBodyComponent } from './gantt-case-body.component';

describe('GanttCaseBodyComponent', () => {
  let component: GanttCaseBodyComponent;
  let fixture: ComponentFixture<GanttCaseBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttCaseBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttCaseBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
