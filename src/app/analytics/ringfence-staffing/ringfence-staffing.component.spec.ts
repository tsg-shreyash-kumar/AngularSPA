import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RingfenceStaffingComponent } from './ringfence-staffing.component';

describe('RingfenceStaffingComponent', () => {
  let component: RingfenceStaffingComponent;
  let fixture: ComponentFixture<RingfenceStaffingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RingfenceStaffingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RingfenceStaffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
