import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAllocationsForPromotionsComponent } from './historical-allocations-for-promotions.component';

describe('HistoricalAllocationsForPromotionsComponent', () => {
  let component: HistoricalAllocationsForPromotionsComponent;
  let fixture: ComponentFixture<HistoricalAllocationsForPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalAllocationsForPromotionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAllocationsForPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
