import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharePlanningCardComponent } from './share-planning-card.component';

describe('SharePlanningCardComponent', () => {
  let component: SharePlanningCardComponent;
  let fixture: ComponentFixture<SharePlanningCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharePlanningCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlanningCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
