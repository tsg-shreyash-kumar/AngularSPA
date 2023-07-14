import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsGanttHeaderComponent } from './projects-gantt-header.component';

describe('ProjectsGanttHeaderComponent', () => {
  let component: ProjectsGanttHeaderComponent;
  let fixture: ComponentFixture<ProjectsGanttHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsGanttHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsGanttHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
