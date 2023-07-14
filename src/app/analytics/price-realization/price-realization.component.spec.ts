import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PriceRealizationComponent } from './price-realization.component';

describe('PriceRealizationComponent', () => {
  let component: PriceRealizationComponent;
  let fixture: ComponentFixture<PriceRealizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRealizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRealizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
