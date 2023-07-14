import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CasePlanningFilterComponent } from './case-planning-filter.component';

describe('CasePlanningFilterComponent', () => {
  let component: CasePlanningFilterComponent;
  let fixture: ComponentFixture<CasePlanningFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CasePlanningFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePlanningFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
