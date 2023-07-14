import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsGanttProjectComponent } from './projects-gantt-project.component';

describe('ProjectsGanttProjectComponent', () => {
  let component: ProjectsGanttProjectComponent;
  let fixture: ComponentFixture<ProjectsGanttProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsGanttProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGanttProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
