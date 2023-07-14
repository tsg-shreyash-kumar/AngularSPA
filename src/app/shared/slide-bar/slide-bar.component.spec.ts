import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlideBarComponent } from './slide-bar.component';

describe('SlideBarComponent', () => {
  let component: SlideBarComponent;
  let fixture: ComponentFixture<SlideBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SlideBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
