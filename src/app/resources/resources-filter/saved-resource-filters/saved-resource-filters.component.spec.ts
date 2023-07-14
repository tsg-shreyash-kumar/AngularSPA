import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedResourceFiltersComponent } from './saved-resource-filters.component';

describe('SavedResourceFiltersComponent', () => {
  let component: SavedResourceFiltersComponent;
  let fixture: ComponentFixture<SavedResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedResourceFiltersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
