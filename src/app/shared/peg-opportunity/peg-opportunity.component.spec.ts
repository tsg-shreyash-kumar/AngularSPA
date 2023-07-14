import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PegOpportunityComponent } from './peg-opportunity.component';

describe('PegOpportunitypopUpComponent', () => {
  let component: PegOpportunityComponent;
  let fixture: ComponentFixture<PegOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PegOpportunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PegOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
