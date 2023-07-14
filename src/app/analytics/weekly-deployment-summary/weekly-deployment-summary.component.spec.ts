import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyDeploymentSummaryComponent } from './weekly-deployment-summary.component';

describe('WeeklyDeploymentSummaryComponent', () => {
  let component: WeeklyDeploymentSummaryComponent;
  let fixture: ComponentFixture<WeeklyDeploymentSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyDeploymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyDeploymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
