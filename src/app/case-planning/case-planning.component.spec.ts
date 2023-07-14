import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CasePlanningComponent } from './case-planning.component';

describe('CasePlanningComponent', () => {
  let component: CasePlanningComponent;
  let fixture: ComponentFixture<CasePlanningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CasePlanningComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
