import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectTypeaheadComponent } from './project-typeahead.component';

describe('ProjectTypeaheadComponent', () => {
  let component: ProjectTypeaheadComponent;
  let fixture: ComponentFixture<ProjectTypeaheadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
