import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedResourceFilterDetailComponent } from './saved-resource-filter-detail.component';

describe('SavedResourceFilterDetailComponent', () => {
  let component: SavedResourceFilterDetailComponent;
  let fixture: ComponentFixture<SavedResourceFilterDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SavedResourceFilterDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedResourceFilterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
