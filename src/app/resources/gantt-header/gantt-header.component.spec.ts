import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttHeaderComponent } from './gantt-header.component';

describe('GanttHeaderComponent', () => {
  let component: GanttHeaderComponent;
  let fixture: ComponentFixture<GanttHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
