import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectActionPanelComponent } from './project-action-panel.component';

describe('ProjectActionPanelComponent', () => {
  let component: ProjectActionPanelComponent;
  let fixture: ComponentFixture<ProjectActionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectActionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
