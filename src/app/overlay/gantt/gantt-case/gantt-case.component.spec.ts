import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttCaseComponent } from './gantt-case.component';

describe('GanttCaseComponent', () => {
  let component: GanttCaseComponent;
  let fixture: ComponentFixture<GanttCaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GanttCaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
