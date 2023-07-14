import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CapacityBreakdownComponent } from './capacity-breakdown.component';

describe('CapacityBreakdownComponent', () => {
  let component: CapacityBreakdownComponent;
  let fixture: ComponentFixture<CapacityBreakdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
