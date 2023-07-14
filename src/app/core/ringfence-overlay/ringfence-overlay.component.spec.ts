import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingfenceOverlayComponent } from './ringfence-overlay.component';

describe('RingfenceOverlayComponent', () => {
  let component: RingfenceOverlayComponent;
  let fixture: ComponentFixture<RingfenceOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RingfenceOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RingfenceOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
