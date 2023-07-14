import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionsMenuComponent } from './more-options-menu.component';

describe('MoreOptionsMenuComponent', () => {
  let component: MoreOptionsMenuComponent;
  let fixture: ComponentFixture<MoreOptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoreOptionsMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
