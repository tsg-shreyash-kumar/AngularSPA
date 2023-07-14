import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttResourceComponent } from './gantt-resource.component';

describe('GanttResourceComponent', () => {
  let component: GanttResourceComponent;
  let fixture: ComponentFixture<GanttResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GanttResourceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
