import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemandFiltersComponent } from './demand-filters.component';

describe('DemandFiltersComponent', () => {
  let component: DemandFiltersComponent;
  let fixture: ComponentFixture<DemandFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
