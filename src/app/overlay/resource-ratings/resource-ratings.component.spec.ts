import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceRatingsComponent } from './resource-ratings.component';

describe('ResourceRatingsComponent', () => {
  let component: ResourceRatingsComponent;
  let fixture: ComponentFixture<ResourceRatingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
