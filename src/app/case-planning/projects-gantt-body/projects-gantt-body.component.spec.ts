import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsGanttBodyComponent } from './projects-gantt-body.component';

describe('ProjectsGanttBodyComponent', () => {
  let component: ProjectsGanttBodyComponent;
  let fixture: ComponentFixture<ProjectsGanttBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsGanttBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGanttBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
