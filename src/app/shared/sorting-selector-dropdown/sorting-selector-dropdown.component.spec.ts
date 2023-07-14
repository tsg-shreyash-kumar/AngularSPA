import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingSelectorDropdownComponent } from './sorting-selector-dropdown.component';

describe('SortingSelectorDropdownComponent', () => {
  let component: SortingSelectorDropdownComponent;
  let fixture: ComponentFixture<SortingSelectorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortingSelectorDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingSelectorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
