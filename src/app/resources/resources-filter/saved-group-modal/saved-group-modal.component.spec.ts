import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedGroupModalComponent } from './saved-group-modal.component';

describe('SavedGroupModalComponent', () => {
  let component: SavedGroupModalComponent;
  let fixture: ComponentFixture<SavedGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedGroupModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
