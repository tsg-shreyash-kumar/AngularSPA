import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeInLaneComponent } from './time-in-lane.component';

describe('TimeInLaneComponent', () => {
  let component: TimeInLaneComponent;
  let fixture: ComponentFixture<TimeInLaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeInLaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeInLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});