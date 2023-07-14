import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSortEditComponent } from './filter-sort-edit.component';

describe('FilterSortEditComponent', () => {
  let component: FilterSortEditComponent;
  let fixture: ComponentFixture<FilterSortEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSortEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSortEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
