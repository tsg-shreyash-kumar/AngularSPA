import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceAvailabilityComponent } from './resource-availability.component';

describe('ResourceAvailabilityComponent', () => {
  let component: ResourceAvailabilityComponent;
  let fixture: ComponentFixture<ResourceAvailabilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
