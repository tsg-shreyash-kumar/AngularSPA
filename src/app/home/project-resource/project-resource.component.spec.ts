import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectResourceComponent } from './project-resource.component';
import { FormsModule } from '@angular/forms';
import { FAKE_PROJECTS } from 'src/app/shared/mocks/mock-home-service';
import { DatePipe } from '@angular/common';

describe('ProjectResourceComponent', () => {
  let component: ProjectResourceComponent;
  let fixture: ComponentFixture<ProjectResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectResourceComponent],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectResourceComponent);
    component = fixture.componentInstance;
    component.userAllocation = JSON.parse(JSON.stringify(FAKE_PROJECTS[0].allocatedResources[0]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get allocated resources end date in a dd-MMM-yyyy format on init', () => {
    const resourceEndDate = new DatePipe('en-US').transform(FAKE_PROJECTS[0].allocatedResources[0].endDate, 'dd-MMM-yyyy');
    expect(component.userAllocation.endDate).toEqual(resourceEndDate);
  });
});
