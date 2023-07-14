import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectGuessedAllocationComponent } from './project-guessed-allocation.component';

describe('ProjectGuessedAllocationComponent', () => {
  let component: ProjectGuessedAllocationComponent;
  let fixture: ComponentFixture<ProjectGuessedAllocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectGuessedAllocationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectGuessedAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
