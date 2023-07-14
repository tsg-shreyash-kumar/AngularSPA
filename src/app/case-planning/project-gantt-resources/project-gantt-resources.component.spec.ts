import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGanttResourcesComponent } from './project-gantt-resources.component';

describe('ProjectGanttResourcesComponent', () => {
  let component: ProjectGanttResourcesComponent;
  let fixture: ComponentFixture<ProjectGanttResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGanttResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectGanttResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
