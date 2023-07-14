import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewingDropdownMenuComponent } from './viewing-dropdown-menu.component';

describe('ViewingDropdownMenuComponent', () => {
  let component: ViewingDropdownMenuComponent;
  let fixture: ComponentFixture<ViewingDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewingDropdownMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewingDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
