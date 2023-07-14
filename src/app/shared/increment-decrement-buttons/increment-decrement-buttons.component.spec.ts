import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncrementDecrementButtonsComponent } from './increment-decrement-buttons.component';

describe('IncrementDecrementButtonsComponent', () => {
  let component: IncrementDecrementButtonsComponent;
  let fixture: ComponentFixture<IncrementDecrementButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementDecrementButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementDecrementButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
