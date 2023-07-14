import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceOverlayHeaderComponent } from './resource-overlay-header.component';

describe('ResourceOverlayHeaderComponent', () => {
  let component: ResourceOverlayHeaderComponent;
  let fixture: ComponentFixture<ResourceOverlayHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceOverlayHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOverlayHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
