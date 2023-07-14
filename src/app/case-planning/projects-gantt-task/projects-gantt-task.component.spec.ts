import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsGanttTaskComponent } from './projects-gantt-task.component';

describe('ProjectsGanttTaskComponent', () => {
  let component: ProjectsGanttTaskComponent;
  let fixture: ComponentFixture<ProjectsGanttTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsGanttTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGanttTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
