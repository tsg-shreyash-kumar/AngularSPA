import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndividualResourceDetailsComponent } from './individual-resource-details.component';

describe('WeeklyDeploymentComponent', () => {
  let component: IndividualResourceDetailsComponent;
  let fixture: ComponentFixture<IndividualResourceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualResourceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualResourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
