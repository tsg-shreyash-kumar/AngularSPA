import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSharePopupComponent } from './resources-share-popup.component';

describe('ResourcesSharePopupComponent', () => {
  let component: ResourcesSharePopupComponent;
  let fixture: ComponentFixture<ResourcesSharePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcesSharePopupComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesSharePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
